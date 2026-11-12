'use client';

import { useEffect, useRef, useState } from 'react';
import { orderCategories } from '@/lib/notes';
import type { Entry } from '@/lib/types';
import { useApp } from '../AppProvider';

const CUSTOM = 'custom';
const CUSTOM_COLOUR = '#1568D4';
// Inputs use 16px on phones: anything smaller makes iPhones zoom in on tap.
const FIELD = 'w-full rounded-xl bg-[var(--d-field)] px-3 font-avenir text-base tracking-[-0.036px] text-[var(--d-text)] placeholder:text-[var(--d-muted)] lg:text-xs';

/** "What are you grateful for?": a modal on desktop, its own page on phones. */
export function CreatePanel({ entry }: { entry?: Entry }) {
  const { categories, saveEntry, addCategory, close, today } = useApp();
  const [title, setTitle] = useState(entry?.title ?? '');
  const [categoryId, setCategoryId] = useState<string | null>(entry?.category_id ?? null);
  const [customName, setCustomName] = useState('');
  const [story, setStory] = useState(entry?.reflection ?? '');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const titleField = useRef<HTMLInputElement>(null);

  useEffect(() => { titleField.current?.focus(); }, []);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!title.trim()) {
      setError('Write what happened first.');
      titleField.current?.focus();
      return;
    }
    if (categoryId === CUSTOM && !customName.trim()) {
      setError('Name your category, or pick one above.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      let chosen = categoryId;
      if (categoryId === CUSTOM) chosen = (await addCategory(customName.trim(), CUSTOM_COLOUR)).id;
      const now = new Date().toISOString();
      saveEntry({
        id: entry?.id ?? crypto.randomUUID(),
        title: title.trim(),
        reflection: story.trim() || null,
        category_id: chosen,
        scripture_ref: entry?.scripture_ref ?? null,
        photo_path: entry?.photo_path ?? null,
        is_pinned: entry?.is_pinned ?? false,
        entry_date: entry?.entry_date ?? today(),
        created_at: entry?.created_at ?? now,
        updated_at: now,
      }, { fresh: !entry });
      close();
    } catch (failure) {
      const duplicate = (failure as { code?: string }).code === '23505';
      setError(duplicate ? 'You already have a category with that name. Pick it from the list.' : 'That didn’t save. Check your connection and try again.');
      setSaving(false);
    }
  }

  const options = [...orderCategories(categories).map((category) => ({ id: category.id, name: category.name })), { id: CUSTOM, name: 'Custom' }];

  return (
    <section
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-heading"
      className="panel-in fixed inset-0 z-50 overflow-y-auto bg-[var(--d-surface)] px-5 pt-[120px] pb-10 lg:inset-auto lg:top-[108px] lg:left-1/2 lg:max-h-[calc(100dvh-128px)] lg:w-[640px] lg:-translate-x-1/2 lg:px-[120px] lg:py-20"
    >
      <button type="button" onClick={close} aria-label="Close" className="absolute top-12 right-5 grid size-8 place-items-center rounded-full bg-[var(--d-field)] lg:hidden">
        <img src="/app/close.svg" alt="" width={18} height={18} className="dash-icon" />
      </button>
      <form onSubmit={submit} noValidate className="mx-auto flex max-w-[400px] flex-col gap-10">
        <h2 id="create-heading" className="font-tusker text-2xl leading-[26px] font-medium text-[var(--d-text)]">
          {entry ? 'Edit this win' : 'What are you grateful for?'}
        </h2>

        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-[11px]">
            <label htmlFor="win-title" className="font-avenir text-base leading-[18px] tracking-[-0.048px] text-[var(--d-soft)]">What happened?</label>
            <input
              id="win-title"
              ref={titleField}
              value={title}
              maxLength={280}
              onChange={(event) => { setTitle(event.target.value); setError(''); }}
              aria-invalid={error === 'Write what happened first.'}
              className={`${FIELD} h-10`}
            />
          </div>

          <fieldset className="flex flex-col gap-[11px]">
            <legend className="mb-[11px] font-avenir text-base leading-[18px] tracking-[-0.048px] text-[var(--d-soft)]">Category</legend>
            <div className="flex flex-wrap gap-2">
              {options.map((option) => {
                const checked = categoryId === option.id;
                return (
                  <label key={option.id} className="flex items-center gap-2.5 rounded-xl bg-[var(--d-field)] px-3 py-2 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-[#1568d4]">
                    <input type="radio" name="category" className="sr-only" checked={checked} onChange={() => setCategoryId(option.id)} onClick={() => checked && setCategoryId(null)} />
                    <span className="font-avenir text-sm leading-4 tracking-[-0.042px] text-[var(--d-text)]">{option.name}</span>
                    <img src={checked ? '/app/radio-on.svg' : '/app/radio-off.svg'} alt="" width={20} height={20} className={checked ? '' : 'dash-icon'} />
                  </label>
                );
              })}
            </div>
            {categoryId === CUSTOM && (
              <input
                aria-label="Name your category"
                placeholder="Name your category"
                value={customName}
                maxLength={40}
                onChange={(event) => setCustomName(event.target.value)}
                className={`${FIELD} mt-1 h-10`}
              />
            )}
          </fieldset>

          <div className="flex flex-col gap-[11px]">
            <label htmlFor="win-story" className="font-avenir text-base leading-[18px] tracking-[-0.048px] text-[var(--d-soft)]">Tell the story</label>
            <textarea
              id="win-story"
              value={story}
              maxLength={10000}
              onChange={(event) => setStory(event.target.value)}
              className={`${FIELD} h-20 resize-none py-[11px] leading-[18px]`}
            />
          </div>
        </div>

        {error && <p role="alert" className="-mt-5 font-avenir text-sm text-[var(--d-danger)]">{error}</p>}

        <button
          type="submit"
          disabled={saving}
          className="mx-auto mt-10 flex h-12 w-[313px] max-w-full items-center justify-center gap-1 rounded-xl border-t-2 border-r-2 border-[#3788f1] bg-[#1568d4] font-avenir text-base font-medium text-white shadow-[inset_0_-4px_4px_rgb(179_208_245/0.25)] dash-glow disabled:opacity-70"
        >
          {!entry && <img src="/landing/pin.svg" alt="" width={24} height={24} />}
          {entry ? 'Save changes' : 'Pin your win'}
        </button>
      </form>
    </section>
  );
}
