'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '../AppProvider';

/** Wall, History and the black create button: a rail on desktop, a bar at the foot on phones. */
export function SideNav() {
  const { basePath, panel, open, close } = useApp();
  const pathname = usePathname();
  const wall = basePath || '/wall';
  const history = `${basePath}/history`;
  const onHistory = pathname.startsWith(history);
  const creating = panel?.kind === 'create';

  const tab = (href: string, active: boolean, icon: string, activeIcon: string, label: string) => (
    <Link href={href} aria-label={label} aria-current={active ? 'page' : undefined} className={`grid size-12 place-items-center rounded-[40px] ${active ? 'bg-[#1568d4]' : ''}`}>
      <img src={active ? activeIcon : icon} alt="" width={24} height={24} className={active ? '' : 'dash-icon'} />
    </Link>
  );

  return (
    <nav
      aria-label="Main"
      // Phones: hidden while the create page fills the screen, which has its own close button.
      className={`fixed bottom-10 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3.5 lg:top-1/2 lg:bottom-auto lg:left-10 lg:w-[65px] lg:translate-x-0 lg:-translate-y-1/2 lg:flex-col ${creating ? 'max-lg:hidden' : ''}`}
    >
      <div className="flex gap-1 rounded-[40px] bg-[var(--d-surface)] p-1.5 dash-lift lg:w-full lg:flex-col lg:items-center">
        {tab(wall, !onHistory, '/app/home.svg', '/app/home-active.svg', 'Wall')}
        {tab(history, onHistory, '/app/history.svg', '/app/history-active.svg', 'History')}
      </div>
      <button
        type="button"
        aria-label={creating ? 'Close' : 'Pin a win'}
        onClick={() => (creating ? close() : open({ kind: 'create' }))}
        className="grid size-11 place-items-center rounded-[40px] bg-[#1a1a1a] dash-lift-add"
      >
        <img src={creating ? '/app/close.svg' : '/app/add.svg'} alt="" width={24} height={24} className={creating ? 'invert' : ''} />
      </button>
    </nav>
  );
}
