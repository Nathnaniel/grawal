import { test } from 'node:test';
import assert from 'node:assert/strict';
import { exportRows, longDate, toCsv } from '../lib/export.ts';
import type { Entry } from '../lib/types.ts';

const win = (patch: Partial<Entry>): Entry => ({
  id: crypto.randomUUID(), title: 'A win', reflection: null, category_id: null, scripture_ref: null, photo_path: null,
  is_pinned: false, on_wall: true, wall_rank: null, stack_id: null, entry_date: '2026-01-01',
  created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z', ...patch,
});

test('rows come newest first, with category names, including wins taken off the wall', () => {
  const rows = exportRows(
    [win({ title: 'Old', entry_date: '2025-03-02' }), win({ title: 'New', entry_date: '2026-05-01', category_id: 'c1', on_wall: false })],
    [{ id: 'c1', user_id: null, name: 'Family', colour: '#fff' }],
  );
  assert.deepEqual(rows.map((row) => [row.title, row.category, row.onWall]), [['New', 'Family', false], ['Old', '', true]]);
});

test('the CSV has a header, quotes commas, quotes and line breaks, and stays UTF-8 for Excel', () => {
  const csv = toCsv(exportRows([win({ title: 'Said "yes", finally', reflection: 'Line one\nLine two', scripture_ref: 'Psalm 23' })], []));
  assert.ok(csv.startsWith('﻿Date,Win,Reflection,Scripture,Category,On wall\r\n'));
  assert.ok(csv.includes('2026-01-01,"Said ""yes"", finally","Line one\nLine two",Psalm 23,,Yes\r\n'));
});

test('text that a spreadsheet would run as a formula is kept as text', () => {
  const csv = toCsv(exportRows([win({ title: '=HYPERLINK("x")' }), win({ title: '+1 answered', entry_date: '2025-01-01' })], []));
  assert.ok(csv.includes(`"'=HYPERLINK(""x"")"`));
  assert.ok(csv.includes(",'+1 answered,"));
});

test('dates read as people write them, without shifting a day', () => {
  assert.equal(longDate('2026-11-16'), '16 November 2026');
});
