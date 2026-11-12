import { ImageResponse } from 'next/og';
import { Mark } from '@/lib/brand-mark';

// The icon iPhones and iPads use when the site is added to the home screen.
export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff' }}>
        <Mark size={112} />
      </div>
    ),
    size,
  );
}
