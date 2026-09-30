import { CONFIG } from 'src/global-config';
import { StudentAssignmentLeaderboardView } from 'src/features/student-assignments/views/student-assignment-leaderboard-view';

export default function Page() {
  return <StudentAssignmentLeaderboardView />;
}

Page.displayName = `StudentAssignmentLeaderboardPage${CONFIG.isStaticExport ? 'Static' : ''}`;
