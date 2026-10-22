import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

/** Full-screen dialogs below `sm` so wide tables and action rows fit a phone. */
export function useFullScreenDialog() {
  const theme = useTheme();
  return useMediaQuery(theme.breakpoints.down('sm'));
}

export const stackedDialogActionsSx = {
  gap: 1,
  flexWrap: 'wrap',
  flexDirection: { xs: 'column-reverse', sm: 'row' },
  '& .MuiButton-root': { width: { xs: '100%', sm: 'auto' } },
};
