import { SearchView } from '@/components/SearchView';
import { sampleEntries, sampleYearCounts } from '@/lib/sample';
import { hasFilters, matchesSearch, parseFilters, type RawFilters } from '@/lib/search';

export default async function PreviewSearch({ searchParams }: { searchParams: Promise<RawFilters> }) {
  const filters = parseFilters(await searchParams);
  const results = hasFilters(filters) ? sampleEntries.filter((entry) => matchesSearch(entry, filters)) : [];
  return <SearchView filters={filters} results={results} years={sampleYearCounts().map(({ year }) => year)} />;
}
