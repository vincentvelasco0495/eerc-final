import { CONFIG } from 'src/global-config';
import { InstructorAssignmentsView } from 'src/features/instructor-assignments/views/instructor-assignments-view';

const metadata = { title: `Student Assignments | Dashboard - ${CONFIG.appName}` };

export default function InstructorAssignmentsPage() {
  return (
    <>
      <title>{metadata.title}</title>

      <InstructorAssignmentsView />
    </>
  );
}
