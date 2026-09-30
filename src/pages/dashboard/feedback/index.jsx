import { CONFIG } from 'src/global-config';
import { FeedbackInboxView } from 'src/features/contact-feedback/views/feedback-inbox-view';

// ----------------------------------------------------------------------

const metadata = { title: `Feedback | Dashboard - ${CONFIG.appName}` };

export default function FeedbackInboxPage() {
  return (
    <>
      <title>{metadata.title}</title>
      <FeedbackInboxView />
    </>
  );
}
