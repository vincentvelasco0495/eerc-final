import { CONFIG } from 'src/global-config';
import { AnalyticsDashboardView } from 'src/features/analytics/views/analytics-dashboard-view';

const metadata = { title: `Analytics | Dashboard - ${CONFIG.appName}` };

export default function AnalyticsPage() {
  return (
    <>
      <title>{metadata.title}</title>

      <AnalyticsDashboardView />
    </>
  );
}
