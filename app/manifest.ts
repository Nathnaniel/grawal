import type { MetadataRoute } from 'next';
import { appManifest } from '@/lib/app-manifest';

export default function manifest(): MetadataRoute.Manifest {
  return appManifest();
}
