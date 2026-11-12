'use client';

import Link from 'next/link';
import { yearOf } from '@/lib/dates';
import type { WallSummary } from '@/lib/types';
import { useApp } from './AppProvider';

const winsLabel = (count: number) => (count === 1 ? 'win' : 'wins');

export function Widgets({ summary }: { summary: WallSummary }) {
  const { categories, basePath, openEdit } = useApp();
  const { year, yearWins, allWins, topCategories, onThisDay } = summary;
  const largest = topCategories[0]?.wins ?? 1;

  return (
    <aside aria-label="Looking back" className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="glass widget">
          <p className="text-sm text-soft">In {year}</p>
          <p className="font-serif text-4xl leading-tight font-medium">{yearWins}</p>
          <p className="text-sm text-soft">{winsLabel(yearWins)}</p>
        </div>
        <div className="glass widget">
          <p className="text-sm text-soft">All together</p>
          <p className="font-serif text-4xl leading-tight font-medium">{allWins}</p>
          <p className="text-sm text-soft">{winsLabel(allWins)}</p>
        </div>
      </div>

      <section aria-labelledby="on-this-day-heading" className="glass widget">
        <h2 id="on-this-day-heading" className="mb-2 font-sans text-sm font-bold text-soft">On this day</h2>
        {onThisDay.length ? (
          <ul className="flex flex-col gap-2 rounded-xl bg-note p-2">
            {onThisDay.map((entry) => (
              <li key={entry.id}>
                <button type="button" className="w-full rounded-lg px-2 py-1.5 text-left hover:bg-deep/10" aria-label={`Edit: ${entry.title}`} onClick={() => openEdit(entry)}>
                  <span className="block font-serif text-lg leading-snug">{entry.title}</span>
                  <span className="text-sm text-soft">{year - yearOf(entry.entry_date) === 1 ? '1 year ago' : `${year - yearOf(entry.entry_date)} years ago`}</span>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="rounded-xl bg-note p-3 text-soft">Nothing from this date yet. Today's win will be here next year.</p>
        )}
      </section>

      {topCategories.length > 0 && (
        <section aria-labelledby="categories-widget-heading" className="glass widget">
          <h2 id="categories-widget-heading" className="mb-2 font-sans text-sm font-bold text-soft">What God did in {year}</h2>
          <ul className="flex flex-col gap-2">
            {topCategories.map(({ category_id, wins }) => {
              const category = categories.find((item) => item.id === category_id);
              if (!category) return null;
              return (
                <li key={category_id}>
                  <div className="flex justify-between text-sm"><span>{category.name}</span><span>{wins}</span></div>
                  <div aria-hidden="true" className="mt-0.5 h-1 rounded-full bg-deep/15">
                    <div className="h-full rounded-full" style={{ width: `${(wins / largest) * 100}%`, background: category.colour }} />
                  </div>
                </li>
              );
            })}
          </ul>
          <Link href={`${basePath}/years/${year}`} className="text-link mt-2 inline-flex min-h-11 items-center text-sm">See {year}</Link>
        </section>
      )}
    </aside>
  );
}
