import type { Metadata } from 'next';
import { SignInForm } from '@/components/SignInForm';
import { isSupabaseConfigured } from '@/lib/supabase/config';

export const metadata: Metadata = { title: 'Sign in' };

export default async function SignIn({ searchParams }: { searchParams: Promise<{ error?: string; mode?: string }> }) {
  const { error, mode } = await searchParams;
  return (
    // Figma: a 540 by 740 white card on grey for desktop; the whole screen white on phones.
    <main className="min-h-dvh bg-white font-avenir text-[#1a1a1a] lg:flex lg:items-center lg:justify-center lg:bg-[#f5f5f5] lg:py-10">
      <div className="relative min-h-dvh px-5 pt-20 pb-[120px] lg:min-h-[740px] lg:w-[540px] lg:bg-white lg:px-[70px] lg:pb-14">
        <SignInForm initialMode={mode === 'create' ? 'create' : 'sign-in'} linkFailed={error === 'link'} configured={isSupabaseConfigured} />
      </div>
    </main>
  );
}
