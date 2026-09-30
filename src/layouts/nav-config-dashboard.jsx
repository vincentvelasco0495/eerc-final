import { paths } from 'src/routes/paths';

import { Iconify } from 'src/components/iconify';

const icon = (name) => <Iconify width={22} icon={name} />;

const ICONS = {
  dashboard: icon('solar:widget-5-bold-duotone'),
  courses: icon('solar:book-bookmark-bold-duotone'),
  modules: icon('solar:library-bold-duotone'),
  quizzes: icon('solar:document-bold-duotone'),
  instructorProfile: icon('solar:teacher-bold-duotone'),
  analytics: icon('solar:chart-square-bold-duotone'),
  leaderboard: icon('solar:cup-star-bold-duotone'),
  enrollment: icon('solar:user-plus-bold-duotone'),
  admin: icon('solar:shield-user-bold-duotone'),
};

export const navData = [
  {
    subheader: 'Learning',
    items: [
      { title: 'Dashboard', path: paths.dashboard.root, icon: ICONS.dashboard },
      {
        title: 'Instructor Dashboard',
        path: paths.dashboard.home,
        icon: ICONS.instructorProfile,
      },
      { title: 'Courses', path: paths.dashboard.courses.root, icon: ICONS.courses, deepMatch: true },
      { title: 'Quizzes', path: paths.dashboard.quizzes.root, icon: ICONS.quizzes, deepMatch: true },
      { title: 'Analytics', path: paths.dashboard.analyticsHub, icon: ICONS.analytics },
      { title: 'Leaderboard', path: paths.dashboard.leaderboard, icon: ICONS.leaderboard },
    ],
  },
  {
    subheader: 'Operations',
    items: [
      { title: 'Enrollment', path: paths.dashboard.enrollment, icon: ICONS.enrollment },
      { title: 'Admin', path: paths.dashboard.admin, icon: ICONS.admin },
      {
        title: 'Resume Module',
        path: paths.dashboard.modules.details('module-hydraulics-review'),
        icon: ICONS.modules,
      },
    ],
  },
];
