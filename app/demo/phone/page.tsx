import { WallView } from '@/components/dashboard/WallView';
import { samplePhoneEntries } from '@/lib/sample';

export default function PhoneDemoWall() {
  return <WallView entries={samplePhoneEntries} hasMore={false} stagger />;
}
