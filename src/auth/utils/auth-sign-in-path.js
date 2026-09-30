import { paths } from 'src/routes/paths';

import { CONFIG } from 'src/global-config';

// ----------------------------------------------------------------------

const SIGN_IN_PATH_BY_METHOD = {
  jwt: paths.auth.jwt.signIn,
  auth0: paths.auth.auth0.signIn,
  amplify: paths.auth.amplify.signIn,
  firebase: paths.auth.firebase.signIn,
  supabase: paths.auth.supabase.signIn,
};

export function getAuthSignInPath() {
  const { method } = CONFIG.auth;
  return SIGN_IN_PATH_BY_METHOD[method] ?? paths.auth.jwt.signIn;
}
