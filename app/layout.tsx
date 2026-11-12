import type { Metadata, Viewport } from 'next';
import { Alegreya, Hanken_Grotesk } from 'next/font/google';
import { SITE_NAME, SITE_PITCH } from '@/lib/site';
import './globals.css';

const serif = Alegreya({ subsets: ['latin'], variable: '--font-alegreya', style: ['normal', 'italic'] });
const sans = Hanken_Grotesk({ subsets: ['latin'], variable: '--font-hanken' });

export const metadata: Metadata = {
  title: { default: SITE_NAME, template: `%s | ${SITE_NAME}` },
  description: SITE_PITCH,
  robots: { index: false },
};

export const viewport: Viewport = { themeColor: '#12468a', viewportFit: 'cover' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
