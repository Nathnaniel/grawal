import { appManifest } from '@/lib/app-manifest';

// The home screen app for a device in dark mode (see lib/app-manifest.ts).
export const dynamic = 'force-static';

export function GET() {
  return new Response(JSON.stringify(appManifest(true)), { headers: { 'Content-Type': 'application/manifest+json' } });
}
