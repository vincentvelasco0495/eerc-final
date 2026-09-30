import { CONFIG } from 'src/global-config';
import { InstructorAssignmentLeaderboardView } from 'src/features/instructor-assignments/views/instructor-assignment-leaderboard-view';

const metadata = { title: `Assignment leaderboard | Dashboard - ${CONFIG.appName}` };

export default function InstructorAssignmentLeaderboardPage() {
  return (
    <>
      <title>{metadata.title}</title>

      <InstructorAssignmentLeaderboardView />
    </>
  );
}
