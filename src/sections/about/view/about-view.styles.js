export const styles = {
  root: {
    bgcolor: 'background.default',
  },
  container: {
    py: { xs: 6, md: 10 },
  },
  section: {
    '& + &': {
      mt: { xs: 6, md: 8 },
    },
  },
  sectionTitle: {
    fontSize: { xs: '1.75rem', md: '2.25rem' },
    fontWeight: 700,
    color: 'text.primary',
    letterSpacing: '-0.02em',
    mb: { xs: 2.5, md: 3 },
  },
  overviewGrid: {
    alignItems: 'start',
  },
  bodyCopy: {
    color: 'text.secondary',
    lineHeight: 1.95,
    fontSize: { xs: '0.95rem', md: '1rem' },
  },
  bodyStack: {
    display: 'grid',
    gap: { xs: 2, md: 2.5 },
  },
  photoCard: {
    p: 0.75,
    borderRadius: 3,
    backgroundImage: (theme) => theme.vars.palette.brand.gradientSurface,
    boxShadow: (theme) => theme.vars.customShadows.card,
    border: '1px solid',
    borderColor: (theme) => theme.vars.palette.brand.borderDefault,
    mx: { xs: 'auto', md: 0 },
    maxWidth: { xs: 360, md: 'none' },
  },
  photoFrame: {
    borderRadius: 2.5,
    overflow: 'hidden',
    bgcolor: 'background.neutral',
    lineHeight: 0,
  },
  logoImage: {
    width: 1,
    height: 'auto',
    display: 'block',
  },
};
