'use client';

import Link from 'next/link';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/browser';

type Mode = 'sign-in' | 'create';

const BUTTON = 'flex h-12 w-full items-center justify-center gap-1 rounded-xl font-avenir text-base font-medium';

function Legal() {
  return (
    <p className="absolute bottom-[70px] left-1/2 w-[266px] -translate-x-1/2 text-center text-xs leading-[18px] tracking-[-0.036px] text-[#666] lg:static lg:mx-auto lg:mt-[46px] lg:translate-x-0">
      By continuing, you agree to our <Link href="/terms" className="text-[#1568d4] underline">Terms of Use</Link> and <Link href="/privacy" className="text-[#1568d4] underline">Privacy Policy</Link>.
    </p>
  );
}

// Google is the only way in: the same button signs people in and creates new accounts.
export function SignInForm({ initialMode, linkFailed, configured }: { initialMode: Mode; linkFailed: boolean; configured: boolean }) {
  const [mode, setMode] = useState<Mode>(initialMode);
  const [error, setError] = useState(linkFailed ? 'That sign-in link has expired or was already used. Continue with Google instead.' : '');

  async function useGoogle() {
    setError('');
    const { error: failed } = await createClient().auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (failed) setError('Google sign-in didn’t start. Try again.');
  }

  const creating = mode === 'create';
  return (
    <>
      <div className="flex flex-col gap-20">
        <img src="/landing/logo.svg" alt="Grawal" width={102} height={24} />
        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-3">
            <h1 className="text-2xl leading-[26px] font-extrabold">{creating ? 'Create an account' : 'Sign in'}</h1>
            <p className="text-base leading-[18px] tracking-[-0.048px] text-[#333]">
              {creating ? 'Already have an account? ' : 'New user? '}
              <button type="button" onClick={() => { setMode(creating ? 'sign-in' : 'create'); setError(''); }} className="text-[#1568d4] underline">
                {creating ? 'Sign in' : 'Create an account'}
              </button>
            </p>
          </div>
          {configured ? (
            <div className="flex flex-col gap-3">
              <button type="button" onClick={useGoogle} className={`${BUTTON} bg-[#f5f5f5] text-[#1a1a1a]`}>
                <img src="/app/google.svg" alt="" width={18} height={18} /> Continue with Google
              </button>
              {error && <p role="alert" className="text-sm text-[#f0322a]">{error}</p>}
            </div>
          ) : (
            <div className="text-base text-[#333]">
              <p>Sign-in is off until this app has Supabase keys. Add them to <code>.env.local</code>, as the README explains.</p>
              {process.env.NODE_ENV !== 'production' && <Link href="/preview" className="mt-3 inline-block text-[#1568d4] underline">Open the preview with sample wins</Link>}
            </div>
          )}
        </div>
      </div>
      <Legal />
    </>
  );
}
