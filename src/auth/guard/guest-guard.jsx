import { useState, useEffect } from 'react';

import { SplashScreen } from 'src/components/loading-screen';

import { useAuthContext } from '../hooks';
import { getPostLoginRedirectPath } from '../utils';

// ----------------------------------------------------------------------

export function GuestGuard({ children }) {
  const { loading, authenticated, user } = useAuthContext();

  const [isChecking, setIsChecking] = useState(true);

  const redirectUrl = getPostLoginRedirectPath(user?.role ?? 'admin');

  const checkPermissions = async () => {
    if (loading) {
      return;
    }

    if (authenticated) {
      // Using `window.location.href` instead of `router.replace` to avoid unnecessary re-rendering
      // that might be caused by the AuthGuard component
      window.location.href = redirectUrl;
      return;
    }

    setIsChecking(false);
  };

  useEffect(() => {
    checkPermissions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authenticated, loading, user]);

  if (isChecking) {
    return <SplashScreen />;
  }

  return <>{children}</>;
}
