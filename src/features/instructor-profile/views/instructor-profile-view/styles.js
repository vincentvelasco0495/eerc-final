export const styles = {
  heading: { fontSize: { xs: '1.95rem', md: '2.4rem' } },
  subtitle: { color: 'text.secondary', maxWidth: 760 },
  statGrid: {
    display: 'flex',
    minWidth: 0,
    '& > .MuiCard-root': { flex: 1, width: 1, maxWidth: 1 },
  },
  courseGrid: {
    display: 'flex',
    '& > .MuiCard-root': { width: 1 },
  },
  pagination: {
    mx: 'auto',
    '& .MuiPagination-ul': { justifyContent: 'center' },
  },
};
