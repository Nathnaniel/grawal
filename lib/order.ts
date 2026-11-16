type Sortable = { is_pinned: boolean; entry_date: string; created_at: string };
type Ranked = Sortable & { wall_rank: number | null };

const newestFirst = (a: Sortable, b: Sortable) =>
  b.entry_date.localeCompare(a.entry_date) || b.created_at.localeCompare(a.created_at);

/** The wall's order: by place on the wall. A win with no place yet (just added) goes on top. */
export const wallOrder = (a: Ranked, b: Ranked) =>
  (a.wall_rank ?? -Infinity) - (b.wall_rank ?? -Infinity) || newestFirst(a, b);

export { newestFirst };
