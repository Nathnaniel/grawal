import type { NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/proxy';

export function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|manifest.webmanifest|icon.svg|apple-icon|opengraph-image|sky.jpg|landing/|app/|fonts/|favicon.ico).*)'],
};
