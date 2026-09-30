import { useSetState } from 'minimal-shared/hooks';
import { useMemo, useEffect, useCallback } from 'react';

import { CONFIG } from 'src/global-config';
import axios, { endpoints } from 'src/lib/axios';
import { getLmsSanctumToken, setLmsSanctumSession } from 'src/lib/lms-sanctum-session';

import { JWT_STORAGE_KEY } from './constant';
import { AuthContext } from '../auth-context';
import { setSession, isValidToken } from './utils';
import { getDemoProfileFromAccessToken } from './demo-credentials';
import { isLaravelLmsApiEnabled, mapLmsUserToAuthSessionUser } from './laravel-lms-api';

// ----------------------------------------------------------------------

function normalizeJwtSessionUser(record) {
  return { ...record, role: record?.role ?? 'admin' };
}

/**
 * NOTE:
 * We only build demo at basic level.
 * Customer will need to do some extra handling yourself if you want to extend the logic and other features...
 */

export function AuthProvider({ children }) {
  const { state, setState } = useSetState({ user: null, loading: true });

  const checkUserSession = useCallback(async () => {
    try {
      if (isLaravelLmsApiEnabled() && getLmsSanctumToken()) {
        try {
          const res = await axios.get('/api/user', { timeout: 12_000 });
          const token = getLmsSanctumToken();
          const user = normalizeJwtSessionUser(mapLmsUserToAuthSessionUser(res.data, token));
          setState({ user, loading: false });
          return user;
        } catch {
          setLmsSanctumSession(null);
        }
      }

      const accessToken = sessionStorage.getItem(JWT_STORAGE_KEY);

      if (accessToken && isValidToken(accessToken)) {
        await setSession(accessToken);

        const demoProfile = getDemoProfileFromAccessToken(accessToken);
        if (demoProfile) {
          if (!CONFIG.auth.allowDemoSignIn) {
            await setSession(null);
            setState({ user: null, loading: false });
            return null;
          }
          const user = normalizeJwtSessionUser({ ...demoProfile, accessToken });
          setState({ user, loading: false });
          return user;
        }

        const res = await axios.get(endpoints.auth.me);

        const { user: apiUser } = res.data;

        const user = normalizeJwtSessionUser({ ...apiUser, accessToken });
        setState({ user, loading: false });
        return user;
      }

      setState({ user: null, loading: false });
      return null;
    } catch (error) {
      console.error(error);
      setState({ user: null, loading: false });
      return null;
    }
  }, [setState]);

  useEffect(() => {
    checkUserSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ----------------------------------------------------------------------

  const checkAuthenticated = state.user ? 'authenticated' : 'unauthenticated';

  const status = state.loading ? 'loading' : checkAuthenticated;

  const memoizedValue = useMemo(
    () => ({
      user: state.user ? { ...state.user, role: state.user?.role ?? 'admin' } : null,
      checkUserSession,
      loading: status === 'loading',
      authenticated: status === 'authenticated',
      unauthenticated: status === 'unauthenticated',
    }),
    [checkUserSession, state.user, status]
  );

  return <AuthContext value={memoizedValue}>{children}</AuthContext>;
}
