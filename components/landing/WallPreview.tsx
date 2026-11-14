// The product shot under the hero: a Grawal wall full of pinned wins, drawn with the
// same note artwork the design uses. It scales as one piece: every length is in
// units of --u, which is 1/1200 of the desktop shot's width (1/313 on mobile).
import { WALL_NOTES } from './content';
import { LiveApp } from './LiveApp';
import { StickyNote } from './StickyNote';

const u = (n: number) => `calc(var(--u) * ${n})`;

// Figma's phone preview pins two wins, staggered, with open wall between them
// (Mobile / Wall / Populated, 2941:2688). Positions are in the card's 313px space.
const MOBILE_NOTES = [
  { index: 0, left: 17.92, top: 95.57 },
  { index: 3, left: 161.28, top: 291.42 },
];

function SearchAndBell({ scale }: { scale: number }) {
  return (
    <div className="flex items-center rounded-full bg-white" style={{ padding: u(9.333 * scale), gap: u(10.889 * scale) }}>
      <img src="/landing/icon-search.svg" alt="" style={{ width: u(18.667 * scale) }} />
      <img src="/landing/icon-bell.svg" alt="" style={{ width: u(18.667 * scale) }} />
    </div>
  );
}

export function DesktopWallPreview() {
  return (
    <div className="mx-auto w-full max-w-[1200px] [container-type:inline-size]">
      <div className="relative overflow-hidden bg-[#f5f5f5] [--u:calc(100cqw/1200)]" style={{ height: u(800) }}>
        <img src="/landing/wave-texture.svg" alt="" loading="lazy" decoding="async" className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ width: u(1200), height: u(1080.833), top: `calc(50% + ${u(0.42)})` }} />
        <div className="absolute overflow-hidden bg-[#f5f5f5]" style={{ left: u(40), top: u(40), width: u(1120), height: u(796.444) }}>
          <div className="absolute inset-x-0 top-0 flex items-center justify-between" style={{ padding: `${u(20.222)} ${u(269.111)}`, height: u(77.777) }}>
            <img src="/landing/logo-app.svg" alt="" style={{ width: u(75.444) }} />
            <div className="flex items-center" style={{ gap: u(9.333) }}>
              <SearchAndBell scale={1} />
              <span className="block overflow-hidden rounded-full bg-[#eaeaea] border-white" style={{ width: u(37.333), height: u(37.333), borderWidth: u(4.667) }}>
                <img src="/landing/avatar.jpg" alt="" className="size-full object-cover object-[50%_35%]" />
              </span>
            </div>
          </div>

          <div className="absolute flex -translate-y-1/2 flex-col items-center" style={{ left: u(31.11), top: '50%', width: u(50.556), gap: u(10.889) }}>
            <div className="flex w-full flex-col items-center rounded-full bg-white" style={{ padding: u(4.667), gap: u(3.111), boxShadow: `0 ${u(3.111)} ${u(3.111)} rgb(204 204 204 / 0.25)` }}>
              <span className="grid place-items-center rounded-full bg-[#1568d4]" style={{ width: u(37.333), height: u(37.333) }}>
                <img src="/landing/icon-home.svg" alt="" style={{ width: u(18.667) }} />
              </span>
              <span className="grid place-items-center" style={{ width: u(37.333), height: u(37.333) }}>
                <img src="/landing/icon-history.svg" alt="" style={{ width: u(18.667) }} />
              </span>
            </div>
            <span className="grid place-items-center rounded-full bg-[#1a1a1a]" style={{ width: u(34.222), height: u(34.222), boxShadow: `inset 0 ${u(3.111)} ${u(3.111)} rgb(0 0 0 / 0.25)` }}>
              <img src="/landing/icon-add.svg" alt="" style={{ width: u(18.667) }} />
            </span>
          </div>

          <div className="absolute left-1/2 flex -translate-x-1/2 flex-wrap" style={{ top: u(124.44), width: u(793.333), gap: u(15.556) }}>
            {WALL_NOTES.map((note, index) => <StickyNote key={index} note={note} style={{ width: u(145.185) }} />)}
          </div>
          {/* The screen is the 1440px desktop app at 1120/1440 scale: try it for real. */}
          <LiveApp width={1440} height={1024} label="Try Grawal: a live demo with sample wins" />
        </div>
      </div>
    </div>
  );
}

export function MobileWallPreview() {
  // Figma's mobile frame shows the phone mock-up at 313px wide; it was drawn at 273px.
  const K = 313 / 273;
  const k = (n: number) => u(n * K);
  return (
    <div className="mx-auto w-full max-w-[353px] [container-type:inline-size]">
      <div className="relative overflow-hidden bg-[#f5f5f5] [--u:calc(100cqw/353)]" style={{ height: u(612) }}>
        <img src="/landing/wave-texture.svg" alt="" loading="lazy" decoding="async" className="absolute max-w-none" style={{ left: u(-274.05), top: u(-46.07), width: u(902.24), height: u(812.01) }} />
        <div className="absolute overflow-hidden bg-[#f5f5f5]" style={{ left: u(20), top: u(20), width: u(313), height: u(592) }}>
          <div className="absolute left-1/2 -translate-x-1/2" style={{ top: k(33.344), width: k(245.214), height: k(33.344) }}>
            <img src="/landing/logo-app.svg" alt="" className="absolute left-0" style={{ top: k(7.99), width: k(67.382) }} />
            <div className="absolute right-0 top-1/2 flex -translate-y-1/2 items-center" style={{ gap: k(8.336) }}>
              <SearchAndBell scale={0.893 * K} />
              <span className="grid place-items-center rounded-full border-white bg-[#89cbfa] font-avenir font-extrabold text-white" style={{ width: k(33.344), height: k(33.344), borderWidth: k(1.389), fontSize: k(11.115) }}>N</span>
            </div>
          </div>

          {MOBILE_NOTES.map(({ index, left, top }) => (
            <StickyNote key={index} note={WALL_NOTES[index]} className="!absolute" style={{ left: u(left), top: u(top), width: u(133.8) }} />
          ))}

          <div className="absolute flex items-center" style={{ left: u(90.79), top: u(506.92), gap: k(9.725) }}>
            <div className="flex items-center rounded-full bg-white" style={{ padding: k(4.168), boxShadow: `0 ${k(2.779)} ${k(2.779)} rgb(204 204 204 / 0.25)` }}>
              <span className="grid place-items-center rounded-full bg-[#1568d4]" style={{ width: k(33.344), height: k(33.344) }}>
                <img src="/landing/icon-home.svg" alt="" style={{ width: k(16.672) }} />
              </span>
              <span className="grid place-items-center" style={{ width: k(33.344), height: k(33.344) }}>
                <img src="/landing/icon-history.svg" alt="" style={{ width: k(16.672) }} />
              </span>
            </div>
            <span className="grid place-items-center rounded-full bg-[#1a1a1a]" style={{ width: k(30.565), height: k(30.565), boxShadow: `inset 0 ${k(2.779)} ${k(2.779)} rgb(0 0 0 / 0.25)` }}>
              <img src="/landing/icon-add.svg" alt="" style={{ width: k(16.672) }} />
            </span>
          </div>
          {/* The screen is the 393px phone app at 313/393 scale: try it for real. */}
          <LiveApp width={393} height={744} label="Try Grawal: a live demo with sample wins" />
        </div>
      </div>
    </div>
  );
}
