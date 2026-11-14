import type { Metadata } from 'next';
import { DemoShell } from '@/components/DemoShell';

export const metadata: Metadata = { title: 'Try Grawal', robots: { index: false, follow: false } };

// Shown inside the phone and desktop shots on the website, so visitors can try the app.
export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return <DemoShell>{children}</DemoShell>;
}
