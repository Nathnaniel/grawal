// Sample wins for /preview, taken from the Figma wall, so every screen can be seen
// before a Supabase project exists.
import { todayIn, yearOf } from './dates.ts';
import { newestFirst } from './order.ts';
import type { Category, Entry, Profile, WallSummary } from './types';

export const SAMPLE_USER = '00000000-0000-4000-8000-000000000000';
export const SAMPLE_EMAIL = 'nathaniel@gmail.com';

export const sampleProfile: Profile = {
  id: SAMPLE_USER,
  name: 'Nathaniel Tibitus',
  timezone: 'Europe/London',
  reminder_frequency: 'weekly',
  reminder_time: '20:00:00',
  onboarded_at: '2025-01-01T00:00:00Z',
  avatar_path: null,
  notify_on_this_day: true,
};

const defaults: [string, string][] = [
  ['Faith', '#A8740C'], ['Work', '#33688C'], ['Family', '#B04466'], ['Health', '#3C7A58'],
  ['Finances', '#68741F'], ['Studies', '#6650A8'], ['Answered Prayer', '#BC4F14'],
  ['Relationships', '#B4235E'], ['Travel', '#0E7C86'], ['Personal Growth', '#5B3FB0'],
];

export const sampleCategories: Category[] = defaults.map(([name, colour], index) => ({
  id: `00000000-0000-4000-8000-0000000000${String(index + 1).padStart(2, '0')}`,
  user_id: null,
  name,
  colour,
}));

const categoryId = (name: string) => sampleCategories.find((category) => category.name === name)?.id ?? null;

function win(index: number, entry_date: string, category: string, title: string, story: string): Entry {
  return {
    id: `10000000-0000-4000-8000-${String(index).padStart(12, '0')}`,
    title,
    reflection: story,
    category_id: categoryId(category),
    scripture_ref: null,
    photo_path: null,
    is_pinned: false,
    entry_date,
    created_at: `${entry_date}T09:00:00Z`,
    updated_at: `${entry_date}T09:00:00Z`,
  };
}

export const sampleEntries: Entry[] = [
  win(1, '2026-11-10', 'Answered Prayer', 'Got the job I prayed for', 'Got the job offer I prayed about for three months. God came through right on time.'),
  win(2, '2026-11-06', 'Family', 'Mum is home', 'Mum’s surgery went well and she’s home recovering. So grateful.'),
  win(3, '2026-10-29', 'Work', 'First international client', 'Landed my first international client today. Never thought this would happen.'),
  win(4, '2026-10-20', 'Faith', 'Finished the Psalms', 'Read through the whole book of Psalms this month. My heart feels full.'),
  win(5, '2026-10-02', 'Finances', 'Debt-free', 'Cleared my last debt payment. Debt-free, by His grace.'),
  win(6, '2026-09-14', 'Health', 'First 5K', 'Ran my first 5K without stopping. Strength I didn’t know I had.'),
  win(7, '2026-08-30', 'Studies', 'Passed my exams', 'Passed my final exams. Every late night was worth it.'),
  win(8, '2026-07-18', 'Work', 'Side project live', 'Launched my side project after a year of building. It’s finally live.'),
  win(9, '2026-06-05', 'Answered Prayer', 'Home safely', 'Travelled safely home after a long, difficult journey. God kept us all the way.'),
  win(10, '2026-04-22', 'Family', 'First steps', 'Our baby took her first steps today. Thank you, Lord, for this gift.'),
  win(11, '2026-02-11', 'Answered Prayer', 'Visa approved', 'My visa was approved after months of waiting. Doors I couldn’t open, God opened.'),
  win(12, '2026-01-09', 'Work', 'Promoted', 'Got promoted today. Two years of quiet, faithful work finally seen.'),
  win(13, '2025-12-21', 'Family', 'Reconnected with my brother', 'Reconnected with my brother after a long silence. Healing is real.'),
  win(14, '2025-11-12', 'Health', 'Clear results', 'Test results came back clear. Breathing easy and thanking God.'),
  win(15, '2025-09-07', 'Faith', 'Led worship', 'Led worship at church for the first time. My hands shook, but He held me.'),
].sort(newestFirst);

export const sampleYearCounts = () => {
  const counts = new Map<number, number>();
  for (const { entry_date } of sampleEntries) counts.set(yearOf(entry_date), (counts.get(yearOf(entry_date)) ?? 0) + 1);
  return [...counts].sort(([a], [b]) => b - a).map(([year, wins]) => ({ year, wins }));
};

export function sampleSummary(): WallSummary {
  const today = todayIn(sampleProfile.timezone);
  const year = yearOf(today);
  return {
    year,
    yearWins: sampleEntries.filter((entry) => yearOf(entry.entry_date) === year).length,
    allWins: sampleEntries.length,
    onThisDay: sampleEntries.filter((entry) => entry.entry_date.slice(5) === today.slice(5) && entry.entry_date < today),
    lastWinDay: sampleEntries[0]?.entry_date ?? null,
  };
}
