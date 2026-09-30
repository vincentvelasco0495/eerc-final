import axios from 'src/lib/axios';

import { JWT_STORAGE_KEY } from 'src/auth/context/jwt/constant';

import { LMS_SANCTUM_TOKEN_KEY } from './lms-api-auth-keys';

export function getLmsSanctumToken() {
  if (typeof sessionStorage === 'undefined') {
    return null;
  }
  return sessionStorage.getItem(LMS_SANCTUM_TOKEN_KEY);
}

/** Call after `POST /api/login` or `/api/register` so LMS API routes send `Authorization: Bearer …`. */
export function setLmsSanctumSession(token) {
  if (token) {
    sessionStorage.setItem(LMS_SANCTUM_TOKEN_KEY, token);
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    return;
  }

  sessionStorage.removeItem(LMS_SANCTUM_TOKEN_KEY);
  const jwt = sessionStorage.getItem(JWT_STORAGE_KEY);
  if (jwt) {
    axios.defaults.headers.common.Authorization = `Bearer ${jwt}`;
  } else {
    delete axios.defaults.headers.common.Authorization;
  }
}
