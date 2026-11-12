import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PreviewShell } from '@/components/PreviewShell';

export const metadata: Metadata = { title: 'Preview' };

// The real screens with sample wins, for development only.
export default function PreviewLayout({ children }: { children: React.ReactNode }) {
  if (process.env.NODE_ENV === 'production') notFound();
  return <PreviewShell>{children}</PreviewShell>;
}
