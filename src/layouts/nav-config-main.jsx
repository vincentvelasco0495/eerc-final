import { paths } from 'src/routes/paths';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function buildMainNavData(programs = []) {
  const activePrograms = (programs ?? []).filter(
    (program) => String(program?.status ?? '').toLowerCase() === 'active'
  );

  const programItems = activePrograms.map((program) => {
    const programSlug = String(program?.slug ?? '').trim();
    const fallbackSlug = String(program?.code ?? '').trim().toLowerCase();
    const resolvedSlug = programSlug || fallbackSlug;

    return {
      title: String(program?.title ?? '').trim() || 'Program',
      path: `${paths.programCourseDetail}?program=${encodeURIComponent(resolvedSlug)}`,
    };
  });

  return [
  { title: 'Home', path: '/', icon: <Iconify width={22} icon="solar:home-angle-bold-duotone" /> },
  {
    title: 'About Us',
    path: paths.about,
    icon: <Iconify width={22} icon="solar:shield-user-bold-duotone" />,
  },
  {
    title: 'Programs',
    path: paths.dashboard.courses.root,
    icon: <Iconify width={22} icon="solar:book-bookmark-bold-duotone" />,
    deepMatch: true,
    children: [
      {
        subheader: 'Programs',
        items: programItems,
      },
    ],
  },
  {
    title: 'Leaderboard',
    path: paths.dashboard.leaderboard,
    icon: <Iconify width={22} icon="solar:cup-star-bold-duotone" />,
  },
  {
    title: 'Contact Us',
    path: paths.contact,
    icon: <Iconify width={22} icon="solar:phone-calling-rounded-bold-duotone" />,
  },
  ];
}

export const navData = buildMainNavData();
