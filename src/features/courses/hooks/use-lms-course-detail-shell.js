import { useMemo, useCallback } from 'react';

import { useEnrollment, useLmsQuizResults, useLmsLessonProgress } from 'src/hooks/use-lms';

import {
  learnerRequiresEnrollment,
  learnerCanAccessCourseLessons,
} from 'src/features/courses/utils/learner-course-access';

import {
  mapLmsToStyledCourseDetail,
  isLessonLockedInCurriculum,
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

  const canAccessLessons = useMemo(() => {
    if (disableEnrollment) {
      return authenticated && !authLoading;
    }
    return learnerCanAccessCourseLessons({
      authenticated,
      role: user?.role,
      programId: course?.programId,
      enrollments: enrollment,
      course,
    });
  }, [authenticated, authLoading, course, disableEnrollment, enrollment, user?.role]);

  const requiresEnrollment = useMemo(() => {
    if (disableEnrollment) {
      return false;
    }
    return learnerRequiresEnrollment({
      authenticated,
      role: user?.role,
      programId: course?.programId,
      enrollments: enrollment,
      course,
    });
  }, [authenticated, course, disableEnrollment, enrollment, user?.role]);

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
    ]
  );

  const isLessonLocked = useCallback(
    (lessonId) => {
      if (staffCurriculumBypass) {
        return false;
      }
      if (requiresEnrollment) {
        return true;
      }
      if (!learnerProgressEnabled) {
        return false;
      }
      return Boolean(lessonId && shell && isLessonLockedInCurriculum(shell.curriculumModules, lessonId));
    },
    [shell, learnerProgressEnabled, requiresEnrollment, staffCurriculumBypass]
  );

  return { shell, lessonProgressKeys, quizResults, isLessonLocked, requiresEnrollment, canAccessLessons };
}
