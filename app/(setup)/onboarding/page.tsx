import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { AppProvider } from '@/components/AppProvider';
import { OnboardingFlow } from '@/components/OnboardingFlow';
import { getCategories, getProfile, getUserId } from '@/lib/queries';

export const metadata: Metadata = { title: 'Welcome' };

export default async function Onboarding() {
  const userId = await getUserId();
  if (!userId) redirect('/sign-in');

  const [profile, categories] = await Promise.all([getProfile(), getCategories()]);
  if (!profile) throw new Error('This account has no profile.');
  if (profile.onboarded_at) redirect('/wall');

  return (
    <AppProvider userId={userId} profile={profile} categories={categories}>
      <OnboardingFlow />
    </AppProvider>
  );
}
