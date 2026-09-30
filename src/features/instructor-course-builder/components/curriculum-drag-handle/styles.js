import { alpha } from '@mui/material/styles';

/** Softer drag dots — uniform light gray so headers and lesson rows match (no heavy contrast). */
export const styles = {
  root: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 4px)',
    gap: '3px',
    flexShrink: 0,
    py: 0.25,
  },
  dot: (theme) => ({
    width: 4,
    height: 4,
    borderRadius: '50%',
    bgcolor: alpha(theme.palette.grey[400], 0.45),
  }),
};
