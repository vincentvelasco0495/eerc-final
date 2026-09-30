import { useState, useEffect } from 'react';

import { useRouter } from 'src/routes/hooks';

import { SplashScreen } from 'src/components/loading-screen';

import { useAuthContext } from '../hooks';
import { normalizeUserRole } from '../utils/role';
import { getRoleHomePath } from '../utils/page-permissions';

// ----------------------------------------------------------------------

const STAFF_ROLES = new Set(['admin', 'instructor']);

/** Redirects when the signed-in user is not an admin or instructor. */
export function StaffGuard({ children }) {
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

    if (!STAFF_ROLES.has(normalizeUserRole(user?.role))) {
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
