'use client';

import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { createMemoryStore } from '@/lib/memory-store';
import { sampleCategories, sampleProfile, SAMPLE_USER } from '@/lib/sample';
import { AppProvider } from './AppProvider';
import { AppShell } from './AppShell';

export function PreviewShell({ children }: { children: React.ReactNode }) {
  const [store] = useState(createMemoryStore);
  const fullScreen = usePathname().endsWith('/onboarding');
  return (
    <AppProvider userId={SAMPLE_USER} profile={sampleProfile} categories={sampleCategories} basePath="/preview" store={store}>
      {fullScreen ? children : <AppShell>{children}</AppShell>}
    </AppProvider>
  );
}
