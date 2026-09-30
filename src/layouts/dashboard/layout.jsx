import { merge } from 'es-toolkit';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import { useTheme } from '@mui/material/styles';
import { iconButtonClasses } from '@mui/material/IconButton';

import { usePathname } from 'src/routes/hooks';
import { paths, isCourseCurriculumBuilderPath } from 'src/routes/paths';

import { goldAlpha, brandPalette } from 'src/theme/brand-tokens';

import { Logo } from 'src/components/logo';
import { useSettingsContext } from 'src/components/settings';

import { useAuthContext } from 'src/auth/hooks';

import { Footer } from '../components/site-footer';
import { AccountDrawer } from '../components/account-drawer';
import { SettingsButton } from '../components/settings-button';
import { MainSection, HeaderSection, LayoutSection } from '../core';
import { LmsNotificationsDrawer } from './lms-notifications-drawer';
import { dashboardLayoutVars, dashboardNavColorVars } from './css-vars';
import { PublicMarketingHeader } from '../main/public-marketing-header';

// ----------------------------------------------------------------------

export function DashboardLayout({ sx, cssVars, children, slotProps, layoutQuery = 'lg' }) {
  const theme = useTheme();
  const pathname = usePathname();
  const { authenticated } = useAuthContext();

  const settings = useSettingsContext();

  const navVars = dashboardNavColorVars(theme, settings.state.navColor, settings.state.navLayout);

  const courseLookupSegment = '[^/]+';
  const isCourseDetailsLanding =
    new RegExp(`^/course-details/${courseLookupSegment}/?$`).test(pathname ?? '') ||
    new RegExp(`^/courses/${courseLookupSegment}/?$`).test(pathname ?? '');

  /** Course landing + lessons + quizzes under `/course-details/:slug/...`. */
  const isLearnerCourseShell =
    isCourseDetailsLanding ||
    new RegExp(`^/course-details/${courseLookupSegment}/(text-lesson|video-lesson|quiz)/`).test(
      pathname ?? ''
    ) ||
    new RegExp(`^/courses/${courseLookupSegment}/(text-lesson|video-lesson|quiz)/`).test(
      pathname ?? ''
    );

  const isContentManagementShell = /^\/content-management(\/.*)?$/.test(pathname ?? '');

  /** Quiz attempt history (`/quizzes/history` or legacy `/history`). */
  const isQuizHistoryShell =
    pathname === paths.dashboard.quizzes.history ||
    /^\/quizzes\/history\/?$/.test(pathname ?? '') ||
    /^\/history\/?$/.test(pathname ?? '');

  const isCurriculumBuilder = isCourseCurriculumBuilderPath(pathname);

  const guestCourseDetailsMarketingHeader = isCourseDetailsLanding && !authenticated;

  /** Light integrated header (not global dark `apparent` nav bar). */
  const lightIntegratedHeaderVars =
    authenticated &&
    (isLearnerCourseShell || isContentManagementShell || isQuizHistoryShell) &&
    !guestCourseDetailsMarketingHeader
      ? dashboardNavColorVars(theme, 'integrate', settings.state.navLayout).layout
      : {};

  const hideDashboardHeader =
    isCurriculumBuilder || /^\/program-course-detail(\/.*)?$/.test(pathname ?? '');

  const renderHeader = () => {
    const headerSlotProps = {
      container: {
        maxWidth: false,
        sx: {
          width: 1,
          maxWidth: 'none !important',
          mx: 0,
          px: { xs: 2, sm: 3, [layoutQuery]: 5 },
          [`& .${iconButtonClasses.root}`]: {
            color: brandPalette.white,
            '&:hover': { bgcolor: goldAlpha(0.12) },
          },
        },
      },
    };

    const headerSlots = {
      topArea: (
        <Alert severity="info" sx={{ display: 'none', borderRadius: 0 }}>
          This is an info Alert.
        </Alert>
      ),
      bottomArea: null,
      leftArea: <Logo sx={{ display: 'inline-flex' }} />,
      rightArea: (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0, sm: 0.75 } }}>
          {/** @slot Notifications popover */}
          <LmsNotificationsDrawer />

          {/** @slot Settings button */}
          <SettingsButton />

          {/** @slot Account drawer */}
          <AccountDrawer />
        </Box>
      ),
    };

    const headerFromLayout = slotProps?.header ?? {};
    const {
      slots: headerSlotsOverride,
      slotProps: headerSlotPropsOverride,
      sx: headerSx,
      ...headerSectionRest
    } = headerFromLayout;

    return (
      <HeaderSection
        layoutQuery={layoutQuery}
        disableOffset
        disableElevation
        {...headerSectionRest}
        slots={{ ...headerSlots, ...headerSlotsOverride }}
        slotProps={merge(headerSlotProps, headerSlotPropsOverride ?? {})}
        sx={[
          {
            bgcolor: brandPalette.deepNavy,
            color: brandPalette.white,
            '--color': brandPalette.white,
            '--offset-color': brandPalette.white,
            borderBottom: `1px solid ${goldAlpha(0.28)}`,
            boxShadow: 'none',
          },
          ...(Array.isArray(headerSx) ? headerSx : [headerSx]),
        ]}
      />
    );
  };

  const renderFooter = () => <Footer layoutQuery={layoutQuery} sx={slotProps?.footer?.sx} />;

  const renderMain = () => <MainSection {...slotProps?.main}>{children}</MainSection>;

  const headerSection = (() => {
    if (hideDashboardHeader) {
      return null;
    }
    if (guestCourseDetailsMarketingHeader) {
      return <PublicMarketingHeader layoutQuery="md" slotProps={slotProps} />;
    }
    return renderHeader();
  })();

  return (
    <LayoutSection
      headerSection={headerSection}
      sidebarSection={null}
      footerSection={renderFooter()}
      cssVars={{
        ...dashboardLayoutVars(theme),
        ...navVars.layout,
        ...lightIntegratedHeaderVars,
        ...(isCurriculumBuilder && {
          '--layout-dashboard-content-pt': '0px',
          '--layout-dashboard-content-pt-desktop': '0px',
          '--layout-dashboard-content-pb': '0px',
        }),
        ...cssVars,
      }}
      sx={[...(Array.isArray(sx) ? sx : [sx])]}
    >
      {renderMain()}
    </LayoutSection>
  );
}
