import { useMemo, useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Drawer from '@mui/material/Drawer';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import useMediaQuery from '@mui/material/useMediaQuery';

import { usePathname } from 'src/routes/hooks';

import { useLmsAssignmentSummaries } from 'src/hooks/use-lms';

import { CONFIG } from 'src/global-config';
import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { lmsPageShellStyles } from 'src/components/layout/lms-page-shell.styles';

import { useAuthContext } from 'src/auth/hooks';

import { workspaceContentSx } from './styles';
import { InstructorProfileSidebar } from '../instructor-profile-sidebar';
import { buildInstructorProfileIdentity, getInstructorWorkspaceNavGroups } from '../../instructor-profile-data';

const NAV_DRAWER_WIDTH = 304;

export function InstructorWorkspaceShell({ children }) {
  const theme = useTheme();
  const pathname = usePathname();
  const { user } = useAuthContext();
  const profile = buildInstructorProfileIdentity(user);
  const apiEnabled = Boolean(CONFIG.serverUrl?.trim());
  const { summaries } = useLmsAssignmentSummaries(apiEnabled);
  const assignmentPendingBadge = useMemo(() => {
    const total = summaries.reduce((sum, row) => sum + (Number(row?.pending) || 0), 0);
    return total > 0 ? String(total) : undefined;
  }, [summaries]);
  const navGroups = useMemo(
    () => getInstructorWorkspaceNavGroups(pathname, user?.role, user, { assignmentPendingBadge }),
    [assignmentPendingBadge, pathname, user]
  );

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
              aria-label="Open instructor menu"
              onClick={() => setMobileNavOpen(true)}
              sx={{ flexShrink: 0 }}
            >
              <Iconify icon="eva:menu-fill" width={22} />
            </IconButton>
            <Typography variant="subtitle2" noWrap sx={{ color: 'text.secondary' }}>
              Instructor menu
            </Typography>
          </Stack>
        ) : null}

        <Grid container spacing={{ xs: 2, md: 3 }} alignItems="flex-start">
          {isLgUp ? (
            <Grid size={{ xs: 12, lg: 3 }}>
              <InstructorProfileSidebar profile={profile} navGroups={navGroups} />
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
          <Box role="navigation" aria-label="Instructor workspace" sx={{ height: 1, overflow: 'auto' }}>
            <InstructorProfileSidebar profile={profile} navGroups={navGroups} disableSticky />
          </Box>
        </Drawer>
      </Stack>
    </DashboardContent>
  );
}
