import { CONFIG } from 'src/global-config';

/** True when the SPA targets the Laravel LMS API (`VITE_SERVER_URL`). */
export function isLaravelLmsApiEnabled() {
  return Boolean(CONFIG.serverUrl?.trim());
}

/**
 * Maps `GET /api/user` (or login/register `user`) to the JWT auth context shape.
 * @param {Record<string, any>} lmsUser
 * @param {string} token Sanctum plain-text token
 */
export function mapLmsUserToAuthSessionUser(lmsUser, token) {
  if (!lmsUser) {
    return null;
  }

  return {
    ...lmsUser,
    id: lmsUser.id,
    displayName: lmsUser.displayName,
    email: lmsUser.email,
    role: lmsUser.role ?? 'student',
    accessToken: token,
  };
}
