import { getRoleHomePath } from './page-permissions';

// ----------------------------------------------------------------------

/**
 * Default route after JWT sign-in / guest redirect.
 * Always the role home — login URLs do not carry a `returnTo` query.
 */
export function getPostLoginRedirectPath(role) {
  return getRoleHomePath(role);
}

/** @deprecated Use {@link getPostLoginRedirectPath}. Extra args are ignored. */
export function resolvePostLoginUrl(role) {
  return getPostLoginRedirectPath(role);
}
