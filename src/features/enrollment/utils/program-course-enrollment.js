/** Legacy whole-program enrollment (covers every course in the program once approved). */
export function getProgramLevelEnrollment(enrollments, programId) {
  if (!programId) {
    return null;
  }
  return (enrollments ?? []).find((item) => item.programId === programId && !item.courseId) ?? null;
}

/** Enrollment row for a catalog course (per-course row, or legacy whole-program row). */
export function getCourseEnrollmentDisplay(enrollments, course) {
  if (!course?.id) {
    return null;
  }
  const programId = course.programId;
  const byCourse = (enrollments ?? []).find((item) => item.courseId === course.id);
  if (byCourse) {
    return byCourse;
  }
  return (enrollments ?? []).find((item) => item.programId === programId && !item.courseId) ?? null;
}
