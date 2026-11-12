import { HistoryView } from '@/components/dashboard/HistoryView';
import { sampleEntries, sampleYearCounts } from '@/lib/sample';

export default async function PreviewHistory({ searchParams }: { searchParams: Promise<{ year?: string; empty?: string }> }) {
  const params = await searchParams;
  const years = 'empty' in params ? [] : sampleYearCounts().map(({ year }) => year);
  const year = years.includes(Number(params.year)) ? Number(params.year) : years[0] ?? null;
  return <HistoryView years={years} year={year} entries={sampleEntries.filter((entry) => year !== null && entry.entry_date.startsWith(`${year}-`))} />;
}
