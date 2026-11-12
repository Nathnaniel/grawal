// The notifications panel, worked out from each person's own wins. Nothing is
// stored: an item appears while it applies, and read ones are remembered on the device.

export type NotificationKind = 'week' | 'onThisDay' | 'recap' | 'today' | 'begun';

export interface NotificationItem {
  id: string;
  kind: NotificationKind;
  title: string;
  body: string;
  entryId?: string;
  year?: number;
}

interface Inputs {
  today: string;
  weeklyReminder: boolean;
  onThisDay: boolean;
  summary: {
    year: number;
    yearWins: number;
    allWins: number;
    lastWinDay: string | null;
    onThisDay: { id: string; title: string; entry_date: string }[];
  };
}

const dayNumber = (day: string) => Date.UTC(+day.slice(0, 4), +day.slice(5, 7) - 1, +day.slice(8, 10)) / 86_400_000;

/** Monday-based week key, so the weekly prompt has one id per week. */
export function weekKey(day: string): string {
  const n = dayNumber(day);
  const weekday = (new Date(n * 86_400_000).getUTCDay() + 6) % 7;
  return String(n - weekday);
}

const sentence = (text: string) => (/[.!?…]$/.test(text.trim()) ? text.trim() : `${text.trim()}.`);

export function buildNotifications({ today, weeklyReminder, onThisDay, summary }: Inputs): NotificationItem[] {
  const items: NotificationItem[] = [];
  const quietDays = summary.lastWinDay ? dayNumber(today) - dayNumber(summary.lastWinDay) : Infinity;

  // A new wall stays quiet until its first win; Figma shows an empty panel for that.
  if (weeklyReminder && summary.allWins > 0 && quietDays >= 7) {
    items.push({
      id: `week-${weekKey(today)}`,
      kind: 'week',
      title: 'What has God done this week?',
      body: 'Take 10 seconds to pin a win before the week ends.',
    });
  }

  if (onThisDay) {
    for (const entry of summary.onThisDay) {
      const years = +today.slice(0, 4) - +entry.entry_date.slice(0, 4);
      items.push({
        id: `on-this-day-${entry.id}-${today}`,
        kind: 'onThisDay',
        title: `${years === 1 ? 'One year' : `${years} years`} ago today 🙏`,
        body: `You pinned: “${sentence(entry.title)}” Tap to look back.`,
        entryId: entry.id,
      });
    }
  }

  // The year's recap opens in December, once there's a win in it.
  if (today.slice(5, 7) === '12' && summary.yearWins > 0) {
    items.push({
      id: `recap-${summary.year}`,
      kind: 'recap',
      title: `Your ${summary.year} in gratitude is ready`,
      body: 'See every win, answered prayer and moment from this year.',
      year: summary.year,
    });
  }

  if (summary.allWins > 0 && summary.lastWinDay !== today) {
    items.push({
      id: `today-${today}`,
      kind: 'today',
      title: 'Count today’s blessings',
      body: 'Big or small, what are you grateful for today?',
    });
  }

  if (summary.allWins > 0) {
    items.push({
      id: 'begun',
      kind: 'begun',
      title: 'Your wall has begun ✨',
      body: 'Every testimony starts with one moment. Come back whenever God shows up again.',
    });
  }

  return items;
}
