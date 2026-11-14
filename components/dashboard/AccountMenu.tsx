'use client';

import { useApp } from '../AppProvider';
import { Avatar } from './Avatar';
import { ThemeSwitch } from './ThemeSwitch';

const ROW = 'flex items-center gap-1 py-2 pr-3 font-avenir text-[var(--d-text)]';

/** The dropdown under the avatar: settings, help, mode and log out. */
export function AccountMenu() {
  const { profile, email, demo, open } = useApp();
  const firstName = profile.name.trim().split(/\s+/)[0] || email.split('@')[0];

  return (
    <div
      role="menu"
      aria-label="Account"
      // Figma: 280 by 304, its left edge 197px right of centre on desktop; under the avatar on phones.
      className="panel-in fixed top-[var(--dash-head)] right-5 z-50 w-[280px] rounded-[20px] bg-[var(--d-surface)] px-5 pt-6 pb-5 dash-pop lg:top-[94px] lg:right-auto lg:left-[calc(50%+197px)]"
    >
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-1 py-1 pr-3">
            <Avatar size={32} ring="#1568d4" ringWidth={0} fontSize={13} />
            <span className="font-avenir text-base font-medium text-[var(--d-text)]">{firstName}</span>
          </div>
          <hr className="border-0 border-t-[0.5px] border-[var(--d-line)]" />
        </div>
        <button type="button" role="menuitem" onClick={() => open({ kind: 'settings' })} className={`${ROW} text-sm leading-4 font-medium`}>
          <img src="/app/settings.svg" alt="" width={20} height={20} className="dash-icon" /> Settings
        </button>
        <a role="menuitem" href="/#faq" target={demo ? '_top' : undefined} className={`${ROW} text-base leading-[18px]`}>
          <img src="/app/help.svg" alt="" width={20} height={20} className="dash-icon" /> Help center
        </a>
        <div className="flex flex-col gap-2">
          <hr className="border-0 border-t-[0.5px] border-[var(--d-line)]" />
          <div className="flex items-center justify-between">
            <span className="font-avenir text-base leading-[18px] text-[var(--d-text)]">Mode</span>
            <ThemeSwitch />
          </div>
          <hr className="border-0 border-t-[0.5px] border-[var(--d-line)]" />
          {demo ? (
            <a role="menuitem" href="/sign-in" target="_top" className={`${ROW} pr-2 text-base leading-[18px] font-medium text-[#1568d4]`}>
              Create your wall
            </a>
          ) : (
            <form action="/auth/sign-out" method="post">
              <button type="submit" role="menuitem" className={`${ROW} pr-2 text-base leading-[18px]`}>
                <img src="/app/logout.svg" alt="" width={20} height={20} className="dash-icon" /> Log out
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
