export function apiErrorHandler(error, fallback = 'Request failed.') {
  const payload = error?.response?.data;
  const msg =
    payload && typeof payload === 'object' && payload.message != null ? payload.message : null;
  if (typeof msg === 'string' && msg.trim()) return msg.trim();
  if (typeof payload === 'string' && payload.trim()) return payload.trim();
  if (typeof error?.message === 'string' && error.message.trim()) return error.message.trim();
  return fallback;
}
