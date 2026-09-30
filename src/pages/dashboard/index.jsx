import { Navigate } from 'react-router';

import { paths } from 'src/routes/paths';

import { CONFIG } from 'src/global-config';

// ----------------------------------------------------------------------

const metadata = { title: `Dashboard - ${CONFIG.appName}` };

export default function OverviewAppPage() {
  return (
    <>
      <title>{metadata.title}</title>

      <Navigate to={paths.dashboard.availablePrograms} replace />
    </>
  );
}
