'use client';

import { useState } from 'react';
import { formatDay } from '@/lib/dates';
import { noteColour, noteText } from '@/lib/notes';
import type { Entry } from '@/lib/types';
import { StickyNote } from '../landing/StickyNote';
import { useApp } from '../AppProvider';

/** A win lifted off the wall at 400px, as in Figma, with ways to change it beneath. */
export function NoteDetail({ entry }: { entry: Entry }) {
  const { categories, open, close, removeEntry, saveEntry } = useApp();
  const [confirming, setConfirming] = useState(false);
  // 'falling' while an unpinned note drops away, 'pinning' while one is pinned back.
  const [motion, setMotion] = useState<'falling' | 'pinning' | null>(null);
  const onWall = entry.on_wall !== false;
  const still = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // The red pin on the note: unpinning takes the win off the wall (it stays in
  // History); on a win that's already off, it pins it back.
  function togglePin() {
    if (motion) return;
    const finish = () => { saveEntry({ ...entry, on_wall: !onWall }); close(); };
    if (still()) return finish();
    setMotion(onWall ? 'falling' : 'pinning');
    window.setTimeout(finish, onWall ? 850 : 500);
  }
  const category = categories.find((item) => item.id === entry.category_id);
  const { heading, story } = noteText(entry, category?.name);
  const colour = noteColour(entry.id);

  return (
    <div role="dialog" aria-modal="true" aria-label={heading} className="pointer-events-none fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 px-5">
      {/* Springs open from a small squeezed note; see .note-unfold in globals.css. */}
      <div className="note-unfold pointer-events-auto w-[min(400px,100%)]">
        <div className={`relative ${motion === 'falling' ? 'note-fall' : motion === 'pinning' ? 'note-fresh' : ''}`}>
          <StickyNote note={{ category: heading, story, colour }} className={`w-full ${onWall ? '' : 'opacity-60'}`} />
          {/* Over the pin drawn on the note (44–58% across, 1–14% down), with room to tap. */}
          <button
            type="button"
            onClick={togglePin}
            aria-label={onWall ? 'Unpin from your wall' : 'Pin back to your wall'}
            className="group/pin absolute top-0 left-[39%] h-[19%] w-[24%] rounded-full"
          >
            <span aria-hidden className="pointer-events-none absolute bottom-full left-1/2 hidden -translate-x-1/2 rounded-lg bg-[var(--d-text)] px-2 py-1 font-avenir text-xs leading-4 whitespace-nowrap text-[var(--d-bg)] opacity-0 group-hover/pin:opacity-100 group-focus-visible/pin:opacity-100 lg:block">
              {onWall ? 'Unpin from wall' : 'Pin back to wall'}
            </span>
          </button>
        </div>
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
            {!onWall && <span className="rounded-md bg-[var(--d-field)] px-2 py-0.5 text-xs text-[var(--d-mid)]">Off the wall</span>}
            <button type="button" onClick={() => open({ kind: 'create', entry })} className="rounded-lg px-3 py-1.5 text-[var(--d-text)]">Edit</button>
            <button type="button" onClick={() => setConfirming(true)} className="rounded-lg px-3 py-1.5 text-[var(--d-danger)]">Delete</button>
          </>
        )}
      </div>
    </div>
  );
}
