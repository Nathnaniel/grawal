'use client';

import Link from 'next/link';
import { useApp } from '../AppProvider';
import { Avatar } from './Avatar';

/** Logo on the left; search, notifications and the account on the right. */
export function Header() {
  const { panel, open, close } = useApp();
  const toggle = (kind: 'search' | 'notifications' | 'account') => (panel?.kind === kind ? close() : open({ kind }));
  // The dropdowns sit above the wash, as in Figma; the larger panels cover the header.
  const raised = panel && ['search', 'notifications', 'account'].includes(panel.kind);

  return (
    <header className={`sticky top-0 px-5 pt-[var(--dash-top)] pb-[26px] lg:px-6 lg:py-[26px] ${raised ? 'z-[45]' : 'z-30'}`}>
      <div className="relative mx-auto flex h-12 items-center justify-between lg:max-w-[748px]">
        {/* The logo goes to the website on every screen size; the nav's Wall button goes to the wall. */}
        <Link href="/" aria-label="Grawal website">
          <img src="/app/logo.svg" alt="" width={97} height={24} className="logo-light" />
          <img src="/app/logo-dark.svg" alt="" width={97} height={24} className="logo-dark" />
        </Link>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3.5 rounded-[39px] bg-[var(--d-surface)] p-3">
            <button type="button" aria-label="Search your wins" aria-expanded={panel?.kind === 'search'} onClick={() => toggle('search')} className="block size-6">
              <img src="/app/search.svg" alt="" width={24} height={24} className="dash-icon" />
            </button>
            <button type="button" aria-label="Notifications" aria-expanded={panel?.kind === 'notifications'} onClick={() => toggle('notifications')} className="block size-6">
              <img src="/app/bell.svg" alt="" width={24} height={24} className="dash-icon" />
            </button>
          </div>
          <button type="button" aria-label="Account" aria-expanded={panel?.kind === 'account'} onClick={() => toggle('account')} className="rounded-full">
            <Avatar size={48} />
          </button>
        </div>
      </div>
    </header>
  );
}
