import type { Metadata } from 'next';
import { ComingSoon } from '@/components/ComingSoon';

export const metadata: Metadata = { title: 'Export' };

export default function Export() {
  return <ComingSoon title="Export your wall">Download every win as a PDF or CSV, so your record is always yours.</ComingSoon>;
}
