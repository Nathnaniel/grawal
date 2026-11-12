import { ComingSoon } from '@/components/ComingSoon';

export default async function Recap({ params }: { params: Promise<{ year: string }> }) {
  const { year } = await params;
  return <ComingSoon title={`${year} in gratitude`}>Your year in one place: your wins, your top categories and your favourite pinned moments.</ComingSoon>;
}
