import { CONFIG } from 'src/global-config';
import { InstructorAssignmentStudentsView } from 'src/features/instructor-assignments/views/instructor-assignment-students-view';

const metadata = { title: `Assignment students | Dashboard - ${CONFIG.appName}` };

export default function InstructorAssignmentStudentsPage() {
  return (
    <>
      <title>{metadata.title}</title>

      <InstructorAssignmentStudentsView />
    </>
  );
}
