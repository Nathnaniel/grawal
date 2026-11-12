'use client';

import Link from 'next/link';
import { newestFirst } from '@/lib/order';
import type { Entry } from '@/lib/types';
import { useApp, useEntries } from '../AppProvider';
import { EmptyState } from './EmptyState';
import { GRID } from './WallView';
import { WinNote } from './WinNote';

/** One year of wins at a time, with the years listed beside the wall. */
export function HistoryView({ years, year, entries: fromServer }: { years: number[]; year: number | null; entries: Entry[] }) {
  const { basePath } = useApp();
  const entries = useEntries(fromServer, (entry) => year !== null && entry.entry_date.startsWith(`${year}-`)).sort(newestFirst);

  if (!years.length || year === null) {
    return <EmptyState title="History is empty">Pin your first win to start your story.</EmptyState>;
  }

  return (
    <>
      {/* Figma: a column at 171px on desktop; a row under the header on phones. */}
      <nav aria-label="Years" className="flex justify-center px-5 lg:fixed lg:top-1/2 lg:left-[171px] lg:z-20 lg:-translate-y-1/2 lg:flex-col lg:gap-3 lg:px-0">
        {years.map((option) => (
          <Link
            key={option}
            href={`${basePath}/history?year=${option}`}
            aria-current={option === year ? 'page' : undefined}
            className={`rounded-lg px-5 py-2 font-avenir text-base leading-[18px] font-extrabold ${option === year ? 'bg-[var(--d-field)] text-[var(--d-text)] max-lg:bg-[var(--d-surface)]' : 'text-[var(--d-faint)]'}`}
          >
            {option}
          </Link>
        ))}
      </nav>
      {/* The wall sits 119px right of centre on desktop, clear of the years. */}
      <div className="px-[22.5px] pt-5 pb-40 lg:pt-[60px] lg:pr-6 lg:pb-24 lg:pl-[max(260px,calc(50%-391px))]">
        <ul className={`${GRID} lg:max-w-[1020px] lg:justify-start`}>
          {entries.map((entry) => <li key={entry.id}><WinNote entry={entry} /></li>)}
        </ul>
      </div>
    </>
  );
}
