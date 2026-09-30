export const styles = {
  container: {
    pt: { xs: 8, md: 12 },
    pb: { xs: 8, md: 10 },
  },
  grid: {
    minHeight: { md: 'calc(100vh - 180px)' },
  },
  content: {
    maxWidth: 540,
  },
  eyebrow: {
    alignSelf: 'flex-start',
    borderRadius: 1.5,
    fontWeight: 700,
  },
  heading: {
    fontSize: { xs: '2.5rem', md: '4.25rem' },
    lineHeight: 1.05,
    letterSpacing: '-0.04em',
  },
  primaryAccent: {
    color: 'primary.main',
  },
  secondaryAccent: {
    color: '#ef2f7a',
  },
  description: {
    color: 'text.secondary',
    fontWeight: 400,
  },
  primaryButton: {
    px: 3,
    py: 1.5,
    borderRadius: 999,
    bgcolor: '#ef2f7a',
    '&:hover': { bgcolor: '#d6246a' },
  },
  secondaryButton: {
    px: 3,
    py: 1.5,
    borderRadius: 999,
  },
};
