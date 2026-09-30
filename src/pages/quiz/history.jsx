import { CONFIG } from 'src/global-config';
import { QuizHistoryView } from 'src/features/quizzes/views/quiz-history-view';

const metadata = { title: `Quiz history | Dashboard - ${CONFIG.appName}` };

export default function QuizHistoryPage() {
  return (
    <>
      <title>{metadata.title}</title>

      <QuizHistoryView />
    </>
  );
}
