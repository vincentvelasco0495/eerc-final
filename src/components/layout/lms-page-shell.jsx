import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { lmsPageShellStyles } from './lms-page-shell.styles';

export function LmsPageShell({
  heading,
  description,
  eyebrow,
  links,
  action,
  children,
  contentSx,
}) {
  const defaultLinks = [{ name: 'Dashboard', href: paths.dashboard.root }];

  return (
    <DashboardContent maxWidth={false}>
      <Stack
        spacing={4}
        sx={[
          lmsPageShellStyles.content,
          ...(Array.isArray(contentSx) ? contentSx : [contentSx]),
        ]}
      >
        <CustomBreadcrumbs
          heading={heading}
          links={[...defaultLinks, ...(links ?? [])]}
          action={action}
        />
        {(eyebrow || description) && (
          <Box
            sx={{
              px: 3,
              py: 2.5,
              borderRadius: 2.5,
              bgcolor: 'background.neutral',
              border: (theme) => `1px solid ${theme.vars.palette.divider}`,
            }}
          >
            <Stack spacing={1}>
              {eyebrow ? (
                <Typography variant="overline" sx={{ color: 'brand.accentText' }}>
                  {eyebrow}
                </Typography>
              ) : null}
              {description ? (
                <Typography variant="body2" sx={{ width: 1, color: 'text.secondary' }}>
                  {description}
                </Typography>
              ) : null}
            </Stack>
          </Box>
        )}
        {children}
      </Stack>
    </DashboardContent>
  );
}
