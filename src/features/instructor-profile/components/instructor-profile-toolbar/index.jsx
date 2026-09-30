import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { Iconify } from 'src/components/iconify';

import { styles } from './styles';

export function InstructorProfileToolbar() {
  return (
    <Stack direction="row" spacing={1.5} justifyContent="flex-end" alignItems="center">
      <Button
        component={RouterLink}
        href={paths.dashboard.settingProgram}
        variant="contained"
        startIcon={<Iconify icon="solar:layers-bold-duotone" />}
        sx={styles.toolbarButton}
      >
        Manage programs
      </Button>
    </Stack>
  );
}
