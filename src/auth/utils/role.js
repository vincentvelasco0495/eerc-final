// ----------------------------------------------------------------------

export function normalizeUserRole(role) {
  return typeof role === 'string' ? role.trim().toLowerCase() : '';
}
