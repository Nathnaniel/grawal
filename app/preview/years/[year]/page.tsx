import { YearTimeline } from '@/components/YearTimeline';
import { sampleEntries } from '@/lib/sample';

export default async function PreviewYear({ params }: { params: Promise<{ year: string }> }) {
  const year = Number((await params).year);
  return <YearTimeline year={year} entries={sampleEntries.filter((entry) => entry.entry_date.startsWith(`${year}-`))} />;
}
