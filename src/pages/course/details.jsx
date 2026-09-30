import { useParams } from 'react-router';

import { LmsStyledCourseDetailView } from 'src/features/courses/views/lms-styled-course-detail-view';

export default function CourseDetailsPage() {
  const { courseId = '', slug = '' } = useParams();
  const courseLookup = slug || courseId;

  return <LmsStyledCourseDetailView courseLookup={courseLookup} />;
}
