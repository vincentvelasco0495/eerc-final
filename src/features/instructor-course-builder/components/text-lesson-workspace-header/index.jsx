import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';

import { styles } from './styles';

export function TextLessonWorkspaceHeader({
  lessonTitle,
  onLessonTitleChange,
  onCreate,
  actionLabel = 'Create',
}) {
  return (
    <Stack sx={styles.root}>
      <Stack direction="row" alignItems="center" sx={styles.typeLabel}>
        <Iconify icon="solar:file-text-bold" width={22} color="brand.accentText" />
        <Typography sx={styles.typeTitle}>Text lesson</Typography>
      </Stack>

      <TextField
        value={lessonTitle}
        onChange={(e) => onLessonTitleChange(e.target.value)}
        placeholder="Enter lesson name"
        fullWidth
        size="small"
        sx={styles.nameField}
      />

      <Button variant="contained" color="primary" onClick={onCreate} sx={styles.createButton}>
        {actionLabel}
      </Button>
    </Stack>
  );
}
