import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import { isPublishedCatalogCourse } from 'src/features/student-profile/student-profile-data';

dayjs.extend(relativeTime);

/**
 * Maps `/api/programs` catalog rows to the shape expected by `InstructorProgramCard`.
 * Stats mirror learner-facing aggregates: published courses only, summed `hours`
 * and `totalModules` from the courses catalog API.
 */
export function mapLmsProgramToInstructorCard(program, courses = []) {
  const id = program?.id ?? program?.publicId ?? program?.public_id ?? '';
  const programCourses = (Array.isArray(courses) ? courses : []).filter(
    (course) => String(course?.programId ?? '') === String(id)
  );
  const publishedCourses = programCourses.filter(isPublishedCatalogCourse);
  const totalHours = publishedCourses.reduce(
    (sum, course) => sum + (Number(course?.hours) || 0),
    0
  );
  const totalLectures = publishedCourses.reduce(
    (sum, course) => sum + (Number(course?.totalModules) || 0),
    0
  );

  const statusRaw = String(program?.status ?? 'active').toLowerCase();
  const status = statusRaw === 'inactive' ? 'inactive' : 'active';

  let updatedAt = '—';
  const updatedAtSource = program?.updatedAt ?? program?.updated_at ?? null;
  if (updatedAtSource) {
    const d = dayjs(updatedAtSource);
    if (d.isValid()) {
      updatedAt = d.fromNow();
    }
  }

  const programSlug =
    String(program?.slug ?? program?.programSlug ?? '').trim() ||
    String(program?.code ?? '')
      .trim()
      .toLowerCase();

  return {
    id,
    bannerPath: program?.bannerPath ?? program?.banner_path ?? '',
    bannerUrl: program?.bannerUrl ?? program?.banner_url ?? '',
    category: String(program?.code ?? '').trim() || 'Program',
    title: String(program?.title ?? '').trim() || 'Untitled program',
    description: String(program?.description ?? '').trim(),
    enrollmentFee:
      (program?.enrollmentFee ?? program?.enrollment_fee) != null &&
      Number.isFinite(Number(program?.enrollmentFee ?? program?.enrollment_fee))
        ? Number(program?.enrollmentFee ?? program?.enrollment_fee)
        : null,
    courseCount: publishedCourses.length,
    durationHours: totalHours,
    lectureCount: totalLectures,
    status,
    updatedAt,
    programSlug,
  };
}
