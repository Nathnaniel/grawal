'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { SITE_NAME } from '@/lib/site';
import type { Profile } from '@/lib/types';
import { useApp } from './AppProvider';
import { EntryForm } from './EntryForm';
import { ReminderFields } from './ReminderFields';

export function OnboardingFlow() {
  const { basePath, profile, updateProfile } = useApp();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [frequency, setFrequency] = useState<Profile['reminder_frequency']>('weekly');
  const [time, setTime] = useState(profile.reminder_time);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function saveReminder() {
    setBusy(true);
    setError('');
    try {
      await updateProfile({
        reminder_frequency: frequency,
        reminder_time: time,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      });
      setStep(3);
    } catch {
      setError('That didn\'t save. Check your connection and try again.');
    } finally {
      setBusy(false);
    }
  }

  async function finish(sent?: Promise<void>) {
    setBusy(true);
    setError('');
    try {
      await sent;
      await updateProfile({ onboarded_at: new Date().toISOString() });
      router.replace(basePath || '/wall');
    } catch {
      setError('That didn\'t save. Check your connection and try again.');
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-dvh max-w-lg flex-col justify-center px-4 py-10">
    <main className="glass flex flex-col rounded-2xl p-6 sm:p-8">
      <p className="mb-8 text-soft">{SITE_NAME}, step {step} of 3</p>

      {step === 1 && (
        <>
          <h1>Busy days make us forget</h1>
          <blockquote className="mt-5 font-serif text-2xl italic">
            Bless the Lord, O my soul, and forget not all his benefits.
            <footer className="mt-1 text-lg not-italic text-soft">Psalm 103:2</footer>
          </blockquote>
          <p className="mt-5">Wins and answered prayers pass quickly. Pin them here as they happen, and they'll be waiting for the seasons when life feels slow.</p>
          <button type="button" className="btn btn-primary mt-8 self-start" onClick={() => setStep(2)}>Continue</button>
        </>
      )}

      {step === 2 && (
        <>
          <h1 className="mb-3">Choose a gentle nudge</h1>
          <p className="mb-6">We'll ask, "What has God done for you this week?" No streaks, and no pressure.</p>
          <ReminderFields frequency={frequency} time={time} onFrequency={setFrequency} onTime={setTime} />
          <button type="button" className="btn btn-primary mt-8 self-start" disabled={busy} onClick={saveReminder}>Continue</button>
        </>
      )}

      {step === 3 && (
        <>
          <h1 className="mb-6">Add your first win</h1>
          <EntryForm onSaved={finish} />
          <button type="button" className="text-link mt-4 min-h-11 self-start" disabled={busy} onClick={() => finish()}>Skip for now</button>
        </>
      )}

      {error && <p role="alert" className="mt-4 text-error">{error}</p>}
    </main>
    </div>
  );
}
