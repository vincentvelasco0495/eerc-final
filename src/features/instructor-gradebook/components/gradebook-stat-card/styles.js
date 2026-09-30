export const styles = {
  card: {
    height: 1,
    width: 1,
    boxShadow: 'none',
    border: '1px solid',
    borderColor: 'divider',
    borderRadius: 2,
    bgcolor: 'background.neutral',
  },
  content: { p: 2, '&:last-child': { pb: 2 } },
  caption: { color: 'text.secondary' },
  value: {
    color: 'brand.accentText',
    fontWeight: 600,
    fontSize: { xs: '1.1rem', sm: '1.35rem' },
  },
};
