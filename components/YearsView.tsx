import Link from 'next/link';

export function YearsView({ years, basePath = '' }: { years: { year: number; wins: number }[]; basePath?: string }) {
  return (
    <>
      <h1 className="mb-8">Year by year</h1>
      {years.length ? (
        <ol className="max-w-xl">
          {years.map(({ year, wins }) => (
            <li key={year} className="border-b border-line">
              <Link href={`${basePath}/years/${year}`} className="flex items-baseline justify-between gap-4 py-4 hover:text-deep">
                <span className="font-serif text-4xl font-medium">{year}</span>
                <span className="text-soft">{wins === 1 ? '1 win' : `${wins} wins`}</span>
              </Link>
            </li>
          ))}
        </ol>
      ) : (
        <p className="text-soft">Once you add a win, its year appears here.</p>
      )}
    </>
  );
}
