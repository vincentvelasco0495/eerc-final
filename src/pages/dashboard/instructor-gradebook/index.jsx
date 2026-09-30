import { CONFIG } from 'src/global-config';
import { InstructorGradebookView } from 'src/features/instructor-gradebook/views/instructor-gradebook-view';

const metadata = { title: `Gradebook | Dashboard - ${CONFIG.appName}` };

export default function InstructorGradebookPage() {
  return (
    <>
      <title>{metadata.title}</title>

      <InstructorGradebookView />
    </>
  );
}
