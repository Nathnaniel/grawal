'use client';

import { formatDay } from '@/lib/dates';
import type { Entry } from '@/lib/types';
import { useApp } from './AppProvider';
import { PinIcon } from './Icons';
import { Keepsake } from './Keepsake';

function PinnedWin({ entry }: { entry: Entry }) {
  const { categories, freshId, waiting, togglePin, openEdit } = useApp();
  const category = categories.find((item) => item.id === entry.category_id);

  return (
    <li className={`keepsake ${freshId === entry.id ? 'row-fresh' : ''}`}>
      <button type="button" className="keepsake-open" aria-label={`Edit: ${entry.title}`} onClick={() => openEdit(entry)}>
        <Keepsake category={category?.name} colour={category?.colour} />
        <span className="keepsake-label">
          <span className="line-clamp-3 font-serif text-lg leading-snug wrap-break-word">{entry.title}</span>
          <time dateTime={entry.entry_date} className="block text-sm">{formatDay(entry.entry_date)}</time>
          {waiting.has(entry.id) && <span className="block text-sm">Saved on this device</span>}
        </span>
      </button>
      <button
        id={`pin-${entry.id}`}
        type="button"
        className="absolute top-0 right-0 grid size-11 place-items-center rounded-full text-white hover:bg-white/15"
        aria-pressed={entry.is_pinned}
        aria-label={`Pin: ${entry.title}`}
        onClick={() => togglePin(entry)}
      >
        <PinIcon filled={entry.is_pinned} />
      </button>
    </li>
  );
}

export function PinnedWins({ entries }: { entries: Entry[] }) {
  if (!entries.length) {
    return <p className="max-w-md text-white">Pin the wins you never want to forget, and they'll stay here in view.</p>;
  }
  return (
    <ul aria-label="Pinned wins" className="keepsake-grid">
      {entries.map((entry) => <PinnedWin key={entry.id} entry={entry} />)}
    </ul>
  );
}
