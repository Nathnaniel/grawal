'use client';

import type { CSSProperties } from 'react';
import type { KubaiIconComponent } from 'kubai-icons-react';
import ArrowDown from 'kubai-icons-react/icons/arrow-down';
import ArrowDownLeft from 'kubai-icons-react/icons/arrow-down-left';
import ArrowUp from 'kubai-icons-react/icons/arrow-up';
import Bell from 'kubai-icons-react/icons/bell';
import CalendarDays from 'kubai-icons-react/icons/calendar-days';
import Circle from 'kubai-icons-react/icons/circle';
import CircleCheck from 'kubai-icons-react/icons/circle-check';
import CircleHelp from 'kubai-icons-react/icons/circle-help';
import CirclePlus from 'kubai-icons-react/icons/circle-plus';
import CircleX from 'kubai-icons-react/icons/circle-x';
import Command from 'kubai-icons-react/icons/command';
import Expand from 'kubai-icons-react/icons/expand';
import HandHeart from 'kubai-icons-react/icons/hand-heart';
import History from 'kubai-icons-react/icons/history';
import Home from 'kubai-icons-react/icons/home';
import LogOut from 'kubai-icons-react/icons/log-out';
import Menu from 'kubai-icons-react/icons/menu';
import Monitor from 'kubai-icons-react/icons/monitor';
import Moon from 'kubai-icons-react/icons/moon';
import Pin from 'kubai-icons-react/icons/pin';
import Search from 'kubai-icons-react/icons/search';
import Settings from 'kubai-icons-react/icons/settings';
import StickyNote from 'kubai-icons-react/icons/sticky-note';
import Sun from 'kubai-icons-react/icons/sun';
import Trash from 'kubai-icons-react/icons/trash';

// Kubai icons, animated on hover. Each entry keeps the colour of the static file at the same path
// in public/, so a src can move between <img> and <Icon> without changing the look.
// `marks` colours the icon's inner details; white icons on a coloured button need the button's colour there.
type Spec = [KubaiIconComponent, string, string?];
const ICONS: Record<string, Spec> = {
  '/app/add.svg': [CirclePlus, '#FFFFFF', '#1A1A1A'],
  '/app/arrow-down.svg': [ArrowDown, '#999999'],
  '/app/arrow-up.svg': [ArrowUp, '#999999'],
  '/app/bell.svg': [Bell, '#666666'],
  '/app/bell-empty.svg': [Bell, '#CCCCCC'],
  '/app/close.svg': [CircleX, '#1A1A1A'],
  '/app/command.svg': [Command, '#999999'],
  '/app/delete.svg': [Trash, '#F0322A'],
  '/app/enter.svg': [ArrowDownLeft, '#999999'],
  '/app/expand.svg': [Expand, '#999999'],
  '/app/help.svg': [CircleHelp, '#1A1A1A'],
  '/app/history.svg': [History, '#999999'],
  '/app/history-active.svg': [History, '#FFFFFF', '#1568D4'],
  '/app/home.svg': [Home, '#999999'],
  '/app/home-active.svg': [Home, '#FFFFFF', '#1568D4'],
  '/app/logout.svg': [LogOut, '#1A1A1A'],
  '/app/logout-red.svg': [LogOut, '#F0322A'],
  '/app/monitor.svg': [Monitor, '#666666'],
  '/app/moon.svg': [Moon, '#1A1A1A'],
  '/app/sun.svg': [Sun, '#666666'],
  '/app/n-bell.svg': [Bell, '#666666'],
  '/app/n-calendar.svg': [CalendarDays, '#666666'],
  '/app/n-history.svg': [History, '#666666'],
  '/app/n-pin.svg': [Pin, '#666666'],
  '/app/n-sun.svg': [Sun, '#666666'],
  '/app/radio-off.svg': [Circle, '#CCCCCC'],
  '/app/radio-on.svg': [CircleCheck, '#1568D4'],
  '/app/search.svg': [Search, '#666666'],
  '/app/search-sm.svg': [Search, '#999999'],
  '/app/search-empty.svg': [Search, '#CCCCCC'],
  '/app/settings.svg': [Settings, '#1A1A1A'],
  '/app/pin-white.svg': [Pin, '#FFFFFF', '#1568D4'],
  '/landing/arrow-down-left.svg': [ArrowDownLeft, '#1A1A1A'],
  '/landing/icon-close.svg': [CircleX, '#1A1A1A'],
  '/landing/icon-menu.svg': [Menu, '#1A1A1A'],
  '/landing/pin.svg': [Pin, '#FFFFFF', '#1A1A1A'],
  '/landing/step-note.svg': [StickyNote, '#1A1A1A'],
  '/landing/step-pin.svg': [Pin, '#141B34'],
  '/landing/step-pray.svg': [HandHeart, '#141B34'],
};

/** `still` turns the hover motion off, for icons whose hover shape would mean something else. */
export function Icon({ src, size = 24, className, style, still = false }: { src: string; size?: number; className?: string; style?: CSSProperties; still?: boolean }) {
  const spec = ICONS[src];
  // Anything not in the list (illustrations, logos) stays a plain image.
  if (!spec) return <img src={src} alt="" width={size} height={size} className={className} style={style} />;
  const [Glyph, color, marks] = spec;
  return (
    <Glyph
      size={size}
      color={color}
      trigger={still ? 'none' : 'parent'}
      className={className}
      style={marks ? { ...style, ['--ki-w' as string]: marks } : style}
    />
  );
}
