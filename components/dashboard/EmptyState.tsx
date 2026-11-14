/** The blank, grey-pinned note with a short message, for an empty wall or history. */
export function EmptyState({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex min-h-[calc(100dvh-var(--dash-head))] flex-col items-center px-5 pt-[max(24px,calc(50dvh-146px-var(--dash-head)))] lg:min-h-[calc(100dvh-100px)] lg:justify-center lg:pt-0 lg:pb-[100px]">
      <img src="/app/blank-note.svg" alt="" className="w-20 lg:w-[187px]" />
      <div className="mt-5 flex flex-col items-center gap-3 text-center">
        <h1 className="font-avenir text-xl leading-6 font-extrabold text-[var(--d-text)] lg:text-2xl lg:leading-[26px]">{title}</h1>
        <p className="w-[273px] font-avenir text-base leading-[18px] tracking-[-0.048px] text-[var(--d-soft)]">{children}</p>
      </div>
    </div>
  );
}
