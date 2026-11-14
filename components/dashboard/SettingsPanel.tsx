'use client';

import { useRef, useState } from 'react';
import { useApp } from '../AppProvider';
import { Avatar } from './Avatar';
import { ThemeSwitch } from './ThemeSwitch';

const FIELD = 'h-10 w-full rounded-xl bg-[var(--d-field)] px-3 font-avenir text-base tracking-[-0.036px] text-[var(--d-mid)] lg:text-xs';
const MAX_PHOTO = 5 * 1024 * 1024;

function Switch({ label, checked, onChange }: { label: string; checked: boolean; onChange: (next: boolean) => void }) {
  return (
    <div className="flex items-center justify-between">
      <span className="font-avenir text-sm leading-[18px] text-[var(--d-text)]">{label}</span>
      <button type="button" role="switch" aria-checked={checked} aria-label={label} onClick={() => onChange(!checked)} className="grid size-10 place-items-center">
        <span className={`relative block h-4 w-8 rounded-full transition-colors ${checked ? 'bg-[#1568d4]' : 'bg-[var(--d-field)]'}`}>
          <span className={`absolute top-0.5 size-3 rounded-full transition-[left] ${checked ? 'left-[18px] bg-white' : 'left-0.5 bg-[var(--d-faint)]'}`} />
        </span>
      </button>
    </div>
  );
}

/** "Make Grawal work the way you do." A modal on desktop, a sheet from the right on phones. */
export function SettingsPanel() {
  const { profile, email, avatarUrl, updateProfile, setAvatar, close } = useApp();
  const [name, setName] = useState(profile.name);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const picker = useRef<HTMLInputElement>(null);

  async function save(patch: Parameters<typeof updateProfile>[0], done = 'Saved.') {
    setMessage('');
    try {
      await updateProfile(patch);
      setMessage(done);
    } catch {
      setMessage('That didn’t save. Check your connection and try again.');
    }
  }

  async function choosePhoto(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) return setMessage('Choose a photo: JPG, PNG, WebP or HEIC.');
    if (file.size > MAX_PHOTO) return setMessage('That photo is over 5 MB. Choose a smaller one.');
    setBusy(true);
    setMessage('');
    try {
      await setAvatar(file);
      setMessage('Photo updated.');
    } catch {
      setMessage('The photo didn’t upload. Check your connection and try again.');
    } finally {
      setBusy(false);
    }
  }

  async function deleteAccount() {
    setBusy(true);
    setMessage('');
    const response = await fetch('/api/account', { method: 'DELETE' }).catch(() => null);
    if (response?.ok) {
      window.location.assign('/');
      return;
    }
    setBusy(false);
    setConfirmDelete(false);
    setMessage(response?.status === 503
      ? 'Deleting accounts isn’t switched on yet. Your account and wins are unchanged.'
      : 'Your account wasn’t deleted. Check your connection and try again.');
  }

  return (
    <section
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-heading"
      className="panel-in fixed inset-y-0 right-0 left-10 z-50 overflow-y-auto bg-[var(--d-surface)] px-10 pt-[calc(var(--dash-top)+72px)] pb-[calc(var(--dash-bottom)+16px)] lg:inset-auto lg:top-[156px] lg:left-1/2 lg:h-[712px] lg:max-h-[calc(100dvh-176px)] lg:w-[500px] lg:-translate-x-1/2 lg:px-[46px] lg:pt-10"
    >
      <button type="button" onClick={close} aria-label="Close settings" className="absolute top-[var(--dash-top)] right-5 grid size-8 place-items-center rounded-full bg-[var(--d-field)] lg:hidden">
        <img src="/app/close.svg" alt="" width={18} height={18} className="dash-icon" />
      </button>

      <div className="flex flex-col gap-10">
        <div className="flex flex-col gap-3">
          <h2 id="settings-heading" className="font-avenir text-2xl leading-[26px] font-extrabold text-[var(--d-text)]">Settings</h2>
          <p className="font-avenir text-base leading-[18px] tracking-[-0.048px] text-[var(--d-soft)]">Make Grawal work the way you do.</p>
        </div>

        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-3">
            <Avatar size={60} ring="var(--d-field)" ringWidth={2.5} fontSize={20} />
            <button type="button" disabled={busy} onClick={() => picker.current?.click()} className="rounded-xl bg-[var(--d-field)] p-2 font-avenir text-base leading-[18px] tracking-[-0.048px] text-[var(--d-soft)] disabled:opacity-60">
              {avatarUrl ? 'Change photo' : 'Add photo'}
            </button>
            <input ref={picker} type="file" accept="image/jpeg,image/png,image/webp,image/heic" className="sr-only" tabIndex={-1} aria-hidden="true" onChange={choosePhoto} />
          </div>

          <div className="flex flex-col gap-[18px]">
            <div className="flex flex-col gap-[11px]">
              <label htmlFor="settings-name" className="font-avenir text-base leading-[18px] tracking-[-0.048px] text-[var(--d-text)]">Name</label>
              <input
                id="settings-name"
                value={name}
                maxLength={80}
                onChange={(event) => setName(event.target.value)}
                onBlur={() => name.trim() !== profile.name && save({ name: name.trim() }, 'Name saved.')}
                onKeyDown={(event) => event.key === 'Enter' && event.currentTarget.blur()}
                className={FIELD}
              />
            </div>
            <div className="flex flex-col gap-[11px]">
              <label htmlFor="settings-email" className="font-avenir text-base leading-[18px] tracking-[-0.048px] text-[var(--d-text)]">Email</label>
              <input id="settings-email" value={email} readOnly className={FIELD} />
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-3.5">
                <p className="font-avenir text-base leading-[18px] tracking-[-0.048px] text-[var(--d-muted)]">Reminders</p>
                <div className="flex flex-col gap-1">
                  <Switch label="Weekly reminder" checked={profile.reminder_frequency === 'weekly'} onChange={(on) => save({ reminder_frequency: on ? 'weekly' : 'off' })} />
                  <Switch label="On this day" checked={profile.notify_on_this_day} onChange={(on) => save({ notify_on_this_day: on })} />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-avenir text-base leading-[18px] text-[var(--d-text)]">Appearance</span>
                <ThemeSwitch />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              {confirmDelete ? (
                <div className="flex flex-col gap-2 rounded-xl bg-[var(--d-field)] p-3">
                  <p className="font-avenir text-sm text-[var(--d-text)]">Delete your account and every win? This can’t be undone.</p>
                  <div className="flex gap-2">
                    <button type="button" disabled={busy} onClick={deleteAccount} className="rounded-lg bg-[var(--d-danger)] px-3 py-2 font-avenir text-sm font-medium text-white disabled:opacity-60">Delete account</button>
                    <button type="button" onClick={() => setConfirmDelete(false)} className="rounded-lg px-3 py-2 font-avenir text-sm text-[var(--d-text)]">Cancel</button>
                  </div>
                </div>
              ) : (
                <button type="button" onClick={() => setConfirmDelete(true)} className="flex items-center gap-1 self-start p-2 font-avenir text-base leading-[18px] text-[var(--d-danger)]">
                  <img src="/app/delete.svg" alt="" width={20} height={20} /> Delete account
                </button>
              )}
              <form action="/auth/sign-out" method="post">
                <button type="submit" className="flex items-center gap-1 p-2 font-avenir text-base leading-[18px] text-[var(--d-danger)]">
                  <img src="/app/logout-red.svg" alt="" width={20} height={20} /> Log out
                </button>
              </form>
            </div>
          </div>
          <p role="status" className="min-h-5 font-avenir text-sm text-[var(--d-soft)]">{message}</p>
        </div>
      </div>
    </section>
  );
}
