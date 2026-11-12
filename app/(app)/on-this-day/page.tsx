import type { Metadata } from 'next';
import { ComingSoon } from '@/components/ComingSoon';

export const metadata: Metadata = { title: 'On this day' };

export default function OnThisDay() {
  return <ComingSoon title="On this day">See what God did on this date in years past.</ComingSoon>;
}
