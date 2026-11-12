'use client';

export default function WallError({ reset }: { reset: () => void }) {
  return (
    <div className="flex min-h-[60dvh] flex-col items-center justify-center gap-3 px-5 text-center font-avenir">
      <h1 className="text-2xl font-extrabold text-[var(--d-text)]">This page didn’t load</h1>
      <p className="text-base text-[var(--d-soft)]">Your wins are safe. Check your connection and try again.</p>
      <button type="button" onClick={reset} className="mt-3 h-12 rounded-xl bg-[#1568d4] px-6 font-medium text-white">Try again</button>
    </div>
  );
}
