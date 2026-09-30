import { CONFIG } from 'src/global-config';
import { CourseQuizStartView } from 'src/features/courses/views/course-quiz-start-view';

// ----------------------------------------------------------------------

const metadata = { title: `Start quiz | ${CONFIG.appName}` };

export default function CourseQuizStartPage() {
  return (
    <>
      <title>{metadata.title}</title>
      <CourseQuizStartView />
    </>
  );
}
