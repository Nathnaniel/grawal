import { notFound } from 'next/navigation';
import { YearTimeline } from '@/components/YearTimeline';
import { getYear } from '@/lib/queries';

export default async function Year({ params }: { params: Promise<{ year: string }> }) {
  const { year } = await params;
  if (!/^\d{4}$/.test(year)) notFound();
  return <YearTimeline year={Number(year)} entries={await getYear(Number(year))} />;
}
