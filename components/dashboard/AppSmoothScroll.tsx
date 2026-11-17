'use client';

import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { useEffect } from 'react';

// Smooth wheel scrolling for the wall and history, with the same feel as the website.
// Only the page itself glides: panels laid over it (settings, notifications, a win being
// written) keep their own normal scrolling. Phones keep native touch scrolling, which
// dragging notes relies on, and Lenis steps aside for people who ask for reduced motion.
export function AppSmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      autoRaf: true,
      lerp: 0.04,
      wheelMultiplier: 0.65,
      stopInertiaOnNavigate: true,
      // Panels sit directly in the dashboard beside the page, header and nav; leave those alone.
      prevent: (node) => !!node.parentElement?.classList.contains('dash') && !['MAIN', 'HEADER', 'NAV'].includes(node.tagName),
    });
    return () => lenis.destroy();
  }, []);

  return null;
}
