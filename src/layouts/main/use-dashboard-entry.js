import { useCallback } from 'react';

import { useRouter } from 'src/routes/hooks';

import { useAuthContext } from 'src/auth/hooks';
import { getAuthSignInPath, getPostLoginRedirectPath } from 'src/auth/utils';

// ----------------------------------------------------------------------

export function useDashboardEntry() {
  const router = useRouter();
  const { authenticated, loading, user } = useAuthContext();

  const goToDashboardOrSignIn = useCallback(() => {
    if (loading) {
      return;
    }

    if (authenticated) {
      router.push(getPostLoginRedirectPath(user?.role));
      return;
    }

    router.push(getAuthSignInPath());
  }, [authenticated, loading, router, user?.role]);

  return { goToDashboardOrSignIn, loading };
}
