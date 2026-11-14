import { HistoryView } from '@/components/dashboard/HistoryView';
import { samplePhoneEntries } from '@/lib/sample';

export default function PhoneDemoHistory() {
  return <HistoryView years={[2026]} year={2026} entries={samplePhoneEntries} />;
}
