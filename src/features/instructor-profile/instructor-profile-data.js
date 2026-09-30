import { paths } from 'src/routes/paths';

import { resolveApiAssetUrl } from 'src/utils/resolve-api-asset-url';

import { getRoleHomePath, canAccessPageHref } from 'src/auth/utils/page-permissions';

// Sidebar navigation groups
const sidebarGroups = [
  {
    title: 'Main',
    items: [
      {
        label: 'Dashboard',
        icon: 'solar:widget-5-bold-duotone',
        pathKey: 'home',
      },
      {
        label: 'Add Courses',
        icon: 'solar:add-circle-bold-duotone',
        path: paths.dashboard.newCourseCurriculum,
      },
    ],
  },
  {
    title: 'Enrollment',
    items: [
      {
        label: 'Enrollment',
        icon: 'solar:user-plus-bold-duotone',
        path: paths.dashboard.enrollment,
      },
      {
        label: 'Payment history',
        icon: 'solar:wallet-money-bold-duotone',
        path: paths.dashboard.paymentHistory,
      },
    ],
  },
  {
    title: 'Communication',
    items: [
      {
        label: 'Announcement',
        icon: 'solar:speaker-bold-duotone',
        path: paths.dashboard.announcement,
      },
      {
        label: 'Feedback',
        icon: 'solar:chat-round-dots-bold-duotone',
        path: paths.dashboard.feedback,
      },
    ],
  },
  {
    title: 'Progress',
    items: [
      {
        label: 'Gradebook',
        icon: 'solar:clipboard-check-bold-duotone',
        path: paths.dashboard.gradebook,
      },
      {
        label: 'Quizzes',
        icon: 'solar:question-circle-bold-duotone',
        path: paths.dashboard.studentQuizzes,
      },
      {
        label: 'Assignments',
        icon: 'solar:clipboard-list-bold-duotone',
        path: paths.dashboard.assignment,
      },
    ],
  },
  {
    title: 'Content Management',
    items: [
      {
        label: 'Homepage',
        icon: 'solar:home-2-bold-duotone',
        path: paths.dashboard.contentManagementHomepageV2,
      },
      {
        label: 'About Us',
        icon: 'solar:info-circle-bold-duotone',
        path: paths.dashboard.contentManagementAboutUs,
      },
      {
        label: 'Contact Us',
        icon: 'solar:mailbox-bold-duotone',
        path: paths.dashboard.contentManagementContactUs,
      },
    ],
  },
  {
    title: 'System Setting',
    items: [
      {
        label: 'Profile',
        icon: 'solar:settings-bold-duotone',
        path: paths.dashboard.settingProfile,
      },
      {
        label: 'Programs',
        icon: 'solar:layers-bold-duotone',
        path: paths.dashboard.settingProgram,
      },
      {
        label: 'Enrollment',
        icon: 'solar:slider-vertical-bold-duotone',
        children: [
          {
            label: 'Batch enroll',
            icon: 'solar:calendar-date-bold-duotone',
            path: paths.dashboard.settingBatchEnroll,
          },
          {
            label: 'Mode of learning',
            icon: 'solar:book-2-bold-duotone',
            path: paths.dashboard.settingModeOfLearning,
          },
          {
            label: 'Branch to enroll',
            icon: 'solar:map-point-bold-duotone',
            path: paths.dashboard.settingBranchEnroll,
          },
          {
            label: 'Review schedule',
            icon: 'solar:calendar-bold-duotone',
            path: paths.dashboard.settingReviewSchedule,
          },
          {
            label: 'Honors / awards / discount',
            icon: 'solar:medal-ribbons-star-bold-duotone',
            path: paths.dashboard.settingHonorsAwardsDiscount,
          },
          {
            label: 'Package enroll',
            icon: 'solar:box-bold-duotone',
            path: paths.dashboard.settingPackageEnroll,
          },
        ],
      },
      {
        label: 'Students',
        icon: 'solar:user-rounded-bold-duotone',
        path: paths.dashboard.settingStudent,
      },
      {
        label: 'Payment',
        icon: 'solar:wallet-money-bold-duotone',
        path: paths.dashboard.settingPayment,
      },
      { label: 'Log out', icon: 'solar:logout-3-bold-duotone', action: 'logout' },
    ],
  },
];

function isPathActive(pathname, path) {
  if (!path) {
    return false;
  }
  return pathname === path || pathname === `${path}/`;
}

function canAccessNavPath(user, role, path) {
  return canAccessPageHref(user ?? { role, pagePermissions: [] }, path);
}

function decorateNavItem(item, pathname, role, user, assignmentPendingBadge) {
  let next = { ...item };

  if (item.pathKey === 'home') {
    next.path = getRoleHomePath(role);
  }

  if (item.path === paths.dashboard.assignment && assignmentPendingBadge) {
    next.badge = assignmentPendingBadge;
  }

  const assignmentStudentsActive =
    item.path === paths.dashboard.assignment &&
    /^\/assignment\/[^/]+\/students\/?$/.test(pathname ?? '');

  const quizStudentsActive =
    item.path === paths.dashboard.studentQuizzes &&
    /^\/student-quizzes\/[^/]+\/students\/?$/.test(pathname ?? '');

  const quizLeaderboardActive =
    item.path === paths.dashboard.studentQuizzes &&
    /^\/student-quizzes\/[^/]+\/leaderboard\/?$/.test(pathname ?? '');

  if (Array.isArray(item.children) && item.children.length > 0) {
    next.children = item.children
      .filter((child) => !child.path || canAccessNavPath(user, role, child.path))
      .map((child) => ({
        ...child,
        active: isPathActive(pathname, child.path),
      }));

    const childActive = next.children.some((child) => child.active);
    next.active = isPathActive(pathname, next.path) || childActive;
    next.open = next.active;
    return next;
  }

  next.active = isPathActive(pathname, next.path) || assignmentStudentsActive || quizStudentsActive || quizLeaderboardActive;
  return next;
}

function isNavItemVisible(item, user, role) {
  if (item.action === 'logout') {
    return true;
  }

  if (Array.isArray(item.children) && item.children.length > 0) {
    const visibleChildren = item.children.filter(
      (child) => !child.path || canAccessNavPath(user, role, child.path)
    );
    return visibleChildren.length > 0 || (item.path && canAccessNavPath(user, role, item.path));
  }

  return !item.path || canAccessNavPath(user, role, item.path);
}

export function getInstructorWorkspaceNavGroups(pathname, role, user, options = {}) {
  const assignmentPendingBadge = options.assignmentPendingBadge;

  return sidebarGroups
    .map((group) => ({
      ...group,
      items: group.items
        .filter((item) => isNavItemVisible(item, user, role))
        .map((item) => decorateNavItem(item, pathname, role, user, assignmentPendingBadge)),
    }))
    .filter((group) => group.items.length > 0);
}

/** First letter of the first two name parts, e.g. "Alex E. Rivera" -> "AE" (same as menu avatar). */
export function getInstructorNameInitials(displayName = '') {
  const initials = displayName
    .split(' ')
    .filter((part) => part.length)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();

  return initials || 'DI';
}

// Instructor identity defaults
export function buildInstructorProfileIdentity(user) {
  const displayName = user?.displayName || 'Demo Instructor';

  return {
    name: displayName,
    subtitle: user?.position || null,
    initials: getInstructorNameInitials(displayName),
    avatarUrl: user?.profileUrl ? resolveApiAssetUrl(user.profileUrl) : null,
  };
}

const INSTRUCTOR_ANALYTICS_STAT_TEMPLATES = [
  {
    id: 'programs',
    label: 'Programs Available',
    icon: 'solar:layers-bold-duotone',
  },
  {
    id: 'enrollments',
    label: 'Enrollments',
    icon: 'solar:users-group-rounded-bold-duotone',
  },
  { id: 'students', label: 'Students', icon: 'solar:user-circle-bold-duotone' },
];

function formatInstructorStatValue(value) {
  const n = Number(value);
  if (!Number.isFinite(n) || n < 0) {
    return '—';
  }

  return new Intl.NumberFormat('en-US').format(n);
}

/** Map `GET /api/analytics` → instructor summary stat cards. */
export function buildInstructorAnalyticsStats(instructorSummary) {
  const summary = instructorSummary ?? {};

  return INSTRUCTOR_ANALYTICS_STAT_TEMPLATES.map((item) => ({
    ...item,
    value: formatInstructorStatValue(summary[item.id]),
  }));
}

/** @deprecated Use `buildInstructorAnalyticsStats` with API data. */
export const instructorAnalyticsStats = buildInstructorAnalyticsStats({
  programs: 0,
  enrollments: 0,
  students: 0,
});

export const instructorProgramFilters = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
];

/** @deprecated Use `instructorProgramFilters`. */
export const instructorCourseFilters = instructorProgramFilters;

/** Course grid data comes from `GET /api/courses` (see `InstructorProfileView`). */
