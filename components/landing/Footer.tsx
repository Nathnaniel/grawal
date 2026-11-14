import Link from 'next/link';
import { FooterWordmark } from './FooterWordmark';

const FOOTER_LINK = 'p-2.5 whitespace-nowrap font-avenir text-base leading-4 font-medium text-white';

/** The site footer. `base` is '/' on pages other than the home page, so the section links lead back to it. */
export function Footer({ base = '' }: { base?: string }) {
  return (
    <footer className="relative mt-7 h-[439px] overflow-hidden px-5 lg:mt-16 lg:h-[470px] lg:px-0">
      <img src="/landing/footer-satin.webp" alt="" loading="lazy" decoding="async" className="absolute inset-0 size-full max-w-none object-cover" />
      <div className="relative mx-auto flex w-full max-w-[353px] flex-col gap-5 pt-[60px] lg:w-[800px] lg:max-w-none lg:pt-[62px]">
        <div data-reveal className="flex w-[242px] flex-wrap items-end gap-10 lg:w-auto">
          <div className="flex flex-col gap-1">
            <div className="flex"><a href={`${base}#how-it-works`} className={FOOTER_LINK}>How it works</a><a href={`${base}#faq`} className={FOOTER_LINK}>FAQs</a></div>
            <div className="flex"><Link href="/privacy" className={FOOTER_LINK}>Privacy Policy</Link><Link href="/terms" className={FOOTER_LINK}>Terms of service</Link></div>
          </div>
          {/* The design names the channels but has no addresses for them yet. */}
          <div className="flex"><span className={FOOTER_LINK}>Tiktok</span><span className={FOOTER_LINK}>Instagram</span><span className={FOOTER_LINK}>Youtube</span><span className={FOOTER_LINK}>X</span></div>
        </div>
        <div data-reveal className="flex flex-col items-center gap-5">
          <FooterWordmark />
          <p className="relative z-10 p-2.5 font-avenir text-base leading-[18px] font-medium text-white">© 2026 Grawal. All rights reserved</p>
        </div>
      </div>
    </footer>
  );
}
