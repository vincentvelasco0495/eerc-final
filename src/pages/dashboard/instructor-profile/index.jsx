import { CONFIG } from 'src/global-config';
import { InstructorProfileView } from 'src/features/instructor-profile/views/instructor-profile-view';

const metadata = { title: `Instructor Profile | Dashboard - ${CONFIG.appName}` };

export default function InstructorProfilePage() {
  return (
    <>
      <title>{metadata.title}</title>

      <InstructorProfileView />
    </>
  );
}
