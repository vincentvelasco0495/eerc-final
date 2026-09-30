import { CONFIG } from 'src/global-config';
import { StudentAssignmentsView } from 'src/features/student-assignments/views/student-assignments-view';

const metadata = { title: `Assignments | Dashboard - ${CONFIG.appName}` };

export default function AssignmentsPage() {
  return (
    <>
      <title>{metadata.title}</title>

      <StudentAssignmentsView />
    </>
  );
}
