'use client';

import { useState } from 'react';
import { createMemoryStore } from '@/lib/memory-store';
import { sampleCategories, SAMPLE_EMAIL, sampleProfile, sampleSummary, SAMPLE_USER } from '@/lib/sample';
import { AppProvider } from './AppProvider';
import { Dashboard } from './dashboard/Dashboard';

export function PreviewShell({ children }: { children: React.ReactNode }) {
  const [store] = useState(createMemoryStore);
  const [summary] = useState(sampleSummary);
  return (
    <AppProvider userId={SAMPLE_USER} email={SAMPLE_EMAIL} profile={sampleProfile} avatarUrl={null} categories={sampleCategories} summary={summary} basePath="/preview" store={store}>
      <Dashboard>{children}</Dashboard>
    </AppProvider>
  );
}
