/** Allowed `per_page` values (must match Laravel validation). */
export const PAYMENT_HISTORY_PER_PAGE_OPTIONS = [5, 10, 20, 50, 100];

export function normalizePaymentHistoryPage(value) {
  const n = Number.parseInt(String(value ?? ''), 10);
  return Number.isFinite(n) && n >= 1 ? n : 1;
}

export function normalizePaymentHistoryPerPage(value) {
  const n = Number.parseInt(String(value ?? ''), 10);
  return PAYMENT_HISTORY_PER_PAGE_OPTIONS.includes(n) ? n : 10;
}

export const PAYMENT_VERIFICATION_FILTER_OPTIONS = [
  { value: '', label: 'All statuses' },
  { value: 'pending', label: 'Pending review' },
  { value: 'correct', label: 'Correct' },
  { value: 'invalid', label: 'Invalid' },
];
