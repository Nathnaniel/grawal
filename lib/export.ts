// Turns someone's wins into a file they can keep: a CSV for spreadsheets, or a PDF to read and print.
import type { Category, Entry } from './types';

export type ExportRow = { date: string; title: string; reflection: string; scripture: string; category: string; onWall: boolean };

/** The wins as plain rows, newest first, with category names in place of ids. */
export function exportRows(entries: Entry[], categories: Category[]): ExportRow[] {
  const names = new Map(categories.map((category) => [category.id, category.name]));
  return [...entries]
    .sort((a, b) => b.entry_date.localeCompare(a.entry_date) || b.created_at.localeCompare(a.created_at))
    .map((entry) => ({
      date: entry.entry_date,
      title: entry.title,
      reflection: entry.reflection ?? '',
      scripture: entry.scripture_ref ?? '',
      category: (entry.category_id && names.get(entry.category_id)) || '',
      onWall: entry.on_wall !== false,
    }));
}

// A cell starting with one of these runs as a formula in spreadsheet apps; a leading quote keeps it text.
const FORMULA_START = /^[=+\-@\t\r]/;

function csvCell(value: string): string {
  const safe = FORMULA_START.test(value) ? `'${value}` : value;
  return /[",\n\r]/.test(safe) ? `"${safe.replace(/"/g, '""')}"` : safe;
}

export function toCsv(rows: ExportRow[]): string {
  const lines = [['Date', 'Win', 'Reflection', 'Scripture', 'Category', 'On wall']];
  for (const row of rows) lines.push([row.date, row.title, row.reflection, row.scripture, row.category, row.onWall ? 'Yes' : 'No']);
  // The byte-order mark tells Excel the file is UTF-8, so accents and emoji survive.
  return '﻿' + lines.map((line) => line.map(csvCell).join(',')).join('\r\n') + '\r\n';
}

/** "2026-11-16" as "16 November 2026", without the time zone shifting the day. */
export function longDate(day: string): string {
  const [year, month, date] = day.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, date)).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
}

/** A printable A4 keepsake: a title page heading, then each win with its date, category, scripture and reflection. */
export async function toPdf(rows: ExportRow[], owner: string): Promise<Blob> {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const page = { width: doc.internal.pageSize.getWidth(), height: doc.internal.pageSize.getHeight() };
  const margin = 56;
  const width = page.width - margin * 2;
  let y = margin;

  const room = (needed: number) => {
    if (y + needed <= page.height - margin) return;
    doc.addPage();
    y = margin;
  };
  const write = (text: string, size: number, style: 'normal' | 'bold' | 'italic', colour: number, gap: number) => {
    doc.setFont('helvetica', style).setFontSize(size).setTextColor(colour);
    const lineHeight = size * 1.35;
    for (const line of doc.splitTextToSize(text, width) as string[]) {
      room(lineHeight);
      doc.text(line, margin, y + size);
      y += lineHeight;
    }
    y += gap;
  };

  write(owner ? `${owner}'s wins` : 'My wins', 24, 'bold', 26, 4);
  write(`${rows.length} ${rows.length === 1 ? 'win' : 'wins'} from Grawal, exported ${longDate(new Date().toISOString().slice(0, 10))}`, 11, 'normal', 102, 20);

  for (const row of rows) {
    room(70);
    doc.setDrawColor(234).setLineWidth(1).line(margin, y, page.width - margin, y);
    y += 16;
    write([longDate(row.date), row.category].filter(Boolean).join('  ·  '), 9, 'normal', 102, 4);
    write(row.title, 14, 'bold', 26, 4);
    if (row.scripture) write(row.scripture, 10, 'italic', 21, 4);
    if (row.reflection) write(row.reflection, 11, 'normal', 51, 4);
    y += 12;
  }
  return doc.output('blob');
}

/** Hands the browser a file to save. */
export function download(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = Object.assign(document.createElement('a'), { href: url, download: filename });
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
