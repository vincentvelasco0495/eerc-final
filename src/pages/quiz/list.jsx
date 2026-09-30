import { CONFIG } from 'src/global-config';
import { QuizListView } from 'src/features/quizzes/views/quiz-list-view';

const metadata = { title: `Quizzes | Dashboard - ${CONFIG.appName}` };

export default function QuizListPage() {
  return (
    <>
      <title>{metadata.title}</title>

      <QuizListView />
    </>
  );
}
