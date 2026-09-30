import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router';

import { paths } from 'src/routes/paths';
import { usePathname } from 'src/routes/hooks';

import { CONFIG } from 'src/global-config';
import { DashboardLayout } from 'src/layouts/dashboard';

import { LoadingScreen } from 'src/components/loading-screen';

import { AuthGuard, StaffGuard, PermissionGuard } from 'src/auth/guard';

const CourseListPage = lazy(() => import('src/pages/course/list'));
const CourseDetailsPage = lazy(() => import('src/pages/course/details'));
const CourseTextLessonPage = lazy(() => import('src/pages/course/text-lesson'));
const CourseVideoLessonPage = lazy(() => import('src/pages/course/video-lesson'));
const CourseQuizStartPage = lazy(() => import('src/pages/course/quiz-start.jsx'));
const CourseQuizTakePage = lazy(() => import('src/pages/course/quiz'));
const CourseAssignmentPage = lazy(() => import('src/pages/course/assignment'));
const ModuleDetailsPage = lazy(() => import('src/pages/module/details'));
const QuizListPage = lazy(() => import('src/pages/quiz/list'));
const QuizDetailsPage = lazy(() => import('src/pages/quiz/details'));
const QuizHistoryPage = lazy(() => import('src/pages/quiz/history'));
const StudentQuizLeaderboardPage = lazy(() => import('src/pages/quiz/student-leaderboard'));
const AnalyticsPage = lazy(() => import('src/pages/analytics'));
const LeaderboardPage = lazy(() => import('src/pages/leaderboard'));
const EnrollmentPage = lazy(() => import('src/pages/dashboard/enrollment'));
const PaymentHistoryPage = lazy(() => import('src/pages/dashboard/payment-history'));
const EnrollmentApplyPage = lazy(() => import('src/pages/dashboard/enrollment-apply'));
const AdminPage = lazy(() => import('src/pages/dashboard/admin'));
const AssignmentsPage = lazy(() => import('src/pages/dashboard/assignments'));
const StudentAssignmentLeaderboardPage = lazy(
  () => import('src/pages/dashboard/student-assignment-leaderboard')
);
const InstructorProfilePage = lazy(() => import('src/pages/dashboard/instructor-profile'));
const InstructorAnnouncementPage = lazy(() => import('src/pages/dashboard/instructor-announcement'));
const FeedbackInboxPage = lazy(() => import('src/pages/dashboard/feedback'));
const InstructorSettingsPage = lazy(() => import('src/pages/dashboard/instructor-settings'));
const InstructorGradebookPage = lazy(() => import('src/pages/dashboard/instructor-gradebook'));
const InstructorCourseCurriculumPage = lazy(() =>
  import('src/pages/dashboard/instructor-course-curriculum')
);
const InstructorCourseEditPage = lazy(() => import('src/pages/dashboard/instructor-course-edit'));
const InstructorAssignmentsPage = lazy(() => import('src/pages/dashboard/instructor-assignments'));
const InstructorAssignmentStudentsPage = lazy(() =>
  import('src/pages/dashboard/instructor-assignment-students')
);
const InstructorAssignmentLeaderboardPage = lazy(() =>
  import('src/pages/dashboard/instructor-assignment-leaderboard')
);
const InstructorStudentQuizzesPage = lazy(() => import('src/pages/dashboard/instructor-student-quizzes'));
const InstructorQuizStudentsPage = lazy(() => import('src/pages/dashboard/instructor-quiz-students'));
const InstructorQuizLeaderboardPage = lazy(() => import('src/pages/dashboard/instructor-quiz-leaderboard'));
const ProgramsPage = lazy(() => import('src/pages/dashboard/programs'));
const ProgramApplicantsPage = lazy(() => import('src/pages/dashboard/programs/applicants'));
const BatchEnrollsPage = lazy(() => import('src/pages/dashboard/batch-enrolls'));
const BatchApplicantsPage = lazy(() => import('src/pages/dashboard/batch-enrolls/applicants'));
const LearningModesPage = lazy(() => import('src/pages/dashboard/learning-modes'));
const LearningModeApplicantsPage = lazy(() => import('src/pages/dashboard/learning-modes/applicants'));
const BranchEnrollsPage = lazy(() => import('src/pages/dashboard/branch-enrolls'));
const BranchEnrollApplicantsPage = lazy(() => import('src/pages/dashboard/branch-enrolls/applicants'));
const ReviewSchedulesPage = lazy(() => import('src/pages/dashboard/review-schedules'));
const ReviewScheduleApplicantsPage = lazy(() => import('src/pages/dashboard/review-schedules/applicants'));
const HonorAwardDiscountsPage = lazy(() => import('src/pages/dashboard/honor-award-discounts'));
const HonorAwardDiscountApplicantsPage = lazy(() => import('src/pages/dashboard/honor-award-discounts/applicants'));
const PackageEnrollsPage = lazy(() => import('src/pages/dashboard/package-enrolls'));
const PackageEnrollApplicantsPage = lazy(() => import('src/pages/dashboard/package-enrolls/applicants'));
const InstructorsPage = lazy(() => import('src/pages/dashboard/instructors'));
const StudentsPage = lazy(() => import('src/pages/dashboard/students'));
const PaymentMethodsPage = lazy(() => import('src/pages/dashboard/payment-methods'));
const SettingsPage = lazy(() => import('src/pages/dashboard/settings'));
const ContentManagementHomepageV2Page = lazy(
  () => import('src/pages/dashboard/content-management/homepage-v2')
);
const ContentManagementAboutUsPage = lazy(
  () => import('src/pages/dashboard/content-management/about-us')
);
const ContentManagementContactUsPage = lazy(
  () => import('src/pages/dashboard/content-management/contact-us')
);
const AvailableProgramsPage = lazy(() => import('src/pages/dashboard/available-programs/index.jsx'));

function SuspenseOutlet() {
  const pathname = usePathname();

  return (
    <Suspense key={pathname} fallback={<LoadingScreen />}>
      <Outlet />
    </Suspense>
  );
}

function withPermissionGuard(Page) {
  return function PermissionProtectedPage() {
    return (
      <PermissionGuard>
        <Page />
      </PermissionGuard>
    );
  };
}

function withStaffGuard(Page) {
  return function StaffProtectedPage() {
    return (
      <StaffGuard>
        <Page />
      </StaffGuard>
    );
  };
}

const AdminDashboardPage = withPermissionGuard(InstructorProfilePage);
const InstructorHomePage = withPermissionGuard(InstructorProfilePage);
const ProtectedCourseCurriculumPage = withPermissionGuard(InstructorCourseCurriculumPage);
const ProtectedCourseEditPage = withPermissionGuard(InstructorCourseEditPage);
const ProtectedProgramApplicantsPage = withPermissionGuard(ProgramApplicantsPage);
const ProtectedBatchApplicantsPage = withPermissionGuard(BatchApplicantsPage);
const ProtectedLearningModesPage = withStaffGuard(LearningModesPage);
const ProtectedLearningModeApplicantsPage = withStaffGuard(LearningModeApplicantsPage);
const ProtectedBranchEnrollsPage = withStaffGuard(BranchEnrollsPage);
const ProtectedBranchEnrollApplicantsPage = withStaffGuard(BranchEnrollApplicantsPage);
const ProtectedReviewSchedulesPage = withStaffGuard(ReviewSchedulesPage);
const ProtectedReviewScheduleApplicantsPage = withStaffGuard(ReviewScheduleApplicantsPage);
const ProtectedHonorAwardDiscountsPage = withStaffGuard(HonorAwardDiscountsPage);
const ProtectedHonorAwardDiscountApplicantsPage = withStaffGuard(HonorAwardDiscountApplicantsPage);
const ProtectedPackageEnrollsPage = withStaffGuard(PackageEnrollsPage);
const ProtectedPackageEnrollApplicantsPage = withStaffGuard(PackageEnrollApplicantsPage);


const dashboardLayout = () => (
  <DashboardLayout>
    <SuspenseOutlet />
  </DashboardLayout>
);

/** Maps old `/dashboard/...` bookmarks to flattened LMS URLs (not `/dashboard` itself). */
function LegacyDashboardSubpathRedirect() {
  const { pathname, search, hash } = useLocation();
  const rest = pathname.slice('/dashboard'.length);

  if (!rest || rest === '/') {
    return <Navigate to={paths.dashboard.home} replace />;
  }

  return <Navigate to={`${rest}${search}${hash}`} replace />;
}

/** Preserves query strings (e.g. `?new=1`) when redirecting legacy curriculum URLs. */
function LegacyInstructorCourseCurriculumRedirect() {
  const { pathname, search, hash } = useLocation();
  const target = pathname.replace(/^\/instructor-course-curriculum/, paths.dashboard.courseCurriculum);
  return <Navigate to={`${target}${search}${hash}`} replace />;
}

/** Redirects `/instructor-course/:slug/edit` → `/course-curriculum/:slug/edit`. */
function LegacyInstructorCourseEditRedirect() {
  const { pathname, search, hash } = useLocation();
  const target = pathname.replace(/^\/instructor-course\//, '/course-curriculum/');
  return <Navigate to={`${target}${search}${hash}`} replace />;
}

/** Redirects `/instructor-announcement` → `/announcement` (preserves query string). */
function LegacyInstructorAnnouncementRedirect() {
  const { search, hash } = useLocation();
  return <Navigate to={`${paths.dashboard.announcement}${search}${hash}`} replace />;
}

/** Redirects `/instructor-settings` → `/setting-profile` (preserves query string). */
function LegacyInstructorSettingsRedirect() {
  const { search, hash } = useLocation();
  return <Navigate to={`${paths.dashboard.settingProfile}${search}${hash}`} replace />;
}

/** Redirects `/programs` → `/setting-program` (preserves query string). */
function LegacyProgramsRedirect() {
  const { search, hash } = useLocation();
  return <Navigate to={`${paths.dashboard.settingProgram}${search}${hash}`} replace />;
}

/** Redirects `/instructors` → `/setting-instructor` (preserves query string). */
function LegacyInstructorsRedirect() {
  const { search, hash } = useLocation();
  return <Navigate to={`${paths.dashboard.settingInstructor}${search}${hash}`} replace />;
}

/** Redirects `/students` → `/setting-student` (preserves query string). */
function LegacyStudentsRedirect() {
  const { search, hash } = useLocation();
  return <Navigate to={`${paths.dashboard.settingStudent}${search}${hash}`} replace />;
}

const dashboardLayoutElement = CONFIG.auth.skip ? dashboardLayout() : <AuthGuard>{dashboardLayout()}</AuthGuard>;

export const dashboardRoutes = [
  {
    element: dashboardLayoutElement,
    children: [
      { path: 'courses', element: <CourseListPage /> },
      { path: 'course-details/:slug/text-lesson/:lessonId', element: <CourseTextLessonPage /> },
      { path: 'courses/:courseId/text-lesson/:lessonId', element: <CourseTextLessonPage /> },
      { path: 'course-details/:slug/video-lesson/:lessonId', element: <CourseVideoLessonPage /> },
      { path: 'courses/:courseId/video-lesson/:lessonId', element: <CourseVideoLessonPage /> },
      { path: 'course-details/:slug/quiz/:quizId/take', element: <CourseQuizTakePage /> },
      { path: 'courses/:courseId/quiz/:quizId/take', element: <CourseQuizTakePage /> },
      { path: 'course-details/:slug/quiz/:quizId', element: <CourseQuizStartPage /> },
      { path: 'courses/:courseId/quiz/:quizId', element: <CourseQuizStartPage /> },
      { path: 'course-details/:slug/assignment/:assignmentId', element: <CourseAssignmentPage /> },
      { path: 'courses/:courseId/assignment/:assignmentId', element: <CourseAssignmentPage /> },
      { path: 'course-details/:slug', element: <CourseDetailsPage /> },
      { path: 'courses/:courseId', element: <CourseDetailsPage /> },
      { path: 'modules/:moduleId', element: <ModuleDetailsPage /> },
      { path: 'quizzes', element: <QuizListPage /> },
      { path: 'quizzes/history', element: <QuizHistoryPage /> },
      { path: 'quizzes/:quizId/leaderboard', element: <StudentQuizLeaderboardPage /> },
      { path: 'quizzes/:quizId', element: <QuizDetailsPage /> },
      { path: 'analytics', element: <AnalyticsPage /> },
      { path: 'leaderboard', element: <LeaderboardPage /> },
      { path: 'dashboard', element: <AdminDashboardPage /> },
      { path: 'instructor-home', element: <InstructorHomePage /> },
      { path: 'dashboard/*', element: <LegacyDashboardSubpathRedirect /> },
      {
        path: 'instructor-profile',
        element: <Navigate to={paths.dashboard.instructorHome} replace />,
      },
      {
        path: 'instructor-profile/*',
        element: <Navigate to={paths.dashboard.instructorHome} replace />,
      },
      { path: 'announcement', element: <InstructorAnnouncementPage /> },
      { path: 'feedback', element: <FeedbackInboxPage /> },
      { path: 'instructor-announcement', element: <LegacyInstructorAnnouncementRedirect /> },
      { path: 'instructor-announcement/*', element: <LegacyInstructorAnnouncementRedirect /> },
      { path: 'setting-profile', element: <InstructorSettingsPage /> },
      { path: 'instructor-settings', element: <LegacyInstructorSettingsRedirect /> },
      { path: 'instructor-settings/*', element: <LegacyInstructorSettingsRedirect /> },
      { path: 'gradebook', element: <InstructorGradebookPage /> },
      { path: 'student-quizzes', element: <InstructorStudentQuizzesPage /> },
      { path: 'student-quizzes/:quizId/students', element: <InstructorQuizStudentsPage /> },
      { path: 'student-quizzes/:quizId/leaderboard', element: <InstructorQuizLeaderboardPage /> },
      {
        path: 'instructor-gradebook',
        element: <Navigate to={paths.dashboard.gradebook} replace />,
      },
      { path: 'course-curriculum/:courseLookup/edit', element: <ProtectedCourseEditPage /> },
      { path: 'course-curriculum', element: <ProtectedCourseCurriculumPage /> },
      { path: 'instructor-course-curriculum', element: <LegacyInstructorCourseCurriculumRedirect /> },
      { path: 'instructor-course-curriculum/*', element: <LegacyInstructorCourseCurriculumRedirect /> },
      { path: 'instructor-course/:courseLookup/edit', element: <LegacyInstructorCourseEditRedirect /> },
      { path: 'assignment', element: <InstructorAssignmentsPage /> },
      { path: 'assignment/:assignmentId/students', element: <InstructorAssignmentStudentsPage /> },
      { path: 'assignment/:assignmentId/leaderboard', element: <InstructorAssignmentLeaderboardPage /> },
      {
        path: 'instructor-assignments',
        element: <Navigate to={paths.dashboard.assignment} replace />,
      },
      { path: 'setting-program/:programId/applicants', element: <ProtectedProgramApplicantsPage /> },
      { path: 'setting-program', element: <ProgramsPage /> },
      { path: 'setting-batch-enroll/:batchId/applicants', element: <ProtectedBatchApplicantsPage /> },
      { path: 'setting-batch-enroll', element: <BatchEnrollsPage /> },
      { path: 'setting-mode-of-learning/:modeId/applicants', element: <ProtectedLearningModeApplicantsPage /> },
      { path: 'setting-mode-of-learning', element: <ProtectedLearningModesPage /> },
      { path: 'setting-branch-enroll/:branchId/applicants', element: <ProtectedBranchEnrollApplicantsPage /> },
      { path: 'setting-branch-enroll', element: <ProtectedBranchEnrollsPage /> },
      { path: 'setting-review-schedule/:scheduleId/applicants', element: <ProtectedReviewScheduleApplicantsPage /> },
      { path: 'setting-review-schedule', element: <ProtectedReviewSchedulesPage /> },
      { path: 'setting-honors-awards-discount/:optionId/applicants', element: <ProtectedHonorAwardDiscountApplicantsPage /> },
      { path: 'setting-honors-awards-discount', element: <ProtectedHonorAwardDiscountsPage /> },
      { path: 'setting-package-enroll/:packageId/applicants', element: <ProtectedPackageEnrollApplicantsPage /> },
      { path: 'setting-package-enroll', element: <ProtectedPackageEnrollsPage /> },
      { path: 'programs', element: <LegacyProgramsRedirect /> },
      { path: 'programs/*', element: <LegacyProgramsRedirect /> },
      { path: 'setting-instructor', element: <InstructorsPage /> },
      { path: 'instructors', element: <LegacyInstructorsRedirect /> },
      { path: 'instructors/*', element: <LegacyInstructorsRedirect /> },
      { path: 'setting-student', element: <StudentsPage /> },
      { path: 'setting-payment', element: <PaymentMethodsPage /> },
      { path: 'students', element: <LegacyStudentsRedirect /> },
      { path: 'students/*', element: <LegacyStudentsRedirect /> },
      { path: 'assignments', element: <AssignmentsPage /> },
      { path: 'assignments/:assignmentId/leaderboard', element: <StudentAssignmentLeaderboardPage /> },
      { path: 'settings', element: <SettingsPage /> },
      {
        path: 'enrolled-courses',
        element: <Navigate to={paths.dashboard.availablePrograms} replace />,
      },
      {
        path: 'student-profile',
        element: <Navigate to={paths.dashboard.availablePrograms} replace />,
      },
      { path: 'available-programs', element: <AvailableProgramsPage /> },
      { path: 'enrollment/apply', element: <EnrollmentApplyPage /> },
      { path: 'enrollment', element: <EnrollmentPage /> },
      { path: 'payment-history', element: <PaymentHistoryPage /> },
      { path: 'content-management/homepage', element: <ContentManagementHomepageV2Page /> },
      { path: 'content-management/homepage-v2', element: <ContentManagementHomepageV2Page /> },
      { path: 'content-management/about-us', element: <ContentManagementAboutUsPage /> },
      { path: 'content-management/contact-us', element: <ContentManagementContactUsPage /> },
      { path: 'admin', element: <AdminPage /> },
      {
        path: 'course',
        element: <Navigate to={paths.dashboard.courses.root} replace />,
      },
      {
        path: 'analytics/legacy',
        element: <Navigate to={paths.dashboard.analyticsHub} replace />,
      },
    ],
  },
];