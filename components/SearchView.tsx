'use client';

import Form from 'next/form';
import { newestFirst } from '@/lib/order';
import { hasFilters, matchesSearch, type SearchFilters } from '@/lib/search';
import type { Entry } from '@/lib/types';
import { useApp, useEntries } from './AppProvider';
import { EntryCard } from './EntryCard';

export function SearchView({ filters, results: fromServer, years }: { filters: SearchFilters; results: Entry[]; years: number[] }) {
  const { basePath, categories } = useApp();
  const searching = hasFilters(filters);
  const results = useEntries(fromServer, (entry) => searching && matchesSearch(entry, filters)).sort(newestFirst);

  return (
    <>
      <h1 className="mb-6">Search your wall</h1>

      {/* The key resets the fields when the address changes. */}
      <Form key={JSON.stringify(filters)} action={`${basePath}/search`} className="mb-8 grid max-w-3xl gap-3 sm:grid-cols-[1fr_11rem_8rem_auto] sm:items-end">
        <div>
          <label htmlFor="search-q" className="field-label">Keyword</label>
          <input id="search-q" name="q" type="search" className="field" defaultValue={filters.q} />
        </div>
        <div>
          <label htmlFor="search-category" className="field-label">Category</label>
          <select id="search-category" name="category" className="field" defaultValue={filters.category}>
            <option value="">All</option>
            {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="search-year" className="field-label">Year</label>
          <select id="search-year" name="year" className="field" defaultValue={filters.year}>
            <option value="">All</option>
            {years.map((year) => <option key={year} value={year}>{year}</option>)}
          </select>
        </div>
        <button type="submit" className="btn btn-primary">Search</button>
      </Form>

      {searching && (
        <p role="status" className="mb-6 text-soft">
          {results.length ? `${results.length} ${results.length === 1 ? 'win' : 'wins'} found` : 'No wins match. Try a shorter word, or clear a filter.'}
        </p>
      )}
      <div className="wall-grid">
        {results.map((entry) => <EntryCard key={entry.id} entry={entry} />)}
      </div>
    </>
  );
}
