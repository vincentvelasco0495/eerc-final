import { enrollmentGrantsCourseAccess } from 'src/constants/lms';

/** Whole-program enrollment (payment/application). Does not unlock course lessons. */
export function getProgramLevelEnrollment(enrollments, programId) {
  if (!programId) {
    return null;
  }
  return (enrollments ?? []).find((item) => item.programId === programId && !item.courseId) ?? null;
}

export function isProgramEnrollmentApproved(enrollments, programId) {
  return enrollmentGrantsCourseAccess(getProgramLevelEnrollment(enrollments, programId)?.status);
}

/** Course-scoped access request / enrollment row. */
export function getCourseAccessEnrollment(enrollments, courseId) {
  if (!courseId) {
    return null;
  }
  return (enrollments ?? []).find((item) => item.courseId === courseId) ?? null;
}

/** Enrollment row shown for a catalog course (course-scoped only). */
export function getCourseEnrollmentDisplay(enrollments, course) {
  return getCourseAccessEnrollment(enrollments, course?.id);
}

/**
 * Student CTA on a program course card after program enrollment.
 * @returns {null | { label: string, disabled?: boolean, loading?: boolean, variant?: string, onClick?: Function }}
 */
export function resolveStudentCourseAccessAction({
  programEnrollmentKind,
  courseEnrollment,
  onRequestAccess,
  requesting = false,
} = {}) {
  if (programEnrollmentKind === 'pending') {
    return { label: 'Enrollment pending', disabled: true, variant: 'outlined' };
  }
  if (programEnrollmentKind === 'hold') {
    return { label: 'Enrollment on hold', disabled: true, variant: 'outlined' };
  }
  if (programEnrollmentKind !== 'approved') {
    return null;
  }

  const status = courseEnrollment?.status;
  if (status === 'approved') {
    return null;
  }
  if (status === 'pending') {
    return { label: 'Pending approval', disabled: true, variant: 'outlined' };
  }
  if (status === 'hold') {
    return { label: 'Access on hold', disabled: true, variant: 'outlined' };
  }

  return {
    label: status === 'rejected' ? 'Request again' : 'Request access',
    disabled: requesting,
    loading: requesting,
    variant: 'contained',
    onClick: onRequestAccess,
  };
}
