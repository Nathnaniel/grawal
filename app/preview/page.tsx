import { WallView } from '@/components/dashboard/WallView';
import { sampleEntries } from '@/lib/sample';

export default async function PreviewWall({ searchParams }: { searchParams: Promise<{ empty?: string }> }) {
  // /preview?empty shows the empty wall.
  const empty = 'empty' in (await searchParams);
  return <WallView entries={empty ? [] : sampleEntries} hasMore={false} />;
}
