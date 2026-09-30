export const lmsEndpoints = {
  user: () => '/api/user',
  meta: () => '/api/meta',
  programs: () => '/api/programs',
  programsPaginated: ({ page = 1, perPage = 10, search = '' } = {}) => {
    const base = `/api/programs?page=${page}&per_page=${perPage}`;
    const q = typeof search === 'string' && search.trim() ? `&search=${encodeURIComponent(search.trim())}` : '';
    return `${base}${q}`;
  },
  programApplicantsPaginated: ({ programId, page = 1, perPage = 10, search = '', status = '' } = {}) => {
    const id = encodeURIComponent(String(programId ?? '').trim());
    const base = `/api/programs/${id}/applicants?page=${page}&per_page=${perPage}`;
    const q = typeof search === 'string' && search.trim() ? `&search=${encodeURIComponent(search.trim())}` : '';
    const statusQ =
      typeof status === 'string' && status.trim() ? `&status=${encodeURIComponent(status.trim())}` : '';
    return `${base}${q}${statusQ}`;
  },
  batchEnrolls: () => '/api/batch-enrolls',
  batchEnrollsPaginated: ({ page = 1, perPage = 10, search = '' } = {}) => {
    const base = `/api/batch-enrolls?page=${page}&per_page=${perPage}`;
    const q = typeof search === 'string' && search.trim() ? `&search=${encodeURIComponent(search.trim())}` : '';
    return `${base}${q}`;
  },
  batchApplicantsPaginated: ({ batchId, page = 1, perPage = 10, search = '', status = '' } = {}) => {
    const id = encodeURIComponent(String(batchId ?? '').trim());
    const base = `/api/batch-enrolls/${id}/applicants?page=${page}&per_page=${perPage}`;
    const q = typeof search === 'string' && search.trim() ? `&search=${encodeURIComponent(search.trim())}` : '';
    const statusQ =
      typeof status === 'string' && status.trim() ? `&status=${encodeURIComponent(status.trim())}` : '';
    return `${base}${q}${statusQ}`;
  },
  learningModes: () => '/api/learning-modes',
  learningModesPaginated: ({ page = 1, perPage = 10, search = '' } = {}) => {
    const base = `/api/learning-modes?page=${page}&per_page=${perPage}`;
    const q = typeof search === 'string' && search.trim() ? `&search=${encodeURIComponent(search.trim())}` : '';
    return `${base}${q}`;
  },
  learningModeApplicantsPaginated: ({
    modeId,
    page = 1,
    perPage = 10,
    search = '',
    status = '',
    program = '',
    batch = '',
  } = {}) => {
    const id = encodeURIComponent(String(modeId ?? '').trim());
    const base = `/api/learning-modes/${id}/applicants?page=${page}&per_page=${perPage}`;
    const q = typeof search === 'string' && search.trim() ? `&search=${encodeURIComponent(search.trim())}` : '';
    const statusQ =
      typeof status === 'string' && status.trim() ? `&status=${encodeURIComponent(status.trim())}` : '';
    const programQ =
      typeof program === 'string' && program.trim() ? `&program=${encodeURIComponent(program.trim())}` : '';
    const batchQ =
      typeof batch === 'string' && batch.trim() ? `&batch=${encodeURIComponent(batch.trim())}` : '';
    return `${base}${q}${statusQ}${programQ}${batchQ}`;
  },
  branchEnrolls: () => '/api/branch-enrolls',
  branchEnrollsPaginated: ({ page = 1, perPage = 10, search = '' } = {}) => {
    const base = `/api/branch-enrolls?page=${page}&per_page=${perPage}`;
    const q = typeof search === 'string' && search.trim() ? `&search=${encodeURIComponent(search.trim())}` : '';
    return `${base}${q}`;
  },
  branchApplicantsPaginated: ({
    branchId,
    page = 1,
    perPage = 10,
    search = '',
    status = '',
    program = '',
    batch = '',
    learningMode = '',
  } = {}) => {
    const id = encodeURIComponent(String(branchId ?? '').trim());
    const base = `/api/branch-enrolls/${id}/applicants?page=${page}&per_page=${perPage}`;
    const q = typeof search === 'string' && search.trim() ? `&search=${encodeURIComponent(search.trim())}` : '';
    const statusQ =
      typeof status === 'string' && status.trim() ? `&status=${encodeURIComponent(status.trim())}` : '';
    const programQ =
      typeof program === 'string' && program.trim() ? `&program=${encodeURIComponent(program.trim())}` : '';
    const batchQ =
      typeof batch === 'string' && batch.trim() ? `&batch=${encodeURIComponent(batch.trim())}` : '';
    const modeQ =
      typeof learningMode === 'string' && learningMode.trim()
        ? `&learningMode=${encodeURIComponent(learningMode.trim())}`
        : '';
    return `${base}${q}${statusQ}${programQ}${batchQ}${modeQ}`;
  },
  reviewSchedules: () => '/api/review-schedules',
  reviewSchedulesPaginated: ({ page = 1, perPage = 10, search = '' } = {}) => {
    const base = `/api/review-schedules?page=${page}&per_page=${perPage}`;
    const q = typeof search === 'string' && search.trim() ? `&search=${encodeURIComponent(search.trim())}` : '';
    return `${base}${q}`;
  },
  reviewScheduleApplicantsPaginated: ({
    scheduleId,
    page = 1,
    perPage = 10,
    search = '',
    status = '',
    program = '',
    batch = '',
    learningMode = '',
  } = {}) => {
    const id = encodeURIComponent(String(scheduleId ?? '').trim());
    const base = `/api/review-schedules/${id}/applicants?page=${page}&per_page=${perPage}`;
    const q = typeof search === 'string' && search.trim() ? `&search=${encodeURIComponent(search.trim())}` : '';
    const statusQ =
      typeof status === 'string' && status.trim() ? `&status=${encodeURIComponent(status.trim())}` : '';
    const programQ =
      typeof program === 'string' && program.trim() ? `&program=${encodeURIComponent(program.trim())}` : '';
    const batchQ =
      typeof batch === 'string' && batch.trim() ? `&batch=${encodeURIComponent(batch.trim())}` : '';
    const modeQ =
      typeof learningMode === 'string' && learningMode.trim()
        ? `&learningMode=${encodeURIComponent(learningMode.trim())}`
        : '';
    return `${base}${q}${statusQ}${programQ}${batchQ}${modeQ}`;
  },
  honorAwardDiscounts: () => '/api/honor-award-discounts',
  honorAwardDiscountsPaginated: ({ page = 1, perPage = 10, search = '' } = {}) => {
    const base = `/api/honor-award-discounts?page=${page}&per_page=${perPage}`;
    const q = typeof search === 'string' && search.trim() ? `&search=${encodeURIComponent(search.trim())}` : '';
    return `${base}${q}`;
  },
  honorAwardDiscountApplicantsPaginated: ({
    optionId,
    page = 1,
    perPage = 10,
    search = '',
    status = '',
    program = '',
    batch = '',
    branch = '',
  } = {}) => {
    const id = encodeURIComponent(String(optionId ?? '').trim());
    const base = `/api/honor-award-discounts/${id}/applicants?page=${page}&per_page=${perPage}`;
    const q = typeof search === 'string' && search.trim() ? `&search=${encodeURIComponent(search.trim())}` : '';
    const statusQ =
      typeof status === 'string' && status.trim() ? `&status=${encodeURIComponent(status.trim())}` : '';
    const programQ =
      typeof program === 'string' && program.trim() ? `&program=${encodeURIComponent(program.trim())}` : '';
    const batchQ =
      typeof batch === 'string' && batch.trim() ? `&batch=${encodeURIComponent(batch.trim())}` : '';
    const branchQ =
      typeof branch === 'string' && branch.trim() ? `&branch=${encodeURIComponent(branch.trim())}` : '';
    return `${base}${q}${statusQ}${programQ}${batchQ}${branchQ}`;
  },
  packageEnrolls: () => '/api/package-enrolls',
  packageEnrollsPaginated: ({ page = 1, perPage = 10, search = '' } = {}) => {
    const base = `/api/package-enrolls?page=${page}&per_page=${perPage}`;
    const q = typeof search === 'string' && search.trim() ? `&search=${encodeURIComponent(search.trim())}` : '';
    return `${base}${q}`;
  },
  packageEnrollApplicantsPaginated: ({
    packageId,
    page = 1,
    perPage = 10,
    search = '',
    status = '',
    program = '',
    batch = '',
    branch = '',
  } = {}) => {
    const id = encodeURIComponent(String(packageId ?? '').trim());
    const base = `/api/package-enrolls/${id}/applicants?page=${page}&per_page=${perPage}`;
    const q = typeof search === 'string' && search.trim() ? `&search=${encodeURIComponent(search.trim())}` : '';
    const statusQ =
      typeof status === 'string' && status.trim() ? `&status=${encodeURIComponent(status.trim())}` : '';
    const programQ =
      typeof program === 'string' && program.trim() ? `&program=${encodeURIComponent(program.trim())}` : '';
    const batchQ =
      typeof batch === 'string' && batch.trim() ? `&batch=${encodeURIComponent(batch.trim())}` : '';
    const branchQ =
      typeof branch === 'string' && branch.trim() ? `&branch=${encodeURIComponent(branch.trim())}` : '';
    return `${base}${q}${statusQ}${programQ}${batchQ}${branchQ}`;
  },
  instructors: () => '/api/instructors',
  instructorsPaginated: ({ page = 1, perPage = 10, search = '' } = {}) => {
    const base = `/api/instructors?page=${page}&per_page=${perPage}`;
    const q = typeof search === 'string' && search.trim() ? `&search=${encodeURIComponent(search.trim())}` : '';
    return `${base}${q}`;
  },
  instructorsLinkableUsers: () => '/api/instructors/linkable-users',
  students: () => '/api/students',
  studentsPaginated: ({ page = 1, perPage = 10, search = '' } = {}) => {
    const base = `/api/students?page=${page}&per_page=${perPage}`;
    const q = typeof search === 'string' && search.trim() ? `&search=${encodeURIComponent(search.trim())}` : '';
    return `${base}${q}`;
  },
  studentsLinkableUsers: () => '/api/students/linkable-users',
  programStats: (programPublicId) =>
    `/api/programs/${encodeURIComponent(programPublicId)}/stats`,
  courses: ({ page = 1, limit = 100, program = '', status = '' } = {}) => {
    const programQuery =
      typeof program === 'string' && program.trim()
        ? `&program=${encodeURIComponent(program.trim())}`
        : '';
    const statusNorm = typeof status === 'string' ? status.trim().toLowerCase() : '';
    const statusQuery =
      statusNorm && statusNorm !== 'all'
        ? `&status=${encodeURIComponent(statusNorm)}`
        : '';
    return `/api/courses?page=${page}&limit=${limit}${programQuery}${statusQuery}`;
  },
  courseDetail: (courseLookup) =>
    `/api/courses/${encodeURIComponent(String(courseLookup ?? '').trim())}/detail`,
  courseStats: (courseId) => `/api/courses/${encodeURIComponent(courseId)}/stats`,
  modulesByCourse: (courseId) => `/api/modules?courseId=${encodeURIComponent(courseId)}`,
  moduleById: (moduleId) => `/api/modules?ids=${encodeURIComponent(moduleId)}`,
  quizzes: (moduleId) =>
    moduleId ? `/api/quizzes?moduleId=${encodeURIComponent(moduleId)}` : '/api/quizzes',
  quizResults: () => '/api/quiz-results',
  assignmentSummaries: () => '/api/assignment-summaries',
  quizSummaries: () => '/api/quiz-summaries',
  gradebookCourses: () => '/api/gradebook/courses',
  gradebook: ({ courseId, page = 1, perPage = 10 } = {}) => {
    const base = `/api/gradebook/courses/${encodeURIComponent(String(courseId ?? '').trim())}?page=${page}&per_page=${perPage}`;
    return base;
  },
  myAssignments: ({ page = 1, perPage = 10, status = 'all', search = '' } = {}) => {
    const base = `/api/my-assignments?page=${page}&per_page=${perPage}`;
    const statusQ =
      typeof status === 'string' && status.trim() && status.toLowerCase() !== 'all'
        ? `&status=${encodeURIComponent(status.toLowerCase())}`
        : '';
    const q = typeof search === 'string' && search.trim() ? `&search=${encodeURIComponent(search.trim())}` : '';
    return `${base}${statusQ}${q}`;
  },
  myQuizzes: ({ page = 1, perPage = 10, status = 'all', search = '' } = {}) => {
    const base = `/api/my-quizzes?page=${page}&per_page=${perPage}`;
    const statusQ =
      typeof status === 'string' && status.trim() && status.toLowerCase() !== 'all'
        ? `&status=${encodeURIComponent(status.toLowerCase())}`
        : '';
    const q = typeof search === 'string' && search.trim() ? `&search=${encodeURIComponent(search.trim())}` : '';
    return `${base}${statusQ}${q}`;
  },
  assignmentStudents: ({ assignmentId, page = 1, perPage = 10, status = 'passed', search = '' } = {}) => {
    const base = `/api/assignments/${encodeURIComponent(String(assignmentId ?? '').trim())}/students?page=${page}&per_page=${perPage}&status=${encodeURIComponent(status)}`;
    const q = typeof search === 'string' && search.trim() ? `&search=${encodeURIComponent(search.trim())}` : '';
    return `${base}${q}`;
  },
  assignmentLeaderboard: ({ assignmentId, page = 1, perPage = 10, search = '' } = {}) => {
    const base = `/api/assignments/${encodeURIComponent(String(assignmentId ?? '').trim())}/leaderboard?page=${page}&per_page=${perPage}`;
    const q = typeof search === 'string' && search.trim() ? `&search=${encodeURIComponent(search.trim())}` : '';
    return `${base}${q}`;
  },
  quizStudents: ({ quizId, page = 1, perPage = 10, status = 'passed', search = '' } = {}) => {
    const base = `/api/quizzes/${encodeURIComponent(String(quizId ?? '').trim())}/students?page=${page}&per_page=${perPage}&status=${encodeURIComponent(status)}`;
    const q = typeof search === 'string' && search.trim() ? `&search=${encodeURIComponent(search.trim())}` : '';
    return `${base}${q}`;
  },
  quizLeaderboard: ({ quizId, page = 1, perPage = 10, search = '' } = {}) => {
    const base = `/api/quizzes/${encodeURIComponent(String(quizId ?? '').trim())}/leaderboard?page=${page}&per_page=${perPage}`;
    const q = typeof search === 'string' && search.trim() ? `&search=${encodeURIComponent(search.trim())}` : '';
    return `${base}${q}`;
  },
  lessonProgress: (courseId) => `/api/courses/${encodeURIComponent(courseId)}/lesson-progress`,
  analytics: () => '/api/analytics',
  modulesByIds: (ids) => `/api/modules?ids=${encodeURIComponent(ids.join(','))}`,
  leaderboard: (period) => `/api/leaderboard?type=${encodeURIComponent(period)}`,
  enrollments: () => '/api/enrollments',
  enrolledCourses: () => '/api/enrollments/enrolled-courses',
  /** Redux cache keys scoped per signed-in user (see `useLmsEnrollments`). */
  enrollmentsCacheKey: (userId) =>
    userId ? `/api/enrollments#user=${encodeURIComponent(String(userId))}` : '/api/enrollments',
  enrolledCoursesCacheKey: (userId) =>
    userId
      ? `/api/enrollments/enrolled-courses#user=${encodeURIComponent(String(userId))}`
      : '/api/enrollments/enrolled-courses',
  enrollmentsPaginated: ({ page = 1, perPage = 10, search = '', course = '', status = '' } = {}) => {
    const base = `/api/enrollments?page=${page}&per_page=${perPage}`;
    const q = typeof search === 'string' && search.trim() ? `&search=${encodeURIComponent(search.trim())}` : '';
    const courseQ =
      typeof course === 'string' && course.trim() ? `&course=${encodeURIComponent(course.trim())}` : '';
    const statusQ =
      typeof status === 'string' && status.trim() ? `&status=${encodeURIComponent(status.trim())}` : '';
    return `${base}${q}${courseQ}${statusQ}`;
  },
  enrollmentPaymentsPaginated: ({ page = 1, perPage = 10, search = '', verification = '' } = {}) => {
    const base = `/api/enrollment-payments?page=${page}&per_page=${perPage}`;
    const q = typeof search === 'string' && search.trim() ? `&search=${encodeURIComponent(search.trim())}` : '';
    const verificationQ =
      typeof verification === 'string' && verification.trim()
        ? `&verification=${encodeURIComponent(verification.trim())}`
        : '';
    return `${base}${q}${verificationQ}`;
  },
  enrollmentDetail: (publicId) => `/api/enrollments/${encodeURIComponent(String(publicId ?? '').trim())}`,
  admin: () => '/api/admin',
  announcements: () => '/api/announcements',
  notifications: () => '/api/notifications',
  notificationsReadAll: () => '/api/notifications/read-all',
  notificationMarkRead: (publicId) =>
    `/api/notifications/${encodeURIComponent(String(publicId ?? '').trim())}/read`,
  notificationMarkUnread: (publicId) =>
    `/api/notifications/${encodeURIComponent(String(publicId ?? '').trim())}/unread`,
};
