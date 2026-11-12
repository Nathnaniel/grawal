export interface SearchFilters { q: string; category: string; year: string }

type Searchable = {
  title: string;
  reflection: string | null;
  scripture_ref: string | null;
  category_id: string | null;
  entry_date: string;
};

/** Same rule the database applies, used for entries changed since the page loaded. */
export function matchesSearch(entry: Searchable, { q, category, year }: SearchFilters): boolean {
  const text = `${entry.title} ${entry.reflection ?? ''} ${entry.scripture_ref ?? ''}`.toLowerCase();
  return text.includes(q.trim().toLowerCase())
    && (!category || entry.category_id === category)
    && (!year || entry.entry_date.startsWith(`${year}-`));
}

/** Turns typed text into a LIKE pattern, so % and _ are searched for literally. */
export function likePattern(q: string): string {
  return `%${q.trim().toLowerCase().replace(/[\\%_]/g, '\\$&')}%`;
}

export const hasFilters = ({ q, category, year }: SearchFilters) => Boolean(q.trim() || category || year);

export type RawFilters = { [K in keyof SearchFilters]?: string | string[] };

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const first = (value?: string | string[]) => (Array.isArray(value) ? value[0] : value) ?? '';

/** Reads filters from the address bar, dropping anything malformed. */
export function parseFilters(raw: RawFilters): SearchFilters {
  const category = first(raw.category);
  const year = first(raw.year);
  return {
    q: first(raw.q).slice(0, 200),
    category: UUID.test(category) ? category : '',
    year: /^\d{4}$/.test(year) ? year : '',
  };
}
