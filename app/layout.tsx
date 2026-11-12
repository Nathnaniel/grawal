import type { Metadata, Viewport } from 'next';
import { SITE_NAME, SITE_PITCH } from '@/lib/site';
import { fontVariables } from './fonts';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3002'),
  title: { default: SITE_NAME, template: `%s | ${SITE_NAME}` },
  description: SITE_PITCH,
  robots: { index: false },
};

export const viewport: Viewport = { themeColor: '#f5f5f5', viewportFit: 'cover' };

// Applies the saved Light, Dark or System choice before the page draws, so it never flashes.
const THEME_SCRIPT = `try{document.documentElement.dataset.theme=localStorage.getItem('grawal-theme')||'light'}catch(e){document.documentElement.dataset.theme='light'}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={fontVariables} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
