'use client';

import { useApp, type Theme } from '../AppProvider';

const OPTIONS: { value: Theme; label: string; icon: string }[] = [
  { value: 'dark', label: 'Dark', icon: '/app/moon.svg' },
  { value: 'light', label: 'Light', icon: '/app/sun.svg' },
  { value: 'system', label: 'Match device', icon: '/app/monitor.svg' },
];

/** Dark, light or match the device: the moon, sun and screen from the design. */
export function ThemeSwitch() {
  const { theme, setTheme } = useApp();
  return (
    <div role="radiogroup" aria-label="Appearance" className="flex h-10 items-center gap-0.5 rounded-3xl bg-[var(--d-field)] py-2 pr-1.5 pl-1">
      {OPTIONS.map(({ value, label, icon }) => (
        <button
          key={value}
          type="button"
          role="radio"
          aria-checked={theme === value}
          aria-label={label}
          onClick={() => setTheme(value)}
          className={`grid size-8 place-items-center rounded-3xl ${theme === value ? 'bg-[var(--d-surface)]' : ''}`}
        >
          <img src={icon} alt="" width={20} height={20} className="dash-icon" />
        </button>
      ))}
    </div>
  );
}
