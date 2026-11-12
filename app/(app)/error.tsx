'use client';

export default function WallError({ reset }: { reset: () => void }) {
  return (
    <div className="max-w-xl">
      <h1>This page didn't load</h1>
      <p className="mt-3 text-soft">Your wins are safe. Check your connection and try again.</p>
      <button type="button" className="btn btn-primary mt-6" onClick={reset}>Try again</button>
    </div>
  );
}
