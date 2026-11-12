import type { Metadata } from 'next';
import { WallView } from '@/components/dashboard/WallView';
import { getWall } from '@/lib/queries';

export const metadata: Metadata = { title: 'Your wall' };

export default async function Wall() {
  return <WallView {...await getWall()} />;
}
