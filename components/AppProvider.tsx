'use client';

import { useRouter } from 'next/navigation';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { todayIn } from '@/lib/dates';
import { createOutbox, type Outbox, type OutboxStorage } from '@/lib/outbox';
import { createSupabaseStore } from '@/lib/store';
import type { AppStore, Category, Entry, Profile, ProfilePatch } from '@/lib/types';
import { EntrySheet } from './EntrySheet';

interface AppContextValue {
  store: AppStore;
  basePath: string;
  profile: Profile;
  categories: Category[];
  /** Changes made in this visit: the entry, or null when it was deleted. */
  overlay: ReadonlyMap<string, Entry | null>;
  /** Entries still waiting to reach the server. */
  waiting: ReadonlySet<string>;
  freshId: string | null;
  today: () => string;
  /** The card updates at once. The promise settles after the send was attempted. */
  saveEntry: (entry: Entry, options?: { fresh?: boolean }) => Promise<void>;
  removeEntry: (id: string) => Promise<void>;
  togglePin: (entry: Entry) => void;
  openAdd: () => void;
  openEdit: (entry: Entry) => void;
  updateProfile: (patch: ProfilePatch) => Promise<void>;
  addCategory: (name: string, colour: string) => Promise<void>;
  removeCategory: (id: string) => Promise<void>;
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

export function AppProvider({ userId, profile: initialProfile, categories: initialCategories, basePath = '', store: givenStore, children }: {
  userId: string;
  profile: Profile;
  categories: Category[];
  basePath?: string;
  store?: AppStore;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [store] = useState(() => givenStore ?? createSupabaseStore());
  const [profile, setProfile] = useState(initialProfile);
  const [categories, setCategories] = useState(initialCategories);
  const [overlay, setOverlay] = useState<ReadonlyMap<string, Entry | null>>(new Map());
  const [waiting, setWaiting] = useState<ReadonlySet<string>>(new Set());
  const [freshId, setFreshId] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState('');
  const [sheet, setSheet] = useState<{ open: boolean; entry: Entry | null; opened: number }>({ open: false, entry: null, opened: 0 });
  const outbox = useRef<Outbox<Entry> | null>(null);
  const focusAfterChange = useRef<string | null>(null);

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

  // Runs after the sheet has closed, so its own focus handling can't undo this.
  useEffect(() => {
    if (!focusAfterChange.current) return;
    document.getElementById(focusAfterChange.current)?.focus();
    focusAfterChange.current = null;
  }, [overlay]);

  const apply = useCallback((id: string, entry: Entry | null) => {
    setOverlay((current) => new Map(current).set(id, entry));
    outbox.current?.enqueue(entry ? { kind: 'save', id, entry } : { kind: 'remove', id });
    return flush();
  }, [flush]);

  // Counts come from the server, so re-read them once a change has landed there.
  const refreshTotals = useCallback(() => {
    if (!outbox.current?.pending().length) router.refresh();
  }, [router]);

  const value = useMemo<AppContextValue>(() => ({
    store,
    basePath,
    profile,
    categories,
    overlay,
    waiting,
    freshId,
    today: () => todayIn(profile.timezone),
    saveEntry(entry, { fresh = false } = {}) {
      if (fresh) setFreshId(entry.id);
      setAnnouncement(fresh ? 'Win added to your wall.' : 'Changes saved.');
      return apply(entry.id, entry).then(() => { if (fresh) refreshTotals(); });
    },
    removeEntry(id) {
      setAnnouncement('Win deleted.');
      // The card that had focus is gone.
      focusAfterChange.current = 'main';
      return apply(id, null).then(refreshTotals);
    },
    togglePin(entry) {
      setAnnouncement(entry.is_pinned ? 'Unpinned.' : 'Pinned to the top of your wall.');
      apply(entry.id, { ...entry, is_pinned: !entry.is_pinned });
      // Pinning moves the card to another section, so keep keyboard focus with it.
      focusAfterChange.current = `pin-${entry.id}`;
    },
    openAdd: () => setSheet((current) => ({ open: true, entry: null, opened: current.opened + 1 })),
    openEdit: (entry) => setSheet((current) => ({ open: true, entry, opened: current.opened + 1 })),
    async updateProfile(patch) {
      await store.saveProfile(patch);
      setProfile((current) => ({ ...current, ...patch }));
    },
    async addCategory(name, colour) {
      const category = await store.addCategory(name, colour);
      setCategories((current) => [...current, category]);
    },
    async removeCategory(id) {
      await store.removeCategory(id);
      setCategories((current) => current.filter((category) => category.id !== id));
      setOverlay((current) => new Map([...current].map(([entryId, entry]) => [
        entryId,
        entry?.category_id === id ? { ...entry, category_id: null } : entry,
      ])));
    },
  }), [store, basePath, profile, categories, overlay, waiting, freshId, apply, refreshTotals]);

  return (
    <AppContext.Provider value={value}>
      {children}
      <EntrySheet key={sheet.opened} open={sheet.open} entry={sheet.entry} onClose={() => setSheet((current) => ({ ...current, open: false }))} />
      <p role="status" className="sr-only">{announcement}</p>
    </AppContext.Provider>
  );
}
