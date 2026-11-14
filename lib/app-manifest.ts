import type { MetadataRoute } from 'next';
import { SITE_NAME, SITE_PITCH } from '@/lib/site';

/**
 * What a phone needs to install Grawal on the home screen. There's a light and a dark
 * version: the page points at the dark one while the device is in dark mode, so the
 * icon matches the mode it was added in.
 */
export function appManifest(dark = false): MetadataRoute.Manifest {
  const suffix = dark ? '-dark' : '';
  const colour = dark ? '#1A1A1A' : '#ffffff';
  return {
    id: '/wall',
    name: SITE_NAME,
    short_name: SITE_NAME,
    description: SITE_PITCH,
    start_url: '/wall',
    display: 'standalone',
    background_color: colour,
    theme_color: colour,
    icons: [
      { src: `/icons/icon${suffix}-192.png`, sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: `/icons/icon${suffix}-512.png`, sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: `/icons/icon${suffix}-512.png`, sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
