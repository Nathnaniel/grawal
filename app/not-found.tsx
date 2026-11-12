import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-3 bg-[#f5f5f5] px-5 text-center font-avenir">
      <h1 className="text-2xl font-extrabold text-[#1a1a1a]">This page isn’t on the wall</h1>
      <p className="text-base text-[#333]">The link may be old, or it may have been taken down.</p>
      <Link href="/wall" className="mt-3 flex h-12 items-center rounded-xl bg-[#1568d4] px-6 font-medium text-white">Go to your wall</Link>
    </main>
  );
}
