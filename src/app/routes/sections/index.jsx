import { lazy, Suspense } from 'react';

import { ErrorBoundary } from 'src/routes/components';
import { authRoutes } from 'src/routes/sections/auth';
import { mainRoutes } from 'src/routes/sections/main';
import { authDemoRoutes } from 'src/routes/sections/auth-demo';

import { MainLayout } from 'src/layouts/main';

import { SplashScreen } from 'src/components/loading-screen';

import { dashboardRoutes } from './dashboard';

const HomePage = lazy(() => import('src/pages/home'));
const Page404 = lazy(() => import('src/pages/error/404'));

export const routesSection = [
  {
    path: '/',
    element: (
      <Suspense fallback={<SplashScreen />}>
        <MainLayout>
          <HomePage />
        </MainLayout>
      </Suspense>
    ),
    errorElement: <ErrorBoundary />,
  },
  ...authRoutes,
  ...authDemoRoutes,
  ...dashboardRoutes,
  ...mainRoutes,
  { path: '*', element: <Page404 /> },
];
