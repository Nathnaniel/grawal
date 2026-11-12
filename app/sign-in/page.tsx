import type { Metadata } from 'next';
import { SignInForm } from '@/components/SignInForm';
import { SITE_NAME, SITE_PITCH } from '@/lib/site';
import { isSupabaseConfigured } from '@/lib/supabase/config';

export const metadata: Metadata = { title: 'Sign in' };

const SAMPLES = [
  { title: 'The scan came back clear', tilt: '-2deg', pinned: true },
  { title: 'Paid off the last of the loan', tilt: '1.5deg', pinned: false },
  { title: 'Mum said yes to coming to church', tilt: '-1deg', pinned: false },
];

export default async function SignIn({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  return (
    <div className="mx-auto grid min-h-dvh max-w-5xl items-center gap-10 px-4 py-10 sm:px-6 md:grid-cols-[1fr_1fr] md:gap-16">
      <div aria-hidden="true" className="flex flex-col gap-6 md:order-2 md:gap-9">
        {SAMPLES.map(({ title, tilt, pinned }, index) => (
          <div key={title} className={`note font-serif text-xl md:text-2xl ${index ? 'hidden md:flex' : ''} ${index === 1 ? 'md:ml-14' : ''}`} style={{ '--tilt': tilt } as React.CSSProperties}>
            {pinned && <span className="pin-head" />}
            <span className="pb-2">{title}</span>
          </div>
        ))}
      </div>
      <main className="glass rounded-2xl p-6 sm:p-8">
        <p className="mb-6 font-serif text-xl font-medium">{SITE_NAME}</p>
        <h1>Remember what God has done</h1>
        <p className="mt-3 mb-8 max-w-md text-soft">{SITE_PITCH}</p>
        <SignInForm linkFailed={error === 'link'} configured={isSupabaseConfigured} />
        <p className="mt-6 text-soft">Your wall is private. Nothing is shared unless you choose to share it.</p>
      </main>
    </div>
  );
}
