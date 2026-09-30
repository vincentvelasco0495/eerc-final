import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router';

import { router } from 'src/app/routes/router';

const root = createRoot(document.getElementById('root'));

root.render(
  // <StrictMode>
    <RouterProvider router={router} />
  // </StrictMode>
);
