import { YearsView } from '@/components/YearsView';
import { sampleYearCounts } from '@/lib/sample';

export default function PreviewYears() {
  return <YearsView years={sampleYearCounts()} basePath="/preview" />;
}
