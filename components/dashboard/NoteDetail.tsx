'use client';

import { useState } from 'react';
import { formatDay } from '@/lib/dates';
import { noteColour, noteText } from '@/lib/notes';
import type { Entry } from '@/lib/types';
import { StickyNote } from '../landing/StickyNote';
import { useApp } from '../AppProvider';

/** A win lifted off the wall at 400px, as in Figma, with ways to change it beneath. */
export function NoteDetail({ entry }: { entry: Entry }) {
  const { categories, open, close, removeEntry } = useApp();
  const [confirming, setConfirming] = useState(false);
  const category = categories.find((item) => item.id === entry.category_id);
  const { heading, story } = noteText(entry, category?.name);
  const colour = noteColour(entry.id);

  return (
    <div role="dialog" aria-modal="true" aria-label={heading} className="pointer-events-none fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 px-5">
      {/* Springs open from a small squeezed note; see .note-unfold in globals.css. */}
      <div className="note-unfold pointer-events-auto w-[min(400px,100%)]">
        <StickyNote note={{ category: heading, story, colour }} className="w-full" />
      </div>
      <div className="note-actions-in pointer-events-auto flex items-center gap-2 rounded-xl bg-[var(--d-surface)] px-2 py-1.5 font-avenir text-sm dash-pop">
        {confirming ? (
          <>
            <span className="px-2 text-[var(--d-soft)]">Delete this win? This can’t be undone.</span>
            <button type="button" onClick={() => { removeEntry(entry.id); close(); }} className="rounded-lg px-3 py-1.5 font-medium text-[var(--d-danger)]">Delete</button>
            <button type="button" onClick={() => setConfirming(false)} className="rounded-lg px-3 py-1.5 text-[var(--d-text)]">Keep</button>
          </>
        ) : (
          <>
            <time dateTime={entry.entry_date} className="px-2 text-[var(--d-muted)]">{formatDay(entry.entry_date)}</time>
            <button type="button" onClick={() => open({ kind: 'create', entry })} className="rounded-lg px-3 py-1.5 text-[var(--d-text)]">Edit</button>
            <button type="button" onClick={() => setConfirming(true)} className="rounded-lg px-3 py-1.5 text-[var(--d-danger)]">Delete</button>
          </>
        )}
      </div>
    </div>
  );
}
