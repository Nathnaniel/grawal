import { WallView } from '@/components/WallView';
import { wallOrder } from '@/lib/order';
import { sampleEntries, sampleSummary, SAMPLE_WALL_SIZE } from '@/lib/sample';

export default function PreviewWall() {
  const sorted = [...sampleEntries].sort(wallOrder);
  const recent = sorted.filter((entry) => !entry.is_pinned);
  return <WallView pinned={sorted.filter((entry) => entry.is_pinned)} recent={recent.slice(0, SAMPLE_WALL_SIZE)} hasMore={recent.length > SAMPLE_WALL_SIZE} summary={sampleSummary()} />;
}
