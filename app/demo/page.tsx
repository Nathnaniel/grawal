import { WallView } from '@/components/dashboard/WallView';
import { sampleEntries } from '@/lib/sample';

export default function DemoWall() {
  return <WallView entries={sampleEntries} hasMore={false} />;
}
