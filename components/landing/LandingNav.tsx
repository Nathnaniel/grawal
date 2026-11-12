'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { smoothScroll } from './SmoothScroll';

const LINKS = [
  { href: '#how-it-works', label: 'How it works' },
  { href: '#faq', label: 'FAQs' },
];

// Figma: Grawal / Landing Page / Mobile menu (node 2938:1900). A full-screen white
// page whose grey header bar sits exactly where the closed header's white bar was.
function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    if (open && !element.open) element.showModal();
    if (!open && element.open) element.close();
    // The page behind stays put while the menu covers it.
    const lenis = smoothScroll();
    if (open) lenis?.stop();
    else lenis?.start();
    document.documentElement.style.overflow = open ? 'hidden' : '';
    return () => {
      lenis?.start();
      document.documentElement.style.overflow = '';
    };
  }, [open]);

  // The menu only exists on phones, so close it if the window grows to the desktop layout.
  useEffect(() => {
    if (!open) return;
    const desktop = window.matchMedia('(min-width: 1024px)');
    const close = () => { if (desktop.matches) onClose(); };
    desktop.addEventListener('change', close);
    return () => desktop.removeEventListener('change', close);
  }, [open, onClose]);

  // Close first, then glide there: while the menu is open the page underneath can't scroll.
  function goTo(event: React.MouseEvent<HTMLAnchorElement>, href: string) {
    event.preventDefault();
    onClose();
    document.documentElement.style.overflow = '';
    const lenis = smoothScroll();
    lenis?.start();
    requestAnimationFrame(() => {
      const target = document.querySelector<HTMLElement>(href);
      if (!target) return;
      // Lenis already leaves the section's scroll margin above it.
      if (lenis) lenis.scrollTo(target, { duration: 2.4, easing: (t) => 1 - (1 - t) ** 4 });
      else target.scrollIntoView();
      history.replaceState(null, '', href);
    });
  }

  return (
    <dialog
      ref={dialog}
      id="landing-menu"
      aria-label="Menu"
      data-lenis-prevent
      onClose={onClose}
      className="m-0 h-dvh max-h-none w-full max-w-none bg-white p-0 backdrop:bg-transparent"
    >
      <div className="px-10 pt-[60px]">
        <div className="flex items-center justify-between rounded-xl bg-[#f5f5f5] px-5">
          <Link href="/" onClick={onClose}><img src="/landing/logo.svg" alt="Grawal" width={102} height={24} /></Link>
          <button type="button" className="rounded-[40px] p-3" aria-label="Close menu" onClick={onClose} autoFocus>
            <img src="/landing/icon-close.svg" alt="" width={24} height={24} />
          </button>
        </div>

        <nav aria-label="Main" className="mt-[55px] flex flex-col items-start gap-5">
          {LINKS.map(({ href, label }) => (
            <a key={href} href={href} className="flex h-9 items-center p-2.5 font-avenir text-base leading-4 font-medium text-[#1a1a1a]" onClick={(event) => goTo(event, href)}>
              {label}
            </a>
          ))}
        </nav>

        <Link
          href="/sign-in"
          className="mt-7 inline-flex h-12 items-center justify-center rounded-xl border-t-2 border-r-2 border-[#3788f1] bg-[#1568d4] px-12 font-avenir text-base font-medium text-white shadow-[inset_0_-4px_4px_rgb(179_208_245/0.25)] drop-shadow-[0_4px_4.15px_rgb(204_204_204/0.14)]"
        >
          Sign In
        </Link>
      </div>
    </dialog>
  );
}

export function LandingNav() {
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);

  function close() {
    setOpen(false);
    menuButton.current?.focus();
  }

  return (
    <header className="absolute inset-x-0 top-0 z-20 px-10 pt-[60px] lg:px-6 lg:pt-10">
      {/* Desktop: a white bar 1218px wide, its content inset 242px and 222px as in Figma. */}
      <nav aria-label="Main" className="mx-auto hidden h-12 max-w-[1218px] items-center rounded-xl bg-white pr-[clamp(24px,18vw,222px)] pl-[clamp(24px,19.5vw,242px)] lg:flex">
        <Link href="/" className="shrink-0"><img src="/landing/logo.svg" alt="Grawal" width={102} height={24} /></Link>
        <div className="ml-[58px] flex items-center font-avenir text-base leading-4 font-medium">
          {LINKS.map(({ href, label }) => <a key={href} href={href} className="p-2.5">{label}</a>)}
        </div>
        <Link href="/sign-in" className="ml-auto flex h-12 items-center rounded-[40px] px-10 font-avenir text-base font-medium">Sign in</Link>
      </nav>

      {/* Mobile: logo and a menu button that opens the full-screen menu. */}
      <div className="flex items-center justify-between rounded-xl bg-white px-5 lg:hidden">
        <Link href="/"><img src="/landing/logo.svg" alt="Grawal" width={102} height={24} /></Link>
        <button ref={menuButton} type="button" className="rounded-[40px] p-3" aria-expanded={open} aria-controls="landing-menu" aria-label="Open menu" onClick={() => setOpen(true)}>
          <img src="/landing/icon-menu.svg" alt="" width={24} height={24} />
        </button>
      </div>
      <MobileMenu open={open} onClose={close} />
    </header>
  );
}
