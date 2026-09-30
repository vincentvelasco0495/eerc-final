import Box from '@mui/material/Box';

import { styles } from './styles';

const DRAG_DOT_KEYS = ['d0', 'd1', 'd2', 'd3', 'd4', 'd5'];

export function CurriculumDragHandle() {
  return (
    <Box sx={styles.root}>
      {DRAG_DOT_KEYS.map((k) => (
        <Box key={k} sx={(theme) => styles.dot(theme)} />
      ))}
    </Box>
  );
}
