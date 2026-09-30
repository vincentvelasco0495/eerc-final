import Box from '@mui/material/Box';

import { Iconify } from 'src/components/iconify';

import { styles } from './styles';
import { curriculumLessonTypeVisual } from '../../instructor-course-curriculum-data';

export function CurriculumLessonTypeIcon({ type }) {
  const spec = curriculumLessonTypeVisual[type] ?? curriculumLessonTypeVisual.document;
  const borderRadius = spec.shape === 'circle' ? '50%' : 1.5;

  return (
    <Box sx={styles.tile(spec, borderRadius)}>
      <Iconify
        icon={spec.icon}
        width={spec.iconW}
        sx={styles.glyph(spec, type === 'video')}
      />
    </Box>
  );
}
