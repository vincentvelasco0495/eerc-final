import { varAlpha } from 'minimal-shared/utils';

export const placeholderStyles = {
  root: (aspectRatio) => ({
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 1,
    width: 1,
    aspectRatio,
    borderRadius: 3,
    border: (theme) => `2px dashed ${theme.vars.palette.brand.borderDefault}`,
    bgcolor: (theme) => theme.vars.palette.brand.sunken,
    overflow: 'hidden',
    transition: (theme) =>
      theme.transitions.create(['box-shadow', 'transform', 'border-color'], {
        duration: theme.transitions.duration.shorter,
      }),
    '&:hover': {
      borderColor: (theme) => theme.vars.palette.brand.borderStrong,
      boxShadow: (theme) => `0 16px 40px ${varAlpha(theme.vars.palette.primary.mainChannel, 0.12)}`,
    },
  }),
  icon: {
    color: 'text.disabled',
  },
  label: {
    px: 2,
    textAlign: 'center',
    color: 'text.secondary',
    fontWeight: 600,
  },
};
