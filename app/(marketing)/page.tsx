import type { Metadata } from 'next';
import { SCRIPTURES, STEPS, WALL_NOTES } from '@/components/landing/content';
import { Faq } from '@/components/landing/Faq';
import { FooterWordmark } from '@/components/landing/FooterWordmark';
import { LandingButton } from '@/components/landing/LandingButton';
import { LandingNav } from '@/components/landing/LandingNav';
import { StickyNote } from '@/components/landing/StickyNote';
import { DesktopWallPreview, MobileWallPreview } from '@/components/landing/WallPreview';

export const metadata: Metadata = {
  title: { absolute: 'Grawal: remember everything God has done' },
  description: 'Pin your wins and answered prayers the moment they happen, and look back year after year at how far you’ve come.',
  robots: { index: true },
};

// Sizes and spacing follow the Figma frames: desktop at 1440px wide (from lg) and mobile at 393px.

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-[850px] overflow-hidden bg-[#1568d4]">
        <img src="/landing/hero-glow.svg" alt="" fetchPriority="high" className="absolute inset-0 size-full max-w-none object-fill" />
        <img src="/landing/hero-lines.svg" alt="" className="absolute top-0 left-1/2 hidden h-[856px] w-[1440px] max-w-none -translate-x-1/2 lg:block" />
        <img src="/landing/hero-lines-mobile.svg" alt="" className="absolute top-0 left-1/2 h-[854px] w-[394px] max-w-none -translate-x-1/2 lg:hidden" />
      </div>
      <LandingNav />

      <div className="relative mx-auto w-[306px] pt-[352px] lg:w-[788px] lg:translate-x-[2px] lg:pt-[351px]">
        <h1 className="w-full font-tusker text-[32px] leading-[34px] font-medium tracking-[1.28px] text-white uppercase lg:w-[531px] lg:text-[48px] lg:leading-[60px] lg:tracking-[1.92px]">
          Remember everything God has done.
        </h1>
        <div className="mt-[37px] ml-auto flex w-[282px] flex-col items-end gap-[33px] lg:mt-[49px] lg:w-[471px]">
          <p className="w-[293px] text-right font-avenir text-base leading-[18px] tracking-[-0.048px] text-white lg:w-auto">
            Pin your wins and answered prayers the moment they happen, and look back year after year at how far you’ve come.
          </p>
          <LandingButton href="/sign-in" pin>Pin your wins</LandingButton>
        </div>
      </div>

      <div role="img" aria-label="A Grawal wall with fifteen pinned wins, such as a job offer, a clear test result and a baby’s first steps." className="relative mt-12 px-5 lg:mt-[54px] lg:px-6">
        <div className="hidden lg:block"><DesktopWallPreview /></div>
        <div className="lg:hidden"><MobileWallPreview /></div>
      </div>
    </section>
  );
}

function SectionIntro({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="flex flex-col gap-3">
      <p className="w-[281px] font-avenir text-base leading-[18px] tracking-[-0.048px]">{eyebrow}</p>
      <h2 className="w-[281px] font-tusker text-2xl leading-7 font-medium">{title}</h2>
    </div>
  );
}

function WhyWeGiveThanks() {
  return (
    <section aria-labelledby="why-heading" className="mt-[147px] px-5 py-10 lg:mt-16 lg:py-[60px]">
      <div className="mx-auto flex w-[353px] max-w-full flex-col gap-10 lg:w-auto lg:max-w-[1230px] lg:items-center xl:translate-x-[5px] xl:flex-row xl:gap-5">
        <div data-reveal className="flex flex-col gap-5 lg:gap-10 xl:w-[286px] xl:shrink-0">
          <h2 id="why-heading" className="w-[281px] font-tusker text-[40px] leading-[42px] font-medium">Why we give thanks</h2>
          <p className="w-[286px] font-inter text-base leading-[18px] tracking-[-0.048px] lg:w-[242px]">Scripture calls us to remember. These verses are the heart behind every win you pin.</p>
        </div>
        <ul className="flex flex-col gap-5 lg:flex-row lg:gap-3">
          {SCRIPTURES.map((card, index) => (
            <li
              key={card.reference}
              data-reveal
              // Phones: Figma leaves 40px above the third card, 20px above the second.
              className={`relative h-[508px] w-full shrink-0 font-switzer lg:h-[600px] lg:w-[300px] ${index === 2 ? 'max-lg:mt-5' : ''}`}
              style={{ background: card.background, color: card.text, '--quote-w': `${card.mobileQuoteWidth}px`, '--art-top': `${card.artTop}px`, '--art-top-m': `${card.mobileArtTop}px` } as React.CSSProperties}
            >
              {/* On phones the reference runs on after the quote; on desktop it sits on its own line. */}
              <blockquote className="absolute top-10 left-5 w-[var(--quote-w)] max-w-[calc(100%-40px)] tracking-[-0.048px] lg:top-[52px] lg:left-[30px] lg:w-[241px]">
                <p className="inline text-base leading-[18px] lg:block">{card.quote}</p>{' '}
                <footer className="inline text-xs leading-[18px] lg:block">{card.reference}</footer>
              </blockquote>
              <img src={card.art} alt="" loading="lazy" decoding="async" className="absolute top-[var(--art-top-m)] left-1/2 w-[240px] -translate-x-1/2 lg:top-[var(--art-top)]" style={{ height: card.artHeight }} />
              <h3 className="absolute top-[416px] left-5 w-[241px] text-2xl leading-[26px] font-semibold tracking-[-0.072px] lg:top-[496px] lg:left-[30px]">{card.title}</h3>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section id="how-it-works" aria-labelledby="how-heading" className="mt-7 scroll-mt-6 px-4 py-10 lg:mt-16 lg:py-[60px]">
      <div className="mx-auto flex w-[321px] flex-col gap-10 lg:w-[1003px] lg:max-w-full">
        <div id="how-heading" data-reveal><SectionIntro eyebrow="How does it work?" title="Three simple steps to never forget what God has done." /></div>
        <ol className="flex flex-col gap-5 lg:flex-row">
          {STEPS.map((step, index) => (
            <li
              key={step.title}
              data-reveal
              // Phones: shorter cards with the content from the top. Figma leaves 8px more above the third.
              className={`flex h-[284px] w-[321px] shrink-0 flex-col rounded-3xl bg-[#f5f5f5] px-5 pt-7 lg:h-[348px] lg:w-auto lg:flex-1 lg:justify-center lg:pt-0 lg:pb-[48.5px] ${index === 2 ? 'max-lg:mt-2' : ''}`}
            >
              <div className="mx-auto flex w-[281px] max-w-full flex-col gap-10">
                <img src={step.icon} alt="" loading="lazy" decoding="async" width={60} height={60} className="size-10 lg:size-[60px]" />
                <div className="flex flex-col gap-3">
                  <h3 className="font-tusker text-2xl leading-[26px] font-medium">{step.title}</h3>
                  <p className="font-avenir text-base leading-[18px] tracking-[-0.048px] text-[#333]">{step.body}</p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Questions() {
  return (
    <section id="faq" aria-labelledby="faq-heading" className="mt-7 scroll-mt-6 px-5 py-10 lg:mt-16 lg:py-[60px]">
      <div className="mx-auto flex max-w-[353px] flex-col gap-10 lg:max-w-[579px]">
        <div id="faq-heading" data-reveal><SectionIntro eyebrow="Questions? We’ve got answers." title="Everything you need to know about Gratitude Wall." /></div>
        <div data-reveal><Faq /></div>
      </div>
    </section>
  );
}

function StartCard() {
  const [first, second] = [WALL_NOTES[8], WALL_NOTES[5]];
  return (
    <div aria-hidden="true" data-reveal className="relative h-[359px] w-full shrink-0 overflow-hidden bg-[#f5f5f5] lg:h-[400px] lg:w-[616px]">
      <img src="/landing/start-card.webp" alt="" loading="lazy" decoding="async" className="absolute inset-0 size-full object-cover" />
      <img src="/landing/start-texture.svg" alt="" loading="lazy" decoding="async" className="absolute top-1/2 left-1/2 h-[554.828px] w-[616px] max-w-none -translate-x-1/2 -translate-y-1/2" />
      <StickyNote note={first} className="!absolute top-[21.7px] left-[33.73px] w-[143.715px] lg:top-[70px] lg:left-[87px] lg:w-[186.667px]" />
      <StickyNote note={second} className="!absolute top-[117.81px] left-[191.82px] w-[143.715px] lg:top-[116px] lg:left-[305px] lg:w-[186.667px]" />
    </div>
  );
}

function StartYourWall() {
  return (
    <section aria-labelledby="start-heading" className="mt-7 px-5 py-5 lg:mt-16 lg:py-[60px]">
      <div className="mx-auto flex w-full max-w-[353px] flex-col gap-5 lg:w-[922px] lg:max-w-none lg:flex-row-reverse lg:items-center lg:justify-between lg:gap-[25px]">
        <StartCard />
        <div data-reveal className="flex flex-col items-start gap-10">
          <div className="flex flex-col gap-5">
            <h2 id="start-heading" className="w-[281px] font-tusker text-[40px] leading-[42px] font-medium">Start remembering today.</h2>
            <p className="w-[242px] font-inter text-base leading-[18px] tracking-[-0.048px]">Your next win is on its way. Be ready to pin it.</p>
          </div>
          <LandingButton href="/sign-in">Start your wall</LandingButton>
        </div>
      </div>
    </section>
  );
}

const FOOTER_LINK = 'p-2.5 whitespace-nowrap font-avenir text-base leading-4 font-medium text-white';

function Footer() {
  return (
    <footer className="relative mt-7 h-[439px] overflow-hidden px-5 lg:mt-16 lg:h-[470px] lg:px-0">
      <img src="/landing/footer-satin.webp" alt="" loading="lazy" decoding="async" className="absolute inset-0 size-full max-w-none object-cover" />
      <div className="relative mx-auto flex w-full max-w-[353px] flex-col gap-5 pt-[60px] lg:w-[800px] lg:max-w-none lg:pt-[62px]">
        <div data-reveal className="flex w-[242px] flex-wrap items-end gap-10 lg:w-auto">
          <div className="flex flex-col gap-1">
            <div className="flex"><a href="#how-it-works" className={FOOTER_LINK}>How it works</a><a href="#faq" className={FOOTER_LINK}>FAQs</a></div>
            {/* No privacy policy or terms pages exist yet, so these are text until they do. */}
            <div className="flex"><span className={FOOTER_LINK}>Privacy Policy</span><span className={FOOTER_LINK}>Terms of service</span></div>
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

export default function Landing() {
  return (
    <>
      <main>
        <Hero />
        <WhyWeGiveThanks />
        <HowItWorks />
        <Questions />
        <StartYourWall />
      </main>
      <Footer />
    </>
  );
}

