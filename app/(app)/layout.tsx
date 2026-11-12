import { redirect } from 'next/navigation';
import { AppProvider } from '@/components/AppProvider';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { getAvatarUrl, getCategories, getClaims, getProfile, getWallSummary } from '@/lib/queries';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const claims = await getClaims();
  if (!claims) redirect('/sign-in');

  const [profile, categories] = await Promise.all([getProfile(), getCategories()]);
  if (!profile) throw new Error('This account has no profile.');
  const [avatarUrl, summary] = await Promise.all([getAvatarUrl(profile.avatar_path), getWallSummary(profile.timezone)]);

  return (
    <AppProvider userId={claims.sub} email={String(claims.email ?? '')} profile={profile} avatarUrl={avatarUrl} categories={categories} summary={summary}>
      <Dashboard>{children}</Dashboard>
    </AppProvider>
  );
}
