'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * The real app, running on sample wins, laid over a product shot so visitors can try
 * it. It renders at a true device size (393px phone or 1440px desktop) and is scaled
 * down to the shot's screen, so it looks exactly like the drawing it replaces. The
 * drawing stays underneath until the app has loaded.
 */
export function LiveApp({ width, height, label, src = '/demo' }: { width: number; height: number; label: string; src?: string }) {
  const box = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const element = box.current;
    if (!element) return;
    const fit = () => setScale(element.clientWidth / width);
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(element);
    return () => observer.disconnect();
  }, [width]);

  return (
    // Lenis leaves scrolling inside the app to the app.
    <div ref={box} data-lenis-prevent className="absolute inset-0 overflow-hidden">
      {scale > 0 && (
        <iframe
          src={src}
          title={label}
          loading="lazy"
          onLoad={() => setReady(true)}
          className={`absolute top-0 left-0 origin-top-left border-0 bg-[#f5f5f5] transition-opacity duration-500 ${ready ? 'opacity-100' : 'opacity-0'}`}
          style={{ width, height, transform: `scale(${scale})` }}
        />
      )}
    </div>
  );
}
