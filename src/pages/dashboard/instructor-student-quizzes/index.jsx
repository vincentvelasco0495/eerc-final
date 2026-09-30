import { CONFIG } from 'src/global-config';
import { InstructorStudentQuizzesView } from 'src/features/instructor-student-quizzes/views/instructor-student-quizzes-view';

export default function Page() {
  return <InstructorStudentQuizzesView />;
}

Page.displayName = `InstructorStudentQuizzesPage${CONFIG.isStaticExport ? 'Static' : ''}`;
