import { paths } from 'src/routes/paths';

import { normalizeUserRole } from './role';

// ----------------------------------------------------------------------

/** Fallback when API has not returned `pagePermissions` (demo / offline). */
const FALLBACK_RULES = {
  admin: [
    { path: '/dashboard', matchType: 'exact', query: null },
    { path: '/course-curriculum', matchType: 'exact', query: { new: '1' } },
    { path: '/course-curriculum/*/edit', matchType: 'path_pattern', query: null },
    { path: '/course-curriculum', matchType: 'exact', query: null },
    { path: '/setting-program', matchType: 'prefix', query: null },
    { path: '/setting-batch-enroll', matchType: 'prefix', query: null },
    { path: '/setting-mode-of-learning', matchType: 'prefix', query: null },
    { path: '/setting-branch-enroll', matchType: 'prefix', query: null },
    { path: '/setting-review-schedule', matchType: 'prefix', query: null },
    { path: '/setting-honors-awards-discount', matchType: 'prefix', query: null },
    { path: '/setting-package-enroll', matchType: 'prefix', query: null },
    { path: '/setting-instructor', matchType: 'prefix', query: null },
    { path: '/setting-student', matchType: 'prefix', query: null },
    { path: '/setting-payment', matchType: 'prefix', query: null },
    { path: '/setting-profile', matchType: 'exact', query: null },
    { path: '/enrollment', matchType: 'prefix', query: null },
    { path: '/payment-history', matchType: 'prefix', query: null },
    { path: '/announcement', matchType: 'exact', query: null },
    { path: '/feedback', matchType: 'prefix', query: null },
    { path: '/gradebook', matchType: 'exact', query: null },
    { path: '/student-quizzes', matchType: 'prefix', query: null },
    { path: '/assignment', matchType: 'prefix', query: null },
    { path: '/content-management', matchType: 'prefix', query: null },
    { path: '/admin', matchType: 'prefix', query: null },
    { path: '/quizzes/history', matchType: 'prefix', query: null },
    { path: '/quizzes', matchType: 'prefix', query: null },
    { path: '/course-details', matchType: 'prefix', query: null },
    { path: '/courses', matchType: 'prefix', query: null },
  ],
  instructor: [
    { path: '/instructor-home', matchType: 'exact', query: null },
    { path: '/course-curriculum/*/edit', matchType: 'path_pattern', query: null },
    { path: '/setting-mode-of-learning', matchType: 'prefix', query: null },
    { path: '/setting-branch-enroll', matchType: 'prefix', query: null },
    { path: '/setting-review-schedule', matchType: 'prefix', query: null },
    { path: '/setting-honors-awards-discount', matchType: 'prefix', query: null },
    { path: '/setting-package-enroll', matchType: 'prefix', query: null },
    { path: '/setting-profile', matchType: 'exact', query: null },
    { path: '/enrollment', matchType: 'prefix', query: null },
    { path: '/payment-history', matchType: 'prefix', query: null },
    { path: '/announcement', matchType: 'exact', query: null },
    { path: '/feedback', matchType: 'prefix', query: null },
    { path: '/gradebook', matchType: 'exact', query: null },
    { path: '/student-quizzes', matchType: 'prefix', query: null },
    { path: '/assignment', matchType: 'prefix', query: null },
    { path: '/content-management', matchType: 'prefix', query: null },
    { path: '/courses', matchType: 'prefix', query: null },
    { path: '/quizzes/history', matchType: 'prefix', query: null },
    { path: '/quizzes', matchType: 'prefix', query: null },
  ],
  student: [
    { path: '/available-programs', matchType: 'exact', query: null },
    { path: '/enrollment/apply', matchType: 'prefix', query: null },
    { path: '/assignments', matchType: 'prefix', query: null },
    { path: '/assignments/*/leaderboard', matchType: 'path_pattern', query: null },
    { path: '/quizzes', matchType: 'prefix', query: null },
    { path: '/quizzes/*/leaderboard', matchType: 'path_pattern', query: null },
    { path: '/quizzes/history', matchType: 'prefix', query: null },
    { path: '/settings', matchType: 'exact', query: null },
    { path: '/course-details', matchType: 'prefix', query: null },
    { path: '/courses', matchType: 'prefix', query: null },
    { path: '/program-course-detail', matchType: 'prefix', query: null },
  ],
};

// ----------------------------------------------------------------------

function normalizePath(pathname) {
  const path = (pathname ?? '').trim();

  if (!path) {
    return '/';
  }

  const withSlash = path.startsWith('/') ? path : `/${path}`;

  return withSlash.replace(/\/$/, '') || '/';
}

function queryMatches(ruleQuery, queryParams) {
  if (!ruleQuery || Object.keys(ruleQuery).length === 0) {
    return true;
  }

  return Object.entries(ruleQuery).every(([key, expected]) => {
    const actual = queryParams?.[key];
    return String(actual ?? '') === String(expected);
  });
}

function patternToRegex(pattern) {
  const normalized = normalizePath(pattern);
  const escaped = normalized.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regexBody = escaped.replace(/\\\*/g, '[^/]+');

  return new RegExp(`^${regexBody}$`);
}

function ruleMatches(rule, pathname, queryParams) {
  const path = normalizePath(pathname);
  const rulePath = normalizePath(rule.path);

  if (!queryMatches(rule.query, queryParams)) {
    return false;
  }

  const matchType = rule.matchType ?? 'exact';

  if (matchType === 'prefix') {
    return path === rulePath || path.startsWith(`${rulePath}/`);
  }

  if (matchType === 'path_pattern') {
    return patternToRegex(rulePath).test(path);
  }

  return path === rulePath;
}

function ruleQueryParams(rule) {
  if (!rule?.query || typeof rule.query !== 'object') {
    return {};
  }

  return { ...rule.query };
}

function dedupeRules(rules) {
  const seen = new Set();

  return rules.filter((rule) => {
    const key = `${normalizePath(rule.path)}|${rule.matchType ?? 'exact'}|${JSON.stringify(rule.query ?? null)}`;

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);

    return true;
  });
}

function matchTypeBreadth(matchType) {
  if (matchType === 'prefix') {
    return 2;
  }
  if (matchType === 'path_pattern') {
    return 1;
  }
  return 0;
}

export function getPagePermissionRules(user) {
  const fromApi = user?.pagePermissions;
  const role = normalizeUserRole(user?.role);
  const fallbacks = FALLBACK_RULES[role] ?? [];

  if (!Array.isArray(fromApi) || fromApi.length === 0) {
    return fallbacks;
  }

  const merged = fromApi.map((rule) => ({ ...rule }));

  for (const fb of fallbacks) {
    const fbPath = normalizePath(fb.path);
    const fbType = fb.matchType ?? 'exact';
    const existingIndex = merged.findIndex((rule) => normalizePath(rule.path) === fbPath);

    if (existingIndex === -1) {
      if (fbType === 'path_pattern' || !merged.some((rule) => ruleMatches(rule, fbPath, ruleQueryParams(fb)))) {
        merged.push({ ...fb });
      }
      continue;
    }

    const existing = merged[existingIndex];
    const existingType = existing.matchType ?? 'exact';

    if (matchTypeBreadth(fbType) > matchTypeBreadth(existingType)) {
      merged[existingIndex] = { ...existing, matchType: fbType };
    }
  }

  return dedupeRules(merged);
}

export function canAccessPage(user, pathname, queryParams = {}) {
  const rules = getPagePermissionRules(user);

  if (!rules.length) {
    return false;
  }

  return rules.some((rule) => ruleMatches(rule, pathname, queryParams));
}

export function canAccessPageHref(user, hrefOrPath) {
  if (!hrefOrPath || typeof hrefOrPath !== 'string') {
    return false;
  }

  try {
    const url = hrefOrPath.startsWith('http')
      ? new URL(hrefOrPath)
      : new URL(hrefOrPath, 'http://local');

    const query = Object.fromEntries(url.searchParams.entries());

    return canAccessPage(user, url.pathname, query);
  } catch {
    return canAccessPage(user, hrefOrPath, {});
  }
}

/** Default landing route per role (aligned with backend `PagePermissionService`). */
export function getRoleHomePath(role) {
  const normalized = normalizeUserRole(role);

  if (normalized === 'student') {
    return paths.dashboard.availablePrograms;
  }

  if (normalized === 'admin') {
    return paths.dashboard.home;
  }

  if (normalized === 'instructor') {
    return paths.dashboard.instructorHome;
  }

  return paths.dashboard.availablePrograms;
}

export function searchParamsToQuery(searchParams) {
  if (!searchParams) {
    return {};
  }

  if (typeof searchParams.entries === 'function') {
    return Object.fromEntries(searchParams.entries());
  }

  return { ...searchParams };
}
