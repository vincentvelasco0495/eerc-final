export const styles = {
  card: {
    height: '100%',
    border: (theme) => `1px solid ${theme.vars.palette.divider}`,
    borderRadius: 2,
    boxShadow: 'none',
  },
  previewCard: {
    minHeight: { lg: 420 },
  },
  cardContent: {
    p: { xs: 2.25, md: 2.75 },
    '&:last-child': { pb: { xs: 2.25, md: 2.75 } },
  },
  sidebarStack: {
    height: '100%',
  },
  sectionTitle: {
    fontWeight: 700,
    fontSize: '1.02rem',
    lineHeight: 1.3,
  },
  sectionSubtitle: {
    color: 'text.secondary',
    lineHeight: 1.55,
  },
  settingRow: {
    minWidth: 0,
  },
  settingIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 1.25,
    display: 'grid',
    placeItems: 'center',
    flexShrink: 0,
    bgcolor: 'background.neutral',
    color: 'brand.accentText',
    border: '1px solid',
    borderColor: 'divider',
  },
  settingText: {
    minWidth: 0,
    flex: '1 1 auto',
  },
  settingLabel: {
    color: 'text.secondary',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: 0.35,
    fontSize: 10,
    lineHeight: 1.2,
  },
  settingValue: {
    fontWeight: 600,
    color: 'text.primary',
    lineHeight: 1.45,
  },
  settingHint: {
    color: 'text.secondary',
    lineHeight: 1.4,
  },
  progressCaption: {
    color: 'text.secondary',
    fontWeight: 600,
  },
  attemptProgress: {
    height: 8,
    borderRadius: 99,
    bgcolor: 'background.neutral',
  },
  historyRow: {
    px: 1.25,
    py: 1,
    borderRadius: 1.25,
    bgcolor: 'background.neutral',
  },
  historyLabel: {
    fontWeight: 600,
    color: 'text.secondary',
  },
  previewCountChip: {
    fontWeight: 600,
    height: 28,
  },
  questionList: {
    borderRadius: 2,
    border: '1px solid',
    borderColor: 'divider',
    overflow: 'hidden',
    bgcolor: 'background.neutral',
  },
  questionItem: {
    px: { xs: 1.75, md: 2.25 },
    py: { xs: 1.75, md: 2 },
    borderBottom: '1px solid',
    borderColor: 'divider',
    bgcolor: 'background.paper',
    '&:last-child': {
      borderBottom: 'none',
    },
  },
  questionChip: {
    mt: 0.15,
    fontWeight: 700,
    height: 24,
    flexShrink: 0,
  },
  questionBody: {
    minWidth: 0,
    flex: '1 1 auto',
  },
  questionPrompt: {
    fontWeight: 700,
    lineHeight: 1.45,
  },
  choiceLine: {
    color: 'text.secondary',
    lineHeight: 1.5,
    display: 'block',
  },
  emptyPreview: {
    py: { xs: 4, md: 5 },
    px: 2,
    borderRadius: 2,
    border: '1px dashed',
    borderColor: 'divider',
    bgcolor: 'background.neutral',
  },
  emptyPreviewIcon: {
    width: 56,
    height: 56,
    borderRadius: '50%',
    display: 'grid',
    placeItems: 'center',
    bgcolor: 'background.paper',
    color: 'text.secondary',
    border: '1px solid',
    borderColor: 'divider',
  },
  emptyState: {
    p: { xs: 3, md: 4 },
    borderRadius: 2,
    border: '1px solid',
    borderColor: 'divider',
    bgcolor: 'background.neutral',
    textAlign: 'center',
  },
  emptyTitle: {
    fontWeight: 700,
  },
  emptyText: {
    color: 'text.secondary',
    lineHeight: 1.6,
    maxWidth: 420,
    mx: 'auto',
  },
};
