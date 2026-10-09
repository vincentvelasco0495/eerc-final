import { useEffect } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';

import { usePathname } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { goldAlpha, brandPalette } from 'src/theme/brand-tokens';

import { Logo } from 'src/components/logo';
import { Scrollbar } from 'src/components/scrollbar';

import { useAuthContext } from 'src/auth/hooks';

import { Nav, NavUl } from '../components';
import { NavList } from './nav-mobile-list';
import { useDashboardEntry } from '../../use-dashboard-entry';

// ----------------------------------------------------------------------

const NAVY = brandPalette.deepNavy;

export function NavMobile({ data, open, onClose, slots, sx }) {
  const pathname = usePathname();
  const { authenticated } = useAuthContext();
  const {
    goToDashboardOrSignIn,
    dashboardHref,
    loading: authLoadingForDashboard,
  } = useDashboardEntry();

  useEffect(() => {
    if (open) {
      onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <Drawer
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: [
            {
              display: 'flex',
              flexDirection: 'column',
              width: 'var(--layout-nav-mobile-width)',
              bgcolor: NAVY,
              color: brandPalette.white,
              backgroundImage: 'none',
              borderRight: `1px solid ${goldAlpha(0.22)}`,
            },
            ...(Array.isArray(sx) ? sx : [sx]),
          ],
        },
      }}
    >
      {slots?.topArea ?? (
        <Box
          sx={{
            pt: 3,
            pb: 2,
            pl: 2.5,
            pr: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 1.25,
            borderBottom: `1px solid ${goldAlpha(0.18)}`,
          }}
        >
          <Logo />
        </Box>
      )}

      <Scrollbar fillContent>
        <Nav
          sx={{
            pb: 3,
            display: 'flex',
            flex: '1 1 auto',
            flexDirection: 'column',
          }}
        >
          <NavUl>
            {data.map((list) => (
              <NavList key={list.title} data={list} />
            ))}
          </NavUl>
        </Nav>
      </Scrollbar>

      {slots?.bottomArea ?? (
        <Box
          sx={{
            py: 3,
            px: 2.5,
            gap: 1.5,
            display: 'flex',
            borderTop: `1px solid ${goldAlpha(0.18)}`,
          }}
        >
          {authenticated ? (
            <Button
              fullWidth
              component={RouterLink}
              href={dashboardHref}
              variant="contained"
              color="inherit"
              disabled={authLoadingForDashboard}
              sx={{
                py: 1.25,
                fontWeight: 700,
                letterSpacing: '0.04em',
                borderRadius: 999,
                bgcolor: brandPalette.gold,
                color: NAVY,
                boxShadow: 'none',
                '&:hover': { bgcolor: brandPalette.goldLight, boxShadow: 'none' },
              }}
            >
              Dashboard
            </Button>
          ) : (
            <Button
              fullWidth
              type="button"
              variant="contained"
              color="inherit"
              disabled={authLoadingForDashboard}
              onClick={goToDashboardOrSignIn}
              sx={{
                py: 1.25,
                fontWeight: 700,
                letterSpacing: '0.04em',
                borderRadius: 999,
                bgcolor: brandPalette.gold,
                color: NAVY,
                boxShadow: 'none',
                '&:hover': { bgcolor: brandPalette.goldLight, boxShadow: 'none' },
              }}
            >
              Login
            </Button>
          )}
        </Box>
      )}
    </Drawer>
  );
}
