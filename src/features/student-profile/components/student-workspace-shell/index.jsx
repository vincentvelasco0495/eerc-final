import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Drawer from '@mui/material/Drawer';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import useMediaQuery from '@mui/material/useMediaQuery';

import { usePathname } from 'src/routes/hooks';

import { useLmsUser } from 'src/hooks/use-lms';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { lmsPageShellStyles } from 'src/components/layout/lms-page-shell.styles';

import { workspaceContentSx } from './styles';
import { StudentProfileSidebar } from '../student-profile-sidebar';
import { getStudentWorkspaceNavGroups } from '../../student-profile-data';

const NAV_DRAWER_WIDTH = 304;

export function StudentWorkspaceShell({ children }) {
  const theme = useTheme();
  const pathname = usePathname();
  const { user } = useLmsUser();
  const navGroups = getStudentWorkspaceNavGroups(pathname);

  const isLgUp = useMediaQuery(theme.breakpoints.up('lg'));
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    setMobileNavOpen(false);
  }, [pathname]);

  return (
    <DashboardContent maxWidth={false}>
      <Stack
        spacing={3.5}
        className="eerc-workspace-shell"
        sx={[lmsPageShellStyles.content, ...workspaceContentSx]}
      >
        {!isLgUp ? (
          <Stack direction="row" alignItems="center" spacing={1} sx={{ display: { lg: 'none' } }}>
            <IconButton
              color="inherit"
              size="large"
              edge="start"
              aria-label="Open student menu"
              onClick={() => setMobileNavOpen(true)}
              sx={{ flexShrink: 0 }}
            >
              <Iconify icon="eva:menu-fill" width={22} />
            </IconButton>
            <Typography variant="subtitle2" noWrap sx={{ color: 'text.secondary' }}>
              Student menu
            </Typography>
          </Stack>
        ) : null}

        <Grid container spacing={{ xs: 2, md: 3 }} alignItems="flex-start">
          {isLgUp ? (
            <Grid size={{ xs: 12, lg: 3 }}>
              <StudentProfileSidebar user={user} navGroups={navGroups} />
            </Grid>
          ) : null}

          <Grid size={{ xs: 12, lg: 9 }}>{children}</Grid>
        </Grid>

        <Drawer
          anchor="left"
          open={mobileNavOpen}
          onClose={() => setMobileNavOpen(false)}
          ModalProps={{ keepMounted: true }}
          slotProps={{
            paper: {
              sx: {
                width: NAV_DRAWER_WIDTH,
                maxWidth: '100vw',
                borderRadius: '0 16px 16px 0',
                pt: 'max(12px, env(safe-area-inset-top))',
                pb: 'max(12px, env(safe-area-inset-bottom))',
              },
            },
          }}
        >
          <Box role="navigation" aria-label="Student workspace" sx={{ height: 1, overflow: 'auto' }}>
            <StudentProfileSidebar user={user} navGroups={navGroups} disableSticky />
          </Box>
        </Drawer>
      </Stack>
    </DashboardContent>
  );
}
