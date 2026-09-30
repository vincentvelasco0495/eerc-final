import { CONFIG } from 'src/global-config';
import { CourseQuizTakeView } from 'src/features/courses/views/course-quiz-take-view';

// ----------------------------------------------------------------------

const metadata = { title: `Quiz | ${CONFIG.appName}` };

export default function CourseQuizPage() {
  return (
    <>
      <title>{metadata.title}</title>
      <CourseQuizTakeView />
    </>
  );
}
