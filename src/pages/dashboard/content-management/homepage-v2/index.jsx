import { CONFIG } from 'src/global-config';
import { HomepageV2CmsView } from 'src/features/content-management/views/homepage-v2-cms-view';

const metadata = { title: `Homepage | Content Management - ${CONFIG.appName}` };

export default function ContentManagementHomepageV2Page() {
  return (
    <>
      <title>{metadata.title}</title>
      <HomepageV2CmsView />
    </>
  );
}
