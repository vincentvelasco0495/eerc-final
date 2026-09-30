import { enrollmentGrantsCourseAccess } from 'src/constants/lms';

import { normalizeUserRole } from 'src/auth/utils/role';

// ----------------------------------------------------------------------

function enrollmentLearningModeFields(item) {
  const formData = item?.formData && typeof item.formData === 'object' ? item.formData : {};
  const labels = formData.labels && typeof formData.labels === 'object' ? formData.labels : {};

  return {
    id: item?.learningModeId ?? formData.learningModeId ?? '',
    name: item?.learningModeName ?? labels.learningMode ?? '',
  };
}

/** PURE ONLINE CLASS — not face-to-face and not blended. */
export function looksLikeOnlineLearningMode(id = '', name = '') {
  const modeId = String(id ?? '').toLowerCase();
  const modeName = String(name ?? '').toLowerCase();
  if (modeId.includes('blended') || modeName.includes('blended')) {
    return false;
  }
  if (/face[\s-]*to[\s-]*face/.test(modeId) || /face[\s-]*to[\s-]*face/.test(modeName)) {
    return false;
  }
  return modeId.includes('online') || modeName.includes('online');
}

export function enrollmentIsOnlineLearningMode(item) {
  const { id, name } = enrollmentLearningModeFields(item);
  return looksLikeOnlineLearningMode(id, name);
}

function enrollmentMatchesCourse(item, courseId, programId) {
  if (!enrollmentGrantsCourseAccess(item?.status) || !enrollmentIsOnlineLearningMode(item)) {
    return false;
  }
  if (courseId && item?.courseId === courseId) {
    return true;
  }
  if (!item?.courseId && programId && item?.programId === programId) {
    return true;
  }
  return false;
}

/** True when the signed-in learner may open lessons/quizzes for this course. */
export function learnerCanAccessCourseLessons({
  authenticated = false,
  role = '',
  programId = '',
  enrollments = [],
  course = null,
} = {}) {
  if (!authenticated) {
    return false;
  }

  const normalizedRole = normalizeUserRole(role);
  if (normalizedRole === 'admin' || normalizedRole === 'instructor') {
    return true;
  }

  if (typeof course?.canAccessLessons === 'boolean') {
    return course.canAccessLessons;
  }

  const courseId = typeof course?.id === 'string' ? course.id : '';
  const resolvedProgramId =
    programId || (typeof course?.programId === 'string' ? course.programId : '');

  return (Array.isArray(enrollments) ? enrollments : []).some((item) =>
    enrollmentMatchesCourse(item, courseId, resolvedProgramId)
  );
}

/** Logged-in learner without course/program approval — curriculum stays locked. */
export function learnerRequiresEnrollment(args) {
  return Boolean(args?.authenticated) && !learnerCanAccessCourseLessons(args);
}
