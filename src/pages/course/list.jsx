import { CONFIG } from 'src/global-config';
import { CourseCatalogView } from 'src/features/courses/views/course-catalog-view';

const metadata = { title: `Courses | Dashboard - ${CONFIG.appName}` };

export default function CourseListPage() {
  return (
    <>
      <title>{metadata.title}</title>

      <CourseCatalogView />
    </>
  );
}
