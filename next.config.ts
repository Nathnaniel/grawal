import type { NextConfig } from 'next';

const dev = process.env.NODE_ENV !== 'production';

// The only other place the browser talks to is this site's Supabase project.
let supabase = '';
try { supabase = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL ?? '').origin; } catch { /* not set yet */ }

// Scripts, images and requests may only come from this site and Supabase. Inline
// scripts stay allowed because Next.js and the theme script need them; dev also
// needs eval for hot reloading.
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${dev ? " 'unsafe-eval'" : ''}`,
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob: ${supabase}`,
  "font-src 'self' data:",
  `connect-src 'self' ${supabase} ${supabase.replace('https://', 'wss://')}${dev ? ' ws:' : ''}`,
  "media-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(dev ? [] : ['upgrade-insecure-requests']),
].join('; ');

const config: NextConfig = {
  reactStrictMode: true,
  // Don't advertise the framework, and never ship source maps to browsers.
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  devIndicators: { position: 'top-right' },
  turbopack: { root: process.cwd() },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Content-Security-Policy', value: contentSecurityPolicy },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()' },
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
        ],
      },
      // Someone's wall is private: keep signed-in pages and APIs out of search engines and shared caches.
      ...['/wall', '/history', '/api/:path*', '/auth/:path*', '/preview/:path*'].map((source) => ({
        source,
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
          { key: 'Cache-Control', value: 'private, no-store' },
        ],
      })),
    ];
  },
};

export default config;
