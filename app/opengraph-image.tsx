import { ImageResponse } from 'next/og';
import { Mark } from '@/lib/brand-mark';

// The picture shown when a Grawal link is shared: the mark, centred on white.
export const alt = 'Grawal';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff' }}>
        <Mark size={300} />
      </div>
    ),
    size,
  );
}
