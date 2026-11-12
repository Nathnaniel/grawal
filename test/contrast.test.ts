// Checks the design tokens against WCAG AA, reading them from the real stylesheet.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { sampleCategories } from '../lib/sample.ts';

const css = readFileSync('app/globals.css', 'utf8');
const token = (name: string) => css.match(new RegExp(`--color-${name}: (#[0-9a-f]{6})`))?.[1] ?? assert.fail(`missing ${name}`);

function luminance(hex: string) {
  const [r, g, b] = [1, 3, 5].map((start) => {
    const channel = parseInt(hex.slice(start, start + 2), 16) / 255;
    return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: string, b: string) {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (light + 0.05) / (dark + 0.05);
}

function mix(top: string, bottom: string, topShare: number) {
  const channel = (start: number) => Math.round(parseInt(top.slice(start, start + 2), 16) * topShare + parseInt(bottom.slice(start, start + 2), 16) * (1 - topShare));
  return `#${[1, 3, 5].map((start) => channel(start).toString(16).padStart(2, '0')).join('')}`;
}

// Frosted panels are 88% opaque, so the darkest thing behind them is the worst case.
const glass = () => mix(token('panel'), token('deep'), 0.88);
const backgrounds: Record<string, () => string> = { glass, note: () => token('note') };

for (const text of ['ink', 'soft', 'deep', 'error']) {
  for (const [name, background] of Object.entries(backgrounds)) {
    test(`${text} text on ${name} reaches 4.5:1`, () => {
      assert.ok(contrast(token(text), background()) >= 4.5);
    });
  }
}

test('white text reaches 4.5:1 on the window behind the heading', () => {
  assert.ok(contrast('#ffffff', token('deep')) >= 4.5);
  assert.ok(contrast('#ffffff', token('mid')) >= 4.5);
});

test('keepsake labels stay readable over the lightest part of the window', () => {
  assert.ok(contrast('#ffffff', mix(token('deep-dark'), '#8dbde9', 0.72)) >= 4.5);
});

test('white text on deep and error buttons reaches 4.5:1', () => {
  assert.ok(contrast('#ffffff', token('deep')) >= 4.5);
  assert.ok(contrast('#ffffff', token('error')) >= 4.5);
});

test('field borders reach 3:1 against glass and the note', () => {
  assert.ok(contrast(token('field'), token('note')) >= 3);
  assert.ok(contrast(token('field'), glass()) >= 3);
});

test('category colours reach 3:1 on a note', () => {
  for (const { name, colour } of sampleCategories) {
    assert.ok(contrast(colour, token('note')) >= 3, name);
  }
});

test('soft text stays readable on the most strongly tinted note', () => {
  for (const { name, colour } of sampleCategories) {
    // Mixes 7% of the category colour into the note, as .note does.
    const mix = (start: number) => Math.round(parseInt(colour.slice(start, start + 2), 16) * 0.07 + parseInt(token('note').slice(start, start + 2), 16) * 0.93);
    const tinted = `#${[1, 3, 5].map((start) => mix(start).toString(16).padStart(2, '0')).join('')}`;
    assert.ok(contrast(token('soft'), tinted) >= 4.5, name);
  }
});
