// What the search panel suggests while typing, and the searches it remembers.

export type SuggestionKind = 'category' | 'win' | 'text';
export interface Suggestion { kind: SuggestionKind; label: string; id?: string }

export function suggest(
  query: string,
  categories: { id: string; name: string }[],
  entries: { id: string; title: string; reflection: string | null }[],
  limit = 6,
): Suggestion[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const fromCategories: Suggestion[] = categories
    .filter((category) => category.name.toLowerCase().includes(q))
    .map((category) => ({ kind: 'category', label: category.name, id: category.id }));
  const fromWins: Suggestion[] = entries
    .filter((entry) => `${entry.title} ${entry.reflection ?? ''}`.toLowerCase().includes(q))
    .map((entry) => ({ kind: 'win', label: entry.title, id: entry.id }));
  return [...fromCategories, ...fromWins].slice(0, limit);
}

/** Newest first, no repeats, at most four kept. */
export function remember(history: Suggestion[], picked: Suggestion): Suggestion[] {
  const same = (a: Suggestion) => a.kind === picked.kind && a.label.toLowerCase() === picked.label.toLowerCase();
  return [picked, ...history.filter((item) => !same(item))].slice(0, 4);
}
