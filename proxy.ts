import type { NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/proxy';

export function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: ['/((?!$|demo|privacy$|terms$|_next/static|_next/image|manifest.webmanifest|manifest-dark.webmanifest|icons/|opengraph-image|sky.jpg|landing/|app/|fonts/|favicon.ico).*)'],
};
