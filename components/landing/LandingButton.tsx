import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';

export function LandingButton({ href, children, pin = false }: { href: string; children: React.ReactNode; pin?: boolean }) {
  return (
    <Link href={href} className="landing-button">
      {pin && <Icon src="/landing/pin.svg" size={24} />}
      {children}
    </Link>
  );
}
