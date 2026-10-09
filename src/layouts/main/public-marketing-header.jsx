import { useMemo } from 'react';
import { merge } from 'es-toolkit';
import { useBoolean } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';

import { RouterLink } from 'src/routes/components';

import { useLmsPrograms } from 'src/hooks/use-lms';

import { goldAlpha, brandPalette } from 'src/theme/brand-tokens';

import { Logo } from 'src/components/logo';

import { useAuthContext } from 'src/auth/hooks';

import { HeaderSection } from '../core';
import { NavMobile } from './nav/mobile';
import { NavDesktop } from './nav/desktop';
import { MenuButton } from '../components/menu-button';
import { useDashboardEntry } from './use-dashboard-entry';
import { buildMainNavData, navData as mainNavData } from '../nav-config-main';

// ----------------------------------------------------------------------

const NAVY = brandPalette.deepNavy;

const headerAuthCtaSx = {
  display: 'inline-flex',
  px: { xs: 2, md: 2.75 },
  py: 1,
  minHeight: 38,
  minWidth: 'fit-content',
  alignItems: 'center',
  whiteSpace: 'nowrap',
  lineHeight: 1,
  borderRadius: 999,
  fontWeight: 700,
  letterSpacing: '0.04em',
  bgcolor: brandPalette.gold,
  color: NAVY,
  boxShadow: 'none',
  '&:hover': {
    bgcolor: brandPalette.goldLight,
    boxShadow: 'none',
  },
};

/**
 * Public site header (logo, main nav, optional Login CTA) used on marketing pages and
 * on selected guest-only catalog routes.
 */
export function PublicMarketingHeader({
  layoutQuery = 'md',
  /** When true, guests see a Login button (hidden for signed-in users). */
  showLoginCta = true,
  /** When set, skips building nav from LMS programs (e.g. parent already computed). */
  navData: navDataProp,
  /** Same shape as `MainLayout` `slotProps` (e.g. `slotProps.header` overrides). */
  slotProps,
}) {
  const { authenticated } = useAuthContext();
  const { value: open, onFalse: onClose, onTrue: onOpen } = useBoolean();
  const {
    goToDashboardOrSignIn,
    dashboardHref,
    loading: authLoadingForDashboard,
  } = useDashboardEntry();
  const { programs } = useLmsPrograms();

  const navData = useMemo(() => {
    if (navDataProp) {
      return navDataProp;
    }
    return programs?.length ? buildMainNavData(programs) : mainNavData;
  }, [navDataProp, programs]);

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

  const headerSlots = {
    topArea: (
      <Alert severity="info" sx={{ display: 'none', borderRadius: 0 }}>
        This is an info Alert.
      </Alert>
    ),
    leftArea: (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          flexShrink: 0,
          minWidth: { md: 180, lg: 220 },
        }}
      >
        <MenuButton
          onClick={onOpen}
          sx={(theme) => ({
            mr: 1,
            ml: -1,
            color: brandPalette.white,
            '&:hover': { bgcolor: goldAlpha(0.12) },
            [theme.breakpoints.up(layoutQuery)]: { display: 'none' },
          })}
        />
        <NavMobile data={navData} open={open} onClose={onClose} />
        <Logo />
      </Box>
    ),
    centerArea: (
      <NavDesktop
        data={navData}
        sx={(theme) => ({
          display: 'none',
          [theme.breakpoints.up(layoutQuery)]: { display: 'flex' },
        })}
      />
    ),
    rightArea: (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 1.5 } }}>
        {authenticated ? (
          <Button
            component={RouterLink}
            href={dashboardHref}
            variant="contained"
            color="inherit"
            disabled={authLoadingForDashboard}
            sx={headerAuthCtaSx}
          >
            Dashboard
          </Button>
        ) : showLoginCta ? (
          <Button
            type="button"
            variant="contained"
            color="inherit"
            disabled={authLoadingForDashboard}
            onClick={goToDashboardOrSignIn}
            sx={headerAuthCtaSx}
          >
            Login
          </Button>
        ) : null}
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
          bgcolor: NAVY,
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
}
