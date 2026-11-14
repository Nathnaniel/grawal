'use client';

import { useEffect, useRef, useState } from 'react';
import { newestFirst } from '@/lib/order';
import { matchesSearch } from '@/lib/search';
import { WALL_PAGE_SIZE, type Entry } from '@/lib/types';
import { useApp, useEntries } from '../AppProvider';
import { EmptyState } from './EmptyState';
import { WinNote } from './WinNote';

// Figma: 186.67px notes, five across with 20px gaps from 160px down on desktop;
// 168px notes, two across with 12px gaps on phones.
// Phones always get two columns, 168px as in Figma and narrower on smaller screens
// (the note's text scales with it). Tablets and up fit as many full notes as they can.
export const GRID = 'grid justify-center gap-3 [grid-template-columns:repeat(2,minmax(0,168px))] sm:[grid-template-columns:repeat(auto-fill,168px)] lg:gap-5 lg:[grid-template-columns:repeat(auto-fill,186.67px)] xl:justify-start';

export function WallView({ entries: firstPage, hasMore: initialHasMore }: { entries: Entry[]; hasMore: boolean }) {
  const { store, filter, setFilter } = useApp();
  const [older, setOlder] = useState<Entry[]>([]);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [results, setResults] = useState<Entry[] | null>(null);
  const loading = useRef(false);
  const sentinel = useRef<HTMLDivElement>(null);

  // A search from the header narrows the wall to matching wins.
  useEffect(() => {
    let current = true;
    setResults(null);
    if (filter) store.search({ q: filter.q, categoryId: filter.categoryId }).then((found) => { if (current) setResults(found); }, () => { if (current) setResults([]); });
    return () => { current = false; };
  }, [filter, store]);

  // Only wins still on the wall; unpinned ones live on in History.
  const matches = (entry: Entry) => entry.on_wall !== false && (!filter || matchesSearch(entry, { q: filter.q, category: filter.categoryId, year: '' }));
  const shown = useEntries(filter ? results ?? [] : [...firstPage, ...older], matches).sort(newestFirst);

  // More of the wall loads as the last row comes into view.
  useEffect(() => {
    const target = sentinel.current;
    if (!target || filter || !hasMore) return;
    const watcher = new IntersectionObserver(async ([seen]) => {
      if (!seen.isIntersecting || loading.current) return;
      const last = older.at(-1) ?? firstPage.at(-1);
      if (!last) return;
      loading.current = true;
      try {
        const next = await store.entriesBefore(last, WALL_PAGE_SIZE + 1);
        setOlder((current) => [...current, ...next.slice(0, WALL_PAGE_SIZE)]);
        setHasMore(next.length > WALL_PAGE_SIZE);
      } finally {
        loading.current = false;
      }
    }, { rootMargin: '600px' });
    watcher.observe(target);
    return () => watcher.disconnect();
  }, [filter, hasMore, older, firstPage, store]);

  if (!filter && !shown.length) {
    return <EmptyState title="Wall is empty">Your wall is waiting.<br />What has God done for you today?</EmptyState>;
  }

  return (
    <div className="mx-auto px-[22.5px] pb-40 lg:max-w-[min(1020px,calc(100vw-260px))] lg:px-0 lg:pt-[60px] lg:pb-24">
      {filter && (
        <div className="mb-5 flex items-center justify-center gap-2 font-avenir text-sm text-[var(--d-soft)]">
          <span>Showing <strong className="font-medium text-[var(--d-text)]">{filter.label}</strong></span>
          <button type="button" onClick={() => setFilter(null)} className="rounded-xl bg-[var(--d-field)] px-3 py-1 text-[var(--d-text)]">Clear</button>
        </div>
      )}
      {filter && results && !shown.length ? (
        <p className="pt-16 text-center font-avenir text-base text-[var(--d-soft)]">No wins match “{filter.label}”.</p>
      ) : (
        <ul className={GRID}>
          {shown.map((entry) => <li key={entry.id}><WinNote entry={entry} /></li>)}
        </ul>
      )}
      <div ref={sentinel} aria-hidden="true" />
    </div>
  );
}
