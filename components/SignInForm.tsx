'use client';

import Link from 'next/link';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/browser';

export function SignInForm({ linkFailed, configured }: { linkFailed: boolean; configured: boolean }) {
  const [email, setEmail] = useState('');
  const [sentTo, setSentTo] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(linkFailed ? 'That sign-in link has expired or was already used. Send a new one.' : '');

  const callback = () => `${window.location.origin}/auth/callback`;

  async function sendLink(event: React.FormEvent) {
    event.preventDefault();
    setSending(true);
    setError('');
    const { error: failed } = await createClient().auth.signInWithOtp({ email, options: { emailRedirectTo: callback() } });
    setSending(false);
    if (failed) setError('The link didn\'t send. Check the address, wait a minute and try again.');
    else setSentTo(email);
  }

  async function useGoogle() {
    setError('');
    const { error: failed } = await createClient().auth.signInWithOAuth({ provider: 'google', options: { redirectTo: callback() } });
    if (failed) setError('Google sign-in didn\'t start. Try again, or use your email.');
  }

  if (!configured) {
    return (
      <div className="max-w-md">
        <p>Sign-in is off until this app has Supabase keys. Add them to <code>.env.local</code>, as the README explains.</p>
        {process.env.NODE_ENV !== 'production' && <Link href="/preview" className="btn btn-primary mt-4">Open the preview with sample wins</Link>}
      </div>
    );
  }

  if (sentTo) {
    return (
      <div role="status" className="max-w-md">
        <h2>Check your email</h2>
        <p className="mt-2">We sent a sign-in link to {sentTo}. Open it on this device.</p>
        <button type="button" className="text-link mt-3 min-h-11" onClick={() => setSentTo('')}>Use a different email</button>
      </div>
    );
  }

  return (
    <div className="flex max-w-md flex-col gap-4">
      <form onSubmit={sendLink} className="flex flex-col gap-3">
        <div>
          <label htmlFor="email" className="field-label">Email</label>
          <input id="email" type="email" required autoComplete="email" className="field" value={email} onChange={(event) => setEmail(event.target.value)} />
        </div>
        <button type="submit" className="btn btn-primary" disabled={sending}>{sending ? 'Sending link' : 'Email me a sign-in link'}</button>
      </form>
      <button type="button" className="btn btn-quiet" onClick={useGoogle}>Continue with Google</button>
      {error && <p role="alert" className="text-error">{error}</p>}
    </div>
  );
}
