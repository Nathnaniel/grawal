// How the wall is laid out when people drag wins around: which wins sit together in a
// pile, and the new places to save after a move. Pure functions, so they're easy to test.

export type Placed = { id: string; wall_rank: number | null; stack_id: string | null };

/** One spot on the wall: a single win, or a pile of wins (top first). */
export type Tile<T extends Placed> = { key: string; stackId: string | null; entries: T[] };

/** Where a dragged tile was dropped, relative to another tile. */
export type Drop = { key: string; mode: 'before' | 'after' | 'stack' };

const GAP = 1024;

/** Groups wins (already in wall order) into tiles. A pile sits where its top win is. */
export function toTiles<T extends Placed>(entries: T[], expanded: ReadonlySet<string> = new Set()): Tile<T>[] {
  const sizes = new Map<string, number>();
  for (const entry of entries) if (entry.stack_id) sizes.set(entry.stack_id, (sizes.get(entry.stack_id) ?? 0) + 1);
  const tiles: Tile<T>[] = [];
  const piles = new Map<string, Tile<T>>();
  for (const entry of entries) {
    const sid = entry.stack_id;
    // A "stack" of one, or an opened stack, shows its wins one by one.
    if (!sid || (sizes.get(sid) ?? 0) < 2 || expanded.has(sid)) {
      tiles.push({ key: entry.id, stackId: sid && (sizes.get(sid) ?? 0) > 1 ? sid : null, entries: [entry] });
      continue;
    }
    const pile = piles.get(sid);
    if (pile) pile.entries.push(entry);
    else {
      const tile = { key: `stack:${sid}`, stackId: sid, entries: [entry] };
      piles.set(sid, tile);
      tiles.push(tile);
    }
  }
  return tiles;
}

/** Ranks for `count` wins between two neighbours (either may be missing). */
function between(before: number | null, after: number | null, count: number): number[] {
  const low = before ?? (after ?? 0) - GAP * (count + 1);
  const high = after ?? (before ?? 0) + GAP * (count + 1);
  return Array.from({ length: count }, (_, index) => low + ((high - low) * (index + 1)) / (count + 1));
}

/**
 * The wins whose place or stack changes when `movingKey` is dropped. Returns only what
 * changed, so only those wins are saved.
 */
export function applyDrop<T extends Placed>(tiles: Tile<T>[], movingKey: string, drop: Drop): T[] {
  if (drop.key === movingKey) return [];
  const moving = tiles.find((tile) => tile.key === movingKey);
  const target = tiles.find((tile) => tile.key === drop.key);
  if (!moving || !target) return [];

  // Give any win still waiting for a place from the database one now, so the gaps add up.
  const flat = tiles.flatMap((tile) => tile.entries);
  const ranks = new Map<string, number>();
  let next = flat.find((entry) => entry.wall_rank !== null)?.wall_rank ?? 0;
  const unplaced = flat.filter((entry) => entry.wall_rank === null);
  unplaced.forEach((entry, index) => ranks.set(entry.id, next - GAP * (unplaced.length - index)));
  for (const entry of flat) if (entry.wall_rank !== null) ranks.set(entry.id, (next = entry.wall_rank));
  const rank = (entry: T) => ranks.get(entry.id)!;

  const changed = new Map<string, T>();
  const set = (entry: T, patch: Partial<Placed>) => changed.set(entry.id, { ...(changed.get(entry.id) ?? entry), ...patch });
  for (const entry of unplaced) set(entry, { wall_rank: rank(entry) });

  const movingIds = new Set(moving.entries.map((entry) => entry.id));
  const rest = tiles.filter((tile) => tile.key !== movingKey);
  const at = rest.findIndex((tile) => tile.key === drop.key);
  const insertAt = drop.mode === 'after' ? at + 1 : at;
  const lastRank = (tile?: Tile<T>) => (tile ? Math.max(...tile.entries.map(rank)) : null);
  const firstRank = (tile?: Tile<T>) => (tile ? Math.min(...tile.entries.map(rank)) : null);
  const newRanks = between(lastRank(rest[insertAt - 1]), firstRank(rest[insertAt]), moving.entries.length);

  // Wins a single note was taken out of: a stack left with one win is no longer a stack.
  const leaving = moving.entries.length === 1 && moving.stackId ? moving.stackId : null;

  if (drop.mode === 'stack') {
    const stackId = target.stackId ?? target.entries[0].id;
    for (const entry of target.entries) if (entry.stack_id !== stackId) set(entry, { stack_id: stackId });
    // The dropped wins go on top of the pile, and the pile stays where the target was.
    moving.entries.forEach((entry, index) => set(entry, { wall_rank: newRanks[index], stack_id: stackId }));
  } else {
    // A whole pile moves together; a single win dragged out of an open stack leaves it.
    moving.entries.forEach((entry, index) => set(entry, { wall_rank: newRanks[index], stack_id: moving.entries.length > 1 ? entry.stack_id : null }));
  }

  if (leaving && !(drop.mode === 'stack' && (target.stackId ?? target.entries[0].id) === leaving)) {
    const left = flat.filter((entry) => entry.stack_id === leaving && !movingIds.has(entry.id));
    if (left.length === 1) set(left[0], { stack_id: null });
  }
  return [...changed.values()];
}
