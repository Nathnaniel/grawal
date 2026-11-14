import type { SampleNote } from './content';

/**
 * A pinned note. With `breeze`, hovering it sends the same breeze through the paper
 * as on the wall: the note stays put to catch the pointer while an inner layer (the
 * paper and its words) swings from the pin.
 */
export function StickyNote({ note, className = '', style, breeze = false }: { note: SampleNote; className?: string; style?: React.CSSProperties; breeze?: boolean }) {
  const paper = (
    <>
      <img src={`/landing/note-${note.colour}.svg`} alt="" />
      <div className="sticky-note-text">
        <div>
          <p className="sticky-note-title">{note.category}</p>
          <p className="sticky-note-story">{note.story}</p>
        </div>
      </div>
    </>
  );
  return (
    <div className={`sticky-note ${breeze ? 'group' : ''} ${className}`} style={style}>
      {breeze ? <div className="note-breeze absolute inset-0">{paper}</div> : paper}
    </div>
  );
}
