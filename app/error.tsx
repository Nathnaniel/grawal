'use client';

// Shown when a page outside the dashboard fails. Visitors never see the error itself.
export default function PageError({ reset }: { reset: () => void }) {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-3 bg-[#f5f5f5] px-5 text-center font-avenir">
      <h1 className="text-2xl font-extrabold text-[#1a1a1a]">Something went wrong</h1>
      <p className="text-base text-[#333]">Please try again in a moment.</p>
      <button type="button" onClick={reset} className="mt-3 h-12 rounded-xl bg-[#1568d4] px-6 font-medium text-white">Try again</button>
    </main>
  );
}
