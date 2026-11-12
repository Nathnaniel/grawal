type Sortable = { is_pinned: boolean; entry_date: string; created_at: string };

const newestFirst = (a: Sortable, b: Sortable) =>
  b.entry_date.localeCompare(a.entry_date) || b.created_at.localeCompare(a.created_at);

/** The wall's order: pinned entries first, then newest first. */
export const wallOrder = (a: Sortable, b: Sortable) =>
  Number(b.is_pinned) - Number(a.is_pinned) || newestFirst(a, b);

export { newestFirst };
