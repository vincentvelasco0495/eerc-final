import { jwtDecode } from './utils';

// ----------------------------------------------------------------------
// Testing only: hard-coded users until backend auth is implemented.
// Disable via `VITE_ALLOW_DEMO_SIGN_IN=false` (see `global-config.js`).

export const DEMO_SIGN_IN_USERS = [
  {
    id: 'eerc-demo-instructor',
    email: 'admin@demo.com',
    password: '123456',
    role: 'admin',
    displayName: 'Demo Instructor',
  },
  {
    id: 'eerc-demo-student',
    email: 'student@demo.com',
    password: '123456',
    role: 'student',
    displayName: 'Demo Student',
  },
];

/**
 * Validates demo email/password pairs (offline / no API).
 * Returns signed-in profile fields (omit password) when valid.
 */
export function resolveDemoCredentials(email, password) {
  const normalized = email?.trim()?.toLowerCase();
  const match = DEMO_SIGN_IN_USERS.find(
    (u) => u.email.toLowerCase() === normalized && u.password === password
  );
  if (!match) {
    return null;
  }
  return {
    id: match.id,
    email: match.email,
    role: match.role,
    displayName: match.displayName,
  };
}

function base64UrlEncode(input) {
  const json = typeof input === 'string' ? input : JSON.stringify(input);
  return btoa(json).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

/** Unsigned demo JWT shape; `jwtDecode` / `isValidToken` only read payload.exp. */
export function createDemoAccessToken(profile) {
  const header = { alg: 'none', typ: 'JWT' };
  const payload = {
    iss: 'eerc-demo',
    demo: true,
    sub: profile.id,
    email: profile.email,
    role: profile.role,
    displayName: profile.displayName,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
  };
  return `${base64UrlEncode(header)}.${base64UrlEncode(payload)}.demo-signature`;
}

export function getDemoProfileFromAccessToken(accessToken) {
  try {
    const payload = jwtDecode(accessToken);
    if (!payload?.demo || payload.iss !== 'eerc-demo') {
      return null;
    }

    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
      displayName: payload.displayName,
      photoURL: payload.photoURL,
    };
  } catch {
    return null;
  }
}
