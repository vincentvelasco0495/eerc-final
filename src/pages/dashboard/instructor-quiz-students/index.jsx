import { CONFIG } from 'src/global-config';
import { InstructorQuizStudentsView } from 'src/features/instructor-student-quizzes/views/instructor-quiz-students-view';

export default function Page() {
  return <InstructorQuizStudentsView />;
}

Page.displayName = `InstructorQuizStudentsPage${CONFIG.isStaticExport ? 'Static' : ''}`;
