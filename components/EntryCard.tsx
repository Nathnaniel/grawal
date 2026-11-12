'use client';

import { useState } from 'react';
import { formatDay } from '@/lib/dates';
import type { Entry } from '@/lib/types';
import { useApp } from './AppProvider';
import { PinIcon } from './Icons';

const LONG_REFLECTION = 220;

// A slight lean from the entry's id, the same on every visit.
function tiltFor(id: string) {
  let hash = 0;
  for (const character of id) hash = (hash * 31 + character.charCodeAt(0)) | 0;
  return `${((Math.abs(hash) % 21) - 10) / 10}deg`;
}

export function EntryCard({ entry, large = false }: { entry: Entry; large?: boolean }) {
  const { categories, freshId, waiting, togglePin, openEdit } = useApp();
  const [expanded, setExpanded] = useState(false);
  const category = categories.find((item) => item.id === entry.category_id);
  const long = (entry.reflection?.length ?? 0) > LONG_REFLECTION;

  return (
    <article
      className={`note ${freshId === entry.id ? 'note-fresh' : ''}`}
      style={{ '--tilt': tiltFor(entry.id), '--cat': category?.colour } as React.CSSProperties}
    >
      {entry.is_pinned && <span className="pin-head" aria-hidden="true" />}

      <div className="flex items-start justify-between gap-2">
        <h3 className={`min-w-0 font-serif leading-snug wrap-break-word ${large ? 'text-2xl' : 'text-xl'}`}>{entry.title}</h3>
        <button
          id={`pin-${entry.id}`}
          type="button"
          className={`-mt-2 -mr-2 grid size-11 shrink-0 place-items-center rounded-full hover:bg-deep/10 ${entry.is_pinned ? 'text-deep' : 'text-soft'}`}
          aria-pressed={entry.is_pinned}
          aria-label={`Pin: ${entry.title}`}
          onClick={() => togglePin(entry)}
        >
          <PinIcon filled={entry.is_pinned} />
        </button>
      </div>

      {entry.scripture_ref && <p className="font-serif italic text-soft">{entry.scripture_ref}</p>}

      {entry.reflection && (
        <div>
          <p className={`whitespace-pre-line wrap-break-word ${long && !expanded ? 'line-clamp-4' : ''}`}>{entry.reflection}</p>
          {long && (
            <button type="button" className="text-link min-h-11" aria-expanded={expanded} onClick={() => setExpanded(!expanded)}>
              {expanded ? 'Show less' : 'Read more'}
            </button>
          )}
        </div>
      )}

      <div className="mt-auto flex flex-wrap items-center gap-x-3 text-soft">
        <time dateTime={entry.entry_date}>{formatDay(entry.entry_date)}</time>
        {category && (
          <span className="inline-flex items-center gap-1.5">
            <span aria-hidden="true" className="size-2.5 rounded-full" style={{ background: category.colour }} />
            {category.name}
          </span>
        )}
        <button type="button" className="text-link ml-auto min-h-11 px-1" aria-label={`Edit: ${entry.title}`} onClick={() => openEdit(entry)}>
          Edit
        </button>
      </div>

      {waiting.has(entry.id) && <p className="text-soft">Saved on this device. It will sync when you're back online.</p>}
    </article>
  );
}
