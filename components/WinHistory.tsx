'use client';

import { formatDay, groupByPeriod } from '@/lib/dates';
import type { Entry } from '@/lib/types';
import { useApp } from './AppProvider';
import { PinIcon } from './Icons';

function HistoryRow({ entry }: { entry: Entry }) {
  const { categories, freshId, waiting, togglePin, openEdit } = useApp();
  const category = categories.find((item) => item.id === entry.category_id);

  return (
    <li className={`history-row ${freshId === entry.id ? 'row-fresh' : ''}`}>
      <button type="button" className="min-w-0 rounded-lg px-2 py-2 text-left" aria-label={`Edit: ${entry.title}`} onClick={() => openEdit(entry)}>
        <span className="block font-serif text-lg leading-snug wrap-break-word">{entry.title}</span>
        <span className="flex flex-wrap items-center gap-x-2 text-sm text-soft">
          <time dateTime={entry.entry_date}>{formatDay(entry.entry_date)}</time>
          {category && (
            <span className="inline-flex items-center gap-1">
              <span aria-hidden="true" className="size-2 rounded-full" style={{ background: category.colour }} />
              {category.name}
            </span>
          )}
        </span>
        {waiting.has(entry.id) && <span className="block text-sm text-soft">Saved on this device. It will sync when you're back online.</span>}
      </button>
      <button
        id={`pin-${entry.id}`}
        type="button"
        className="grid size-11 place-items-center rounded-full text-soft hover:bg-deep/10"
        aria-pressed={entry.is_pinned}
        aria-label={`Pin: ${entry.title}`}
        onClick={() => togglePin(entry)}
      >
        <PinIcon filled={entry.is_pinned} />
      </button>
    </li>
  );
}

export function WinHistory({ entries, hasMore, loading, loadFailed, onShowMore }: {
  entries: Entry[];
  hasMore: boolean;
  loading: boolean;
  loadFailed: boolean;
  onShowMore: () => void;
}) {
  return (
    <section aria-labelledby="history-heading" className="glass flex min-h-0 flex-col rounded-xl p-3 lg:rounded-l-none lg:pb-4">
      <h2 id="history-heading" className="px-2 pt-1 pb-2">History</h2>
      <div className="min-h-0 flex-1 lg:overflow-y-auto">
        {entries.length ? groupByPeriod(entries).map(({ period, label, items }) => (
          <div key={period} className="mb-3">
            <h3 className="sticky top-0 z-1 rounded bg-panel px-2 py-1 font-sans text-sm font-bold text-soft">{label}</h3>
            <ul>{items.map((entry) => <HistoryRow key={entry.id} entry={entry} />)}</ul>
          </div>
        )) : (
          <p className="px-2 text-soft">New wins appear here. Pin one to move it onto your wall.</p>
        )}
        {hasMore && (
          <div className="px-2 pb-2">
            <button type="button" className="btn btn-quiet w-full" disabled={loading} onClick={onShowMore}>
              {loading ? 'Loading older wins' : 'Show older wins'}
            </button>
            {loadFailed && <p role="alert" className="mt-2 text-error">Older wins didn't load. Check your connection and try again.</p>}
          </div>
        )}
      </div>
    </section>
  );
}
