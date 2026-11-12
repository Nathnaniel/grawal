'use client';

import { useState } from 'react';
import { FAQS } from './content';

export function Faq() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <ul className="flex flex-col gap-3">
      {FAQS.map(({ question, answer }, index) => {
        const expanded = open === index;
        return (
          <li key={question} className="rounded-[20px] bg-[#f5f5f5] px-5 py-3.5">
            <h3>
              <button
                type="button"
                className="flex min-h-10 w-full items-center justify-between gap-4 text-left"
                aria-expanded={expanded}
                aria-controls={`faq-answer-${index}`}
                onClick={() => setOpen(expanded ? null : index)}
              >
                <span className="font-tusker text-base leading-[18px] font-medium capitalize">{question}</span>
                <span className="grid size-10 shrink-0 place-items-center bg-[#eaeaea]">
                  <img src={expanded ? '/landing/arrow-up-right.svg' : '/landing/arrow-down-left.svg'} alt="" width={24} height={24} />
                </span>
              </button>
            </h3>
            <div id={`faq-answer-${index}`} hidden={!expanded}>
              <p className="max-w-[459px] pt-3 pb-1 font-avenir text-base leading-[18px] tracking-[-0.048px] text-[#333]">{answer}</p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
