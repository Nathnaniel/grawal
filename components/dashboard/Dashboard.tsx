'use client';

import { useApp } from '../AppProvider';
import { AccountMenu } from './AccountMenu';
import { CreatePanel } from './CreatePanel';
import { Header } from './Header';
import { NoteDetail } from './NoteDetail';
import { NotificationsPanel } from './NotificationsPanel';
import { Overlay } from './Overlay';
import { SearchPanel } from './SearchPanel';
import { SettingsPanel } from './SettingsPanel';
import { SideNav } from './SideNav';

/** The signed-in dashboard: header, navigation, the page, and whichever panel is open. */
export function Dashboard({ children }: { children: React.ReactNode }) {
  const { panel } = useApp();
  return (
    <div className="dash">
      <Header />
      <main id="main" tabIndex={-1}>{children}</main>
      <SideNav />
      {panel && <Overlay />}
      {panel?.kind === 'create' && <CreatePanel key={panel.entry?.id ?? 'new'} entry={panel.entry} />}
      {panel?.kind === 'note' && <NoteDetail key={panel.entry.id} entry={panel.entry} />}
      {panel?.kind === 'search' && <SearchPanel />}
      {panel?.kind === 'notifications' && <NotificationsPanel />}
      {panel?.kind === 'account' && <AccountMenu />}
      {panel?.kind === 'settings' && <SettingsPanel />}
    </div>
  );
}
