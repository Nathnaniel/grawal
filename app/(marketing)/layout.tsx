import type { Viewport } from 'next';
import { ScrollAnimations } from '@/components/landing/ScrollAnimations';
import { SmoothScroll } from '@/components/landing/SmoothScroll';

// Grawal blue fills the browser's tab and address bar, and the strip around the
// Dynamic Island, so the hero's blue runs right to the top of the phone.
export const viewport: Viewport = { themeColor: '#1568D4', viewportFit: 'cover' };

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="landing bg-white text-[#1a1a1a]">
      <SmoothScroll />
      <ScrollAnimations />
      {children}
    </div>
  );
}
