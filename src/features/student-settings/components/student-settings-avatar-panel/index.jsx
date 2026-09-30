import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';

import { Iconify } from 'src/components/iconify';

import { styles } from './styles';

export function StudentSettingsAvatarPanel({ initials }) {
  return (
    <Box sx={styles.root}>
      <Avatar sx={styles.avatar}>
        {initials || <Iconify icon="solar:user-circle-bold-duotone" width={92} />}
      </Avatar>

      <IconButton color="primary" sx={styles.editButton}>
        <Iconify icon="solar:camera-bold" width={20} />
      </IconButton>
    </Box>
  );
}
