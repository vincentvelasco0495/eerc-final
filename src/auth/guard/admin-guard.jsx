import { useState, useEffect } from 'react';

import { useRouter } from 'src/routes/hooks';

import { SplashScreen } from 'src/components/loading-screen';

import { useAuthContext } from '../hooks';
import { normalizeUserRole } from '../utils/role';
import { getRoleHomePath } from '../utils/page-permissions';

// ----------------------------------------------------------------------

/** Redirects when the signed-in user is not an admin. */
export function AdminGuard({ children }) {
  const router = useRouter();
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

    if (normalizeUserRole(user?.role) !== 'admin') {
      router.replace(getRoleHomePath(user?.role));
      return;
    }

    setIsChecking(false);
  }, [authenticated, loading, router, user]);

  if (loading || isChecking) {
    return <SplashScreen />;
  }

  return <>{children}</>;
}
