import type { SampleNote } from './content';

export function StickyNote({ note, className = '', style }: { note: SampleNote; className?: string; style?: React.CSSProperties }) {
  return (
    <div className={`sticky-note ${className}`} style={style}>
      <img src={`/landing/note-${note.colour}.svg`} alt="" />
      <div className="sticky-note-text">
        <div>
          <p className="sticky-note-title">{note.category}</p>
          <p className="sticky-note-story">{note.story}</p>
        </div>
      </div>
    </div>
  );
}
