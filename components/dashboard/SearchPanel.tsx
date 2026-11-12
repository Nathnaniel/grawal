'use client';

import { useEffect, useRef, useState } from 'react';
import { remember, suggest, type Suggestion } from '@/lib/search-suggestions';
import type { Entry } from '@/lib/types';
import { useApp } from '../AppProvider';

const TYPE_LABEL = { category: 'category', win: 'win', text: 'search' } as const;

/** The search box and its panel: recent searches, then suggestions as you type. */
export function SearchPanel() {
  const { store, categories, filter, setFilter, open, close, remembered, remember: store_ } = useApp();
  const [query, setQuery] = useState(filter?.q || filter?.label || '');
  const [wins, setWins] = useState<Entry[]>([]);
  const [active, setActive] = useState(0);
  const [history, setHistory] = useState<Suggestion[]>(() => remembered<Suggestion[]>('searches', []));
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => { input.current?.focus(); }, []);

  // Wins come from the server, a moment after typing stops.
  useEffect(() => {
    if (!query.trim()) { setWins([]); return; }
    const timer = setTimeout(() => store.search({ q: query, categoryId: '' }).then(setWins, () => setWins([])), 200);
    return () => clearTimeout(timer);
  }, [query, store]);

  const typing = Boolean(query.trim());
  const suggestions = typing ? suggest(query, categories, wins) : history;
  const recent = history.slice(0, 2);
  const previous = history.slice(2);
  useEffect(() => setActive(0), [query]);

  function pick(item: Suggestion) {
    const next = remember(history, item);
    setHistory(next);
    store_('searches', next);
    if (item.kind === 'win') {
      const entry = wins.find((win) => win.id === item.id);
      if (entry) return open({ kind: 'note', entry });
      return setFilter({ label: item.label, q: item.label, categoryId: '' }), close();
    }
    if (item.kind === 'category') setFilter({ label: item.label, q: '', categoryId: item.id ?? '' });
    else setFilter({ label: item.label, q: item.label, categoryId: '' });
    close();
  }

  function onKeyDown(event: React.KeyboardEvent) {
    if (event.key === 'ArrowDown') { event.preventDefault(); setActive((index) => Math.min(index + 1, suggestions.length - 1)); }
    if (event.key === 'ArrowUp') { event.preventDefault(); setActive((index) => Math.max(index - 1, 0)); }
    if (event.key === 'Enter') {
      event.preventDefault();
      const chosen = suggestions[active];
      if (chosen) pick(chosen);
      else if (typing) pick({ kind: 'text', label: query.trim() });
    }
  }

  const row = (item: Suggestion, index: number) => (
    <li key={`${item.kind}-${item.label}-${index}`} role="option" aria-selected={index === active}>
      <button
        type="button"
        onMouseEnter={() => setActive(index)}
        onClick={() => pick(item)}
        className={`flex h-10 w-full items-center justify-between rounded-xl px-3 text-left font-avenir ${index === active ? 'bg-[var(--d-field)]' : ''}`}
      >
        <span className="truncate text-sm leading-4 text-[var(--d-text)]">{item.label}</span>
        {index === active
          ? <img src="/app/enter.svg" alt="" width={12} height={12} className="dash-icon" />
          : <span className="text-xs leading-[14px] text-[var(--d-muted)]">{TYPE_LABEL[item.kind]}</span>}
      </button>
    </li>
  );

  const empty = typing && !suggestions.length;

  return (
    // Figma: a 400px search box at 94px and a 380px panel 12px below it on desktop; 353px wide on phones.
    <div className="fixed top-[122px] left-1/2 z-50 w-[min(353px,calc(100vw-40px))] -translate-x-1/2 lg:top-[94px] lg:w-[400px]">
      <div className="panel-in relative h-10 rounded-xl bg-[var(--d-surface)] shadow-[0_12px_14.1px_rgb(0_0_0/0.08)]">
        <img src="/app/search-sm.svg" alt="" width={20} height={20} className="dash-icon absolute top-2.5 left-3" />
        <input
          ref={input}
          role="combobox"
          aria-expanded="true"
          aria-controls="search-results"
          aria-label="Search your wins"
          placeholder="Enter text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={onKeyDown}
          className="size-full rounded-xl bg-transparent pr-16 pl-10 font-avenir text-base tracking-[-0.036px] text-[var(--d-soft)] outline-none placeholder:text-[var(--d-faint)] lg:text-xs"
        />
        <span aria-hidden="true" className="absolute top-1/2 right-3 hidden h-5 -translate-y-1/2 items-center gap-1 rounded-md border-[0.5px] border-[rgb(204_204_204/0.5)] px-1 py-0.5 text-xs text-[var(--d-muted)] lg:flex">
          <img src="/app/command.svg" alt="" width={12} height={12} className="dash-icon" />k
        </span>
      </div>

      <div className="panel-in relative mt-3 h-[380px] rounded-xl bg-[var(--d-surface)] p-3 shadow-[0_12px_14.1px_rgb(0_0_0/0.08)]">
        {empty ? (
          <div className="flex h-[300px] flex-col items-center justify-center gap-2 text-center">
            <span className="grid size-10 place-items-center rounded-xl bg-[var(--d-field)]"><img src="/app/search-empty.svg" alt="" width={20} height={20} className="dash-icon" /></span>
            <p className="font-avenir text-sm leading-[14px] tracking-[-0.042px] text-[var(--d-text)]">No results found</p>
            <p className="w-[203px] font-avenir text-xs leading-[14px] tracking-[-0.036px] text-[var(--d-muted)]">Your search did not match any results. Please try again.</p>
          </div>
        ) : typing ? (
          <ul id="search-results" role="listbox" className="flex flex-col gap-2">{suggestions.map(row)}</ul>
        ) : history.length ? (
          <ul id="search-results" role="listbox">
            <li className="px-3 pb-[11px] font-avenir text-xs leading-[14px] text-[var(--d-faint)]" role="presentation">Recent</li>
            <li role="presentation"><ul className="flex flex-col gap-2">{recent.map((item, index) => row(item, index))}</ul></li>
            {previous.length > 0 && (
              <>
                <li className="px-3 pt-[29px] pb-[11px] font-avenir text-xs leading-[14px] text-[var(--d-faint)]" role="presentation">Previous</li>
                <li role="presentation"><ul className="flex flex-col gap-2">{previous.map((item, index) => row(item, index + 2))}</ul></li>
              </>
            )}
          </ul>
        ) : (
          <p className="px-3 pt-1 font-avenir text-xs leading-[14px] text-[var(--d-muted)]">Search your wins by word or category.</p>
        )}

        <div className="absolute inset-x-3 bottom-3 flex flex-col items-center gap-2">
          <hr className="w-[350px] max-w-full border-0 border-t-[0.5px] border-[var(--d-line)]" />
          <div className="flex w-full items-center justify-between font-avenir text-[10px] leading-3 font-medium text-[var(--d-muted)]">
            <span className="flex items-center gap-1">
              <span className="flex items-center gap-1 px-2 py-1"><img src="/app/arrow-up.svg" alt="" width={12} height={12} className="dash-icon" /><img src="/app/arrow-down.svg" alt="" width={12} height={12} className="dash-icon" /> to navigate</span>
              <span className="flex items-center gap-1 px-2 py-1"><img src="/app/enter.svg" alt="" width={12} height={12} className="dash-icon" /> select</span>
            </span>
            <span className="px-2 py-1">esc to close</span>
          </div>
        </div>
      </div>
    </div>
  );
}
