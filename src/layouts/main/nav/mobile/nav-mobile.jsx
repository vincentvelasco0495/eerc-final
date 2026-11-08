import { useEffect } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import { usePathname } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { navyAlpha, whiteAlpha, brandPalette } from 'src/theme/brand-tokens';

import { Logo } from 'src/components/logo';
import { Iconify } from 'src/components/iconify';
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
        backdrop: { sx: { backgroundColor: navyAlpha(0.62) } },
        paper: {
          sx: [
            {
              display: 'flex',
              flexDirection: 'column',
              width: { xs: '100%', sm: 400 },
              maxWidth: '100%',
              bgcolor: NAVY,
              color: brandPalette.white,
              backgroundImage: 'none',
            },
            ...(Array.isArray(sx) ? sx : [sx]),
          ],
        },
      }}
    >
      {slots?.topArea ?? (
        <Box
          sx={{
            px: 2,
            py: 1.75,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 1.5,
            borderBottom: `1px solid ${whiteAlpha(0.08)}`,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}>
            <Logo />
            <Box sx={{ minWidth: 0 }}>
              <Typography noWrap sx={{ fontWeight: 700, fontSize: 16, lineHeight: 1.2 }}>
                EERC LMS
              </Typography>
              <Typography noWrap sx={{ color: whiteAlpha(0.55), fontSize: 12, lineHeight: 1.4 }}>
                Learning Center
              </Typography>
            </Box>
          </Box>

          <IconButton aria-label="Close menu" onClick={onClose} sx={{ color: brandPalette.white }}>
            <Iconify icon="mingcute:close-line" width={22} />
          </IconButton>
        </Box>
      )}

      <Scrollbar fillContent>
        <Nav
          sx={{
            pb: 2,
            display: 'flex',
            flex: '1 1 auto',
            flexDirection: 'column',
          }}
        >
          <NavUl sx={{ gap: 0.5, px: 1.5, pt: 1.5 }}>
            {data.map((list) => (
              <NavList key={list.title} data={list} />
            ))}
          </NavUl>
        </Nav>
      </Scrollbar>

      {slots?.bottomArea ?? (
        <Box
          sx={{
            px: 2,
            pt: 2,
            pb: 'calc(16px + env(safe-area-inset-bottom))',
            borderTop: `1px solid ${whiteAlpha(0.08)}`,
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
                borderRadius: 1.5,
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
                borderRadius: 1.5,
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
