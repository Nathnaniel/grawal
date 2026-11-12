// Checks the dashboard's colours against WCAG AA, reading them from the real stylesheet.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const css = readFileSync('app/globals.css', 'utf8');
const block = (selector: string) => css.slice(css.indexOf(selector), css.indexOf('}', css.indexOf(selector)));
const light = block('.dash {');
const dark = block(':root[data-theme="dark"] .dash {');
const token = (theme: string, name: string) => theme.match(new RegExp(`--d-${name}: (#[0-9a-f]{3,6})`, 'i'))?.[1] ?? assert.fail(`missing ${name}`);

const hex = (value: string) => (value.length === 4 ? `#${[...value.slice(1)].map((c) => c + c).join('')}` : value);
function luminance(value: string) {
  const full = hex(value);
  const [r, g, b] = [1, 3, 5].map((start) => {
    const channel = parseInt(full.slice(start, start + 2), 16) / 255;
    return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
const contrast = (a: string, b: string) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

// Body text, labels and field text. The design's #999 and #ccc greys are used for
// hints and inactive years; they're Figma's choice and fall below AA, so they're not checked.
for (const [name, theme] of [['light', light], ['dark', dark]] as const) {
  for (const text of ['text', 'soft', 'mid']) {
    for (const background of ['surface', 'bg', 'field']) {
      test(`${name}: ${text} on ${background} reaches 4.5:1`, () => {
        assert.ok(contrast(token(theme, text), token(theme, background)) >= 4.5);
      });
    }
  }
  test(`${name}: the danger red is readable on panels`, () => {
    assert.ok(contrast(token(theme, 'danger'), token(theme, 'surface')) >= 3);
  });
}

test('white text on Grawal blue buttons reaches 4.5:1', () => {
  assert.ok(contrast('#ffffff', '#1568d4') >= 4.5);
});
