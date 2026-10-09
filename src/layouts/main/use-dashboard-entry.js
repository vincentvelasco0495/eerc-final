import { useCallback } from 'react';

import { useRouter } from 'src/routes/hooks';

import { useAuthContext } from 'src/auth/hooks';
import { getAuthSignInPath, getPostLoginRedirectPath } from 'src/auth/utils';

// ----------------------------------------------------------------------

export function useDashboardEntry() {
  const router = useRouter();
  const { authenticated, loading, user } = useAuthContext();
  const dashboardHref = getPostLoginRedirectPath(user?.role);

  const goToDashboardOrSignIn = useCallback(() => {
    if (loading) {
      return;
    }

    if (authenticated) {
      router.push(dashboardHref);
      return;
    }

    router.push(getAuthSignInPath());
  }, [authenticated, dashboardHref, loading, router]);

  return { goToDashboardOrSignIn, dashboardHref, loading };
}
