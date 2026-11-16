import { test } from 'node:test';
import assert from 'node:assert/strict';
import { applyDrop, toTiles, type Placed } from '../lib/wall-layout.ts';

const win = (id: string, wall_rank: number | null, stack_id: string | null = null): Placed => ({ id, wall_rank, stack_id });

// Applies the changes and returns the wall's new order of tile keys, as the screen would show it.
function after(entries: Placed[], movingKey: string, drop: Parameters<typeof applyDrop>[2]) {
  const changes = new Map(applyDrop(toTiles(entries), movingKey, drop).map((entry) => [entry.id, entry]));
  const next = entries.map((entry) => changes.get(entry.id) ?? entry).sort((a, b) => (a.wall_rank ?? -Infinity) - (b.wall_rank ?? -Infinity));
  return { order: toTiles(next).map((tile) => tile.key), entries: next, changed: [...changes.keys()] };
}

test('wins sharing a stack become one pile where the top win is', () => {
  const tiles = toTiles([win('a', 1), win('b', 2, 's'), win('c', 3, 's'), win('d', 4)]);
  assert.deepEqual(tiles.map((tile) => tile.key), ['a', 'stack:s', 'd']);
  assert.deepEqual(tiles[1].entries.map((entry) => entry.id), ['b', 'c']);
});

test('an opened stack shows its wins one by one, and a stack of one is just a win', () => {
  assert.deepEqual(toTiles([win('a', 1, 's'), win('b', 2, 's')], new Set(['s'])).map((tile) => tile.key), ['a', 'b']);
  assert.deepEqual(toTiles([win('a', 1, 'gone')]).map((tile) => tile.key), ['a']);
});

test('dragging a win before another moves only that win', () => {
  const result = after([win('a', 1024), win('b', 2048), win('c', 3072)], 'c', { key: 'a', mode: 'before' });
  assert.deepEqual(result.order, ['c', 'a', 'b']);
  assert.deepEqual(result.changed, ['c']);
});

test('dragging a win after the last one puts it at the end', () => {
  assert.deepEqual(after([win('a', 1024), win('b', 2048), win('c', 3072)], 'a', { key: 'c', mode: 'after' }).order, ['b', 'c', 'a']);
});

test('dropping a win on another stacks them where the target was, dropped win on top', () => {
  const result = after([win('a', 1024), win('b', 2048), win('c', 3072)], 'c', { key: 'a', mode: 'stack' });
  assert.deepEqual(result.order, ['stack:a', 'b']);
  assert.deepEqual(toTiles(result.entries)[0].entries.map((entry) => entry.id), ['c', 'a']);
});

test('dropping on a pile adds to it, and a whole pile moves together', () => {
  const start = [win('a', 1024, 's'), win('b', 2048, 's'), win('c', 3072), win('d', 4096)];
  assert.deepEqual(toTiles(after(start, 'd', { key: 'stack:s', mode: 'stack' }).entries)[0].entries.map((entry) => entry.id), ['d', 'a', 'b']);
  assert.deepEqual(after(start, 'stack:s', { key: 'd', mode: 'after' }).order, ['c', 'd', 'stack:s']);
});

test('dragging the second-last win out of an open stack ends the stack', () => {
  const start = [win('a', 1024, 's'), win('b', 2048, 's'), win('c', 3072)];
  const changes = applyDrop(toTiles(start, new Set(['s'])), 'a', { key: 'c', mode: 'after' });
  assert.deepEqual(changes.map((entry) => [entry.id, entry.stack_id]).sort(), [['a', null], ['b', null]]);
});

test('wins just added, without a place yet, get one so the move still lands right', () => {
  const result = after([win('new', null), win('a', 1024), win('b', 2048)], 'b', { key: 'new', mode: 'after' });
  assert.deepEqual(result.order, ['new', 'b', 'a']);
  assert.ok(result.entries.every((entry) => entry.wall_rank !== null));
});
