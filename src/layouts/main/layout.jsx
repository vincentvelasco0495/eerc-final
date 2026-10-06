import { useMemo } from 'react';
import { merge } from 'es-toolkit';

import Box from '@mui/material/Box';
import { iconButtonClasses } from '@mui/material/IconButton';

import { paths } from 'src/routes/paths';
import { usePathname } from 'src/routes/hooks';

import { useLmsPrograms } from 'src/hooks/use-lms';

import { Logo } from 'src/components/logo';

import { useAuthContext } from 'src/auth/hooks';

import { Footer } from './footer';
import { AccountDrawer } from '../components/account-drawer';
import { SettingsButton } from '../components/settings-button';
import { PublicMarketingHeader } from './public-marketing-header';
import { MainSection, LayoutSection, HeaderSection } from '../core';
import { buildMainNavData, navData as mainNavData } from '../nav-config-main';
import { LmsNotificationsDrawer } from '../dashboard/lms-notifications-drawer';

// ----------------------------------------------------------------------

function MainLayout({ sx, cssVars, children, slotProps, layoutQuery = 'md' }) {
  const pathname = usePathname();
  const { authenticated } = useAuthContext();

  const normalizedPath = (pathname ?? '').replace(/\/$/, '') || '/';
  /** Home, About, and Contact share the same marketing header + footer chrome. */
  const isMarketingLanding =
    normalizedPath === '/' ||
    normalizedPath === paths.about ||
    normalizedPath === paths.contact;
  const isProgramCourseDetailPage =
    pathname === paths.programCourseDetail || /^\/program-course-detail\/?$/.test(pathname ?? '');
  /** Logged-in users keep the slim course header on program catalog detail. */
  const isMinimalCourseChrome =
    pathname === paths.courseDetailDemo || (isProgramCourseDetailPage && authenticated);
  const showLoginCtaInPublicHeader = isMarketingLanding || isProgramCourseDetailPage;

  const { programs } = useLmsPrograms();

  const navData = useMemo(() => {
    if (slotProps?.nav?.data) {
      return slotProps.nav.data;
    }
    return programs?.length ? buildMainNavData(programs) : mainNavData;
  }, [programs, slotProps?.nav?.data]);

  const renderHeader = () => {
    if (isMinimalCourseChrome) {
      const courseDetailHeaderSlots = {
        topArea: null,
        leftArea: isProgramCourseDetailPage ? null : (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              flexShrink: 0,
              minWidth: { md: 220, lg: 260 },
            }}
          >
            <Logo />
          </Box>
        ),
        centerArea: null,
        rightArea: (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: { xs: 0.25, sm: 0.75 },
              flexShrink: 0,
              ml: 'auto',
              color: 'text.secondary',
              [`& .${iconButtonClasses.root}`]: { color: 'text.secondary' },
            }}
          >
            <LmsNotificationsDrawer sx={{ color: 'inherit' }} />
            <SettingsButton dotForced sx={{ color: 'inherit' }} />
            <AccountDrawer sx={{ color: 'inherit' }} />
          </Box>
        ),
      };

      const headerSlotProps = {
        container: {
          maxWidth: false,
          sx: {
            width: 1,
            maxWidth: 'none !important',
            mx: 0,
            px: { xs: 2, sm: 3, md: 5 },
          },
        },
      };

      return (
        <HeaderSection
          layoutQuery={layoutQuery}
          {...slotProps?.header}
          slots={{ ...courseDetailHeaderSlots, ...slotProps?.header?.slots }}
          slotProps={merge(headerSlotProps, slotProps?.header?.slotProps ?? {})}
          sx={slotProps?.header?.sx}
        />
      );
    }

    return (
      <PublicMarketingHeader
        layoutQuery={layoutQuery}
        navData={navData}
        showLoginCta={showLoginCtaInPublicHeader}
        slotProps={slotProps}
      />
    );
  };

  const renderFooter = () => (
    <Footer sx={slotProps?.footer?.sx} layoutQuery={layoutQuery} />
  );

  const renderMain = () => <MainSection {...slotProps?.main}>{children}</MainSection>;

  return (
    <LayoutSection
      /** **************************************
       * @Header
       *************************************** */
      headerSection={renderHeader()}
      /** **************************************
       * @Footer
       *************************************** */
      footerSection={renderFooter()}
      /** **************************************
       * @Styles
       *************************************** */
      cssVars={cssVars}
      sx={sx}
    >
      {renderMain()}
    </LayoutSection>
  );
}

export { MainLayout };
export default MainLayout;
