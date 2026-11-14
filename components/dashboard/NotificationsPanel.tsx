'use client';

import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { buildNotifications, type NotificationItem, type NotificationKind } from '@/lib/notifications';
import { useApp } from '../AppProvider';

const ICONS: Record<NotificationKind, string> = {
  week: '/app/n-bell.svg',
  onThisDay: '/app/n-history.svg',
  recap: '/app/n-calendar.svg',
  today: '/app/n-sun.svg',
  begun: '/app/n-pin.svg',
};

/** Reminders and memories, worked out from the wall. Read ones are remembered on the device. */
export function NotificationsPanel() {
  const router = useRouter();
  const { summary, profile, basePath, today, open, close, remembered, remember } = useApp();
  const [read, setRead] = useState<string[]>(() => remembered<string[]>('read', []));
  const [expanded, setExpanded] = useState(false);
  const items = useMemo(() => buildNotifications({
    today: today(),
    weeklyReminder: profile.reminder_frequency === 'weekly',
    onThisDay: profile.notify_on_this_day,
    summary,
  }), [summary, profile, today]);

  function markRead(ids: string[]) {
    const next = [...new Set([...read, ...ids])].slice(-200);
    setRead(next);
    remember('read', next);
  }

  function choose(item: NotificationItem) {
    markRead([item.id]);
    if (item.kind === 'week' || item.kind === 'today') return open({ kind: 'create' });
    if (item.kind === 'onThisDay') {
      const entry = summary.onThisDay.find((win) => win.id === item.entryId);
      return entry ? open({ kind: 'note', entry }) : close();
    }
    if (item.kind === 'recap') {
      close();
      return router.push(`${basePath}/history?year=${item.year}`);
    }
    close();
  }

  const frame = 'panel-in fixed top-[var(--dash-head)] left-1/2 z-50 w-[calc(100vw-40px)] -translate-x-1/2 overflow-hidden rounded-xl bg-[var(--d-surface)] dash-pop lg:top-[94px] lg:w-[400px]';
  const title = <h2 className="absolute top-3 left-3 px-3 py-1 font-avenir text-base leading-[14px] font-medium tracking-[-0.048px] text-[var(--d-text)]">Notifications</h2>;
  const expand = (
    <button type="button" aria-label={expanded ? 'Show fewer' : 'Show all'} aria-pressed={expanded} onClick={() => setExpanded(!expanded)} className="absolute top-3 right-3 flex h-5 items-center rounded-md border-[0.5px] border-[rgb(204_204_204/0.5)] px-1">
      <img src="/app/expand.svg" alt="" width={12} height={12} className="dash-icon" />
    </button>
  );

  if (!items.length) {
    return (
      <section aria-label="Notifications" className={`${frame} h-[380px]`}>
        {title}
        {expand}
        <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
          <span className="grid size-10 place-items-center rounded-xl bg-[var(--d-field)]"><img src="/app/bell-empty.svg" alt="" width={20} height={20} className="dash-icon" /></span>
          <p className="font-avenir text-sm leading-4 text-[var(--d-text)]">All quiet for now.</p>
          <p className="w-[236px] font-avenir text-xs leading-[14px] text-[var(--d-muted)]">Reminders and memories from your wall will show up here.</p>
        </div>
      </section>
    );
  }

  const shown = expanded ? items : items.slice(0, 5);
  return (
    <section aria-label="Notifications" className={`${frame} ${expanded ? 'max-h-[calc(100dvh-var(--dash-head)-var(--dash-bottom))] lg:max-h-[calc(100dvh-140px)] overflow-y-auto' : ''} pb-12`}>
      {title}
      {expand}
      <div className="mx-auto mt-[52px] flex w-[calc(100%-44px)] flex-col items-end gap-5">
        <button type="button" onClick={() => markRead(items.map((item) => item.id))} className="px-2 py-1 font-avenir text-xs leading-[14px] font-medium tracking-[-0.036px] text-[var(--d-text)]">Mark all as read</button>
        <ul className="flex w-full flex-col gap-5">
          {shown.map((item) => {
            const unread = !read.includes(item.id);
            return (
              <li key={item.id}>
                <button type="button" onClick={() => choose(item)} className={`flex w-full items-start gap-3 rounded-xl p-2 text-left ${unread ? 'bg-[var(--d-field)]' : ''}`}>
                  <span className={`grid size-10 shrink-0 place-items-center rounded-3xl ${unread ? 'bg-[var(--d-icon-bg)]' : 'bg-[var(--d-field)]'}`}>
                    <img src={ICONS[item.kind]} alt="" width={16} height={16} className="dash-icon" />
                  </span>
                  <span className="flex flex-col gap-2">
                    <span className="font-avenir text-sm leading-4 text-[var(--d-text)]">{item.title}{unread && <span className="sr-only"> (unread)</span>}</span>
                    <span className="font-avenir text-xs leading-[14px] text-[var(--d-muted)]">{item.body}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
      {!expanded && items.length > 5 && (
        <button type="button" onClick={() => setExpanded(true)} className="absolute bottom-3 left-1/2 -translate-x-1/2 px-2 py-1 font-avenir text-xs leading-[14px] font-medium text-[var(--d-text)]">View all</button>
      )}
    </section>
  );
}
