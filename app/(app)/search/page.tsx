import type { Metadata } from 'next';
import { SearchView } from '@/components/SearchView';
import { getYearCounts, searchEntries } from '@/lib/queries';
import { hasFilters, parseFilters, type RawFilters } from '@/lib/search';

export const metadata: Metadata = { title: 'Search' };

export default async function Search({ searchParams }: { searchParams: Promise<RawFilters> }) {
  const filters = parseFilters(await searchParams);
  const [results, years] = await Promise.all([
    hasFilters(filters) ? searchEntries(filters) : [],
    getYearCounts(),
  ]);
  return <SearchView filters={filters} results={results} years={years.map(({ year }) => year)} />;
}
