import type { Metadata, Viewport } from 'next';
import { SCRIPTURES, STEPS, WALL_NOTES } from '@/components/landing/content';
import { Faq } from '@/components/landing/Faq';
import { Footer } from '@/components/landing/Footer';
import { HeroLines } from '@/components/landing/HeroLines';
import { LandingButton } from '@/components/landing/LandingButton';
import { LandingNav } from '@/components/landing/LandingNav';
import { StickyNote } from '@/components/landing/StickyNote';
import { DesktopWallPreview, MobileWallPreview } from '@/components/landing/WallPreview';

// Chrome and Samsung Internet colour their bar with this: the top edge of the hero.
export const viewport: Viewport = { themeColor: '#1f6fd7', viewportFit: 'cover' };

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
        <HeroLines />
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

// The app pieces on the desktop panel: white cards with a soft blue shadow (Figma: Section / How It Works, node 2960:16317).
const PANEL_CARD = 'absolute rounded-2xl border border-white/70 bg-white shadow-[0_24px_24px_rgba(9,45,110,0.22)]';

function HowItWorks() {
  return (
    <section id="how-it-works" aria-labelledby="how-heading" className="mt-7 scroll-mt-6 px-4 py-10 lg:mt-16 lg:py-20">
      {/* Phones: the desktop design stacked. The steps as a list, then the app pieces down the wave panel. */}
      <div className="mx-auto flex max-w-[353px] flex-col gap-10 lg:hidden">
        <div id="how-heading" data-reveal className="px-4"><SectionIntro eyebrow="How does it work?" title="Three simple steps to never forget what God has done." /></div>
        <ol className="flex flex-col gap-7 px-4">
          {STEPS.map((step) => (
            <li key={step.title} data-reveal className="flex items-start gap-4">
              <img src={step.icon} alt="" loading="lazy" decoding="async" width={28} height={28} className="size-7 shrink-0" />
              <div className="flex flex-col gap-2">
                <h3 className="font-tusker text-xl leading-[26px] font-medium">{step.title}</h3>
                <p className="font-avenir text-base leading-[18px] tracking-[-0.048px] text-[#333]">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>

        <div data-reveal aria-hidden className="relative flex flex-col items-center gap-5 overflow-hidden rounded-3xl bg-white px-5 py-8">
          <img src="/landing/wave-texture.svg" alt="" loading="lazy" decoding="async" className="absolute top-1/2 left-1/2 max-w-none -translate-x-1/2 -translate-y-1/2" style={{ width: 900, height: 810.6 }} />

          {/* Step 1: pinning a win. */}
          <div className="relative w-full rounded-2xl border border-white/70 bg-white p-4 shadow-[0_24px_24px_rgba(9,45,110,0.22)]">
            <div className="flex items-center gap-2 border-b border-[#1a1a1a]/10 pb-3">
              <img src="/landing/step-pin.svg" alt="" width={20} height={20} className="size-5" />
              <p className="font-tusker text-xl leading-6 font-medium text-[#1a1a1a]">Pin your win</p>
            </div>
            <p className="pt-4 font-avenir text-xs leading-[14px] text-[#666]">What happened?</p>
            <p className="pt-1 font-avenir text-sm leading-4 text-[#1a1a1a]">Mum’s surgery went well and she’s home recovering.</p>
            <div className="flex items-center gap-2 pt-4 font-avenir text-xs leading-[14px] text-[#333]">
              <span className="rounded-full bg-white px-2.5 py-1">Family</span>
              <span className="ml-auto flex h-[38px] items-center rounded-xl border-t-2 border-r-2 border-[#3788f1] bg-[#1568d4] px-5 text-base leading-[18px] font-medium text-white shadow-[inset_0_-4px_4px_rgba(179,208,245,0.25),0_4px_4px_rgba(204,204,204,0.14)]">Pin it</span>
            </div>
          </div>

          {/* Step 2: it lands on the wall. */}
          <StickyNote note={WALL_NOTES[1]} breeze className="w-[170px] rotate-3" />

          {/* Step 3: looking back. */}
          <div className="relative w-full rounded-2xl border border-white/70 bg-white p-4 shadow-[0_24px_24px_rgba(9,45,110,0.22)]">
            <div className="flex items-center gap-2 font-avenir text-xs leading-[14px] text-[#666]">
              <img src="/app/n-calendar.svg" alt="" width={16} height={16} className="size-4" />
              On this day, a year ago
            </div>
            <p className="pt-3 font-tusker text-lg leading-[22px] font-medium text-[#1a1a1a]">Answered Prayer</p>
            <p className="pt-1 font-avenir text-sm leading-4 text-[#333]">Got the job offer I prayed about for three months.</p>
            <span className="mt-4 inline-flex rounded-lg border-[0.5px] border-[#ccc]/40 bg-white px-3 py-1.5 font-avenir text-xs leading-[14px] font-medium text-[#1a1a1a]">Give thanks again</span>
          </div>
        </div>
      </div>

      {/* Desktop: the intro beside the steps, then the steps in the app on the wave panel. */}
      <div className="mx-auto hidden w-[1043px] max-w-full flex-col items-center gap-[60px] lg:flex">
        <div className="flex w-full items-start justify-between">
          <div data-reveal><SectionIntro eyebrow="How does it work?" title="Three simple steps to never forget what God has done." /></div>
          <ol className="flex flex-col gap-7">
            {STEPS.map((step) => (
              <li key={step.title} data-reveal className="flex items-start gap-5">
                <img src={step.icon} alt="" loading="lazy" decoding="async" width={28} height={28} className="size-7" />
                <div className="flex w-[444px] flex-col gap-3">
                  <h3 className="font-tusker text-xl leading-[26px] font-medium">{step.title}</h3>
                  <p className="font-avenir text-base leading-[18px] tracking-[-0.048px] text-[#333]">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div data-reveal aria-hidden className="relative h-[460px] w-[1003px] overflow-hidden rounded-[32px] bg-white">
          <img src="/landing/wave-texture.svg" alt="" loading="lazy" decoding="async" className="absolute max-w-none" style={{ left: -48.5, top: -295, width: 1100, height: 990.76 }} />

          {/* Your wall at a glance. */}
          <div className={`${PANEL_CARD} top-[86px] left-[300px] flex items-center gap-3 py-2.5 pr-2.5 pl-3`}>
            <img src="/landing/avatar.jpg" alt="" className="size-8 rounded-full object-cover" />
            <div className="w-[90px] font-avenir leading-4 whitespace-nowrap">
              <p className="text-sm font-medium text-[#1a1a1a]">Your wall</p>
              <p className="text-xs text-[#666]">128 wins pinned</p>
            </div>
            <span className="ml-6 rounded-lg bg-[#1568d4]/10 px-3 py-1.5 font-avenir text-[13px] font-medium text-[#1568d4]">This year</span>
          </div>

          {/* Step 1: pinning a win. */}
          <div className={`${PANEL_CARD} top-[168px] left-[64px] w-[340px] p-5`}>
            <div className="flex items-center gap-2 border-b border-[#1a1a1a]/10 pb-3">
              <img src="/landing/step-pin.svg" alt="" width={20} height={20} className="size-5" />
              <p className="font-tusker text-xl leading-6 font-medium text-[#1a1a1a]">Pin your win</p>
            </div>
            <p className="pt-4 font-avenir text-xs leading-[14px] text-[#666]">What happened?</p>
            <p className="pt-1 font-avenir text-sm leading-4 text-[#1a1a1a]">Mum’s surgery went well and she’s home recovering.</p>
            <div className="flex items-center gap-2 pt-4 font-avenir text-xs leading-[14px] text-[#333]">
              <span className="rounded-full bg-white px-2.5 py-1">Family</span>
              <span className="ml-auto flex h-[38px] items-center rounded-xl border-t-2 border-r-2 border-[#3788f1] bg-[#1568d4] px-6 text-base leading-[18px] font-medium text-white shadow-[inset_0_-4px_4px_rgba(179,208,245,0.25),0_4px_4px_rgba(204,204,204,0.14)]">Pin it</span>
            </div>
          </div>

          {/* Step 2: it lands on the wall. */}
          <div className="absolute top-[161px] left-[436px]">
            <StickyNote note={WALL_NOTES[1]} breeze className="w-[188px] rotate-3" />
          </div>

          {/* Step 3: looking back. */}
          <div className={`${PANEL_CARD} top-[206px] left-[668px] w-[260px] p-4`}>
            <div className="flex items-center gap-2 font-avenir text-xs leading-[14px] text-[#666]">
              <img src="/app/n-calendar.svg" alt="" width={16} height={16} className="size-4" />
              On this day, a year ago
            </div>
            <p className="pt-3 font-tusker text-lg leading-[22px] font-medium text-[#1a1a1a]">Answered Prayer</p>
            <p className="pt-1 font-avenir text-sm leading-4 text-[#333]">Got the job offer I prayed about for three months.</p>
            <span className="mt-4 inline-flex rounded-lg border-[0.5px] border-[#ccc]/40 bg-white px-3 py-1.5 font-avenir text-xs leading-[14px] font-medium text-[#1a1a1a]">Give thanks again</span>
          </div>
        </div>
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
      <StickyNote note={first} breeze className="!absolute top-[21.7px] left-[33.73px] w-[143.715px] lg:top-[70px] lg:left-[87px] lg:w-[186.667px]" />
      <StickyNote note={second} breeze className="!absolute top-[117.81px] left-[191.82px] w-[143.715px] lg:top-[116px] lg:left-[305px] lg:w-[186.667px]" />
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

export default function Landing() {
  return (
    <>
      {/* landing-home turns the page behind the sections blue (globals.css). */}
      {/* On phones, the strip under the status bar takes the header's blue and the strip by the
          home indicator takes the footer's, on every browser (Safari and Firefox follow fixed
          elements at the edges). They're as tall as the phone's safe areas, so zero on desktop. */}
      <div aria-hidden className="pointer-events-none fixed inset-x-0 top-0 z-30 h-[env(safe-area-inset-top)] bg-[#1f6fd7]" />
      <div aria-hidden className="pointer-events-none fixed inset-x-0 bottom-0 z-30 h-[env(safe-area-inset-bottom)] bg-[#60a3e9]" />
      <main className="landing-home">
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

