'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { formatDay } from '@/lib/dates';
import { SITE_NAME } from '@/lib/site';
import { useApp } from './AppProvider';
import { PlusIcon, SearchIcon, SettingsIcon, WallIcon, YearsIcon } from './Icons';

const LINKS = [
  { href: '', label: 'Wall', tile: 'bg-linear-to-b from-[#3f8fe0] to-[#1a5fb4]', Icon: WallIcon },
  { href: '/years', label: 'Years', tile: 'bg-linear-to-b from-[#e8734a] to-[#c2431f]', Icon: YearsIcon },
  { href: '/search', label: 'Search', tile: 'bg-linear-to-b from-[#4c5a6e] to-[#232d3b]', Icon: SearchIcon },
  { href: '/settings', label: 'Settings', tile: 'bg-linear-to-b from-[#8a97a8] to-[#566273]', Icon: SettingsIcon },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const { basePath, openAdd, today } = useApp();
  const pathname = usePathname();
  const home = basePath || '/wall';
  const onWall = pathname === home;

  return (
    <div className="desk">
      <a href="#main" className="btn btn-primary sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50">Skip to content</a>

      <div className="window">
        <header className="menubar">
          <Link href={home} className="flex min-h-9 items-center gap-2 font-bold">
            <span aria-hidden="true" className="size-3 rounded-full bg-marigold" />
            {SITE_NAME}
          </Link>
          <time dateTime={today()} suppressHydrationWarning>{formatDay(today())}</time>
        </header>

        <main id="main" tabIndex={-1} className="min-h-0 flex-1">
          {onWall ? children : <div className="page-sheet glass">{children}</div>}
        </main>

        <nav aria-label="Main" className="dock glass">
          {LINKS.map(({ href, label, tile, Icon }) => {
            const target = href ? `${basePath}${href}` : home;
            const current = href ? pathname.startsWith(target) : onWall;
            return (
              <Link key={label} href={target} aria-current={current ? 'page' : undefined} className="dock-item">
                <span className={`dock-tile ${tile}`}><Icon /></span>
                <span className="dock-label">{label}</span>
              </Link>
            );
          })}
          <span aria-hidden="true" className="mx-1 hidden h-9 w-px bg-field/40 lg:block" />
          <button type="button" onClick={openAdd} className="btn btn-primary min-h-11 rounded-xl px-3 lg:min-h-12 lg:px-4">
            <PlusIcon /> Add a win
          </button>
        </nav>
      </div>
    </div>
  );
}
