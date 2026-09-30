import { CONFIG } from 'src/global-config';
import { StudentSettingsView } from 'src/features/student-settings/views/student-settings-view';

const metadata = { title: `Settings | Dashboard - ${CONFIG.appName}` };

export default function SettingsPage() {
  return (
    <>
      <title>{metadata.title}</title>

      <StudentSettingsView />
    </>
  );
}
