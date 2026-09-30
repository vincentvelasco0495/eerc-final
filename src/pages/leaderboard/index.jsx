import { CONFIG } from 'src/global-config';
import { LeaderboardView } from 'src/features/leaderboard/views/leaderboard-view';

const metadata = { title: `Leaderboard | Dashboard - ${CONFIG.appName}` };

export default function LeaderboardPage() {
  return (
    <>
      <title>{metadata.title}</title>

      <LeaderboardView />
    </>
  );
}
