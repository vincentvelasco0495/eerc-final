import { alpha } from '@mui/material/styles';

export const styles = {
  label: {
    fontSize: 13,
    fontWeight: 600,
    color: 'text.primary',
    mb: 1,
  },
  dropzone: (theme) => ({
    position: 'relative',
    border: '2px dashed',
    borderColor: alpha(theme.palette.primary.main, 0.35),
    borderRadius: 2,
    bgcolor: alpha(theme.palette.primary.main, 0.06),
    py: 4,
    px: 2,
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    cursor: 'pointer',
    transition: theme.transitions.create(['border-color', 'background-color'], {
      duration: theme.transitions.duration.shorter,
    }),
    '&:hover': {
      borderColor: theme.palette.primary.main,
      bgcolor: alpha(theme.palette.primary.main, 0.09),
    },
  }),
  dropzoneActive: (theme) => ({
    borderColor: theme.palette.primary.main,
    bgcolor: alpha(theme.palette.primary.main, 0.12),
  }),
  hint: {
    mt: 0,
    mb: 0,
    color: 'text.secondary',
    fontSize: 14,
    maxWidth: '100%',
    mx: 'auto',
    lineHeight: 1.5,
    textAlign: 'center',
  },
  browseButton: {
    mt: 0,
    px: 3,
    py: 1,
    fontWeight: 600,
    textTransform: 'none',
    borderRadius: 1.5,
    flexShrink: 0,
  },
  fileList: {
    mt: 2,
    textAlign: 'left',
  },
  fileName: {
    fontSize: 13,
    color: 'text.secondary',
  },
};
