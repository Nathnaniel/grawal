'use client';

import { noteColour, noteText } from '@/lib/notes';
import type { Entry } from '@/lib/types';
import { StickyNote } from '../landing/StickyNote';
import { useApp } from '../AppProvider';


// A little celebration from the pin when a new win lands: bits of paper in the note
// colours and a few sparkles pop out, then drift down. Fixed shapes, so it looks the
// same every time; see .pin-burst in globals.css.
const BURST = [
  { dx: -4.0, dy: -39.0, r: -90, c: '#f2c14e', kind: 'paper' },
  { dx: 29.1, dy: -43.6, r: -43, c: '#d63a9a', kind: 'paper' },
  { dx: 46.3, dy: -46.9, r: 4, c: '#5ab0f0', kind: 'paper' },
  { dx: 49.1, dy: -11.6, r: 51, c: '#ffffff', kind: 'spark' },
  { dx: 63.8, dy: -4.7, r: -82, c: '#1568d4', kind: 'paper' },
  { dx: 67.0, dy: 32.2, r: -35, c: '#f2c14e', kind: 'paper' },
  { dx: 42.9, dy: 30.6, r: 12, c: '#d63a9a', kind: 'paper' },
  { dx: 18.4, dy: 56.5, r: 59, c: '#5ab0f0', kind: 'spark' },
  { dx: 4.2, dy: 40.6, r: -74, c: '#ffffff', kind: 'paper' },
  { dx: -30.0, dy: 45.1, r: -27, c: '#1568d4', kind: 'paper' },
  { dx: -47.6, dy: 48.2, r: 20, c: '#f2c14e', kind: 'paper' },
  { dx: -51.1, dy: 12.0, r: 67, c: '#d63a9a', kind: 'spark' },
  { dx: -65.7, dy: 4.9, r: -66, c: '#5ab0f0', kind: 'paper' },
  { dx: -68.8, dy: -33.1, r: -19, c: '#ffffff', kind: 'paper' },
  { dx: -44.4, dy: -31.7, r: 28, c: '#1568d4', kind: 'paper' },
  { dx: -19.0, dy: -58.2, r: 75, c: '#f2c14e', kind: 'spark' },
];

function PinBurst() {
  return (
    <span aria-hidden className="pin-burst pointer-events-none absolute top-[8%] left-[51%] z-10">
      {BURST.map((bit, index) => (
        <span
          key={index}
          className={bit.kind === 'spark' ? 'pin-burst-spark' : 'pin-burst-paper'}
          style={{ '--dx': `${bit.dx}px`, '--dy': `${bit.dy}px`, '--r': `${bit.r}deg`, background: bit.kind === 'spark' ? undefined : bit.c, animationDelay: `${300 + (index % 4) * 18}ms` } as React.CSSProperties}
        />
      ))}
    </span>
  );
}

/** One win on the wall. Opening it shows it full size. */
export function WinNote({ entry }: { entry: Entry }) {
  const { categories, freshId, waiting, open } = useApp();
  const category = categories.find((item) => item.id === entry.category_id);
  const { heading, story } = noteText(entry, category?.name);

  return (
    <button
      type="button"
      onClick={() => open({ kind: 'note', entry })}
      aria-label={`${heading}: ${story || entry.title}${entry.on_wall === false ? ' (off the wall)' : ''}`}
      className={`group relative block w-full max-w-[168px] rounded-sm text-left lg:w-[186.67px] lg:max-w-none ${freshId === entry.id ? 'note-fresh' : ''}`}
    >
      {/* Only the paper moves (a breeze through it, see .note-breeze); the button stays
          put, so the pointer never slips off its edge and sets off a flicker. */}
      <StickyNote
        note={{ category: heading, story, colour: noteColour(entry.id) }}
        className={`note-breeze w-full ${entry.on_wall === false ? 'opacity-60' : ''}`}
      />
      {freshId === entry.id && <PinBurst />}
      {waiting.has(entry.id) && (
        <span className="absolute inset-x-0 -bottom-5 text-center text-[11px] text-[var(--d-muted)]">Saved on this device</span>
      )}
    </button>
  );
}
