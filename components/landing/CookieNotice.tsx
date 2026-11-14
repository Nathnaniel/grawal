'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

const SEEN = 'grawal-cookie-notice';

/**
 * Tells visitors what Grawal stores. It only sets the cookies that keep people signed in,
 * which need no consent, so this is a notice with "Got it" rather than a choice. If
 * analytics or anything that tracks people is ever added, this has to become a real
 * Accept / Decline, with that tracking off until someone accepts.
 */
export function CookieNotice() {
  const [open, setOpen] = useState(false);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    let seen = false;
    try { seen = localStorage.getItem(SEEN) === '1'; } catch { /* blocked storage: show it for this visit */ }
    if (seen) return;
    // A moment after the page settles, so it doesn't compete with the first impression.
    const timer = window.setTimeout(() => setOpen(true), 1200);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!open) return;
    const frame = requestAnimationFrame(() => setShown(true));
    return () => cancelAnimationFrame(frame);
  }, [open]);

  function close() {
    try { localStorage.setItem(SEEN, '1'); } catch { /* it just shows again next visit */ }
    setShown(false);
    window.setTimeout(() => setOpen(false), 400);
  }

  if (!open) return null;

  return (
    <div
      role="region"
      aria-label="Cookies"
      className={`cookie-notice fixed inset-x-4 bottom-[max(16px,env(safe-area-inset-bottom))] z-30 mx-auto flex max-w-[560px] items-center justify-between gap-4 rounded-2xl sm:gap-6 border border-[#ebebeb] bg-white py-3 pr-3 pl-5 shadow-[0_12px_32px_rgba(26,26,26,0.12)] ${shown ? 'is-shown' : ''}`}
    >
      <p className="font-avenir text-[15px] leading-5 text-[#333]">
        Grawal only uses cookies to keep you signed in.{' '}
        <Link href="/privacy#on-your-device" className="whitespace-nowrap text-[#1a1a1a] underline decoration-[#b3b3b3] underline-offset-[3px] hover:decoration-[#1a1a1a]">Privacy policy</Link>
      </p>
      <button type="button" onClick={close} className="ml-auto h-10 shrink-0 rounded-xl bg-[#1568d4] px-5 font-avenir text-[15px] font-medium text-white transition-colors duration-200 hover:bg-[#1259b8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1568d4]">
        Got it
      </button>
    </div>
  );
}
