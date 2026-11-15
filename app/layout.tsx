import type { Metadata, Viewport } from 'next';
import { SITE_NAME, SITE_PITCH } from '@/lib/site';
import { fontVariables } from './fonts';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3002'),
  title: { default: SITE_NAME, template: `%s | ${SITE_NAME}` },
  description: SITE_PITCH,
  robots: { index: false },
  // Browser tabs follow the device's light or dark mode; so does the home screen icon (see ICON_SCRIPT).
  icons: {
    icon: [
      { url: '/icons/favicon.svg', type: 'image/svg+xml', media: '(prefers-color-scheme: light)' },
      { url: '/icons/favicon-dark.svg', type: 'image/svg+xml', media: '(prefers-color-scheme: dark)' },
    ],
    apple: '/icons/apple-touch-icon.png',
  },
  appleWebApp: { capable: true, title: SITE_NAME, statusBarStyle: 'default' },
};

export const viewport: Viewport = { themeColor: '#f5f5f5', viewportFit: 'cover' };

// Applies the saved Light, Dark or System choice before the page draws, so it never flashes.
const THEME_SCRIPT = `try{document.documentElement.dataset.theme=localStorage.getItem('grawal-theme')||'light'}catch(e){document.documentElement.dataset.theme='light'}`;

// Home screens take the icon the page points at when someone adds the site, and can't
// switch it later. So while the device is in dark mode, point at the dark icon, including
// links Next adds to the head later. It waits until a moment after the page has loaded:
// changing those links while React is still taking over the page makes React warn that
// the server's HTML didn't match. Phones only read them when someone adds the site.
const ICON_SCRIPT = `(function(){var q=matchMedia('(prefers-color-scheme: dark)');function point(sel,url){document.querySelectorAll(sel).forEach(function(l){if(l.getAttribute('href')!==url)l.setAttribute('href',url)})}function set(){var d=q.matches;point('link[rel="apple-touch-icon"]',d?'/icons/apple-touch-icon-dark.png':'/icons/apple-touch-icon.png');point('link[rel="manifest"]',d?'/manifest-dark.webmanifest':'/manifest.webmanifest')}function start(){set();new MutationObserver(set).observe(document.head,{childList:true});q.addEventListener('change',set)}function later(){setTimeout(start,1000)}if(document.readyState==='complete')later();else addEventListener('load',later)})()`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={fontVariables} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
        <script dangerouslySetInnerHTML={{ __html: ICON_SCRIPT }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
