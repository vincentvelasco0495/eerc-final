const avatarBase = {
  width: { xs: 100, sm: 112 },
  height: { xs: 100, sm: 112 },
  fontSize: { xs: '1.75rem', sm: '2rem' },
  fontWeight: 700,
  bgcolor: 'secondary.dark',
  color: 'primary.main',
};

export const styles = {
  root: {
    position: 'relative',
    width: 1,
    pb: { xs: '50px', sm: '56px' },
    pt: 0.5,
  },
  cover: {
    position: 'relative',
    minHeight: { xs: 180, sm: 220 },
    border: '1px dashed',
    borderColor: (theme) => theme.palette.divider,
    borderRadius: 2,
    bgcolor: (theme) => theme.vars.palette.brand.sunken,
  },
  uploadCover: {
    position: 'absolute',
    top: 12,
    right: 12,
    textTransform: 'none',
    fontWeight: 600,
    boxShadow: 'none',
    '&:hover': { boxShadow: 1 },
  },
  avatarAnchor: {
    position: 'absolute',
    left: '50%',
    bottom: 0,
    transform: 'translate(-50%, 50%)',
    zIndex: 1,
  },
  avatarInner: { position: 'relative' },
  avatar: (theme) => ({
    ...avatarBase,
    border: `4px solid ${theme.palette.background.default}`,
    boxShadow: 3,
  }),
  avatarEditBtn: {
    position: 'absolute',
    right: 2,
    bottom: 2,
    bgcolor: 'primary.main',
    color: 'primary.contrastText',
    width: 36,
    height: 36,
    boxShadow: 2,
    '&:hover': { bgcolor: 'primary.dark' },
  },
};
