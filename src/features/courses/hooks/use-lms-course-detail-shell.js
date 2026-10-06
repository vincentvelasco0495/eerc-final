import { useMemo, useCallback } from 'react';

import { useEnrollment, useLmsQuizResults, useLmsLessonProgress } from 'src/hooks/use-lms';

import {
  LMS_ACCESS_NONE,
  LMS_ACCESS_REPLAY,
  allowedCourseTabKeysForAccess,
  learnerCanAccessCourseLessons,
  learnerCanAccessLessonType,
  learnerLmsAccessLevel,
  learnerRequiresEnrollment,
} from 'src/features/courses/utils/learner-course-access';

import {
  isLessonLockedInCurriculum,
  lessonTypeInCurriculum,
  mapLmsToStyledCourseDetail,
} from 'src/components/course-detail/map-lms-to-styled-shell';

import { useAuthContext } from 'src/auth/hooks';
import { normalizeUserRole } from 'src/auth/utils/role';

/**
 * Full learner course-detail shell (progress-aware) plus `isLessonLocked` when
 * `course.marketing.lockLessonsInOrder` is enabled or program enrollment is required.
 */
export function useLmsCourseDetailShell(
  course,
  modules,
  quizzesForCourse,
  courseStats = null,
  options = {}
) {
  const disableEnrollment = Boolean(options.disableEnrollment);
  const courseId = course?.id ?? '';
  const { authenticated, loading: authLoading, user } = useAuthContext();
  const enrollment = useEnrollment(authenticated && !authLoading && !disableEnrollment);
  const learnerProgressEnabled = Boolean(courseId) && authenticated && !authLoading;

  const staffCurriculumBypass = useMemo(() => {
    const r = normalizeUserRole(user?.role);
    return r === 'admin' || r === 'instructor';
  }, [user?.role]);

  const accessArgs = useMemo(
    () => ({
      authenticated,
      role: user?.role,
      programId: course?.programId,
      enrollments: enrollment,
      course,
    }),
    [authenticated, course, enrollment, user?.role]
  );

  const lmsAccess = useMemo(() => {
    if (disableEnrollment) {
      return authenticated && !authLoading ? 'full' : LMS_ACCESS_NONE;
    }
    return learnerLmsAccessLevel(accessArgs);
  }, [accessArgs, authenticated, authLoading, disableEnrollment]);

  const allowedTabKeys = useMemo(() => allowedCourseTabKeysForAccess(lmsAccess), [lmsAccess]);

  const canAccessLessons = useMemo(() => {
    if (disableEnrollment) {
      return authenticated && !authLoading;
    }
    return learnerCanAccessCourseLessons(accessArgs);
  }, [accessArgs, authenticated, authLoading, disableEnrollment]);

  const requiresEnrollment = useMemo(() => {
    if (disableEnrollment) {
      return false;
    }
    return learnerRequiresEnrollment(accessArgs);
  }, [accessArgs, disableEnrollment]);

  const { lessonProgressKeys } = useLmsLessonProgress(courseId, learnerProgressEnabled && canAccessLessons);
  const { results: quizResults } = useLmsQuizResults(learnerProgressEnabled && canAccessLessons);

  const shell = useMemo(
    () =>
      course
        ? mapLmsToStyledCourseDetail(
            course,
            modules ?? [],
            quizzesForCourse ?? [],
            quizResults,
            lessonProgressKeys,
            courseStats,
            {
              applyLessonLocks: learnerProgressEnabled && !staffCurriculumBypass,
              requiresEnrollment,
              lmsAccess,
            }
          )
        : null,
    [
      course,
      modules,
      quizzesForCourse,
      quizResults,
      lessonProgressKeys,
      courseStats,
      learnerProgressEnabled,
      requiresEnrollment,
      staffCurriculumBypass,
      lmsAccess,
    ]
  );

  const isLessonLocked = useCallback(
    (lessonId) => {
      if (staffCurriculumBypass) {
        return false;
      }
      if (requiresEnrollment || lmsAccess === LMS_ACCESS_NONE) {
        return true;
      }
      if (lmsAccess === LMS_ACCESS_REPLAY) {
        const type = lessonTypeInCurriculum(shell?.curriculumModules, lessonId);
        if (!learnerCanAccessLessonType(lmsAccess, type)) {
          return true;
        }
      }
      if (!learnerProgressEnabled) {
        return false;
      }
      return Boolean(lessonId && shell && isLessonLockedInCurriculum(shell.curriculumModules, lessonId));
    },
    [shell, learnerProgressEnabled, requiresEnrollment, staffCurriculumBypass, lmsAccess]
  );

  return {
    shell,
    lessonProgressKeys,
    quizResults,
    isLessonLocked,
    requiresEnrollment,
    canAccessLessons,
    lmsAccess,
    allowedTabKeys,
  };
}
