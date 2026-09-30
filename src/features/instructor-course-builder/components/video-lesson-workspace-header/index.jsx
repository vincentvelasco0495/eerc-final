import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';

import { styles } from './styles';

export function VideoLessonWorkspaceHeader({
  lessonTitle,
  onLessonTitleChange,
  onCreate,
  actionLabel = 'Create',
}) {
  return (
    <Box sx={styles.shell}>
      <Stack sx={styles.inner}>
        <Stack direction="row" alignItems="center" sx={styles.typeBlock}>
          <Box sx={styles.typeIconWrap}>
            <Iconify icon="mdi:play" width={18} sx={{ color: 'warning.contrastText', ml: '2px' }} />
          </Box>
          <Typography sx={styles.typeTitle}>Video lesson</Typography>
          <Iconify
            icon="eva:chevron-down-fill"
            width={18}
            sx={{ color: 'text.secondary', display: { xs: 'none', sm: 'block' } }}
          />
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
    </Box>
  );
}
