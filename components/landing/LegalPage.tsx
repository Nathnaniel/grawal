import type { Viewport } from 'next';
import { CONTACT_EMAIL, LEGAL_UPDATED, SITE_NAME } from '@/lib/site';
import { Footer } from './Footer';
import { LandingNav } from './LandingNav';
import { LegalContents } from './LegalContents';

// These pages start white, not blue, so the browser's bar matches them.
export const legalViewport: Viewport = { themeColor: '#ffffff', viewportFit: 'cover' };

export const ContactEmail = () => <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>;

/** A table. On phones each row becomes a small card, with the column names as labels, so nothing scrolls sideways. */
export function LegalTable({ head, rows }: { head: string[]; rows: React.ReactNode[][] }) {
  return (
    <div className="legal-table legal-stack">
      <table>
        <thead><tr>{head.map((cell) => <th key={cell} scope="col">{cell}</th>)}</tr></thead>
        <tbody>{rows.map((row, index) => <tr key={index}>{row.map((cell, cellIndex) => <td key={cellIndex} data-label={head[cellIndex]}>{cell}</td>)}</tr>)}</tbody>
      </table>
    </div>
  );
}

export type LegalPart = { id: string; title: string; body: React.ReactNode };
export type LegalSection = LegalPart & { parts?: LegalPart[] };

/**
 * The privacy policy and terms of service share this layout: a plain white header with
 * a grey floating nav, then a sticky list of sections beside the text on desktop (a
 * fold-out list above it on phones). Sections are numbered in order.
 */
export function LegalPage({ title, intro, sections }: { title: string; intro: string; sections: LegalSection[] }) {
  return (
    <>
      {/* Outside the header, so it can stay stuck to the top for the whole page. */}
      <LandingNav base="/" floating grey />
      <header className="relative bg-white">
        <div className="relative mx-auto flex max-w-[353px] flex-col items-center gap-5 pt-[52px] pb-10 text-center lg:max-w-[720px] lg:pt-[72px] lg:pb-14">
          <div className="flex gap-2 font-avenir text-sm leading-4 font-medium text-[#1a1a1a]">
            <span className="rounded-lg bg-[#f5f5f5] px-3 py-2">{SITE_NAME}</span>
            <span className="rounded-lg bg-[#f5f5f5] px-3 py-2">Updated {LEGAL_UPDATED}</span>
          </div>
          <h1 className="font-tusker text-[32px] leading-[36px] font-medium tracking-[1.28px] text-[#1a1a1a] uppercase lg:text-[44px] lg:leading-[50px] lg:tracking-[1.76px]">{title}</h1>
          <p className="font-avenir text-base leading-[22px] text-[#4d4d4d]">{intro}</p>
        </div>
      </header>

      <main className="mx-auto grid max-w-[1218px] grid-cols-1 gap-6 px-5 pt-8 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-10 lg:px-6 lg:pt-12">
        <LegalContents sections={sections.map((section, index) => ({
          id: section.id,
          label: `${index + 1}. ${section.title}`,
          parts: section.parts?.map((part, partIndex) => ({ id: part.id, label: `${index + 1}.${partIndex + 1} ${part.title}` })),
        }))} />

        <article className="legal rounded-3xl bg-[#f5f5f5] px-5 py-8 lg:px-12 lg:py-12">
          <p><strong>Effective date:</strong> {LEGAL_UPDATED}</p>
          {sections.map((section, index) => (
            <section key={section.id} id={section.id} aria-labelledby={`${section.id}-title`}>
              <h2 id={`${section.id}-title`}>{index + 1}. {section.title}</h2>
              {section.body}
              {section.parts?.map((part, partIndex) => (
                <div key={part.id} id={part.id}>
                  <h3>{index + 1}.{partIndex + 1} {part.title}</h3>
                  {part.body}
                </div>
              ))}
            </section>
          ))}
        </article>
      </main>
      <Footer base="/" />
    </>
  );
}
