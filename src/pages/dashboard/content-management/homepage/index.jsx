import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { RouterLink } from 'src/routes/components';

import { CONFIG } from 'src/global-config';
import { InstructorWorkspaceShell } from 'src/features/instructor-profile/components/instructor-workspace-shell';

const metadata = { title: `Homepage | Content Management - ${CONFIG.appName}` };

export default function ContentManagementHomepagePage() {
  return (
    <>
      <title>{metadata.title}</title>

      <InstructorWorkspaceShell>
        <Stack spacing={2} sx={{ maxWidth: 640 }}>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            Homepage
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage landing page sections, hero content, and featured blocks. A full editor will be
            connected here — for now you can preview the public homepage.
          </Typography>
          <Button
            component={RouterLink}
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            variant="outlined"
            sx={{ alignSelf: 'flex-start' }}
          >
            Preview homepage
          </Button>
        </Stack>
      </InstructorWorkspaceShell>
    </>
  );
}
