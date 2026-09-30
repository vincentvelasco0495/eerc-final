export const styles = {
  root: { width: 1 },
  titleBlock: { minWidth: 0, flex: '1 1 auto' },
  title: {
    fontSize: { xs: '1.65rem', md: '1.9rem' },
    fontWeight: 700,
    lineHeight: 1.2,
  },
  subtitle: {
    color: 'text.secondary',
    maxWidth: 520,
    lineHeight: 1.55,
  },
  filtersRow: {
    width: { xs: 1, lg: 'auto' },
    flex: { lg: '0 0 auto' },
    minWidth: { lg: 380 },
    maxWidth: { lg: 560 },
  },
  searchField: {
    flex: { sm: '1 1 auto' },
    width: { xs: 1, sm: 'auto' },
    minWidth: { sm: 220 },
  },
  statusField: {
    minWidth: { sm: 148 },
    flex: { sm: '0 0 auto' },
    width: { xs: 1, sm: 'auto' },
  },
};
