import type { Viewport } from 'next';
import { Inter, Nunito_Sans, Oswald } from 'next/font/google';
import localFont from 'next/font/local';
import { ScrollAnimations } from '@/components/landing/ScrollAnimations';
import { SmoothScroll } from '@/components/landing/SmoothScroll';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter-face' });
const oswald = Oswald({ subsets: ['latin'], weight: ['500'], variable: '--font-oswald' });
const nunito = Nunito_Sans({ subsets: ['latin'], weight: ['400', '500', '800'], variable: '--font-nunito' });
const switzer = localFont({ src: '../fonts/Switzer-Variable.woff2', variable: '--font-switzer-face', weight: '100 900' });

// Grawal blue fills the browser's tab and address bar, and the strip around the
// Dynamic Island, so the hero's blue runs right to the top of the phone.
export const viewport: Viewport = { themeColor: '#1568D4', viewportFit: 'cover' };

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`landing bg-white text-[#1a1a1a] ${inter.variable} ${oswald.variable} ${nunito.variable} ${switzer.variable}`}>
      <SmoothScroll />
      <ScrollAnimations />
      {children}
    </div>
  );
}
