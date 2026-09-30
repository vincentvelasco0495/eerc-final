import { useMemo } from 'react';
import { useSearchParams } from 'react-router';

import { CONFIG } from 'src/global-config';
import { InstructorCourseCurriculumView } from 'src/features/instructor-course-builder/views/instructor-course-curriculum-view';

const metadata = { title: `Course curriculum | Dashboard - ${CONFIG.appName}` };

/**
 * Which course to author in the curriculum builder. Only the `?course=` query is used so a bare
 * `/course-curriculum` URL does not silently load a dev env default (e.g. the seeded
 * demo course with modules). Use `?course=slug-or-public-id` or the route
 * `/course-curriculum/:courseLookup/edit` to open a specific course.
 */
function useEffectiveCourseLookup() {
  const [searchParams] = useSearchParams();
  return useMemo(() => {
    const qp = searchParams.get('course')?.trim();
    return qp || null;
  }, [searchParams]);
}

function useIsNewCourseIntent() {
  const [searchParams] = useSearchParams();
  return useMemo(() => {
    const raw = searchParams.get('new');
    return raw === '1' || raw === 'true' || raw === 'yes';
  }, [searchParams]);
}

export default function InstructorCourseCurriculumPage() {
  const courseLookup = useEffectiveCourseLookup();
  const isNewCourseIntent = useIsNewCourseIntent();

  return (
    <>
      <title>{metadata.title}</title>

      <InstructorCourseCurriculumView courseLookup={courseLookup} isNewCourseIntent={isNewCourseIntent} />
    </>
  );
}
