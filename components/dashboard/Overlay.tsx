'use client';

import { useApp } from '../AppProvider';

/** The design's "Overlay / Background Blur": a faint wash over the wall. A click closes. */
export function Overlay() {
  const { close } = useApp();
  return <div aria-hidden="true" onClick={close} className="panel-in fixed inset-0 z-40 bg-black/8 backdrop-blur-[1px]" />;
}
