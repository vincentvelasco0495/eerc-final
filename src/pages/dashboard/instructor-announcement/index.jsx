import { CONFIG } from 'src/global-config';
import { InstructorAnnouncementView } from 'src/features/instructor-profile/views/instructor-announcement-view';

const metadata = { title: `Announcement | Dashboard - ${CONFIG.appName}` };

export default function InstructorAnnouncementPage() {
  return (
    <>
      <title>{metadata.title}</title>

      <InstructorAnnouncementView />
    </>
  );
}
