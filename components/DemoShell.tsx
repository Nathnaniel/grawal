'use client';

import { useState } from 'react';
import { createMemoryStore } from '@/lib/memory-store';
import { sampleCategories, sampleProfile, sampleSummary } from '@/lib/sample';
import { AppProvider } from './AppProvider';
import { Dashboard } from './dashboard/Dashboard';

// The website's try-it demo: the real dashboard on sample wins, kept in memory so
// nothing a visitor does is saved or seen by anyone else. A neutral name stands in
// for a real person.
const DEMO_USER = '00000000-0000-4000-8000-00000000d3e0';
const DEMO_PROFILE = { ...sampleProfile, id: DEMO_USER, name: 'Grace', avatar_path: null };

export function DemoShell({ children }: { children: React.ReactNode }) {
  const [store] = useState(createMemoryStore);
  const [summary] = useState(sampleSummary);
  return (
    <AppProvider userId={DEMO_USER} email="grace@example.com" profile={DEMO_PROFILE} avatarUrl={null} categories={sampleCategories} summary={summary} basePath="/demo" demo store={store}>
      <Dashboard>{children}</Dashboard>
    </AppProvider>
  );
}
