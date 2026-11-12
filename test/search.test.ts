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

test('pinned entries come first, then newest first', () => {
  const at = (id: string, is_pinned: boolean, entry_date: string, created_at = '2026-01-01T00:00:00Z') => ({ id, is_pinned, entry_date, created_at });
  const sorted = [
    at('old', false, '2024-01-01'),
    at('pinned-old', true, '2020-01-01'),
    at('new-early', false, '2026-01-01', '2026-01-01T08:00:00Z'),
    at('new-late', false, '2026-01-01', '2026-01-01T09:00:00Z'),
  ].sort(wallOrder);
  assert.deepEqual(sorted.map((e) => e.id), ['pinned-old', 'new-late', 'new-early', 'old']);
});
