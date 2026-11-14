// The hero's drafting lines, from the Figma hero frames (desktop 1440px, phones 394px).
// The dotted horizontals run edge to edge at any width; the verticals and their
// crosses keep their place either side of the centre, as in the design.

type Layout = { height: number; rows: number[]; columns: number[]; dot: number; line: number; cross: number; crossWidth: number };

// Positions are from the Figma frames: rows from the top, columns from the centre line.
const DESKTOP: Layout = { height: 856, rows: [350, 518], columns: [-396, 397], dot: 0.6, line: 1, cross: 8, crossWidth: 1.5 };
const MOBILE: Layout = { height: 854, rows: [349.5, 458.4], columns: [-153, 154], dot: 0.33, line: 0.6, cross: 2.2, crossWidth: 0.6 };

function Lines({ layout, className }: { layout: Layout; className: string }) {
  const { height, rows, columns, dot, line, cross, crossWidth } = layout;
  const dashed = { stroke: '#84CCF9', strokeWidth: line, strokeDasharray: `${dot} ${dot}` };
  return (
    <svg aria-hidden className={`absolute inset-x-0 top-0 w-full ${className}`} height={height} opacity={0.6} overflow="visible">
      {rows.map((y) => <line key={y} x1="0" x2="100%" y1={y} y2={y} {...dashed} />)}
      {/* Everything below is placed from the centre of the page. */}
      <svg x="50%" overflow="visible">
        {columns.map((x) => <line key={x} x1={x} x2={x} y1="0" y2={height} {...dashed} />)}
        {columns.flatMap((x) => rows.map((y) => (
          <g key={`${x}-${y}`} stroke="white" strokeWidth={crossWidth} strokeLinecap="round">
            <line x1={x} x2={x} y1={y - cross} y2={y + cross} />
            <line x1={x - cross} x2={x + cross} y1={y} y2={y} />
          </g>
        )))}
      </svg>
    </svg>
  );
}

export function HeroLines() {
  return (
    <>
      <Lines layout={DESKTOP} className="hidden lg:block" />
      <Lines layout={MOBILE} className="lg:hidden" />
    </>
  );
}
