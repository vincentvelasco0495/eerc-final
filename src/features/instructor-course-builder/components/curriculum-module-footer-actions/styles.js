export const styles = {
  root: {
    px: { xs: 1.25, sm: 1.75 },
    pb: 1.75,
    pt: 1.5,
  },
  addIconWrap: {
    width: 20,
    height: 20,
    borderRadius: '50%',
    bgcolor: 'primary.main',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addIcon: { color: 'primary.contrastText' },
  addButton: {
    minHeight: { xs: 40, sm: 36 },
    px: 1,
    py: 0.5,
    fontWeight: 600,
    fontSize: '0.875rem',
    lineHeight: 1.25,
    textTransform: 'none',
    color: 'brand.accentText',
    justifyContent: { xs: 'flex-start', sm: 'center' },
    '& .MuiButton-startIcon': { mr: 0.625, ml: -0.125 },
  },
};
