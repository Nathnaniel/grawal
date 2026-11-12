// Sample wins for /preview, so the screens can be seen before a Supabase project exists.
import { todayIn, yearOf } from './dates.ts';
import type { Category, Entry, Profile, WallSummary } from './types';

export const SAMPLE_USER = '00000000-0000-4000-8000-000000000000';
export const SAMPLE_WALL_SIZE = 8;

export const sampleProfile: Profile = {
  id: SAMPLE_USER,
  name: 'Sample',
  timezone: 'Europe/London',
  reminder_frequency: 'weekly',
  reminder_time: '20:00:00',
  onboarded_at: '2023-01-01T00:00:00Z',
};

const defaults: [string, string][] = [
  ['Faith', '#A8740C'], ['Work', '#33688C'], ['Family', '#B04466'], ['Health', '#3C7A58'],
  ['Finances', '#68741F'], ['Studies', '#6650A8'], ['Answered Prayer', '#BC4F14'],
];

export const sampleCategories: Category[] = defaults.map(([name, colour], index) => ({
  id: `00000000-0000-4000-8000-00000000000${index + 1}`,
  user_id: null,
  name,
  colour,
}));

const categoryId = (name: string) => sampleCategories.find((category) => category.name === name)?.id ?? null;

function win(index: number, entry_date: string, title: string, category: string | null, extra: Partial<Entry> = {}): Entry {
  return {
    id: `10000000-0000-4000-8000-${String(index).padStart(12, '0')}`,
    title,
    reflection: null,
    category_id: category ? categoryId(category) : null,
    scripture_ref: null,
    photo_path: null,
    is_pinned: false,
    entry_date,
    created_at: `${entry_date}T09:00:00Z`,
    updated_at: `${entry_date}T09:00:00Z`,
    ...extra,
  };
}

export const sampleEntries: Entry[] = [
  win(1, '2026-10-28', 'Got the offer from the new job', 'Answered Prayer', { is_pinned: true, scripture_ref: 'Philippians 4:19', reflection: 'Eight months of applications, and the door opened in a week I had nearly given up.' }),
  win(2, '2024-05-14', 'The scan came back clear', 'Health', { is_pinned: true, scripture_ref: 'Psalm 103:3' }),
  win(3, '2026-11-02', 'Finished the client project a day early', 'Work', { is_pinned: true }),
  win(4, '2026-10-30', 'Dad called just to say he was proud of me', 'Family'),
  win(5, '2026-09-18', 'Paid off the last of the credit card', 'Finances', { is_pinned: true, reflection: 'Three years ago this felt impossible. I kept the final statement, because I never want to forget how it felt to read a zero. We gave a little more that Sunday too, and it felt like the right way to mark it. There were months I could only pay the minimum, and months when something broke and the plan fell apart, yet the provision kept arriving, often from places I would never have guessed.' }),
  win(6, '2026-08-03', 'Led worship for the first time', 'Faith', { is_pinned: true, scripture_ref: 'Psalm 96:1' }),
  win(7, '2026-06-21', 'Slept through the night again', 'Health'),
  win(8, '2026-03-09', 'Passed my final exam', 'Studies', { is_pinned: true }),
  win(9, '2025-12-24', 'The whole family at one table for Christmas', 'Family', { is_pinned: true }),
  win(10, '2025-11-06', 'Rent was covered with a day to spare', 'Answered Prayer'),
  win(11, '2025-07-12', 'Baptised at the lake', 'Faith', { scripture_ref: 'Romans 6:4' }),
  win(12, '2025-02-01', 'Started the new role', 'Work'),
  win(13, '2024-09-30', 'Found the flat, right by the church', null, { is_pinned: true }),
  win(14, '2023-11-06', 'First month of keeping this wall', null),
  win(15, '2026-10-12', 'Shipped the launch with the team', 'Work'),
  win(16, '2026-10-03', 'Prayed with a colleague over lunch', 'Faith'),
  win(17, '2026-09-02', 'The car passed its inspection, no repairs', 'Finances'),
  win(18, '2026-07-19', 'Ran my first 10k', 'Health'),
  win(19, '2026-05-27', 'New manager, and she listens', 'Work'),
  win(20, '2026-04-05', 'Easter morning with my sister', 'Family'),
];

export const sampleYearCounts = () => {
  const counts = new Map<number, number>();
  for (const { entry_date } of sampleEntries) {
    const year = Number(entry_date.slice(0, 4));
    counts.set(year, (counts.get(year) ?? 0) + 1);
  }
  return [...counts].sort(([a], [b]) => b - a).map(([year, wins]) => ({ year, wins }));
};

export function sampleSummary(): WallSummary {
  const today = todayIn(sampleProfile.timezone);
  const year = yearOf(today);
  const thisYear = sampleEntries.filter((entry) => yearOf(entry.entry_date) === year);
  const counts = new Map<string, number>();
  for (const { category_id } of thisYear) {
    if (category_id) counts.set(category_id, (counts.get(category_id) ?? 0) + 1);
  }
  return {
    year,
    yearWins: thisYear.length,
    allWins: sampleEntries.length,
    topCategories: [...counts].sort(([, a], [, b]) => b - a).slice(0, 4).map(([category_id, wins]) => ({ category_id, wins })),
    onThisDay: sampleEntries.filter((entry) => entry.entry_date.slice(5) === today.slice(5) && entry.entry_date < today),
  };
}
