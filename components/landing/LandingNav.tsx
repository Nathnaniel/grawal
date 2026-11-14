'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { createClient } from '@/lib/supabase/browser';
import { smoothScroll } from './SmoothScroll';

// Signed-in visitors see Dashboard where everyone else sees Sign in. The page stays
// static, so this is read from the saved session in the browser after it loads.
function useAccountLink() {
  const [signedIn, setSignedIn] = useState(false);
  useEffect(() => {
    if (!isSupabaseConfigured) return;
    let live = true;
    createClient().auth.getSession().then(({ data }) => { if (live) setSignedIn(Boolean(data.session)); });
    return () => { live = false; };
  }, []);
  return signedIn ? { href: '/wall', label: 'Dashboard' } : { href: '/sign-in', label: 'Sign in' };
}

const LINKS = [
  { href: '#how-it-works', label: 'How it works' },
  { href: '#faq', label: 'FAQs' },
];

// Figma: Grawal / Landing Page / Mobile menu (node 2938:1900). A full-screen white
// page whose grey header bar sits exactly where the closed header's white bar was.
function MobileMenu({ open, onClose, account }: { open: boolean; onClose: () => void; account: { href: string; label: string } }) {
  const dialog = useRef<HTMLDialogElement>(null);
  // Closing hands focus back to the menu button. Keyboard users need that, but after
  // a tap it would leave the button outlined, so it's only kept for the keyboard.
  const byKeyboard = useRef(false);

  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    if (open && !element.open) {
      element.showModal();
      // Focus goes to the menu itself, so the close button isn't outlined the moment it opens.
      element.focus();
    }
    if (!open && element.open) {
      element.close();
      if (!byKeyboard.current) (document.activeElement as HTMLElement | null)?.blur();
    }
    if (!open) byKeyboard.current = false;
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
      tabIndex={-1}
      data-lenis-prevent
      onCancel={() => { byKeyboard.current = true; }}
      onClose={onClose}
      className="landing-menu m-0 h-dvh max-h-none w-full max-w-none bg-white p-0 backdrop:bg-transparent"
    >
      <div className="px-5 pt-[60px]">
        <div className="mx-auto flex max-w-[353px] items-center justify-between rounded-xl bg-[#f5f5f5] px-5">
          <Link href="/" onClick={onClose}><img src="/landing/logo.svg" alt="Grawal" width={102} height={24} /></Link>
          <button type="button" className="rounded-[40px] p-3" aria-label="Close menu" onClick={(event) => { byKeyboard.current = event.detail === 0; onClose(); }}>
            <img src="/landing/icon-close.svg" alt="" width={24} height={24} />
          </button>
        </div>

        <nav aria-label="Main" className="mt-[55px] flex flex-col items-start gap-5 px-5">
          {LINKS.map(({ href, label }, index) => (
            <a key={href} href={href} style={{ '--i': index } as React.CSSProperties} className="menu-item flex h-9 items-center p-2.5 font-avenir text-base leading-4 font-medium text-[#1a1a1a]" onClick={(event) => goTo(event, href)}>
              {label}
            </a>
          ))}
        </nav>

        <Link
          href={account.href}
          onClick={onClose}
          style={{ '--i': LINKS.length } as React.CSSProperties}
          className="menu-item mt-7 ml-5 inline-flex h-12 items-center justify-center rounded-xl border-t-2 border-r-2 border-[#3788f1] bg-[#1568d4] px-12 font-avenir text-base font-medium text-white"
        >
          {account.label === 'Sign in' ? 'Sign In' : account.label}
        </Link>
      </div>
    </dialog>
  );
}

export function LandingNav() {
  const [open, setOpen] = useState(false);
  const account = useAccountLink();

  // The menu itself returns focus to the button when that helps; see MobileMenu.
  const close = () => setOpen(false);

  return (
    <header className="absolute inset-x-0 top-0 z-20 px-5 pt-[60px] lg:px-6 lg:pt-10">
      {/* Desktop: a white bar 1218px wide, its content inset 242px and 222px as in Figma. */}
      <nav aria-label="Main" className="mx-auto hidden h-12 max-w-[1218px] items-center rounded-xl bg-white pr-[clamp(24px,18vw,222px)] pl-[clamp(24px,19.5vw,242px)] lg:flex">
        <Link href="/" className="shrink-0"><img src="/landing/logo.svg" alt="Grawal" width={102} height={24} /></Link>
        <div className="ml-[58px] flex items-center font-avenir text-base leading-4 font-medium">
          {LINKS.map(({ href, label }) => <a key={href} href={href} className="p-2.5">{label}</a>)}
        </div>
        {/* A 40px button with 12px corners inside the 48px bar, grey on hover. The extra right margin keeps the
            text exactly where Figma puts it now the padding is smaller. */}
        <Link href={account.href} className="mr-4 ml-auto flex h-10 items-center rounded-xl px-6 font-avenir text-base font-medium transition-colors duration-200 hover:bg-[#f5f5f5]">{account.label}</Link>
      </nav>

      {/* Mobile: logo and a menu button that opens the full-screen menu. */}
      <div className="mx-auto flex max-w-[353px] items-center justify-between rounded-xl bg-white px-5 lg:hidden">
        <Link href="/"><img src="/landing/logo.svg" alt="Grawal" width={102} height={24} /></Link>
        <button type="button" className="rounded-[40px] p-3" aria-expanded={open} aria-controls="landing-menu" aria-label="Open menu" onClick={() => setOpen(true)}>
          <img src="/landing/icon-menu.svg" alt="" width={24} height={24} />
        </button>
      </div>
      <MobileMenu open={open} onClose={close} account={account} />
    </header>
  );
}
