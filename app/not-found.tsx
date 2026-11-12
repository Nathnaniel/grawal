import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="glass mx-auto mt-24 max-w-xl rounded-2xl p-8">
      <h1>This page isn't on the wall</h1>
      <p className="mt-3 text-soft">The link may be old, or it may have been taken down.</p>
      <Link href="/wall" className="btn btn-primary mt-6">Go to your wall</Link>
    </main>
  );
}
