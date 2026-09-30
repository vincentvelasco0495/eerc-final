import { CONFIG } from 'src/global-config';
import { InstructorQuizLeaderboardView } from 'src/features/instructor-student-quizzes/views/instructor-quiz-leaderboard-view';

export default function Page() {
  return <InstructorQuizLeaderboardView />;
}

Page.displayName = `InstructorQuizLeaderboardPage${CONFIG.isStaticExport ? 'Static' : ''}`;
