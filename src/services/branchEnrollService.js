/** Allowed `per_page` values (must match Laravel validation). */
export const BRANCH_ENROLL_PER_PAGE_OPTIONS = [5, 10, 20, 50, 100];

export function normalizeBranchEnrollPage(value) {
  const n = Number.parseInt(String(value ?? ''), 10);
  return Number.isFinite(n) && n >= 1 ? n : 1;
}

export function normalizeBranchEnrollPerPage(value) {
  const n = Number.parseInt(String(value ?? ''), 10);
  return BRANCH_ENROLL_PER_PAGE_OPTIONS.includes(n) ? n : 10;
}
