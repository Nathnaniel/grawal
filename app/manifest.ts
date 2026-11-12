import type { MetadataRoute } from 'next';
import { SITE_NAME, SITE_PITCH } from '@/lib/site';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: SITE_NAME,
    description: SITE_PITCH,
    start_url: '/wall',
    display: 'standalone',
    background_color: '#12468A',
    theme_color: '#12468A',
    icons: [
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
      { src: '/apple-icon', sizes: '180x180', type: 'image/png', purpose: 'any' },
    ],
  };
}
