// The product shot under the hero: a Grawal wall full of pinned wins, drawn with the
// same note artwork the design uses. It scales as one piece: every length is in
// units of --u, which is 1/1200 of the desktop shot's width (1/313 on mobile).
import { WALL_NOTES } from './content';
import { StickyNote } from './StickyNote';

const u = (n: number) => `calc(var(--u) * ${n})`;

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
        <img src="/landing/wave-texture.svg" alt="" className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ width: u(1200), height: u(1080.833), top: `calc(50% + ${u(0.42)})` }} />
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
        </div>
      </div>
    </div>
  );
}

export function MobileWallPreview() {
  return (
    <div className="mx-auto w-full max-w-[313px] [container-type:inline-size]">
      <div className="relative overflow-hidden bg-[#f5f5f5] [--u:calc(100cqw/313)]" style={{ height: u(612) }}>
        <img src="/landing/wave-texture.svg" alt="" className="absolute max-w-none" style={{ left: u(-243.5), top: 0, width: u(800), height: u(720.6) }} />
        <div className="absolute overflow-hidden bg-[#f5f5f5]" style={{ left: u(20.5), top: u(20), width: u(273), height: u(591.85) }}>
          <div className="absolute left-1/2 -translate-x-1/2" style={{ top: u(33.344), width: u(245.214), height: u(33.344) }}>
            <img src="/landing/logo-app.svg" alt="" className="absolute left-0" style={{ top: u(7.99), width: u(67.382) }} />
            <div className="absolute right-0 top-1/2 flex -translate-y-1/2 items-center" style={{ gap: u(8.336) }}>
              <SearchAndBell scale={0.893} />
              <span className="grid place-items-center rounded-full border-white bg-[#89cbfa] font-avenir font-extrabold text-white" style={{ width: u(33.344), height: u(33.344), borderWidth: u(1.389), fontSize: u(11.115) }}>N</span>
            </div>
          </div>

          <div className="absolute grid grid-cols-2" style={{ left: u(15.63), top: u(83.36), width: u(241.74), gap: u(8.336) }}>
            {WALL_NOTES.map((note, index) => <StickyNote key={index} note={note} style={{ width: u(116.702) }} />)}
          </div>

          <div className="absolute flex items-center" style={{ left: u(79.19), top: u(522.38), gap: u(9.725) }}>
            <div className="flex items-center rounded-full bg-white" style={{ padding: u(4.168), boxShadow: `0 ${u(2.779)} ${u(2.779)} rgb(204 204 204 / 0.25)` }}>
              <span className="grid place-items-center rounded-full bg-[#1568d4]" style={{ width: u(33.344), height: u(33.344) }}>
                <img src="/landing/icon-home.svg" alt="" style={{ width: u(16.672) }} />
              </span>
              <span className="grid place-items-center" style={{ width: u(33.344), height: u(33.344) }}>
                <img src="/landing/icon-history.svg" alt="" style={{ width: u(16.672) }} />
              </span>
            </div>
            <span className="grid place-items-center rounded-full bg-[#1a1a1a]" style={{ width: u(30.565), height: u(30.565), boxShadow: `inset 0 ${u(2.779)} ${u(2.779)} rgb(0 0 0 / 0.25)` }}>
              <img src="/landing/icon-add.svg" alt="" style={{ width: u(16.672) }} />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
