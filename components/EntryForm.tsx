'use client';

import { useEffect, useRef, useState } from 'react';
import type { Entry } from '@/lib/types';
import { useApp } from './AppProvider';
import { CategoryPicker } from './CategoryPicker';

const clean = (text: string) => text.trim() || null;

export function EntryForm({ entry, onSaved, onCancel, onDelete }: {
  entry?: Entry | null;
  /** Called as soon as the win is on the wall. The promise settles once sending was tried. */
  onSaved: (sent: Promise<void>) => void;
  onCancel?: () => void;
  onDelete?: () => void;
}) {
  const { categories, saveEntry, today } = useApp();
  const [title, setTitle] = useState(entry?.title ?? '');
  const [categoryId, setCategoryId] = useState(entry?.category_id ?? null);
  const [date, setDate] = useState(entry?.entry_date ?? today());
  const [scripture, setScripture] = useState(entry?.scripture_ref ?? '');
  const [reflection, setReflection] = useState(entry?.reflection ?? '');
  const [showDetails, setShowDetails] = useState(Boolean(entry?.scripture_ref || entry?.reflection));
  const [error, setError] = useState('');
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const titleField = useRef<HTMLTextAreaElement>(null);

  useEffect(() => { titleField.current?.focus(); }, []);

  function submit(event?: React.FormEvent) {
    event?.preventDefault();
    if (!title.trim()) {
      setError('Write what happened first.');
      titleField.current?.focus();
      return;
    }
    const now = new Date().toISOString();
    const saved: Entry = {
      id: entry?.id ?? crypto.randomUUID(),
      title: title.trim(),
      category_id: categoryId,
      entry_date: date || today(),
      scripture_ref: clean(scripture),
      reflection: clean(reflection),
      photo_path: entry?.photo_path ?? null,
      is_pinned: entry?.is_pinned ?? false,
      created_at: entry?.created_at ?? now,
      updated_at: now,
    };
    onSaved(saveEntry(saved, { fresh: !entry }));
  }

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-4">
      <div>
        <label htmlFor="entry-title" className="field-label">What happened?</label>
        <textarea
          id="entry-title"
          ref={titleField}
          className="field resize-none font-serif text-xl"
          rows={2}
          maxLength={280}
          value={title}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? 'entry-title-error' : undefined}
          onChange={(event) => { setTitle(event.target.value); setError(''); }}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault();
              submit();
            }
          }}
        />
        {error && <p id="entry-title-error" className="mt-1 text-error">{error}</p>}
      </div>

      <CategoryPicker categories={categories} value={categoryId} onChange={setCategoryId} />

      <div>
        <label htmlFor="entry-date" className="field-label">Date</label>
        <input id="entry-date" type="date" className="field sm:max-w-56" value={date} onChange={(event) => setDate(event.target.value)} />
      </div>

      {showDetails ? (
        <>
          <div>
            <label htmlFor="entry-scripture" className="field-label">Scripture</label>
            <input id="entry-scripture" className="field" maxLength={120} placeholder="Psalm 103:2" value={scripture} onChange={(event) => setScripture(event.target.value)} />
          </div>
          <div>
            <label htmlFor="entry-reflection" className="field-label">Reflection</label>
            <textarea id="entry-reflection" className="field" rows={4} maxLength={10000} value={reflection} onChange={(event) => setReflection(event.target.value)} />
          </div>
        </>
      ) : (
        <button type="button" className="text-link self-start py-2" onClick={() => setShowDetails(true)}>
          Add scripture or a reflection
        </button>
      )}

      {confirmingDelete ? (
        <div className="flex flex-wrap items-center gap-3">
          <p className="w-full">Delete this win? It can't be recovered.</p>
          <button type="button" className="btn btn-danger" onClick={onDelete}>Delete win</button>
          <button type="button" className="btn btn-quiet" onClick={() => setConfirmingDelete(false)}>Keep it</button>
        </div>
      ) : (
        <div className="flex flex-wrap items-center gap-3">
          <button type="submit" className="btn btn-primary">{entry ? 'Save changes' : 'Add win'}</button>
          {onCancel && <button type="button" className="btn btn-quiet" onClick={onCancel}>Cancel</button>}
          {onDelete && <button type="button" className="text-link ml-auto py-2" onClick={() => setConfirmingDelete(true)}>Delete</button>}
        </div>
      )}
    </form>
  );
}
