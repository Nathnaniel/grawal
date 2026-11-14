'use client';

import { noteColour, noteText } from '@/lib/notes';
import type { Entry } from '@/lib/types';
import { StickyNote } from '../landing/StickyNote';
import { useApp } from '../AppProvider';

/** One win on the wall. Opening it shows it full size. */
export function WinNote({ entry }: { entry: Entry }) {
  const { categories, freshId, waiting, open } = useApp();
  const category = categories.find((item) => item.id === entry.category_id);
  const { heading, story } = noteText(entry, category?.name);

  return (
    <button
      type="button"
      onClick={() => open({ kind: 'note', entry })}
      aria-label={`${heading}: ${story || entry.title}`}
      className={`group relative block w-full max-w-[168px] rounded-sm text-left lg:w-[186.67px] lg:max-w-none ${freshId === entry.id ? 'note-fresh' : ''}`}
    >
      {/* Only the note lifts; the button stays put, so the pointer never slips off its
          edge and sets off a flicker. */}
      <StickyNote
        note={{ category: heading, story, colour: noteColour(entry.id) }}
        className="w-full transition-transform duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:-translate-y-1 group-hover:rotate-[-0.6deg] group-focus-visible:-translate-y-1 motion-reduce:transition-none motion-reduce:group-hover:transform-none"
      />
      {waiting.has(entry.id) && (
        <span className="absolute inset-x-0 -bottom-5 text-center text-[11px] text-[var(--d-muted)]">Saved on this device</span>
      )}
    </button>
  );
}
