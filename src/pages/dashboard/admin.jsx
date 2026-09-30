import { CONFIG } from 'src/global-config';
import { AdminPanelView } from 'src/features/admin/views/admin-panel-view';

const metadata = { title: `Admin | Dashboard - ${CONFIG.appName}` };

export default function AdminPage() {
  return (
    <>
      <title>{metadata.title}</title>

      <AdminPanelView />
    </>
  );
}
