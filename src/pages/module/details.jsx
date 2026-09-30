import { useParams } from 'react-router';

import { CONFIG } from 'src/global-config';
import { ModulePlayerView } from 'src/features/modules/views/module-player-view';

const metadata = { title: `Module player | Dashboard - ${CONFIG.appName}` };

export default function ModuleDetailsPage() {
  const { moduleId = '' } = useParams();

  return (
    <>
      <title>{metadata.title}</title>

      <ModulePlayerView moduleId={moduleId} />
    </>
  );
}
