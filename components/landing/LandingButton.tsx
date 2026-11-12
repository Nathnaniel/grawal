import Link from 'next/link';

export function LandingButton({ href, children, pin = false }: { href: string; children: React.ReactNode; pin?: boolean }) {
  return (
    <Link href={href} className="landing-button">
      {pin && <img src="/landing/pin.svg" alt="" width={24} height={24} />}
      {children}
    </Link>
  );
}
