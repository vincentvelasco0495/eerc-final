import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';

import { styles } from './styles';

export function CurriculumBuilderEmptyWorkspace() {
  const theme = useTheme();

  return (
    <Box sx={styles.root(theme)}>
      <Stack spacing={2.5} alignItems="center" sx={styles.stack}>
        <Box sx={styles.hero(theme)}>
          <Iconify icon="solar:clipboard-list-bold-duotone" width={56} sx={styles.heroIcon} />
          <Box sx={styles.badge(theme)}>
            <Iconify icon="solar:pen-bold-duotone" width={20} sx={styles.badgeIcon} />
          </Box>
        </Box>
        <Typography variant="h4" sx={styles.heading}>
          Let&apos;s build your course!
        </Typography>
        <Typography variant="body1" sx={styles.body}>
          Get started by creating the lessons from scratch in the column on the left or import your
          Educational content.
        </Typography>
      </Stack>
    </Box>
  );
}
