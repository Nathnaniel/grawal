import { test } from 'node:test';
import assert from 'node:assert/strict';
import { formatDay, groupByMonth, groupByPeriod, monthName, todayIn, yearOf } from '../lib/dates.ts';

test("today follows the person's timezone, not the server's", () => {
  const now = new Date('2026-01-01T02:30:00Z');
  assert.equal(todayIn('America/New_York', now), '2025-12-31');
  assert.equal(todayIn('Africa/Lagos', now), '2026-01-01');
  assert.equal(todayIn('Pacific/Auckland', new Date('2026-06-30T13:00:00Z')), '2026-07-01');
});

test('an unknown timezone falls back to UTC instead of failing', () => {
  assert.equal(todayIn('Not/AZone', new Date('2026-03-04T10:00:00Z')), '2026-03-04');
});

test('a calendar day never shifts when shown', () => {
  assert.equal(formatDay('2024-02-29'), '29 February 2024');
  assert.equal(formatDay('2026-01-01'), '1 January 2026');
  assert.equal(yearOf('2026-01-01'), 2026);
  assert.equal(monthName(12), 'December');
});

test('months group latest first and keep entry order inside', () => {
  const days = ['2026-11-20', '2026-11-02', '2026-03-09', '2026-03-01'].map((entry_date) => ({ entry_date }));
  const groups = groupByMonth(days);
  assert.deepEqual(groups.map((g) => g.month), [11, 3]);
  assert.deepEqual(groups[0].items.map((i) => i.entry_date), ['2026-11-20', '2026-11-02']);
});

test('history groups by month and year, keeping the same month of different years apart', () => {
  const days = ['2026-11-20', '2026-11-02', '2025-11-09'].map((entry_date) => ({ entry_date }));
  assert.deepEqual(groupByPeriod(days).map((g) => [g.label, g.items.length]), [['November 2026', 2], ['November 2025', 1]]);
});
