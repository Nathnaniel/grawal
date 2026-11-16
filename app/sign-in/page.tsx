import type { Metadata } from 'next';
import { SignInForm } from '@/components/SignInForm';
import { isSupabaseConfigured } from '@/lib/supabase/config';

export const metadata: Metadata = { title: 'Sign in' };

export default async function SignIn({ searchParams }: { searchParams: Promise<{ error?: string; mode?: string }> }) {
  const { error, mode } = await searchParams;
  return (
    // Figma: a 540 by 640 white card on grey for desktop; the whole screen white on phones.
    <main className="min-h-dvh bg-white font-avenir text-[#1a1a1a] md:flex md:items-center md:justify-center md:bg-[#f5f5f5] md:py-10">
      <div className="relative min-h-dvh px-5 pt-20 pb-[120px] md:min-h-[640px] md:w-[540px] md:bg-white md:px-[70px] md:pb-14">
        <SignInForm initialMode={mode === 'create' ? 'create' : 'sign-in'} linkFailed={error === 'link'} configured={isSupabaseConfigured} />
      </div>
    </main>
  );
}
