export const styles = {
  title: { fontWeight: 700 },
  quizTitle: {
    fontWeight: 700,
    color: 'brand.accentText',
  },
  panel: {
    borderRadius: 2,
    overflow: 'hidden',
  },
  panelBody: {
    p: { xs: 2, md: 2.5 },
  },
  tableContainer: {
    borderRadius: 2,
  },
  headRow: {
    '& th': {
      fontWeight: 700,
      color: 'text.secondary',
      bgcolor: 'background.neutral',
    },
  },
  score: {
    fontWeight: 700,
  },
  metric: {
    fontWeight: 600,
  },
  loadingWrap: {
    display: 'flex',
    justifyContent: 'center',
    py: 6,
  },
  emptyState: {
    py: 5,
    textAlign: 'center',
  },
  myRankCard: {
    p: { xs: 2, md: 2.5 },
    borderRadius: 2,
    bgcolor: 'background.neutral',
  },
  myRankLabel: {
    color: 'text.secondary',
    fontWeight: 700,
    letterSpacing: 0.8,
  },
  studentName: {
    fontWeight: 600,
  },
};
