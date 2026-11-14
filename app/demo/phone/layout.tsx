import type { Metadata } from 'next';
import { DemoShell } from '@/components/DemoShell';
import { samplePhoneEntries } from '@/lib/sample';

export const metadata: Metadata = { title: 'Try Grawal', robots: { index: false, follow: false } };

// The website's phone shot: the same live demo, with just the two wins Figma pins there.
export default function PhoneDemoLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* The shot is a whole phone screen, so it keeps Figma's spacing: 48px above the
          header and the nav 46.5px from the bottom (Mobile / Wall / Populated, 2941:2688,
          at the phone's 393px). The second win sits 245.9px lower than the first, and both
          start 2px higher, where Figma's pins reach into the header. */}
      <style>{`.dash { --dash-top: 48px; --dash-bottom: 46.5px; --stagger: 245.9px; } .dash main ul { margin-top: -2px; }`}</style>
      <DemoShell basePath="/demo/phone" entries={samplePhoneEntries}>{children}</DemoShell>
    </>
  );
}
