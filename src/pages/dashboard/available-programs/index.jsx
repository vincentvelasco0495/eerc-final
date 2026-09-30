import { CONFIG } from 'src/global-config';
import { StudentAvailableProgramsView } from 'src/features/student-profile/views/student-available-programs-view';

const metadata = { title: `Programs | Dashboard - ${CONFIG.appName}` };

export default function AvailableProgramsPage() {
  return (
    <>
      <title>{metadata.title}</title>

      <StudentAvailableProgramsView />
    </>
  );
}
