export function ComingSoon({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="max-w-xl">
      <h1>{title}</h1>
      <p className="mt-3 text-soft">{children}</p>
      <p className="mt-3 text-soft">This part of your wall is coming soon.</p>
    </div>
  );
}
