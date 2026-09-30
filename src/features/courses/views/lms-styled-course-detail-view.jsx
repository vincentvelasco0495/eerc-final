import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import {
  useLmsCourseStats,
  useLmsCourseByLookup,
  useLmsModulesByCourse,
  extractQuizzesFromModules,
} from 'src/hooks/use-lms';

import { CONFIG } from 'src/global-config';
import { DashboardContent } from 'src/layouts/dashboard';
import { useLmsCourseDetailShell } from 'src/features/courses/hooks/use-lms-course-detail-shell';

import { CourseDetailLayout } from 'src/components/course-detail/CourseDetailLayout';

// ----------------------------------------------------------------------

export function LmsStyledCourseDetailView({ courseLookup }) {
  const { course, isLoading: courseLoading, error: courseError } = useLmsCourseByLookup(courseLookup ?? '');
  const courseId = course?.id ?? '';
  const { modules } = useLmsModulesByCourse(courseId);
  const { stats: courseStats } = useLmsCourseStats(courseId);

  const quizzesForCourse = extractQuizzesFromModules(modules);

  const { shell, canAccessLessons, requiresEnrollment } = useLmsCourseDetailShell(
    course,
    modules,
    quizzesForCourse,
    courseStats
  );

  if (!courseLookup) {
    return (
      <DashboardContent maxWidth={false}>
        <Typography variant="body2">Course not specified.</Typography>
      </DashboardContent>
    );
  }

  if (!courseId && !courseLoading) {
    return (
      <DashboardContent maxWidth={false}>
        <>
          <title>{`Course not found — ${CONFIG.appName}`}</title>
          <Typography variant="body2">
            {courseError || 'This course is not in the LMS catalog.'}
          </Typography>
        </>
      </DashboardContent>
    );
  }

  if (courseLoading && !shell) {
    return (
      <DashboardContent maxWidth={false}>
        <>
          <title>{`Loading… — ${CONFIG.appName}`}</title>
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress />
          </Box>
        </>
      </DashboardContent>
    );
  }

  if (!shell) {
    return (
      <DashboardContent maxWidth={false}>
        <>
          <title>{`Course not found — ${CONFIG.appName}`}</title>
          <Typography variant="body2">Unable to load this course.</Typography>
        </>
      </DashboardContent>
    );
  }

  return (
    <>
      <title>{`${shell.data.title} | ${CONFIG.appName}`}</title>

      <CourseDetailLayout
        data={shell.data}
        heroImageUrl={shell.heroImageUrl}
        completion={shell.completion}
        detailRows={shell.detailRows}
        curriculumModules={shell.curriculumModules}
        noticeContent={shell.noticeContent}
        faqItems={shell.faqItems}
        continueHref={shell.continueHref}
        courseLookup={shell.courseLookup}
        requiresEnrollment={requiresEnrollment}
        canAccessLessons={canAccessLessons}
        wrapMinHeightPage={false}
      />
    </>
  );
}
