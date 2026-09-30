import { useParams } from 'react-router';

import { CONFIG } from 'src/global-config';
import { InstructorCourseCurriculumView } from 'src/features/instructor-course-builder/views/instructor-course-curriculum-view';

const metadata = {
  title: `Edit course | Dashboard — ${CONFIG.appName}`,
};

export default function InstructorCourseEditPage() {
  const { courseLookup } = useParams();

  return (
    <>
      <title>{metadata.title}</title>
      <InstructorCourseCurriculumView courseLookup={courseLookup ?? ''} />
    </>
  );
}
