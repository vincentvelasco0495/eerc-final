import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';

import { getInstructorNameInitials } from 'src/features/instructor-profile/instructor-profile-data';

import { styles } from './styles';

export function GradebookStudentCell({ name, email }) {
  const initials = getInstructorNameInitials(name);

  return (
    <Stack direction="row" spacing={1.5} alignItems="center" sx={styles.root}>
      <Avatar sx={styles.avatar}>{initials}</Avatar>
      <Stack spacing={0.2} sx={styles.textCol}>
        <Typography variant="subtitle2" sx={styles.name}>
          {name}
        </Typography>
        <Typography variant="caption" sx={styles.email} noWrap>
          {email}
        </Typography>
      </Stack>
    </Stack>
  );
}
