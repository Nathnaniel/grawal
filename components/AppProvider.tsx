'use client';

import { useRouter } from 'next/navigation';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { todayIn } from '@/lib/dates';
import { createOutbox, type Outbox, type OutboxStorage } from '@/lib/outbox';
import { createSupabaseStore } from '@/lib/store';
import type { AppStore, Category, Entry, Profile, ProfilePatch, WallSummary } from '@/lib/types';

/** Which overlay is open. Only one at a time, as in the design. */
export type Panel =
  | { kind: 'create'; entry?: Entry }
  | { kind: 'note'; entry: Entry }
  | { kind: 'search' }
  | { kind: 'notifications' }
  | { kind: 'account' }
  | { kind: 'settings' }
  | null;

/** A search applied to the wall: a keyword, a category, or a single win. */
export interface WallFilter { label: string; q: string; categoryId: string }

export type Theme = 'light' | 'dark' | 'system';

interface AppContextValue {
  store: AppStore;
  basePath: string;
  userId: string;
  email: string;
  profile: Profile;
  avatarUrl: string | null;
  categories: Category[];
  summary: WallSummary;
  /** Changes made in this visit: the entry, or null when it was deleted. */
  overlay: ReadonlyMap<string, Entry | null>;
  /** Entries still waiting to reach the server. */
  waiting: ReadonlySet<string>;
  freshId: string | null;
  panel: Panel;
  filter: WallFilter | null;
  theme: Theme;
  today: () => string;
  open: (panel: Panel) => void;
  close: () => void;
  setFilter: (filter: WallFilter | null) => void;
  setTheme: (theme: Theme) => void;
  /** The card updates at once. The promise settles after the send was attempted. */
  saveEntry: (entry: Entry, options?: { fresh?: boolean }) => Promise<void>;
  removeEntry: (id: string) => Promise<void>;
  updateProfile: (patch: ProfilePatch) => Promise<void>;
  setAvatar: (file: File) => Promise<void>;
  addCategory: (name: string, colour: string) => Promise<Category>;
  /** Device-side memory: read notifications and recent searches. */
  remembered: <T>(key: string, fallback: T) => T;
  remember: (key: string, value: unknown) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function useApp() {
  const value = useContext(AppContext);
  if (!value) throw new Error('useApp needs an AppProvider');
  return value;
}

/** Applies this visit's changes on top of what the server sent. */
export function useEntries(fromServer: Entry[], include: (entry: Entry) => boolean = () => true) {
  const { overlay } = useApp();
  const merged = new Map(fromServer.map((entry) => [entry.id, entry]));
  for (const [id, entry] of overlay) {
    if (entry) merged.set(id, entry);
    else merged.delete(id);
  }
  return [...merged.values()].filter(include);
}

// localStorage can be blocked. Saves then last for this visit instead of failing.
function deviceStorage(): OutboxStorage {
  try {
    window.localStorage.getItem('gratitude-wall.probe');
    return window.localStorage;
  } catch {
    const memory = new Map<string, string>();
    return { getItem: (key) => memory.get(key) ?? null, setItem: (key, value) => void memory.set(key, value) };
  }
}

export function AppProvider({ userId, email, profile: initialProfile, avatarUrl: initialAvatarUrl, categories: initialCategories, summary, basePath = '', store: givenStore, children }: {
  userId: string;
  email: string;
  profile: Profile;
  avatarUrl: string | null;
  categories: Category[];
  summary: WallSummary;
  basePath?: string;
  store?: AppStore;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [store] = useState(() => givenStore ?? createSupabaseStore());
  const [storage] = useState<OutboxStorage | null>(() => (typeof window === 'undefined' ? null : deviceStorage()));
  const [profile, setProfile] = useState(initialProfile);
  const [avatarUrl, setAvatarUrl] = useState(initialAvatarUrl);
  const [categories, setCategories] = useState(initialCategories);
  const [overlay, setOverlay] = useState<ReadonlyMap<string, Entry | null>>(new Map());
  const [waiting, setWaiting] = useState<ReadonlySet<string>>(new Set());
  const [freshId, setFreshId] = useState<string | null>(null);
  const [panel, setPanel] = useState<Panel>(null);
  const [filter, setFilter] = useState<WallFilter | null>(null);
  const [theme, setThemeState] = useState<Theme>('light');
  const [announcement, setAnnouncement] = useState('');
  const outbox = useRef<Outbox<Entry> | null>(null);
  const opener = useRef<HTMLElement | null>(null);

  const flush = useCallback(async () => {
    const box = outbox.current;
    if (!box) return;
    await box.flush();
    setWaiting(new Set(box.pending().map((operation) => operation.id)));
  }, []);

  useEffect(() => {
    const box = createOutbox<Entry>({
      key: `gratitude-wall.outbox.${userId}`,
      storage: deviceStorage(),
      send: (operation) => (operation.kind === 'save' ? store.saveEntry(operation.entry) : store.removeEntry(operation.id)),
    });
    outbox.current = box;

    // Saves left over from an earlier visit show on the wall straight away.
    const queued = box.pending();
    if (queued.length) {
      setOverlay(new Map(queued.map((operation) => [operation.id, operation.kind === 'save' ? operation.entry : null])));
    }
    flush();

    const retry = () => { if (document.visibilityState === 'visible') flush(); };
    window.addEventListener('online', retry);
    document.addEventListener('visibilitychange', retry);
    return () => {
      window.removeEventListener('online', retry);
      document.removeEventListener('visibilitychange', retry);
    };
  }, [userId, store, flush]);

  // The theme was applied before the page drew; read it back so the switches match.
  useEffect(() => {
    const saved = document.documentElement.dataset.theme;
    if (saved === 'dark' || saved === 'system' || saved === 'light') setThemeState(saved);
  }, []);

  // New accounts start on UTC; pick up the device's timezone so "today" is right.
  useEffect(() => {
    const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (profile.timezone === 'UTC' && zone && zone !== 'UTC') {
      store.saveProfile({ timezone: zone }).then(() => setProfile((current) => ({ ...current, timezone: zone }))).catch(() => {});
    }
  }, [profile.timezone, store]);

  // Esc closes whatever is open; Cmd or Ctrl and K opens search, as the design's hint says.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        opener.current = document.activeElement as HTMLElement | null;
        setPanel({ kind: 'search' });
      } else if (event.key === 'Escape') {
        setPanel((current) => {
          if (current) requestAnimationFrame(() => opener.current?.focus());
          return null;
        });
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Panels cover the wall, so the wall stays still underneath.
  useEffect(() => {
    const covers = panel && panel.kind !== 'account';
    document.documentElement.style.overflow = covers ? 'hidden' : '';
    return () => { document.documentElement.style.overflow = ''; };
  }, [panel]);

  const apply = useCallback((id: string, entry: Entry | null) => {
    setOverlay((current) => new Map(current).set(id, entry));
    outbox.current?.enqueue(entry ? { kind: 'save', id, entry } : { kind: 'remove', id });
    return flush();
  }, [flush]);

  // Counts and notifications come from the server, so re-read them once a change lands.
  const refresh = useCallback(() => {
    if (!outbox.current?.pending().length) router.refresh();
  }, [router]);

  const value = useMemo<AppContextValue>(() => ({
    store,
    basePath,
    userId,
    email,
    profile,
    avatarUrl,
    categories,
    summary,
    overlay,
    waiting,
    freshId,
    panel,
    filter,
    theme,
    today: () => todayIn(profile.timezone),
    open(next) {
      opener.current = document.activeElement as HTMLElement | null;
      setPanel(next);
    },
    close() {
      setPanel(null);
      requestAnimationFrame(() => opener.current?.focus());
    },
    setFilter,
    setTheme(next) {
      setThemeState(next);
      document.documentElement.dataset.theme = next;
      try { localStorage.setItem('grawal-theme', next); } catch { /* the choice lasts for this visit */ }
    },
    saveEntry(entry, { fresh = false } = {}) {
      if (fresh) setFreshId(entry.id);
      setAnnouncement(fresh ? 'Win pinned to your wall.' : 'Changes saved.');
      return apply(entry.id, entry).then(refresh);
    },
    removeEntry(id) {
      setAnnouncement('Win deleted.');
      return apply(id, null).then(refresh);
    },
    async updateProfile(patch) {
      await store.saveProfile(patch);
      setProfile((current) => ({ ...current, ...patch }));
    },
    async setAvatar(file) {
      const { path, url } = await store.uploadAvatar(file);
      await store.saveProfile({ avatar_path: path });
      setProfile((current) => ({ ...current, avatar_path: path }));
      setAvatarUrl(url);
    },
    async addCategory(name, colour) {
      const category = await store.addCategory(name, colour);
      setCategories((current) => [...current, category]);
      return category;
    },
    remembered<T>(key: string, fallback: T): T {
      try { return JSON.parse(storage?.getItem(`grawal.${key}.${userId}`) ?? 'null') ?? fallback; } catch { return fallback; }
    },
    remember(key, data) {
      try { storage?.setItem(`grawal.${key}.${userId}`, JSON.stringify(data)); } catch { /* kept for this visit only */ }
    },
  }), [store, basePath, userId, email, profile, avatarUrl, categories, summary, overlay, waiting, freshId, panel, filter, theme, apply, refresh, storage]);

  return (
    <AppContext.Provider value={value}>
      {children}
      <p role="status" className="sr-only">{announcement}</p>
    </AppContext.Provider>
  );
}
