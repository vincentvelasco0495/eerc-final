import { kebabCase } from 'es-toolkit';

import { _id, _postTitles } from 'src/_mock/assets';

// ----------------------------------------------------------------------

const MOCK_ID = _id[1];
const MOCK_TITLE = _postTitles[2];

const ROOTS = {
  AUTH: '/auth',
  AUTH_DEMO: '/auth-demo',
};

/** Default authenticated landing for students. */
const LMS_HOME = '/available-programs';

/** Admin dashboard home. */
const ADMIN_DASHBOARD = '/dashboard';

/** Instructor dashboard home (non-admin instructors). */
const INSTRUCTOR_HOME = '/instructor-home';

/** Legacy instructor dashboard URL — kept for redirects and `returnTo` handling. */
export const LEGACY_INSTRUCTOR_PROFILE_PATH = '/instructor-profile';

/**
 * First URL segment for routes rendered inside `DashboardLayout`.
 * Used to distinguish LMS shell from marketing routes at the same path depth.
 */
const DASHBOARD_LAYOUT_FIRST_SEGMENTS = new Set([
  'courses',
  'course-details',
  'setting-program',
  'setting-batch-enroll',
  'setting-mode-of-learning',
  'setting-branch-enroll',
  'setting-review-schedule',
  'setting-honors-awards-discount',
  'setting-package-enroll',
  'programs',
  'setting-instructor',
  'instructors',
  'setting-student',
  'students',
  'setting-payment',
  'modules',
  'quizzes',
  'analytics',
  'leaderboard',
  'dashboard',
  'instructor-home',
  'instructor-profile',
  'announcement',
  'instructor-announcement',
  'setting-profile',
  'instructor-settings',
  'gradebook',
  'instructor-gradebook',
  'instructor-course',
  'course-curriculum',
  'instructor-course-curriculum',
  'assignment',
  'student-quizzes',
  'instructor-assignments',
  'assignments',
  'settings',
  'enrolled-courses',
  'student-profile',
  'available-programs',
  'enrollment',
  'feedback',
  'admin',
  'content-management',
]);

export function isDashboardLayoutPath(pathname) {
  const seg = pathname?.split('/').filter(Boolean)[0];
  return !!seg && DASHBOARD_LAYOUT_FIRST_SEGMENTS.has(seg);
}

/** Curriculum builder shell — hide global dashboard header (logo, account, notifications). */
export function isCourseCurriculumBuilderPath(pathname) {
  const path = (pathname ?? '').replace(/\/$/, '') || '/';

  if (path === '/course-curriculum' || path.startsWith('/course-curriculum/')) {
    return true;
  }

  if (path === '/instructor-course-curriculum' || path.startsWith('/instructor-course-curriculum/')) {
    return true;
  }

  return /^\/instructor-course\/[^/]+\/edit$/.test(path);
}

// ----------------------------------------------------------------------

export const paths = {
  comingSoon: '/coming-soon',
  maintenance: '/maintenance',
  pricing: '/pricing',
  payment: '/payment',
  about: '/about-us',
  contact: '/contact-us',
  faqs: '/faqs',
  /** Styled-components learner course-detail reference (`src/pages/course-detail/CourseDetail.jsx`). */
  courseDetailDemo: '/course-detail',
  /** Programs nav — forked detail shell (`src/pages/program-course-detail/`). */
  programCourseDetail: '/program-course-detail',
  page403: '/error/403',
  page404: '/error/404',
  page500: '/error/500',
  components: '/components',
  docs: 'https://docs.minimals.cc/',
  changelog: 'https://docs.minimals.cc/changelog/',
  zoneStore: 'https://mui.com/store/items/zone-landing-page/',
  minimalStore: 'https://mui.com/store/items/minimal-dashboard/',
  freeUI: 'https://mui.com/store/items/minimal-dashboard-free/',
  figmaUrl: 'https://www.figma.com/design/WadcoP3CSejUDj7YZc87xj/%5BPreview%5D-Minimal-Web.v7.3.0',
  product: {
    root: `/product`,
    checkout: `/product/checkout`,
    details: (id) => `/product/${id}`,
    demo: { details: `/product/${MOCK_ID}` },
  },
  post: {
    root: `/post`,
    details: (title) => `/post/${kebabCase(title)}`,
    demo: { details: `/post/${kebabCase(MOCK_TITLE)}` },
  },
  // AUTH
  auth: {
    amplify: {
      signIn: `${ROOTS.AUTH}/amplify/sign-in`,
      verify: `${ROOTS.AUTH}/amplify/verify`,
      signUp: `${ROOTS.AUTH}/amplify/sign-up`,
      updatePassword: `${ROOTS.AUTH}/amplify/update-password`,
      resetPassword: `${ROOTS.AUTH}/amplify/reset-password`,
    },
    jwt: {
      signIn: '/login',
      signUp: `${ROOTS.AUTH}/jwt/sign-up`,
    },
    firebase: {
      signIn: `${ROOTS.AUTH}/firebase/sign-in`,
      verify: `${ROOTS.AUTH}/firebase/verify`,
      signUp: `${ROOTS.AUTH}/firebase/sign-up`,
      resetPassword: `${ROOTS.AUTH}/firebase/reset-password`,
    },
    auth0: { signIn: `${ROOTS.AUTH}/auth0/sign-in` },
    supabase: {
      signIn: `${ROOTS.AUTH}/supabase/sign-in`,
      verify: `${ROOTS.AUTH}/supabase/verify`,
      signUp: `${ROOTS.AUTH}/supabase/sign-up`,
      updatePassword: `${ROOTS.AUTH}/supabase/update-password`,
      resetPassword: `${ROOTS.AUTH}/supabase/reset-password`,
    },
  },
  authDemo: {
    split: {
      signIn: `${ROOTS.AUTH_DEMO}/split/sign-in`,
      signUp: `${ROOTS.AUTH_DEMO}/split/sign-up`,
      resetPassword: `${ROOTS.AUTH_DEMO}/split/reset-password`,
      updatePassword: `${ROOTS.AUTH_DEMO}/split/update-password`,
      verify: `${ROOTS.AUTH_DEMO}/split/verify`,
    },
    centered: {
      signIn: `${ROOTS.AUTH_DEMO}/centered/sign-in`,
      signUp: `${ROOTS.AUTH_DEMO}/centered/sign-up`,
      resetPassword: `${ROOTS.AUTH_DEMO}/centered/reset-password`,
      updatePassword: `${ROOTS.AUTH_DEMO}/centered/update-password`,
      verify: `${ROOTS.AUTH_DEMO}/centered/verify`,
    },
  },
  // DASHBOARD (LMS routes — instructor home at `/dashboard`)
  dashboard: {
    root: LMS_HOME,
    overview: LMS_HOME,
    courses: {
      root: `/courses`,
      /** Legacy; prefer `courseDetails` — resolves by LMS id only. */
      details: (courseId) => `/courses/${courseId}`,
    },
    /** Public-facing course landing URL slug (matches course settings URL field). */
    courseDetails: (slug) => `/course-details/${slug}`,
    /** Full-page text lesson (`kind: document`) — `courseKey` is slug or LMS course `public_id`. */
    courseTextLesson: (courseKey, lessonId) =>
      `/course-details/${encodeURIComponent(String(courseKey ?? ''))}/text-lesson/${encodeURIComponent(String(lessonId ?? ''))}`,
    courseVideoLesson: (courseKey, lessonId) =>
      `/course-details/${encodeURIComponent(String(courseKey ?? ''))}/video-lesson/${encodeURIComponent(String(lessonId ?? ''))}`,
    /** Quiz intro (“Start quiz”); `courseKey` is slug or LMS course `public_id`. */
    courseQuiz: (courseKey, quizId) =>
      `/course-details/${encodeURIComponent(String(courseKey ?? ''))}/quiz/${encodeURIComponent(String(quizId ?? ''))}`,
    /** Timed quiz attempt UI (pagination + timer); same `courseKey` as `courseQuiz`. */
    courseQuizTake: (courseKey, quizId) =>
      `/course-details/${encodeURIComponent(String(courseKey ?? ''))}/quiz/${encodeURIComponent(String(quizId ?? ''))}/take`,
    /** Assignment intro for enrolled learners; `courseKey` is slug or LMS course `public_id`. */
    courseAssignment: (courseKey, assignmentId) =>
      `/course-details/${encodeURIComponent(String(courseKey ?? ''))}/assignment/${encodeURIComponent(String(assignmentId ?? ''))}`,
    modules: {
      details: (moduleId) => `/modules/${moduleId}`,
    },
    quizzes: {
      root: `/quizzes`,
      details: (quizId) => `/quizzes/${quizId}`,
      history: `/quizzes/history`,
      leaderboard: (quizId) =>
        `/quizzes/${encodeURIComponent(String(quizId ?? ''))}/leaderboard`,
    },
    /** Admin dashboard at `/dashboard`. */
    home: ADMIN_DASHBOARD,
    /** Instructor workspace home (non-admin). */
    instructorHome: INSTRUCTOR_HOME,
    /** @deprecated Legacy alias — use `home` (admin) or `instructorHome` (instructor). */
    instructorProfile: ADMIN_DASHBOARD,
    settingProfile: `/setting-profile`,
    /** @deprecated Use `settingProfile` — legacy `/instructor-settings` URL. */
    instructorSettings: `/setting-profile`,
    gradebook: `/gradebook`,
    /** @deprecated Use `gradebook` — legacy `/instructor-gradebook` URL. */
    instructorGradebook: `/gradebook`,
    announcement: `/announcement`,
    /** @deprecated Use `announcement` — legacy `/instructor-announcement` URL. */
    instructorAnnouncement: `/announcement`,
    /** Contact form submissions inbox (admin / instructor). */
    feedback: `/feedback`,
    courseCurriculum: `/course-curriculum`,
    /** Opens the builder against the LMS API and creates a DB row on first save / first module. */
    newCourseCurriculum: `/course-curriculum?new=1`,
    /** @deprecated Use `courseCurriculum` — legacy `/instructor-course-curriculum` URL. */
    instructorCourseCurriculum: `/course-curriculum`,
    /** @deprecated Use `newCourseCurriculum`. */
    instructorNewCourseCurriculum: `/course-curriculum?new=1`,
    courseCurriculumEdit: (slugOrPublicId) =>
      `/course-curriculum/${encodeURIComponent(String(slugOrPublicId ?? ''))}/edit`,
    /** @deprecated Use `courseCurriculumEdit` — legacy `/instructor-course/:slug/edit` URL. */
    instructorCourseEdit: (slugOrPublicId) =>
      `/course-curriculum/${encodeURIComponent(String(slugOrPublicId ?? ''))}/edit`,
    assignment: `/assignment`,
    assignmentStudents: (assignmentId) =>
      `/assignment/${encodeURIComponent(String(assignmentId ?? ''))}/students`,
    assignmentLeaderboard: (assignmentId) =>
      `/assignment/${encodeURIComponent(String(assignmentId ?? ''))}/leaderboard`,
    studentQuizzes: `/student-quizzes`,
    quizStudents: (quizId) =>
      `/student-quizzes/${encodeURIComponent(String(quizId ?? ''))}/students`,
    quizLeaderboard: (quizId) =>
      `/student-quizzes/${encodeURIComponent(String(quizId ?? ''))}/leaderboard`,
    /** @deprecated Use `assignment` — legacy `/instructor-assignments` URL. */
    instructorAssignments: `/assignment`,
    settingProgram: `/setting-program`,
    settingProgramApplicants: (programId) =>
      `/setting-program/${encodeURIComponent(String(programId ?? ''))}/applicants`,
    /** @deprecated Use `settingProgram` — legacy `/programs` admin URL. */
    programs: `/setting-program`,
    settingBatchEnroll: `/setting-batch-enroll`,
    settingBatchEnrollApplicants: (batchId) =>
      `/setting-batch-enroll/${encodeURIComponent(String(batchId ?? ''))}/applicants`,
    settingModeOfLearning: `/setting-mode-of-learning`,
    settingModeOfLearningApplicants: (modeId) =>
      `/setting-mode-of-learning/${encodeURIComponent(String(modeId ?? ''))}/applicants`,
    settingBranchEnroll: `/setting-branch-enroll`,
    settingBranchEnrollApplicants: (branchId) =>
      `/setting-branch-enroll/${encodeURIComponent(String(branchId ?? ''))}/applicants`,
    settingReviewSchedule: `/setting-review-schedule`,
    settingReviewScheduleApplicants: (scheduleId) =>
      `/setting-review-schedule/${encodeURIComponent(String(scheduleId ?? ''))}/applicants`,
    settingHonorsAwardsDiscount: `/setting-honors-awards-discount`,
    settingHonorsAwardsDiscountApplicants: (optionId) =>
      `/setting-honors-awards-discount/${encodeURIComponent(String(optionId ?? ''))}/applicants`,
    settingPackageEnroll: `/setting-package-enroll`,
    settingPackageEnrollApplicants: (packageId) =>
      `/setting-package-enroll/${encodeURIComponent(String(packageId ?? ''))}/applicants`,
    settingInstructor: `/setting-instructor`,
    /** @deprecated Use `settingInstructor` — legacy `/instructors` admin URL. */
    instructors: `/setting-instructor`,
    settingStudent: `/setting-student`,
    /** @deprecated Use `settingStudent` — legacy `/students` admin URL. */
    students: `/setting-student`,
    settingPayment: `/setting-payment`,
    studentAssignments: `/assignments`,
    studentAssignmentLeaderboard: (assignmentId) =>
      `/assignments/${encodeURIComponent(String(assignmentId ?? ''))}/leaderboard`,
    availablePrograms: `/available-programs`,
    studentSettings: `/settings`,
    analyticsHub: `/analytics`,
    leaderboard: `/leaderboard`,
    enrollment: `/enrollment`,
    enrollmentApply: `/enrollment/apply`,
    paymentHistory: `/payment-history`,
    admin: `/admin`,
    contentManagementHomepage: `/content-management/homepage`,
    contentManagementHomepageV2: `/content-management/homepage-v2`,
    contentManagementAboutUs: `/content-management/about-us`,
    contentManagementContactUs: `/content-management/contact-us`,
    mail: `/mail`,
    chat: `/chat`,
    blank: `/blank`,
    kanban: `/kanban`,
    calendar: `/calendar`,
    fileManager: `/file-manager`,
    permission: `/permission`,
    general: {
      app: `/app`,
      ecommerce: `/ecommerce`,
      analytics: `/analytics`,
      banking: `/banking`,
      booking: `/booking`,
      file: `/file`,
      course: `/course`,
    },
    user: {
      root: `/user`,
      new: `/user/new`,
      list: `/user/list`,
      cards: `/user/cards`,
      profile: `/user/profile`,
      account: `/user/account`,
      edit: (id) => `/user/${id}/edit`,
      demo: { edit: `/user/${MOCK_ID}/edit` },
    },
    product: {
      root: `/product`,
      new: `/product/new`,
      details: (id) => `/product/${id}`,
      edit: (id) => `/product/${id}/edit`,
      demo: {
        details: `/product/${MOCK_ID}`,
        edit: `/product/${MOCK_ID}/edit`,
      },
    },
    invoice: {
      root: `/invoice`,
      new: `/invoice/new`,
      details: (id) => `/invoice/${id}`,
      edit: (id) => `/invoice/${id}/edit`,
      demo: {
        details: `/invoice/${MOCK_ID}`,
        edit: `/invoice/${MOCK_ID}/edit`,
      },
    },
    post: {
      root: `/post`,
      new: `/post/new`,
      details: (title) => `/post/${kebabCase(title)}`,
      edit: (title) => `/post/${kebabCase(title)}/edit`,
      demo: {
        details: `/post/${kebabCase(MOCK_TITLE)}`,
        edit: `/post/${kebabCase(MOCK_TITLE)}/edit`,
      },
    },
    order: {
      root: `/order`,
      details: (id) => `/order/${id}`,
      demo: { details: `/order/${MOCK_ID}` },
    },
    job: {
      root: `/job`,
      new: `/job/new`,
      details: (id) => `/job/${id}`,
      edit: (id) => `/job/${id}/edit`,
      demo: {
        details: `/job/${MOCK_ID}`,
        edit: `/job/${MOCK_ID}/edit`,
      },
    },
    tour: {
      root: `/tour`,
      new: `/tour/new`,
      details: (id) => `/tour/${id}`,
      edit: (id) => `/tour/${id}/edit`,
      demo: {
        details: `/tour/${MOCK_ID}`,
        edit: `/tour/${MOCK_ID}/edit`,
      },
    },
  },
};
