import type { Metadata } from 'next';
import { HistoryView } from '@/components/dashboard/HistoryView';
import { getYear, getYearCounts } from '@/lib/queries';

export const metadata: Metadata = { title: 'History' };

export default async function History({ searchParams }: { searchParams: Promise<{ year?: string }> }) {
  const years = (await getYearCounts()).map(({ year }) => year);
  const asked = Number((await searchParams).year);
  const year = years.includes(asked) ? asked : years[0] ?? null;
  return <HistoryView years={years} year={year} entries={year === null ? [] : await getYear(year)} />;
}
