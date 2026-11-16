'use client';

import { useEffect, useRef, useState } from 'react';
import { Icon } from '@/components/ui/Icon';

type Entry = { id: string; label: string; parts?: { id: string; label: string }[] };

/**
 * The list of sections. On desktop it stays in view beside the text and highlights the
 * section being read; on phones it folds out above the text.
 */
export function LegalContents({ sections }: { sections: Entry[] }) {
  const [active, setActive] = useState(sections[0]?.id);
  const fold = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const ids = sections.flatMap((section) => [section.id, ...(section.parts?.map((part) => part.id) ?? [])]);
    const elements = ids.map((id) => document.getElementById(id)).filter((element): element is HTMLElement => element !== null);
    // The section being read is the last one whose top has reached a line just under the
    // floating nav (and the pinned list on phones).
    const pick = () => {
      const line = window.innerWidth >= 1024 ? 160 : 200;
      let current = elements[0]?.id;
      for (const element of elements) if (element.getBoundingClientRect().top <= line) current = element.id;
      setActive(current);
    };
    // Check again once the browser has jumped to a #section in the address.
    pick();
    const late = window.setTimeout(pick, 300);
    window.addEventListener('scroll', pick, { passive: true });
    window.addEventListener('load', pick);
    return () => { window.clearTimeout(late); window.removeEventListener('scroll', pick); window.removeEventListener('load', pick); };
  }, [sections]);

  const list = (
    <ol className="flex flex-col gap-0.5">
      {sections.map((section) => (
        <li key={section.id}>
          <Item id={section.id} label={section.label} active={active === section.id} />
          {section.parts && (
            <ol className="flex flex-col gap-0.5 pl-3">
              {section.parts.map((part) => <li key={part.id}><Item id={part.id} label={part.label} active={active === part.id} small /></li>)}
            </ol>
          )}
        </li>
      ))}
    </ol>
  );

  return (
    <>
      {/* Phones: pinned just under the floating nav. Picking a section folds it away again. */}
      <details ref={fold} className="legal-toc sticky top-[calc(var(--legal-top)+60px)] z-10 rounded-2xl border border-[#ebebeb] bg-white shadow-[0_8px_24px_rgba(26,26,26,0.06)] lg:hidden">
        <summary className="flex cursor-pointer items-center justify-between px-5 py-4 font-avenir text-base font-medium">
          On this page
          <Icon src="/app/arrow-down.svg" size={20} className="legal-toc-arrow" />
        </summary>
        <nav aria-label="On this page" data-lenis-prevent className="max-h-[calc(100dvh-200px)] overflow-y-auto px-3 pb-4" onClick={(event) => { if ((event.target as HTMLElement).closest('a') && fold.current) fold.current.open = false; }}>{list}</nav>
      </details>
      <nav aria-label="On this page" className="sticky top-[calc(var(--legal-top)+80px)] hidden max-h-[calc(100dvh-var(--legal-top)-104px)] self-start overflow-y-auto pb-4 lg:block" data-lenis-prevent>
        <p className="px-3 pb-2 font-avenir text-sm font-medium text-[#666]">On this page</p>
        {list}
      </nav>
    </>
  );
}

function Item({ id, label, active, small = false }: { id: string; label: string; active: boolean; small?: boolean }) {
  return (
    <a
      href={`#${id}`}
      aria-current={active ? 'location' : undefined}
      className={`block rounded-lg px-3 py-2 font-avenir leading-[18px] transition-colors duration-200 ${small ? 'text-sm' : 'text-[15px] font-medium'} ${active ? 'bg-[#f5f5f5] text-[#1568d4]' : 'text-[#4d4d4d] hover:bg-[#f5f5f5] hover:text-[#1a1a1a]'}`}
    >
      {label}
    </a>
  );
}
