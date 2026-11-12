'use client';

import gsap from 'gsap';
import { useEffect, useRef } from 'react';

// The footer wordmark from Figma, split into "Gra" (with the mark) and "wal".
// The halves see-saw toward the pointer: the side it's over lifts and tilts while
// the other dips, easing in like the reference recording. Same drawing on phones
// and desktops: it scales to its column (353px on phones, 800px on desktop).
const MARK = ["M79.2277 185.49L0 80.1028H45.2196L79.2277 185.49Z", "M184.615 151.482L79.2277 185.49L184.615 106.263V151.482Z", "M114.357 111.495L35.1292 6.10713H80.3488L114.357 111.495Z", "M184.615 106.263L105.388 0.875113H150.607L184.615 106.263Z"];
const GRA = ["M110.579 127.694H95.5761L93.9091 110.668C86.1296 123.793 72.6082 130 56.4936 130C22.0418 130 0 106.412 0 67.5716C0 28.9086 22.0418 4.78854 58.3459 4.78854C83.3513 4.78854 104.837 17.9127 110.765 42.9195H89.0932C84.6478 29.0859 72.7934 21.4598 57.7902 21.4598C34.8223 21.4598 21.1157 39.0177 21.1157 67.5716C21.1157 96.1255 35.0075 113.329 58.3459 113.329C75.5718 113.329 89.4637 103.397 90.7603 80.3411H60.939V64.9113H110.579V127.694Z", "M133.187 127.694V33.1651H153.006V47.176C159.489 35.8254 169.676 30.6821 181.16 30.6821C185.05 30.6821 188.754 31.5689 190.607 33.1651V49.8363C187.643 48.9495 184.124 48.5948 180.049 48.5948C161.156 48.5948 153.006 59.5907 153.006 76.0846V127.694H133.187Z", "M220.798 64.0246H200.979C204.128 43.0969 219.131 30.6821 243.766 30.6821C270.624 30.6821 283.96 45.7572 283.96 67.749V104.638C283.96 115.989 285.071 122.551 287.294 127.694H266.549C265.067 124.147 264.511 119.181 264.326 113.861C255.991 125.034 243.211 130 231.356 130C211.352 130 197.645 120.955 197.645 102.865C197.645 89.9181 205.054 80.3411 219.872 75.5525C233.023 71.296 246.359 70.2319 264.141 70.0546V67.9263C264.141 54.0928 257.473 46.6439 242.284 46.6439C229.504 46.6439 222.651 53.3834 220.798 64.0246ZM217.65 102.156C217.65 110.136 224.503 115.102 235.061 115.102C251.546 115.102 264.141 102.51 264.141 87.2578V83.0014C226.17 83.3561 217.65 91.337 217.65 102.156Z"];
const WAL = ["M391.496 127.694L371.862 60.4775L369.825 49.8363L367.602 60.4775L347.968 127.694H323.519L294.994 33.1651H316.295L334.447 103.397L336.855 114.038L339.448 103.397L360.193 33.1651H381.124L402.054 103.397L404.277 113.506L406.499 103.397L424.651 33.1651H445.026L416.316 127.694H391.496Z", "M476.723 64.0246H456.904C460.053 43.0969 475.056 30.6821 499.691 30.6821C526.548 30.6821 539.885 45.7572 539.885 67.749V104.638C539.885 115.989 540.996 122.551 543.219 127.694H522.473C520.992 124.147 520.436 119.181 520.251 113.861C511.916 125.034 499.135 130 487.281 130C467.276 130 453.57 120.955 453.57 102.865C453.57 89.9181 460.979 80.3411 475.797 75.5525C488.948 71.296 502.284 70.2319 520.066 70.0546V67.9263C520.066 54.0928 513.397 46.6439 498.209 46.6439C485.428 46.6439 478.575 53.3834 476.723 64.0246ZM473.574 102.156C473.574 110.136 480.427 115.102 490.985 115.102C507.47 115.102 520.066 102.51 520.066 87.2578V83.0014C482.094 83.3561 473.574 91.337 473.574 102.156Z", "M564.181 127.694V0H584V127.694H564.181Z"];

// Figma's desktop layout: mark 184 by 192, a 30.769 gap, then the 584 by 130
// wordmark centred beside it.
const WIDTH = 184 + 30.769 + 584;
const WORD_X = 184 + 30.769;
const WORD_Y = (192 - 130) / 2;

const LIFT = 26;
const TILT = 3.5;
const EASE = { duration: 1.1, ease: 'power3.out' };

export function FooterWordmark() {
  const svg = useRef<SVGSVGElement>(null);
  const left = useRef<SVGGElement>(null);
  const right = useRef<SVGGElement>(null);

  useEffect(() => {
    const footer = svg.current?.closest('footer');
    if (!footer || !left.current || !right.current) return;
    const motion = gsap.matchMedia();

    motion.add('(prefers-reduced-motion: no-preference)', () => {
      // Each half hinges on the seam between "Gra" and "wal".
      gsap.set(left.current, { transformOrigin: '100% 100%' });
      gsap.set(right.current, { transformOrigin: '0% 100%' });
      const to = {
        leftY: gsap.quickTo(left.current, 'y', EASE),
        leftTurn: gsap.quickTo(left.current, 'rotation', EASE),
        rightY: gsap.quickTo(right.current, 'y', EASE),
        rightTurn: gsap.quickTo(right.current, 'rotation', EASE),
      };

      // -1 with the pointer at the footer's left edge, 1 at its right, 0 at rest.
      const lean = (p: number) => {
        to.leftY(p * LIFT);
        to.leftTurn(-p * TILT);
        to.rightY(-p * LIFT);
        to.rightTurn(-p * TILT);
      };
      const follow = (event: PointerEvent) => {
        const box = footer.getBoundingClientRect();
        lean(gsap.utils.clamp(-1, 1, ((event.clientX - box.left) / box.width) * 2 - 1));
      };
      const settle = () => lean(0);

      footer.addEventListener('pointermove', follow);
      footer.addEventListener('pointerdown', follow);
      footer.addEventListener('pointerleave', settle);
      footer.addEventListener('pointercancel', settle);
      return () => {
        footer.removeEventListener('pointermove', follow);
        footer.removeEventListener('pointerdown', follow);
        footer.removeEventListener('pointerleave', settle);
        footer.removeEventListener('pointercancel', settle);
      };
    });

    return () => motion.revert();
  }, []);

  return (
    <svg ref={svg} viewBox={`0 0 ${WIDTH} 192`} role="img" aria-label="Grawal" className="block h-auto w-full overflow-visible">
      <g ref={left}>
        {MARK.map((d) => <path key={d} d={d} fill="#fff" />)}
        <g transform={`translate(${WORD_X} ${WORD_Y})`}>{GRA.map((d) => <path key={d} d={d} fill="#fff" />)}</g>
      </g>
      <g ref={right}>
        <g transform={`translate(${WORD_X} ${WORD_Y})`}>{WAL.map((d) => <path key={d} d={d} fill="#fff" />)}</g>
      </g>
    </svg>
  );
}
