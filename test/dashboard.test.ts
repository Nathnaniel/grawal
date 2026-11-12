import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildNotifications, weekKey } from '../lib/notifications.ts';
import { noteColour, noteText, orderCategories } from '../lib/notes.ts';
import { remember, suggest } from '../lib/search-suggestions.ts';

const summary = (overrides = {}) => ({ year: 2026, yearWins: 3, allWins: 5, lastWinDay: '2026-11-12', onThisDay: [], ...overrides });
const kinds = (items: { kind: string }[]) => items.map((item) => item.kind);

test('a brand-new wall has no notifications', () => {
  assert.deepEqual(buildNotifications({ today: '2026-11-12', weeklyReminder: true, onThisDay: true, summary: summary({ allWins: 0, yearWins: 0, lastWinDay: null }) }), []);
});

test('the weekly prompt shows after a quiet week, only when switched on', () => {
  const quiet = summary({ lastWinDay: '2026-11-04' });
  assert.deepEqual(kinds(buildNotifications({ today: '2026-11-12', weeklyReminder: true, onThisDay: true, summary: quiet })), ['week', 'today', 'begun']);
  assert.deepEqual(kinds(buildNotifications({ today: '2026-11-12', weeklyReminder: false, onThisDay: true, summary: quiet })), ['today', 'begun']);
});

test('a win today removes the daily prompt', () => {
  assert.deepEqual(kinds(buildNotifications({ today: '2026-11-12', weeklyReminder: true, onThisDay: true, summary: summary() })), ['begun']);
});

test('on this day names the win and how long ago, only when switched on', () => {
  const past = summary({ onThisDay: [{ id: 'e1', title: 'Got the job I prayed for', entry_date: '2025-11-12' }, { id: 'e2', title: 'Moved house!', entry_date: '2023-11-12' }] });
  const items = buildNotifications({ today: '2026-11-12', weeklyReminder: false, onThisDay: true, summary: past });
  assert.deepEqual(items.slice(0, 2).map((item) => [item.title, item.body]), [
    ['One year ago today 🙏', 'You pinned: “Got the job I prayed for.” Tap to look back.'],
    ['3 years ago today 🙏', 'You pinned: “Moved house!” Tap to look back.'],
  ]);
  assert.equal(buildNotifications({ today: '2026-11-12', weeklyReminder: false, onThisDay: false, summary: past }).some((item) => item.kind === 'onThisDay'), false);
});

test('the year recap appears in December', () => {
  const december = buildNotifications({ today: '2026-12-03', weeklyReminder: false, onThisDay: true, summary: summary({ lastWinDay: '2026-12-03' }) });
  assert.equal(december[0].title, 'Your 2026 in gratitude is ready');
  assert.equal(buildNotifications({ today: '2026-11-03', weeklyReminder: false, onThisDay: true, summary: summary({ lastWinDay: '2026-11-03' }) }).some((item) => item.kind === 'recap'), false);
});

test('weeks start on Monday, so one prompt id covers a whole week', () => {
  assert.equal(weekKey('2026-11-09'), weekKey('2026-11-15'));
  assert.notEqual(weekKey('2026-11-15'), weekKey('2026-11-16'));
});

test('each win keeps its paper colour, and all four get used', () => {
  assert.equal(noteColour('abc'), noteColour('abc'));
  const used = new Set(Array.from({ length: 40 }, (_, i) => noteColour(`10000000-0000-4000-8000-${String(i).padStart(12, '0')}`)));
  assert.equal(used.size, 4);
});

test('a note shows the category and the story, falling back to the title', () => {
  assert.deepEqual(noteText({ title: 'Job', reflection: 'God came through.' }, 'Work'), { heading: 'Work', story: 'God came through.' });
  assert.deepEqual(noteText({ title: 'Job', reflection: '  ' }, 'Work'), { heading: 'Work', story: 'Job' });
  assert.deepEqual(noteText({ title: 'Job', reflection: null }, undefined), { heading: 'Job', story: '' });
});

test('categories follow the design order, then the person’s own', () => {
  const names = orderCategories([
    { name: 'Mine', user_id: 'u' }, { name: 'Work', user_id: null }, { name: 'Answered Prayer', user_id: null }, { name: 'Personal Growth', user_id: null },
  ]).map((category) => category.name);
  assert.deepEqual(names, ['Answered Prayer', 'Work', 'Personal Growth', 'Mine']);
});

test('search suggests matching categories, then matching wins', () => {
  const found = suggest('fam', [{ id: 'c', name: 'Family' }], [{ id: 'e', title: 'Family dinner', reflection: null }, { id: 'f', title: 'Exam', reflection: 'my family cheered' }]);
  assert.deepEqual(found.map((item) => `${item.kind}:${item.label}`), ['category:Family', 'win:Family dinner', 'win:Exam']);
  assert.deepEqual(suggest('  ', [{ id: 'c', name: 'Family' }], []), []);
});

test('recent searches keep the newest four with no repeats', () => {
  let history = [] as ReturnType<typeof remember>;
  for (const label of ['Family', 'Health', 'family', 'Home', 'Work', 'Studies']) history = remember(history, { kind: 'category', label });
  assert.deepEqual(history.map((item) => item.label), ['Studies', 'Work', 'Home', 'family']);
});
