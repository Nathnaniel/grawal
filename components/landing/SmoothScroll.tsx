'use client';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { useEffect } from 'react';

let current: Lenis | null = null;

/** The landing page's Lenis instance, or null before it starts or where it isn't used. */
export const smoothScroll = () => current;

// Slow, smooth page scrolling, with the same settings as the Email Verifier site.
// GSAP's clock drives Lenis, so the scroll animations stay in step with it.
// Section links glide there over 2.4 seconds. Lenis steps aside on its own for
// visitors who ask their device for reduced motion.
export function SmoothScroll() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const lenis = new Lenis({
      lerp: 0.04,
      wheelMultiplier: 0.65,
      anchors: { duration: 2.4, easing: (t) => 1 - (1 - t) ** 4 },
      stopInertiaOnNavigate: true,
    });
    const tick = (time: number) => lenis.raf(time * 1000);

    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    current = lenis;

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      current = null;
    };
  }, []);

  return null;
}
