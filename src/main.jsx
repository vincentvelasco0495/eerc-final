import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router';

import { installStaleChunkRecovery } from 'src/utils/reload-stale-chunk';

import { router } from 'src/app/routes/router';

installStaleChunkRecovery();

const root = createRoot(document.getElementById('root'));

root.render(
  // <StrictMode>
    <RouterProvider router={router} />
  // </StrictMode>
);
