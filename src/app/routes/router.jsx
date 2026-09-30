import { Outlet, createBrowserRouter } from 'react-router';

import { ErrorBoundary } from 'src/routes/components';

import { routesSection } from 'src/app/routes/sections';
import AppProviders from 'src/app/providers/app-providers';

function AppRoot() {
  return (
    <AppProviders>
      <Outlet />
    </AppProviders>
  );
}

export const router = createBrowserRouter([
  {
    Component: AppRoot,
    errorElement: <ErrorBoundary />,
    children: routesSection,
  },
]);
