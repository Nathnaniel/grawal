'use client';

import Link from 'next/link';
import { groupByMonth, monthName, yearOf } from '@/lib/dates';
import { newestFirst } from '@/lib/order';
import type { Entry } from '@/lib/types';
import { useApp, useEntries } from './AppProvider';
import { EntryCard } from './EntryCard';

export function YearTimeline({ year, entries: fromServer }: { year: number; entries: Entry[] }) {
  const { basePath } = useApp();
  const entries = useEntries(fromServer, (entry) => yearOf(entry.entry_date) === year).sort(newestFirst);
  const months = groupByMonth(entries);

  return (
    <>
      <Link href={`${basePath}/years`} className="text-link inline-flex min-h-11 items-center">All years</Link>
      <h1 className="mt-2 mb-6">{year}</h1>

      {months.length > 1 && (
        <nav aria-label="Months" className="mb-8 flex flex-wrap gap-x-4">
          {months.map(({ month }) => (
            <a key={month} href={`#month-${month}`} className="text-link inline-flex min-h-11 items-center">{monthName(month)}</a>
          ))}
        </nav>
      )}

      {months.length ? (
        <div className="flex flex-col gap-12 border-l-2 border-line pl-4 sm:pl-8">
          {months.map(({ month, items }) => (
            <section key={month} id={`month-${month}`} aria-labelledby={`month-heading-${month}`}>
              <h2 id={`month-heading-${month}`} className="mb-5">{monthName(month)}</h2>
              <div className="wall-grid">
                {items.map((entry) => <EntryCard key={entry.id} entry={entry} />)}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <p className="text-soft">No wins from {year} yet. You can add one and set its date to that year.</p>
      )}
    </>
  );
}
