import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

import { Iconify } from 'src/components/iconify';

import { styles } from './styles';

export function CurriculumModuleFooterActions({ onAddLessonClick, addLessonUnavailableTitle }) {
  const inactive = typeof onAddLessonClick !== 'function';
  const titleHint = inactive ? addLessonUnavailableTitle : undefined;

  return (
    <Stack direction="row" alignItems="center" sx={styles.root}>
      <Button
        variant="text"
        color="primary"
        disableElevation
        disabled={inactive}
        title={inactive ? titleHint : undefined}
        onClick={onAddLessonClick}
        startIcon={
          <Box sx={styles.addIconWrap}>
            <Iconify icon="mingcute:add-line" width={12} sx={styles.addIcon} />
          </Box>
        }
        sx={styles.addButton}
      >
        Add a lesson
      </Button>
    </Stack>
  );
}
