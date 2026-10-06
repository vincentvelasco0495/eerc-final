import { enrollmentGrantsCourseAccess } from 'src/constants/lms';

import { normalizeUserRole } from 'src/auth/utils/role';

// ----------------------------------------------------------------------

export const LMS_ACCESS_NONE = 'none';
export const LMS_ACCESS_REPLAY = 'replay';
export const LMS_ACCESS_FULL = 'full';

const REPLAY_TAB_KEYS = ['lecture-video'];
const FULL_TAB_KEYS = ['quiz', 'handouts', 'lecture-video', 'group-study'];

function enrollmentLearningModeFields(item) {
  const formData = item?.formData && typeof item.formData === 'object' ? item.formData : {};
  const labels = formData.labels && typeof formData.labels === 'object' ? formData.labels : {};

  return {
    id: item?.learningModeId ?? formData.learningModeId ?? '',
    name: item?.learningModeName ?? labels.learningMode ?? '',
  };
}

/** BLENDED LEARNING — that label also mentions face-to-face, so check it first. */
export function looksLikeBlendedLearningMode(id = '', name = '') {
  const modeId = String(id ?? '').toLowerCase();
  const modeName = String(name ?? '').toLowerCase();
  return modeId.includes('blended') || modeName.includes('blended');
}

/** PURE ONLINE CLASS — not face-to-face and not blended. */
export function looksLikeOnlineLearningMode(id = '', name = '') {
  const modeId = String(id ?? '').toLowerCase();
  const modeName = String(name ?? '').toLowerCase();
  if (looksLikeBlendedLearningMode(modeId, modeName)) {
    return false;
  }
  if (/face[\s-]*to[\s-]*face/.test(modeId) || /face[\s-]*to[\s-]*face/.test(modeName)) {
    return false;
  }
  return modeId.includes('online') || modeName.includes('online');
}

/**
 * `full` — Pure online class (all LMS tabs).
 * `replay` — Blended learning (lecture video only).
 * `none` — Face to face, or unrecognized.
 */
export function learningModeAccessTier(id = '', name = '') {
  if (looksLikeBlendedLearningMode(id, name)) {
    return LMS_ACCESS_REPLAY;
  }
  if (looksLikeOnlineLearningMode(id, name)) {
    return LMS_ACCESS_FULL;
  }
  return LMS_ACCESS_NONE;
}

export function enrollmentIsOnlineLearningMode(item) {
  const { id, name } = enrollmentLearningModeFields(item);
  return looksLikeOnlineLearningMode(id, name);
}

export function enrollmentAccessTier(item) {
  if (!enrollmentGrantsCourseAccess(item?.status)) {
    return LMS_ACCESS_NONE;
  }
  const { id, name } = enrollmentLearningModeFields(item);
  return learningModeAccessTier(id, name);
}

function enrollmentMatchesCourse(item, courseId) {
  if (!enrollmentGrantsCourseAccess(item?.status)) {
    return false;
  }
  return Boolean(courseId && item?.courseId === courseId);
}

function normalizeAccessTier(value) {
  const raw = String(value ?? '').trim().toLowerCase();
  if (raw === LMS_ACCESS_FULL || raw === LMS_ACCESS_REPLAY || raw === LMS_ACCESS_NONE) {
    return raw;
  }
  return null;
}

/** Highest LMS access among approved enrollments for this course (`full` beats `replay`). */
export function learnerLmsAccessLevel({
  authenticated = false,
  role = '',
  enrollments = [],
  course = null,
} = {}) {
  if (!authenticated) {
    return LMS_ACCESS_NONE;
  }

  const normalizedRole = normalizeUserRole(role);
  if (normalizedRole === 'admin' || normalizedRole === 'instructor') {
    return LMS_ACCESS_FULL;
  }

  const fromApi = normalizeAccessTier(course?.lmsAccess);
  if (fromApi === LMS_ACCESS_FULL) {
    return LMS_ACCESS_FULL;
  }

  const courseId = typeof course?.id === 'string' ? course.id : '';

  let best = fromApi === LMS_ACCESS_REPLAY ? LMS_ACCESS_REPLAY : LMS_ACCESS_NONE;
  for (const item of Array.isArray(enrollments) ? enrollments : []) {
    if (!enrollmentMatchesCourse(item, courseId)) {
      continue;
    }
    const tier = enrollmentAccessTier(item);
    if (tier === LMS_ACCESS_FULL) {
      return LMS_ACCESS_FULL;
    }
    if (tier === LMS_ACCESS_REPLAY) {
      best = LMS_ACCESS_REPLAY;
    }
  }

  return best;
}

export function allowedCourseTabKeysForAccess(lmsAccess) {
  if (lmsAccess === LMS_ACCESS_FULL) {
    return [...FULL_TAB_KEYS];
  }
  if (lmsAccess === LMS_ACCESS_REPLAY) {
    return [...REPLAY_TAB_KEYS];
  }
  return [];
}

export function learnerCanAccessLessonType(lmsAccess, lessonType) {
  if (lmsAccess === LMS_ACCESS_FULL) {
    return true;
  }
  if (lmsAccess === LMS_ACCESS_REPLAY) {
    return lessonType === 'video';
  }
  return false;
}

/** True when the signed-in learner may open any LMS materials for this course. */
export function learnerCanAccessCourseLessons(args) {
  return learnerLmsAccessLevel(args) !== LMS_ACCESS_NONE;
}

/** Logged-in learner without Pure online / Blended access — curriculum stays locked. */
export function learnerRequiresEnrollment(args) {
  return Boolean(args?.authenticated) && !learnerCanAccessCourseLessons(args);
}
