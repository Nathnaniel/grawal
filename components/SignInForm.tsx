'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/browser';

type Mode = 'sign-in' | 'create';
const RESEND_AFTER = 30;

// "Open email app" goes straight to the inbox for the big providers.
function inboxFor(email: string) {
  const domain = email.split('@')[1]?.toLowerCase() ?? '';
  if (/^(gmail|googlemail)\.com$/.test(domain)) return 'https://mail.google.com/mail/u/0/#inbox';
  if (/^(outlook|hotmail|live|msn)\./.test(domain)) return 'https://outlook.live.com/mail/0/';
  if (/^(icloud|me|mac)\.com$/.test(domain)) return 'https://www.icloud.com/mail';
  if (/^yahoo\./.test(domain)) return 'https://mail.yahoo.com';
  return 'mailto:';
}

const BUTTON = 'flex h-12 w-full items-center justify-center gap-1 rounded-xl font-avenir text-base font-medium';
// Desktop's Continue is blue; the phone screens use the dark button.
const PRIMARY = `${BUTTON} border-t-2 border-r-2 border-[#333] bg-[#1a1a1a] text-white opacity-94 shadow-[inset_0_-4px_4px_rgb(51_51_51/0.25)] drop-shadow-[0_4px_4.15px_rgb(204_204_204/0.14)] lg:border-[#3788f1] lg:bg-[#1568d4] lg:opacity-100 lg:shadow-[inset_0_-4px_4px_rgb(179_208_245/0.25)] disabled:opacity-60`;

function Legal() {
  return (
    <p className="absolute bottom-[70px] left-1/2 w-[266px] -translate-x-1/2 text-center text-xs leading-[18px] tracking-[-0.036px] text-[#666] lg:static lg:mx-auto lg:mt-[46px] lg:translate-x-0">
      By continuing, you agree to our <span className="text-[#1568d4] underline">Terms of Use</span> and <span className="text-[#1568d4] underline">Privacy Policy.</span>
    </p>
  );
}

export function SignInForm({ initialMode, linkFailed, configured }: { initialMode: Mode; linkFailed: boolean; configured: boolean }) {
  const [mode, setMode] = useState<Mode>(initialMode);
  const [email, setEmail] = useState('');
  const [sentTo, setSentTo] = useState('');
  const [sending, setSending] = useState(false);
  const [wait, setWait] = useState(0);
  const [error, setError] = useState(linkFailed ? 'That sign-in link has expired or was already used. Send a new one.' : '');
  const [noAccount, setNoAccount] = useState(false);

  useEffect(() => {
    if (!wait) return;
    const timer = setTimeout(() => setWait(wait - 1), 1000);
    return () => clearTimeout(timer);
  }, [wait]);

  const callback = () => `${window.location.origin}/auth/callback`;

  async function sendLink(address: string) {
    setSending(true);
    setError('');
    setNoAccount(false);
    const { error: failed } = await createClient().auth.signInWithOtp({
      email: address,
      // "Sign in" never creates an account, so a typo can't start a second wall.
      options: { emailRedirectTo: callback(), shouldCreateUser: mode === 'create' },
    });
    setSending(false);
    if (failed) {
      const missing = /signup|not allowed|not found/i.test(failed.message);
      setNoAccount(missing);
      setError(missing ? 'There’s no account for that email yet.' : 'The link didn’t send. Check the address, wait a minute and try again.');
      return false;
    }
    setSentTo(address);
    setWait(RESEND_AFTER);
    return true;
  }

  async function useGoogle() {
    setError('');
    const { error: failed } = await createClient().auth.signInWithOAuth({ provider: 'google', options: { redirectTo: callback() } });
    if (failed) setError('Google sign-in didn’t start. Try again, or use your email.');
  }

  if (sentTo) {
    return (
      <div className="flex flex-col">
        <img src="/app/check-email.jpg" alt="" className="mt-[-20px] h-60 w-full object-cover lg:-mx-[50px] lg:mt-[-62px] lg:h-[312px] lg:w-[calc(100%+100px)] lg:max-w-none" />
        <div className="mt-20 flex flex-col gap-10 lg:mt-[52px]">
          <div className="flex flex-col gap-3">
            <h1 className="text-2xl leading-[26px] font-extrabold">Check your email</h1>
            <p className="text-base leading-[18px] tracking-[-0.048px] text-[#333]">
              We sent a sign-in link to <span className="text-[#1568d4]">{sentTo}</span>. Tap it to continue.
            </p>
          </div>
          <div className="flex flex-col items-center gap-[21px]">
            <a href={inboxFor(sentTo)} target="_blank" rel="noreferrer" className={`${BUTTON} border-t-2 border-r-2 border-[#333] bg-[#1a1a1a] text-white opacity-94 shadow-[inset_0_-4px_4px_rgb(51_51_51/0.25)]`}>Open email app</a>
            <p className="text-center text-xs leading-[18px] tracking-[-0.036px] text-[#666]" aria-live="polite">
              {wait ? <>Resend link <span className="text-[#1568d4] underline">{wait}s</span></> : (
                <button type="button" disabled={sending} onClick={() => sendLink(sentTo)} className="text-[#1568d4] underline">Resend link</button>
              )}
            </p>
            <button type="button" onClick={() => setSentTo('')} className="text-xs text-[#666] underline">Use a different email</button>
          </div>
        </div>
      </div>
    );
  }

  const creating = mode === 'create';
  return (
    <>
      <div className="flex flex-col gap-20">
        <img src="/landing/logo.svg" alt="Grawal" width={102} height={24} />
        <div className="flex flex-col gap-[26px]">
          <div className="flex flex-col gap-10">
            <div className="flex flex-col gap-3">
              <h1 className="text-2xl leading-[26px] font-extrabold">{creating ? 'Create an account' : 'Sign in'}</h1>
              <p className="text-base leading-[18px] tracking-[-0.048px] text-[#333]">
                {creating ? 'Already have an account? ' : 'New user? '}
                <button type="button" onClick={() => { setMode(creating ? 'sign-in' : 'create'); setError(''); setNoAccount(false); }} className="text-[#1568d4] underline">
                  {creating ? 'Sign in' : 'Create an account'}
                </button>
              </p>
            </div>
            {configured ? (
              <form id="email-form" onSubmit={(event) => { event.preventDefault(); sendLink(email.trim()); }} className="flex flex-col gap-[11px]">
                <label htmlFor="email" className="text-base leading-[18px] tracking-[-0.048px]">Email</label>
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="h-10 w-full rounded-xl bg-[#f5f5f5] px-3 text-base tracking-[-0.036px] text-[#1a1a1a] lg:text-xs"
                />
              </form>
            ) : (
              <div className="text-base text-[#333]">
                <p>Sign-in is off until this app has Supabase keys. Add them to <code>.env.local</code>, as the README explains.</p>
                {process.env.NODE_ENV !== 'production' && <Link href="/preview" className="mt-3 inline-block text-[#1568d4] underline">Open the preview with sample wins</Link>}
              </div>
            )}
          </div>
          {configured && (
            <div className="flex flex-col items-center gap-5">
              <button type="submit" form="email-form" disabled={sending} className={PRIMARY}>{sending ? 'Sending link' : 'Continue'}</button>
              {error && (
                <p role="alert" className="-mt-2 self-start text-sm text-[#f0322a]">
                  {error}{' '}
                  {noAccount && <button type="button" onClick={() => { setMode('create'); setError(''); setNoAccount(false); }} className="text-[#1568d4] underline">Create an account</button>}
                </p>
              )}
              <div className="flex w-[259px] items-center justify-between">
                <span className="h-px w-[108px] bg-[#eaeaea]" />
                <span className="text-base leading-[18px] tracking-[-0.048px] text-[#999]">Or</span>
                <span className="h-px w-[108px] bg-[#eaeaea]" />
              </div>
              <button type="button" onClick={useGoogle} className={`${BUTTON} bg-[#f5f5f5] text-[#1a1a1a]`}>
                <img src="/app/google.svg" alt="" width={18} height={18} /> Continue with Google
              </button>
            </div>
          )}
        </div>
      </div>
      <Legal />
    </>
  );
}
