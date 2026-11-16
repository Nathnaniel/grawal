'use client';

import Download from 'kubai-icons-react/icons/download';
import { useEffect, useRef, useState } from 'react';
import { download, exportRows, toCsv, toPdf } from '@/lib/export';
import { useApp } from '../AppProvider';

type Format = 'csv' | 'pdf';

/** On History the black button exports instead of adding: it asks for CSV or PDF, then saves every win. */
export function ExportMenu({ tip }: { tip?: React.ReactNode }) {
  const { store, categories, profile } = useApp();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState<Format | null>(null);
  const [failed, setFailed] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  // A click elsewhere or Escape closes the menu.
  useEffect(() => {
    if (!open) return;
    const away = (event: PointerEvent) => { if (!box.current?.contains(event.target as Node)) setOpen(false); };
    const escape = (event: KeyboardEvent) => { if (event.key === 'Escape') setOpen(false); };
    document.addEventListener('pointerdown', away);
    document.addEventListener('keydown', escape);
    return () => { document.removeEventListener('pointerdown', away); document.removeEventListener('keydown', escape); };
  }, [open]);

  async function save(format: Format) {
    setBusy(format);
    setFailed(false);
    try {
      const rows = exportRows(await store.allEntries(), categories);
      const name = `grawal-wins-${new Date().toISOString().slice(0, 10)}`;
      if (format === 'csv') download(new Blob([toCsv(rows)], { type: 'text/csv;charset=utf-8' }), `${name}.csv`);
      else download(await toPdf(rows, profile.name.trim()), `${name}.pdf`);
      setOpen(false);
    } catch {
      setFailed(true);
    } finally {
      setBusy(null);
    }
  }

  const item = 'flex w-full flex-col items-start rounded-xl px-3 py-2 text-left hover:bg-[var(--d-field)] disabled:opacity-50';

  return (
    <div ref={box} className="relative">
      <button
        type="button"
        aria-label="Export your wins"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className="group relative grid size-11 place-items-center rounded-[40px] bg-[#1a1a1a]"
      >
        <Download size={24} color="#FFFFFF" trigger="parent" style={{ ['--ki-w' as string]: '#1A1A1A' }} />
        {!open && tip}
      </button>
      {open && (
        <div
          role="menu"
          aria-label="Export your wins"
          // Above the button on phones; beside it, opening upwards, on desktop.
          className="panel-in absolute right-0 bottom-[calc(100%+12px)] z-50 w-[220px] rounded-[20px] bg-[var(--d-surface)] p-2 dash-pop lg:right-auto lg:bottom-0 lg:left-[calc(100%+16px)]"
        >
          <p className="px-3 pt-2 pb-1 font-avenir text-sm leading-4 font-extrabold text-[var(--d-text)]">Export your wins as</p>
          {(['csv', 'pdf'] as const).map((format) => (
            <button key={format} type="button" role="menuitem" disabled={busy !== null} onClick={() => save(format)} className={item}>
              <span className="font-avenir text-sm leading-4 font-medium text-[var(--d-text)]">
                {busy === format ? 'Preparing…' : format === 'csv' ? 'CSV file' : 'PDF file'}
              </span>
              <span className="mt-1 font-avenir text-xs leading-4 text-[var(--d-muted)]">
                {format === 'csv' ? 'For Excel, Numbers or Sheets' : 'To read, print or keep'}
              </span>
            </button>
          ))}
          {failed && <p role="alert" className="px-3 pt-1 pb-2 font-avenir text-xs leading-4 text-[#F0322A]">Couldn’t export your wins. Check your connection and try again.</p>}
        </div>
      )}
    </div>
  );
}
