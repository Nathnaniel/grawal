'use client';

import { useState } from 'react';
import { newestFirst } from '@/lib/order';
import { WALL_PAGE_SIZE, type Entry, type WallSummary } from '@/lib/types';
import { useApp, useEntries } from './AppProvider';
import { PlusIcon } from './Icons';
import { PinnedWins } from './PinnedWins';
import { Widgets } from './Widgets';
import { WinHistory } from './WinHistory';

export function WallView({ pinned, recent, hasMore: initialHasMore, summary }: {
  pinned: Entry[];
  recent: Entry[];
  hasMore: boolean;
  summary: WallSummary;
}) {
  const { store, profile, openAdd } = useApp();
  const [older, setOlder] = useState<Entry[]>([]);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loading, setLoading] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);

  const entries = useEntries([...pinned, ...recent, ...older]).sort(newestFirst);
  const pinnedEntries = entries.filter((entry) => entry.is_pinned);
  const history = entries.filter((entry) => !entry.is_pinned);
  const name = profile.name.trim();

  async function showMore() {
    const last = older.at(-1) ?? recent.at(-1);
    if (!last) return;
    setLoading(true);
    setLoadFailed(false);
    try {
      const next = await store.entriesBefore(last, WALL_PAGE_SIZE + 1);
      setOlder((current) => [...current, ...next.slice(0, WALL_PAGE_SIZE)]);
      setHasMore(next.length > WALL_PAGE_SIZE);
    } catch {
      setLoadFailed(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-5 px-4 pt-5 pb-28 lg:h-full lg:grid-cols-[16rem_minmax(0,1fr)_15rem] lg:gap-4 xl:grid-cols-[19rem_minmax(0,1fr)_18rem] xl:gap-6 lg:p-0 lg:pr-5">
      {/* The wall comes first for phones and screen readers. On a wide screen the history sits to its left. */}
      <div className="min-w-0 lg:order-2 lg:overflow-y-auto lg:px-2 lg:pt-8 lg:pb-28">
        <div className="mb-8 flex items-center gap-4 text-white">
          <span aria-hidden="true" className="grid size-20 shrink-0 place-items-center rounded-full bg-linear-to-b from-[#ffd98a] to-[#f08a4b] font-serif text-3xl text-ink shadow-lg ring-2 ring-white/60">
            {(name[0] ?? 'G').toUpperCase()}
          </span>
          <div className="min-w-0">
            <h1>{name ? `${name}'s wall` : 'Your wall'}</h1>
            <p className="mt-1 max-w-md font-serif text-lg italic">Bless the Lord, O my soul, and forget not all his benefits. <span className="not-italic">Psalm 103:2</span></p>
          </div>
        </div>

        {entries.length ? <PinnedWins entries={pinnedEntries} /> : (
          <div className="max-w-md text-white">
            <h2>What has God done for you today?</h2>
            <p className="mt-2">Big or small, pin it here. Your wall keeps it for the days you need reminding.</p>
            <button type="button" className="btn mt-5 bg-white text-deep hover:bg-panel" onClick={openAdd}><PlusIcon /> Add your first win</button>
          </div>
        )}
      </div>

      <div className="min-w-0 lg:order-3 lg:overflow-y-auto lg:pt-5 lg:pb-24">
        <Widgets summary={summary} />
      </div>

      <div className="flex min-h-0 min-w-0 flex-col lg:order-1 lg:my-5">
        <WinHistory entries={history} hasMore={hasMore} loading={loading} loadFailed={loadFailed} onShowMore={showMore} />
      </div>
    </div>
  );
}
