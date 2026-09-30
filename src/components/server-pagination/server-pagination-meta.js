/**
 * Shared helpers for server-driven list pagination (LMS + admin APIs).
 * Supports Laravel-style snake_case (`current_page`, `last_page`, …) and camelCase (`currentPage`, …).
 */

// ----------------------------------------------------------------------

export function buildPageList(current, last) {
  if (last <= 1) return [1];
  if (last <= 7) {
    return Array.from({ length: last }, (_, i) => i + 1);
  }
  const set = new Set([1, last, current, current - 1, current + 1]);
  return [...set].filter((p) => p >= 1 && p <= last).sort((a, b) => a - b);
}

export function deriveRangeFromTotal(page, perPage, total) {
  const p = Math.max(1, Number(page) || 1);
  const pp = Math.max(1, Number(perPage) || 1);
  const t = Math.max(0, Number(total) || 0);

  if (t === 0) {
    return { from: 0, to: 0 };
  }

  const from = (p - 1) * pp + 1;
  const to = Math.min(p * pp, t);

  return { from, to };
}

/**
 * @param {Record<string, unknown> | null | undefined} meta
 * @param {{ page?: number; perPage?: number; lastPage?: number; total?: number }} [fallbacks]
 */
export function normalizeServerPaginationMeta(meta, fallbacks = {}) {
  const total = Number(meta?.total ?? fallbacks.total ?? 0);
  const currentPage = Math.max(
    1,
    Number(meta?.current_page ?? meta?.currentPage ?? fallbacks.page ?? 1) || 1
  );
  const lastPage = Math.max(
    1,
    Number(meta?.last_page ?? meta?.lastPage ?? fallbacks.lastPage ?? 1) || 1
  );
  const perPage = Math.max(
    1,
    Number(meta?.per_page ?? meta?.perPage ?? fallbacks.perPage ?? 10) || 10
  );

  const fromRaw = meta?.from;
  const toRaw = meta?.to;

  let from = Number(fromRaw);
  let to = Number(toRaw);

  if (!Number.isFinite(from) || from < 0) {
    ({ from, to } = deriveRangeFromTotal(currentPage, perPage, total));
  } else if (!Number.isFinite(to) || to < 0) {
    to = deriveRangeFromTotal(currentPage, perPage, total).to;
  }

  return {
    total,
    currentPage,
    lastPage,
    perPage,
    from,
    to,
  };
}
