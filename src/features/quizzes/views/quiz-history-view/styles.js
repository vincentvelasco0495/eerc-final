export const styles = {
  overline: {
    color: 'text.secondary',
    fontWeight: 700,
    letterSpacing: 0.6,
  },
  title: {
    fontWeight: 800,
    lineHeight: 1.2,
  },
  summaryGrid: {
    display: 'grid',
    gap: 1.25,
    gridTemplateColumns: {
      xs: '1fr',
      sm: 'repeat(3, minmax(0, 1fr))',
    },
  },
  summaryTile: {
    minWidth: 0,
    p: 2,
    borderRadius: 2,
    bgcolor: 'background.neutral',
    border: '1px solid',
    borderColor: 'divider',
  },
  summaryLabel: {
    color: 'text.secondary',
    lineHeight: 1.2,
  },
  summaryValue: {
    mt: 0.75,
    fontWeight: 800,
    lineHeight: 1.2,
    fontVariantNumeric: 'tabular-nums',
  },
  attemptList: {
    gap: 1.25,
  },
  attemptCard: (passed) => ({
    p: 2,
    borderRadius: 2,
    bgcolor: 'background.paper',
    border: '1px solid',
    borderColor: 'divider',
    borderLeft: '4px solid',
    borderLeftColor: passed ? 'success.main' : 'error.main',
  }),
  scoreBadge: (passed) => ({
    width: 64,
    height: 64,
    borderRadius: '50%',
    display: 'grid',
    placeItems: 'center',
    flexShrink: 0,
    fontWeight: 800,
    fontSize: 14,
    lineHeight: 1,
    fontVariantNumeric: 'tabular-nums',
    color: passed ? 'success.dark' : 'error.dark',
    bgcolor: passed ? 'success.lighter' : 'error.lighter',
  }),
  attemptTitle: {
    fontWeight: 700,
  },
  attemptMeta: {
    color: 'text.secondary',
  },
  scoreBar: {
    mt: 1.5,
    height: 6,
    borderRadius: 99,
    bgcolor: 'action.hover',
  },
  chip: {
    height: 22,
    fontWeight: 700,
  },
  emptyState: {
    p: { xs: 4, md: 5 },
    borderRadius: 2,
    border: '1px solid',
    borderColor: 'divider',
    bgcolor: 'background.neutral',
    textAlign: 'center',
  },
};
