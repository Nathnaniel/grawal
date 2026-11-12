import { WallView } from '@/components/WallView';
import { getProfile, getWall, getWallSummary } from '@/lib/queries';

export default async function Wall() {
  const profile = await getProfile();
  const [wall, summary] = await Promise.all([getWall(), getWallSummary(profile?.timezone ?? 'UTC')]);
  return <WallView {...wall} summary={summary} />;
}
