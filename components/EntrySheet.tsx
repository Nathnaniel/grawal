'use client';

import { useEffect, useRef } from 'react';
import type { Entry } from '@/lib/types';
import { useApp } from './AppProvider';
import { EntryForm } from './EntryForm';

export function EntrySheet({ open, entry, onClose }: { open: boolean; entry: Entry | null; onClose: () => void }) {
  const { removeEntry } = useApp();
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (open) dialog.current?.showModal();
    else dialog.current?.close();
  }, [open]);

  return (
    <dialog
      ref={dialog}
      className="sheet"
      aria-labelledby="entry-sheet-title"
      onClose={onClose}
      onClick={(event) => { if (event.target === dialog.current) onClose(); }}
    >
      {open && (
        <>
          <h2 id="entry-sheet-title" className="mb-4">{entry ? 'Edit this win' : 'Add a win'}</h2>
          <EntryForm
            entry={entry}
            onSaved={onClose}
            onCancel={onClose}
            onDelete={entry ? () => {
              removeEntry(entry.id);
              onClose();
            } : undefined}
          />
        </>
      )}
    </dialog>
  );
}
