import { redirect } from 'next/navigation';
import { AppProvider } from '@/components/AppProvider';
import { AppShell } from '@/components/AppShell';
import { getCategories, getProfile, getUserId } from '@/lib/queries';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const userId = await getUserId();
  if (!userId) redirect('/sign-in');

  const [profile, categories] = await Promise.all([getProfile(), getCategories()]);
  if (!profile) throw new Error('This account has no profile.');
  if (!profile.onboarded_at) redirect('/onboarding');

  return (
    <AppProvider userId={userId} profile={profile} categories={categories}>
      <AppShell>{children}</AppShell>
    </AppProvider>
  );
}
