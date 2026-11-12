import type { Metadata } from 'next';
import { YearsView } from '@/components/YearsView';
import { getYearCounts } from '@/lib/queries';

export const metadata: Metadata = { title: 'Years' };

export default async function Years() {
  return <YearsView years={await getYearCounts()} />;
}
