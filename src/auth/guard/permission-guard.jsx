import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router';

import { useRouter, usePathname } from 'src/routes/hooks';

import { SplashScreen } from 'src/components/loading-screen';

import { useAuthContext } from '../hooks';
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

/** Redirects when the signed-in user lacks a DB rule for the current path + query. */
export function PermissionGuard({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [searchParams] = useSearchParams();
  const { authenticated, loading, user } = useAuthContext();

  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!authenticated) {
      setIsChecking(false);
      return;
    }

    const query = searchParamsToQuery(searchParams);
    const allowed = canAccessPage(user, pathname, query);

    if (!allowed) {
      const home = getRoleHomePath(user?.role);
      const current = normalizeGuardPath(pathname);
      const target = normalizeGuardPath(home);

      if (current !== target) {
        router.replace(home);
        return;
      }
    }

    setIsChecking(false);
  }, [authenticated, loading, pathname, router, searchParams, user]);

  if (loading || isChecking) {
    return <SplashScreen />;
  }

  return <>{children}</>;
}
