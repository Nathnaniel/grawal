import { test } from 'node:test';
import assert from 'node:assert/strict';
import { hasFilters, likePattern, matchesSearch } from '../lib/search.ts';
import { wallOrder } from '../lib/order.ts';

const entry = { title: 'Passed my exams', reflection: 'Stayed Calm', scripture_ref: 'Psalm 23', category_id: 'c1', entry_date: '2025-06-01' };
const none = { q: '', category: '', year: '' };

test('keyword search covers every text field and partial words', () => {
  assert.ok(matchesSearch(entry, { ...none, q: 'exam' }));
  assert.ok(matchesSearch(entry, { ...none, q: ' calm ' }));
  assert.ok(matchesSearch(entry, { ...none, q: 'psalm' }));
  assert.ok(!matchesSearch(entry, { ...none, q: 'job' }));
});

test('filters combine', () => {
  assert.ok(matchesSearch(entry, { q: 'exam', category: 'c1', year: '2025' }));
  assert.ok(!matchesSearch(entry, { ...none, category: 'c2' }));
  assert.ok(!matchesSearch(entry, { ...none, year: '2024' }));
});

test('typed wildcards are searched for literally', () => {
  assert.equal(likePattern(' 100%_Done\\ '), '%100\\%\\_done\\\\%');
});

test('blank filters count as no search', () => {
  assert.ok(!hasFilters({ ...none, q: '   ' }));
  assert.ok(hasFilters({ ...none, year: '2025' }));
});

test('the wall goes by place, with unplaced new wins on top', () => {
  const at = (id: string, wall_rank: number | null, entry_date: string, created_at = '2026-01-01T00:00:00Z') => ({ id, is_pinned: false, wall_rank, entry_date, created_at });
  const sorted = [
    at('third', 2048, '2026-03-01'),
    at('first', -1024, '2020-01-01'),
    at('new', null, '2026-01-01'),
    at('second', 1024, '2024-01-01'),
  ].sort(wallOrder);
  assert.deepEqual(sorted.map((e) => e.id), ['new', 'first', 'second', 'third']);
});
