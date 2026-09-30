import { CONFIG } from 'src/global-config';
import { InstructorSettingsView } from 'src/features/instructor-settings/views/instructor-settings-view';

const metadata = { title: `Instructor settings | Dashboard - ${CONFIG.appName}` };

export default function InstructorSettingsPage() {
  return (
    <>
      <title>{metadata.title}</title>

      <InstructorSettingsView />
    </>
  );
}
