// The Grawal mark from the Figma logo: four shapes in a 24 by 24 box.
export const MARK_BLUE = '#1568D4';

export const MARK_PATHS = [
  'M10.2996 24L0 10.2996H5.87854L10.2996 24Z',
  'M24 19.5789L10.2996 24L24 13.7004V19.5789Z',
  'M14.8664 14.3806L4.5668 0.680162H10.4453L14.8664 14.3806Z',
  'M24 13.7004L13.7004 0H19.5789L24 13.7004Z',
];

export function Mark({ size, colour = MARK_BLUE }: { size: number; colour?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      {MARK_PATHS.map((d) => <path key={d} d={d} fill={colour} />)}
    </svg>
  );
}
