'use client';

import { useApp } from '../AppProvider';

/** The profile photo, or the first letter of the name on Grawal's light blue. */
export function Avatar({ size, ring = 'white', ringWidth = 2, fontSize = 16 }: { size: number; ring?: string; ringWidth?: number; fontSize?: number }) {
  const { profile, avatarUrl, email } = useApp();
  const initial = (profile.name.trim() || email).charAt(0).toUpperCase();
  return (
    <span
      className="relative grid shrink-0 place-items-center overflow-hidden rounded-full bg-[#89cbfa] font-avenir font-extrabold text-white"
      style={{ width: size, height: size, border: `${ringWidth}px solid ${ring}`, fontSize, lineHeight: 1 }}
      aria-hidden="true"
    >
      {avatarUrl ? <img src={avatarUrl} alt="" className="absolute inset-0 size-full object-cover" /> : initial}
    </span>
  );
}
