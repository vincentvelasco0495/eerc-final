export const styles = {
  closeBtn: {
    position: 'absolute',
    right: 12,
    top: 12,
  },
  title: {
    pr: 5,
    pb: 0.5,
  },
  subtitle: {
    px: 3,
    pb: 2,
    color: 'text.secondary',
  },
  content: {
    pt: 2.5,
  },
  summaryGrid: {
    display: 'grid',
    gap: 1.25,
    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
    mb: 2.5,
  },
  summaryTile: {
    minWidth: 0,
    p: 1.5,
    borderRadius: 1.5,
    bgcolor: 'background.neutral',
  },
  summaryLabel: {
    color: 'text.secondary',
    lineHeight: 1.2,
  },
  summaryValue: {
    mt: 0.5,
    fontWeight: 700,
    lineHeight: 1.2,
    fontVariantNumeric: 'tabular-nums',
  },
  attemptList: {
    gap: 1.25,
  },
  attemptCard: (passed) => ({
    p: 1.5,
    borderRadius: 1.5,
    border: '1px solid',
    borderColor: 'divider',
    borderLeft: '3px solid',
    borderLeftColor: passed ? 'success.main' : 'error.main',
  }),
  scoreBadge: (passed) => ({
    width: 56,
    height: 56,
    borderRadius: '50%',
    display: 'grid',
    placeItems: 'center',
    flexShrink: 0,
    fontWeight: 700,
    fontSize: 13,
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
    mt: 1.25,
    height: 6,
    borderRadius: 99,
    bgcolor: 'action.hover',
  },
  chip: {
    height: 22,
    fontWeight: 600,
  },
};
