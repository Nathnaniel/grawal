// Reads for server components. Row-level security limits every query to the
// signed-in person, so none of these need to filter by user.
import { cache } from 'react';
import { todayIn, yearOf } from './dates';
import { createClient } from './supabase/server';
import { ENTRY_COLUMNS, PROFILE_COLUMNS, WALL_PAGE_SIZE, type Category, type Entry, type Profile, type WallSummary } from './types';

export const getClaims = cache(async () => {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  return data?.claims ?? null;
});

export const getUserId = cache(async () => (await getClaims())?.sub ?? null);

export const getProfile = cache(async (): Promise<Profile | null> => {
  const supabase = await createClient();
  const { data, error } = await supabase.from('profiles').select(PROFILE_COLUMNS).maybeSingle();
  if (error) throw error;
  return data;
});

export const getCategories = cache(async (): Promise<Category[]> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('categories')
    .select('id, user_id, name, colour')
    .order('user_id', { nullsFirst: true })
    .order('created_at');
  if (error) throw error;
  return data;
});

/** A short-lived link to the profile photo, which lives in a private bucket. */
export async function getAvatarUrl(path: string | null): Promise<string | null> {
  if (!path) return null;
  const supabase = await createClient();
  const { data } = await supabase.storage.from('avatars').createSignedUrl(path, 60 * 60 * 24);
  return data?.signedUrl ?? null;
}

/** The newest page of the wall. */
export async function getWall(): Promise<{ entries: Entry[]; hasMore: boolean }> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('entries')
    .select(ENTRY_COLUMNS)
    .eq('on_wall', true)
    .order('entry_date', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(WALL_PAGE_SIZE + 1);
  if (error) throw error;
  return { entries: data.slice(0, WALL_PAGE_SIZE), hasMore: data.length > WALL_PAGE_SIZE };
}

export async function getYearCounts() {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc('entry_year_counts');
  if (error) throw error;
  return data;
}

export async function getWallSummary(timezone: string): Promise<WallSummary> {
  const supabase = await createClient();
  const today = todayIn(timezone);
  const year = yearOf(today);
  const [counts, onThisDay, latest] = await Promise.all([
    supabase.rpc('entry_year_counts'),
    supabase.rpc('entries_on_this_day', { p_day: today }),
    supabase.from('entries').select('entry_date').order('entry_date', { ascending: false }).limit(1).maybeSingle(),
  ]);
  if (counts.error) throw counts.error;
  if (onThisDay.error) throw onThisDay.error;
  if (latest.error) throw latest.error;
  return {
    year,
    yearWins: counts.data.find((row) => row.year === year)?.wins ?? 0,
    allWins: counts.data.reduce((total, row) => total + row.wins, 0),
    onThisDay: onThisDay.data,
    lastWinDay: latest.data?.entry_date ?? null,
  };
}

export async function getYear(year: number): Promise<Entry[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('entries')
    .select(ENTRY_COLUMNS)
    .gte('entry_date', `${year}-01-01`)
    .lte('entry_date', `${year}-12-31`)
    .order('entry_date', { ascending: false })
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}
