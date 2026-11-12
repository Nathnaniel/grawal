// Each category has its own small object, so a wall of pinned wins reads like a
// shelf of keepsakes. Custom categories and uncategorised wins are a folded note.

function Candle() {
  return (
    <>
      <ellipse cx="48" cy="84" rx="28" ry="7" fill="#b98a2c" /><ellipse cx="48" cy="81" rx="28" ry="7" fill="#e2b64f" />
      <rect x="36" y="34" width="24" height="46" rx="3" fill="#fff4dc" /><rect x="52" y="34" width="8" height="46" rx="3" fill="#ecd9b4" />
      <path d="M48 33v-6" stroke="#4b3a2a" strokeWidth="2" />
      <path d="M48 7c7 8 9 13 9 16a9 9 0 0 1-18 0c0-3 2-8 9-16Z" fill="#f59e0b" /><path d="M48 15c3 4 4 7 4 9a4 4 0 0 1-8 0c0-2 1-5 4-9Z" fill="#fde68a" />
    </>
  );
}

function Briefcase() {
  return (
    <>
      <path d="M34 30v-7a5 5 0 0 1 5-5h18a5 5 0 0 1 5 5v7h-6v-6H40v6Z" fill="#5b3a21" />
      <rect x="10" y="29" width="76" height="52" rx="7" fill="#8a5a33" /><path d="M10 50h76v-14a7 7 0 0 0-7-7H17a7 7 0 0 0-7 7Z" fill="#a06c40" />
      <rect x="41" y="44" width="14" height="12" rx="2" fill="#e2b64f" />
    </>
  );
}

function Photo() {
  return (
    <g transform="rotate(-5 48 48)">
      <rect x="16" y="9" width="64" height="78" rx="2" fill="#fffdf8" />
      <rect x="22" y="15" width="52" height="52" fill="#9fd0f2" />
      <path d="M22 67V52c10-8 20-8 28-2 8-5 16-5 24 1v16Z" fill="#6fae7d" />
      <circle cx="41" cy="44" r="6" fill="#7a4a2c" /><path d="M31 67c0-10 4-16 10-16s10 6 10 16Z" fill="#b04466" />
      <circle cx="57" cy="47" r="5" fill="#3b2a22" /><path d="M48 67c0-9 4-13 9-13s9 4 9 13Z" fill="#33688c" />
    </g>
  );
}

function Apple() {
  return (
    <>
      <path d="M48 26c-5-6-13-8-21-5C15 26 11 40 14 54c3 15 14 32 25 32 4 0 6-2 9-2s5 2 9 2c11 0 22-17 25-32 3-14-1-28-13-33-8-3-16-1-21 5Z" fill="#c8362f" />
      <path d="M27 28c-6 4-8 13-7 21" stroke="#e98079" strokeWidth="4" strokeLinecap="round" fill="none" />
      <path d="M48 27c0-7 2-13 7-18" stroke="#5b3a21" strokeWidth="4" strokeLinecap="round" fill="none" />
      <path d="M54 17c5-8 14-9 21-7-2 8-12 13-21 7Z" fill="#4c9a5f" />
    </>
  );
}

function Coins() {
  const coin = (y: number, x = 48) => (
    <g key={`${x}-${y}`}>
      <path d={`M${x - 28} ${y}v9c0 5 12.5 9 28 9s28-4 28-9v-9Z`} fill="#c58f1c" />
      <ellipse cx={x} cy={y} rx="28" ry="9" fill="#efc24d" /><ellipse cx={x} cy={y} rx="19" ry="5.5" fill="#dba92f" />
    </g>
  );
  return <>{[70, 58, 46, 34, 22].map((y, index) => coin(y, 46 + (index % 2) * 4))}</>;
}

function Books() {
  return (
    <>
      <rect x="10" y="66" width="76" height="16" rx="2" fill="#33688c" /><rect x="14" y="70" width="70" height="8" fill="#f3ece0" />
      <rect x="16" y="49" width="66" height="17" rx="2" fill="#b04466" /><rect x="20" y="53" width="60" height="9" fill="#f3ece0" />
      <rect x="12" y="32" width="68" height="17" rx="2" fill="#3c7a58" /><rect x="16" y="36" width="62" height="9" fill="#f3ece0" />
      <path d="M26 32 22 12h46l6 20Z" fill="#e2b64f" /><path d="M46 12h4l3 20h-4Z" fill="#a8740c" />
    </>
  );
}

function Letter() {
  return (
    <g transform="rotate(4 48 48)">
      <rect x="8" y="22" width="80" height="56" rx="3" fill="#f6ead2" />
      <path d="M8 76 40 48M88 76 56 48" stroke="#dfcda9" strokeWidth="2" fill="none" />
      <path d="M8 24a3 3 0 0 1 3-2h74a3 3 0 0 1 3 2L48 56Z" fill="#fff6e4" stroke="#dfcda9" strokeWidth="1.5" />
      <circle cx="48" cy="54" r="10" fill="#b5301f" /><circle cx="48" cy="54" r="6" fill="#d24a35" />
    </g>
  );
}

function Note({ colour }: { colour?: string }) {
  return (
    <g transform="rotate(-3 48 48)">
      <path d="M16 12h64v58L62 86H16Z" fill="#fffdf8" /><path d="M80 70 62 86V70Z" fill="#e6dcc8" />
      <path d="M26 30h44M26 42h44M26 54h28" stroke={colour ?? '#a9bcd3'} strokeWidth="3" strokeLinecap="round" />
    </g>
  );
}

const OBJECTS: Record<string, () => React.ReactNode> = {
  Faith: Candle,
  Work: Briefcase,
  Family: Photo,
  Health: Apple,
  Finances: Coins,
  Studies: Books,
  'Answered Prayer': Letter,
};

export function Keepsake({ category, colour, size = 96 }: { category?: string; colour?: string; size?: number }) {
  const Art = category ? OBJECTS[category] : undefined;
  return (
    <svg viewBox="0 0 96 96" width={size} height={size} aria-hidden="true" className="keepsake-art">
      {Art ? <Art /> : <Note colour={colour} />}
    </svg>
  );
}
