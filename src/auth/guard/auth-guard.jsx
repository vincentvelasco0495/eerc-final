import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router';

import { isDashboardLayoutPath } from 'src/routes/paths';
import { useRouter, usePathname } from 'src/routes/hooks';

import { SplashScreen } from 'src/components/loading-screen';

import { useAuthContext } from '../hooks';
import { getAuthSignInPath } from '../utils';
import {
  canAccessPage,
  getRoleHomePath,
  searchParamsToQuery,
} from '../utils/page-permissions';

// ----------------------------------------------------------------------

function normalizeGuardPath(pathname) {
  const path = (pathname ?? '').trim();
  if (!path) {
    return '/';
  }
  const withSlash = path.startsWith('/') ? path : `/${path}`;
  return withSlash.replace(/\/$/, '') || '/';
}

function createRedirectPath(signInPath, returnToPath) {
  const queryString = new URLSearchParams({ returnTo: returnToPath }).toString();
  return `${signInPath}?${queryString}`;
}

export function AuthGuard({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [searchParams] = useSearchParams();

  const { authenticated, loading, user } = useAuthContext();

  const [isChecking, setIsChecking] = useState(true);

  const isPublicPath =
    /^\/course-details\/[^/]+(\/.*)?$/.test(pathname ?? '') ||
    /^\/program-course-detail(\/.*)?$/.test(pathname ?? '');

  useEffect(() => {
    if (loading) {
      return;
    }

    if (isPublicPath) {
      setIsChecking(false);
      return;
    }

    if (!authenticated) {
      router.replace(createRedirectPath(getAuthSignInPath(), pathname));
      setIsChecking(false);
      return;
    }

    if (isDashboardLayoutPath(pathname)) {
      const query = searchParamsToQuery(searchParams);

      if (!canAccessPage(user, pathname, query)) {
        const home = getRoleHomePath(user?.role);
        const current = normalizeGuardPath(pathname);
        const target = normalizeGuardPath(home);

        if (current !== target) {
          router.replace(home);
          return;
        }
      }
    }

    setIsChecking(false);
  }, [authenticated, isPublicPath, loading, pathname, router, searchParams, user]);

  if (loading || isChecking) {
    return <SplashScreen />;
  }

  return <>{children}</>;
}
