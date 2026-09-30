import { CONFIG } from 'src/global-config';
import axios, { endpoints } from 'src/lib/axios';
import { getLmsSanctumToken, setLmsSanctumSession } from 'src/lib/lms-sanctum-session';

import { setSession } from './utils';
import { JWT_STORAGE_KEY } from './constant';
import { isLaravelLmsApiEnabled } from './laravel-lms-api';
import { createDemoAccessToken, resolveDemoCredentials } from './demo-credentials';

// ----------------------------------------------------------------------

/** **************************************
 * Sign in
 *************************************** */
export const signInWithPassword = async ({ email, password }) => {
  try {
    if (isLaravelLmsApiEnabled()) {
      const res = await axios.post('/api/login', { email, password });
      const { token } = res.data;

      if (!token) {
        throw new Error('Token not returned from API');
      }

      await setSession(null);
      setLmsSanctumSession(token);
      return;
    }

    const demoProfile =
      CONFIG.auth.allowDemoSignIn && resolveDemoCredentials(email, password);

    if (demoProfile) {
      await setSession(createDemoAccessToken(demoProfile));
      return;
    }

    const params = { email, password };

    const res = await axios.post(endpoints.auth.signIn, params);

    const { accessToken } = res.data;

    if (!accessToken) {
      throw new Error('Access token not found in response');
    }

    await setSession(accessToken);
  } catch (error) {
    console.error('Error during sign in:', error);
    throw error;
  }
};

/** **************************************
 * Sign up
 *************************************** */
export const signUp = async ({ email, password, firstName, lastName, confirmPassword }) => {
  try {
    if (isLaravelLmsApiEnabled()) {
      const name = `${firstName} ${lastName}`.trim();
      const res = await axios.post('/api/register', {
        name,
        email,
        password,
        password_confirmation: confirmPassword ?? password,
      });

      const { token } = res.data;

      if (!token) {
        throw new Error('Token not returned from API');
      }

      await setSession(null);
      setLmsSanctumSession(token);
      return;
    }

    const params = {
      email,
      password,
      firstName,
      lastName,
    };

    const res = await axios.post(endpoints.auth.signUp, params);

    const { accessToken } = res.data;

    if (!accessToken) {
      throw new Error('Access token not found in response');
    }

    sessionStorage.setItem(JWT_STORAGE_KEY, accessToken);
  } catch (error) {
    console.error('Error during sign up:', error);
    throw error;
  }
};

/** **************************************
 * Sign out
 *************************************** */
export const signOut = async () => {
  try {
    if (getLmsSanctumToken()) {
      try {
        await axios.post('/api/logout');
      } catch {
        // Token may already be invalid (e.g. logged in elsewhere).
      }
      setLmsSanctumSession(null);
    }
    await setSession(null);
  } catch (error) {
    console.error('Error during sign out:', error);
    throw error;
  }
};
