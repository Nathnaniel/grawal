'use client';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect } from 'react';

// Blocks marked data-reveal rise in as they reach the screen, a few at a time, as on
// the Email Verifier site. Everything stays in place for visitors who ask for reduced motion.
export function ScrollAnimations() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const motion = gsap.matchMedia();

    motion.add('(prefers-reduced-motion: no-preference)', () => {
      // Only what's below the fold is hidden, and only after hydration, so nothing
      // on screen flashes and the page is complete without JavaScript.
      const items = gsap.utils.toArray<HTMLElement>('[data-reveal]')
        .filter((item) => item.getBoundingClientRect().top > window.innerHeight * 0.9);
      gsap.set(items, { autoAlpha: 0, y: 28 });
      ScrollTrigger.batch(items, {
        start: 'top 92%',
        once: true,
        interval: 0.1,
        onEnter: (batch) => gsap.to(batch, {
          autoAlpha: 1, y: 0, duration: 0.7, ease: 'power3.out', stagger: 0.09, overwrite: true, clearProps: 'transform,opacity,visibility',
        }),
      });
    });

    // An opening FAQ answer changes the page's height, which moves every trigger below it.
    // Waits for the change to settle, so it doesn't refresh on every frame.
    let settle: ReturnType<typeof setTimeout>;
    const resize = new ResizeObserver(() => {
      clearTimeout(settle);
      settle = setTimeout(() => ScrollTrigger.refresh(), 200);
    });
    resize.observe(document.body);

    return () => {
      clearTimeout(settle);
      resize.disconnect();
      motion.revert();
    };
  }, []);

  return null;
}
