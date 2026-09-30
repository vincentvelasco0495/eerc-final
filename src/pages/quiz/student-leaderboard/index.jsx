import { CONFIG } from 'src/global-config';
import { StudentQuizLeaderboardView } from 'src/features/quizzes/views/student-quiz-leaderboard-view';

export default function Page() {
  return <StudentQuizLeaderboardView />;
}

Page.displayName = `StudentQuizLeaderboardPage${CONFIG.isStaticExport ? 'Static' : ''}`;
