'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '../AppProvider';

/** The desktop hover label: a dark pill with a small point, beside the rail. It shows
 *  at once, like the design's recording; screen readers use the control's own label. */
function Tip({ text, offset }: { text: string; offset: string }) {
  return (
    <span
      aria-hidden
      style={{ left: `calc(100% + ${offset})` }}
      className="pointer-events-none absolute top-1/2 z-10 hidden -translate-y-1/2 rounded-lg bg-[var(--d-text)] px-2 py-1 font-avenir text-xs leading-4 whitespace-nowrap text-[var(--d-bg)] opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 before:absolute before:top-1/2 before:-left-[3px] before:size-2 before:-translate-y-1/2 before:rotate-45 before:rounded-[2px] before:bg-[var(--d-text)] lg:block"
    >
      {text}
    </span>
  );
}

/** Wall, History and the black create button: a rail on desktop, a bar at the foot on phones. */
export function SideNav() {
  const { basePath, panel, open, close } = useApp();
  const pathname = usePathname();
  const wall = basePath || '/wall';
  const history = `${basePath}/history`;
  const onHistory = pathname.startsWith(history);
  const creating = panel?.kind === 'create';

  const tab = (href: string, active: boolean, icon: string, activeIcon: string, label: string) => (
    <Link
      href={href}
      aria-label={label}
      aria-current={active ? 'page' : undefined}
      // The tab you're not on gets a soft grey circle on hover, easing in.
      className={`group relative grid size-12 place-items-center rounded-[40px] transition-colors duration-[250ms] ${active ? 'bg-[#1568d4]' : 'hover:bg-[var(--d-field)]'}`}
    >
      <img src={active ? activeIcon : icon} alt="" width={24} height={24} className={active ? '' : 'dash-icon'} />
      {/* The tab you're already on shows nothing on hover. */}
      {!active && <Tip text={label} offset="17px" />}
    </Link>
  );

  return (
    <nav
      aria-label="Main"
      // Phones: hidden while the create page fills the screen, which has its own close button.
      className={`fixed bottom-[var(--dash-bottom)] left-[calc(50%+0.5px)] z-50 flex -translate-x-1/2 items-center gap-3.5 lg:top-1/2 lg:bottom-auto lg:left-10 lg:w-[65px] lg:translate-x-0 lg:-translate-y-1/2 lg:flex-col ${creating ? 'max-lg:hidden' : ''}`}
    >
      <div className="flex gap-0 rounded-[40px] lg:gap-1 bg-[var(--d-surface)] p-1.5 dash-lift lg:w-full lg:flex-col lg:items-center">
        {tab(wall, !onHistory, '/app/home.svg', '/app/home-active.svg', 'Wall')}
        {tab(history, onHistory, '/app/history.svg', '/app/history-active.svg', 'History')}
      </div>
      <button
        type="button"
        aria-label={creating ? 'Close' : 'Pin a win'}
        onClick={() => (creating ? close() : open({ kind: 'create' }))}
        className="group relative grid size-11 place-items-center rounded-[40px] bg-[#1a1a1a]"
      >
        <img src={creating ? '/app/close.svg' : '/app/add.svg'} alt="" width={24} height={24} className={creating ? 'invert' : ''} />
        <Tip text={creating ? 'Close' : 'Pin a win'} offset="19px" />
      </button>
    </nav>
  );
}
