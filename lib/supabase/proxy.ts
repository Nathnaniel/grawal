import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import type { Database } from '../database.types';
import { isSupabaseConfigured, supabaseKey, supabaseUrl } from './config';

const isPublic = (path: string) =>
  path === '/' || path === '/sign-in' || path.startsWith('/auth/') || path.startsWith('/t/') || path.startsWith('/preview') || path === '/demo' || path.startsWith('/demo/');

// Refreshes the session on each request and keeps signed-out visitors on public pages.
export async function updateSession(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const redirectTo = (path: string) => {
    const url = request.nextUrl.clone();
    url.pathname = path;
    url.search = '';
    return NextResponse.redirect(url);
  };

  if (!isSupabaseConfigured) return isPublic(pathname) ? NextResponse.next() : redirectTo('/sign-in');

  let response = NextResponse.next({ request });
  const supabase = createServerClient<Database>(supabaseUrl, supabaseKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        Object.entries(headers).forEach(([name, value]) => response.headers.set(name, value));
      },
    },
  });

  const { data } = await supabase.auth.getClaims();
  const signedIn = Boolean(data?.claims);
  // Redirects carry the refreshed cookies, or the session would be lost on the way.
  const keepCookies = (redirect: NextResponse) => {
    response.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie));
    return redirect;
  };

  if (!signedIn && !isPublic(pathname)) return keepCookies(redirectTo('/sign-in'));
  // Everyone sees the website at /; its Sign in turns into Dashboard once signed in.
  // Signed-in visitors who open sign-in go straight to their wall instead.
  if (signedIn && pathname === '/sign-in') return keepCookies(redirectTo('/wall'));
  return response;
}
