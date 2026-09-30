import { CONFIG } from 'src/global-config';
import { EnrollmentWizardView } from 'src/features/enrollment/enrollment-wizard/enrollment-wizard-view';

const metadata = { title: `Enrollment Application | Dashboard - ${CONFIG.appName}` };

export default function EnrollmentApplyPage() {
  return (
    <>
      <title>{metadata.title}</title>
      <EnrollmentWizardView />
    </>
  );
}
