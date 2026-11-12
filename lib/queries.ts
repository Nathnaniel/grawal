// Reads for server components. Row-level security limits every query to the
// signed-in person, so none of these need to filter by user.
import { cache } from 'react';
import { todayIn, yearOf } from './dates';
import { likePattern, type SearchFilters } from './search';
import { createClient } from './supabase/server';
import { ENTRY_COLUMNS, WALL_PAGE_SIZE, type Category, type Entry, type Profile, type WallSummary } from './types';

export const getUserId = cache(async () => {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  return data?.claims.sub ?? null;
});

export const getProfile = cache(async (): Promise<Profile | null> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('profiles')
    .select('id, name, timezone, reminder_frequency, reminder_time, onboarded_at')
    .maybeSingle();
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

export async function getWall(): Promise<{ pinned: Entry[]; recent: Entry[]; hasMore: boolean }> {
  const supabase = await createClient();
  const sorted = (pinned: boolean) => supabase
    .from('entries')
    .select(ENTRY_COLUMNS)
    .eq('is_pinned', pinned)
    .order('entry_date', { ascending: false })
    .order('created_at', { ascending: false });

  const [pinned, recent] = await Promise.all([sorted(true), sorted(false).limit(WALL_PAGE_SIZE + 1)]);
  if (pinned.error) throw pinned.error;
  if (recent.error) throw recent.error;
  return {
    pinned: pinned.data,
    recent: recent.data.slice(0, WALL_PAGE_SIZE),
    hasMore: recent.data.length > WALL_PAGE_SIZE,
  };
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
  const [counts, categories, onThisDay] = await Promise.all([
    supabase.rpc('entry_year_counts'),
    supabase.rpc('year_category_counts', { p_year: year }),
    supabase.rpc('entries_on_this_day', { p_day: today }),
  ]);
  if (counts.error) throw counts.error;
  if (categories.error) throw categories.error;
  if (onThisDay.error) throw onThisDay.error;
  return {
    year,
    yearWins: counts.data.find((row) => row.year === year)?.wins ?? 0,
    allWins: counts.data.reduce((total, row) => total + row.wins, 0),
    topCategories: categories.data,
    onThisDay: onThisDay.data,
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

export async function searchEntries({ q, category, year }: SearchFilters): Promise<Entry[]> {
  const supabase = await createClient();
  let query = supabase.from('entries').select(ENTRY_COLUMNS);
  if (q.trim()) query = query.like('search_text', likePattern(q));
  if (category) query = query.eq('category_id', category);
  if (year) query = query.gte('entry_date', `${year}-01-01`).lte('entry_date', `${year}-12-31`);
  const { data, error } = await query
    .order('entry_date', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(200);
  if (error) throw error;
  return data;
}
