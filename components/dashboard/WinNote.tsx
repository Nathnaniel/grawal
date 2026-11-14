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
      className={`relative block w-full max-w-[168px] rounded-sm text-left transition-transform duration-200 hover:-translate-y-0.5 lg:w-[186.67px] lg:max-w-none ${freshId === entry.id ? 'note-fresh' : ''}`}
    >
      <StickyNote note={{ category: heading, story, colour: noteColour(entry.id) }} className="w-full" />
      {waiting.has(entry.id) && (
        <span className="absolute inset-x-0 -bottom-5 text-center text-[11px] text-[var(--d-muted)]">Saved on this device</span>
      )}
    </button>
  );
}
