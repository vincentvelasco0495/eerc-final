import { useParams } from 'react-router';

import { CONFIG } from 'src/global-config';
import { QuizDetailsView } from 'src/features/quizzes/views/quiz-details-view';

const metadata = { title: `Quiz details | Dashboard - ${CONFIG.appName}` };

export default function QuizDetailsPage() {
  const { quizId = '' } = useParams();

  return (
    <>
      <title>{metadata.title}</title>

      <QuizDetailsView quizId={quizId} />
    </>
  );
}
