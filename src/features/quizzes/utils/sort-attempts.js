function attemptTime(result) {
  const parsed = Date.parse(result?.createdAt || '');
  return Number.isFinite(parsed) ? parsed : 0;
}

/** Newest attempt first. Same-day rows are ordered by their id, which is time-based. */
export function sortAttemptsNewestFirst(results) {
  return [...results].sort((a, b) => {
    const timeDiff = attemptTime(b) - attemptTime(a);
    if (timeDiff !== 0) {
      return timeDiff;
    }
    return String(b?.id ?? '').localeCompare(String(a?.id ?? ''));
  });
}
