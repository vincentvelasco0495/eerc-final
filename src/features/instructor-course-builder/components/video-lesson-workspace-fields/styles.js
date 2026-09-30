import { varAlpha } from 'minimal-shared/utils';

import { brandVars } from 'src/theme';

export const styles = {
  root: {
    gap: 2.5,
    py: 0.5,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: 600,
    color: 'text.primary',
    mb: 0.75,
  },
  dropzone: (theme) => ({
    border: '2px dashed',
    borderColor: brandVars.borderDefault,
    borderRadius: 2,
    bgcolor: brandVars.sunken,
    py: 4,
    px: 2,
    textAlign: 'center',
    cursor: 'pointer',
    transition: theme.transitions.create(['border-color', 'background-color'], {
      duration: theme.transitions.duration.shorter,
    }),
    '&:hover': {
      borderColor: brandVars.borderStrong,
      bgcolor: brandVars.hover,
    },
  }),
  dropzoneActive: (theme) => ({
    borderColor: theme.vars.palette.primary.main,
    bgcolor: brandVars.accentSoft,
  }),
  previewWrap: {
    position: 'relative',
    width: '100%',
    borderRadius: 2,
    overflow: 'hidden',
    isolation: 'isolate',
    bgcolor: brandVars.page,
    minHeight: 160,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '&:fullscreen, &:-webkit-full-screen, &.is-player-fullscreen': {
      width: '100%',
      height: '100%',
      minHeight: '100%',
      borderRadius: 0,
      bgcolor: '#000',
      '& > div': {
        width: '100%',
        height: '100%',
      },
      '& video': {
        width: '100%',
        height: '100%',
        maxHeight: 'none',
      },
      '& .premium-video-chrome': {
        zIndex: 2147483646,
      },
    },
    '&.is-player-fullscreen': {
      position: 'fixed',
      inset: 0,
      zIndex: 2000,
    },
  },
  posterPreview: {
    display: 'block',
    width: '100%',
    maxHeight: 240,
    objectFit: 'contain',
    bgcolor: brandVars.sunken,
  },
  videoPreview: {
    display: 'block',
    width: '100%',
    maxHeight: 280,
    objectFit: 'contain',
    bgcolor: 'common.black',
  },
  uploadingOverlay: (theme) => ({
    position: 'absolute',
    inset: 0,
    bgcolor: varAlpha(theme.vars.palette.common.blackChannel, 0.35),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 3,
  }),
  hint: {
    mt: 1.5,
    mb: 2,
    color: 'text.secondary',
    fontSize: 14,
    maxWidth: 400,
    mx: 'auto',
    lineHeight: 1.5,
  },
  actionButton: {
    px: 3,
    py: 1,
    fontWeight: 600,
    textTransform: 'none',
    borderRadius: 1.5,
  },
  actionRow: {
    flexWrap: 'wrap',
    gap: 1,
    justifyContent: 'center',
    mt: 0.5,
  },
  removeLink: {
    fontWeight: 600,
    textTransform: 'none',
    fontSize: 13,
  },
  row: {
    flexDirection: { xs: 'column', sm: 'row' },
    gap: 2,
    alignItems: { xs: 'stretch', sm: 'flex-start' },
  },
};
