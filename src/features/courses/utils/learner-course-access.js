import { enrollmentGrantsCourseAccess } from 'src/constants/lms';

import { normalizeUserRole } from 'src/auth/utils/role';

// ----------------------------------------------------------------------

export const LMS_ACCESS_NONE = 'none';
export const LMS_ACCESS_REPLAY = 'replay';
export const LMS_ACCESS_CLASSROOM = 'classroom';
export const LMS_ACCESS_FULL = 'full';

const REPLAY_TAB_KEYS = ['lecture-video'];
const CLASSROOM_TAB_KEYS = ['quiz', 'handouts', 'group-study'];
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

/** FACE TO FACE CLASS — not blended (that label also mentions face-to-face). */
export function looksLikeFaceToFaceLearningMode(id = '', name = '') {
  if (looksLikeBlendedLearningMode(id, name)) {
    return false;
  }
  const modeId = String(id ?? '').toLowerCase();
  const modeName = String(name ?? '').toLowerCase();
  if (/face[\s-]*to[\s-]*face/.test(modeId) || /face[\s-]*to[\s-]*face/.test(modeName)) {
    return true;
  }
  if (/\bf2f\b/.test(modeId) || /\bf2f\b/.test(modeName)) {
    return true;
  }
  return modeId === 'learning-mode-face' || modeId.endsWith('-face');
}

/** PURE ONLINE CLASS — not face-to-face and not blended. */
export function looksLikeOnlineLearningMode(id = '', name = '') {
  const modeId = String(id ?? '').toLowerCase();
  const modeName = String(name ?? '').toLowerCase();
  if (looksLikeBlendedLearningMode(modeId, modeName) || looksLikeFaceToFaceLearningMode(modeId, modeName)) {
    return false;
  }
  return modeId.includes('online') || modeName.includes('online');
}

/**
 * `full` — Pure online class and blended learning (all LMS tabs).
 * `classroom` — Face to face (quiz / handouts / group study; no lecture video).
 * `replay` — Legacy API value (lecture video only).
 * `none` — Unrecognized, or no approved course access.
 */
export function learningModeAccessTier(id = '', name = '') {
  if (looksLikeBlendedLearningMode(id, name) || looksLikeOnlineLearningMode(id, name)) {
    return LMS_ACCESS_FULL;
  }
  if (looksLikeFaceToFaceLearningMode(id, name)) {
    return LMS_ACCESS_CLASSROOM;
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

function enrollmentMatchesProgram(item, programId) {
  if (!enrollmentGrantsCourseAccess(item?.status)) {
    return false;
  }
  if (!programId || item?.programId !== programId) {
    return false;
  }
  const courseId = item?.courseId;
  return courseId == null || courseId === '';
}

function normalizeAccessTier(value) {
  const raw = String(value ?? '').trim().toLowerCase();
  if (
    raw === LMS_ACCESS_FULL ||
    raw === LMS_ACCESS_REPLAY ||
    raw === LMS_ACCESS_CLASSROOM ||
    raw === LMS_ACCESS_NONE
  ) {
    return raw;
  }
  return null;
}

function bestAccessTier(tiers) {
  if (tiers.includes(LMS_ACCESS_CLASSROOM)) {
    return LMS_ACCESS_CLASSROOM;
  }
  if (tiers.includes(LMS_ACCESS_FULL)) {
    return LMS_ACCESS_FULL;
  }
  if (tiers.includes(LMS_ACCESS_REPLAY)) {
    return LMS_ACCESS_REPLAY;
  }
  return LMS_ACCESS_NONE;
}

/**
 * Approved course access is required. Face-to-face (program or course enrollment)
 * hides lecture video even if a copied course-access row was stored as online.
 */
export function learnerLmsAccessLevel({
  authenticated = false,
  role = '',
  enrollments = [],
  course = null,
  programId = '',
} = {}) {
  if (!authenticated) {
    return LMS_ACCESS_NONE;
  }

  const normalizedRole = normalizeUserRole(role);
  if (normalizedRole === 'admin' || normalizedRole === 'instructor') {
    return LMS_ACCESS_FULL;
  }

  const fromApi = normalizeAccessTier(course?.lmsAccess);
  const courseId = typeof course?.id === 'string' ? course.id : '';
  const resolvedProgramId =
    (typeof course?.programId === 'string' && course.programId) ||
    (typeof programId === 'string' ? programId : '');

  const list = Array.isArray(enrollments) ? enrollments : [];
  const courseRows = list.filter((item) => enrollmentMatchesCourse(item, courseId));
  const programRow = list.find((item) => enrollmentMatchesProgram(item, resolvedProgramId));

  if (courseRows.length === 0) {
    return fromApi ?? LMS_ACCESS_NONE;
  }

  const tiers = courseRows.map((item) => enrollmentAccessTier(item));
  if (programRow) {
    tiers.push(enrollmentAccessTier(programRow));
  }

  return bestAccessTier(tiers);
}

export function allowedCourseTabKeysForAccess(lmsAccess) {
  if (lmsAccess === LMS_ACCESS_FULL) {
    return [...FULL_TAB_KEYS];
  }
  if (lmsAccess === LMS_ACCESS_REPLAY) {
    return [...REPLAY_TAB_KEYS];
  }
  if (lmsAccess === LMS_ACCESS_CLASSROOM) {
    return [...CLASSROOM_TAB_KEYS];
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
  if (lmsAccess === LMS_ACCESS_CLASSROOM) {
    return lessonType !== 'video';
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
