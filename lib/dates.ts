// entry_date is a calendar day, not a moment. Everything here treats it as a
// plain YYYY-MM-DD string, so a win never slides to another day across timezones.

/** Today's calendar day for someone in the given timezone. */
export function todayIn(timezone: string, now = new Date()): string {
  try {
    return new Intl.DateTimeFormat('en-CA', { timeZone: timezone, year: 'numeric', month: '2-digit', day: '2-digit' }).format(now);
  } catch {
    return now.toISOString().slice(0, 10);
  }
}

const asUtc = (day: string) => new Date(`${day}T00:00:00Z`);

export function formatDay(day: string): string {
  return new Intl.DateTimeFormat('en-GB', { timeZone: 'UTC', day: 'numeric', month: 'long', year: 'numeric' }).format(asUtc(day));
}

export function monthName(month: number): string {
  return new Intl.DateTimeFormat('en-GB', { timeZone: 'UTC', month: 'long' }).format(new Date(Date.UTC(2000, month - 1, 1)));
}

export const yearOf = (day: string) => Number(day.slice(0, 4));
export const monthOf = (day: string) => Number(day.slice(5, 7));

export interface MonthGroup<T> { month: number; items: T[] }

/** Groups by month, latest month first. Items keep the order they came in. */
export function groupByMonth<T extends { entry_date: string }>(items: T[]): MonthGroup<T>[] {
  const months = new Map<number, T[]>();
  for (const item of items) {
    const month = monthOf(item.entry_date);
    months.set(month, [...(months.get(month) ?? []), item]);
  }
  return [...months.entries()].sort(([a], [b]) => b - a).map(([month, grouped]) => ({ month, items: grouped }));
}

export interface PeriodGroup<T> { period: string; label: string; items: T[] }

/** Groups items already in date order under "November 2026" style headings. */
export function groupByPeriod<T extends { entry_date: string }>(items: T[]): PeriodGroup<T>[] {
  const groups: PeriodGroup<T>[] = [];
  for (const item of items) {
    const period = item.entry_date.slice(0, 7);
    const current = groups.at(-1);
    if (current?.period === period) current.items.push(item);
    else groups.push({ period, label: `${monthName(monthOf(item.entry_date))} ${yearOf(item.entry_date)}`, items: [item] });
  }
  return groups;
}
