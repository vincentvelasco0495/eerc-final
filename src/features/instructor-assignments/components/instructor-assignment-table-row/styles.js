export const styles = {
  assignmentTitle: {
    fontWeight: 700,
    color: 'brand.accentText',
    fontSize: 14,
    lineHeight: 1.35,
  },
  courseLine: {
    color: 'text.secondary',
    fontSize: 13,
    mt: 0.35,
  },
  totalCell: {
    fontWeight: 600,
    fontSize: 14,
    color: 'text.primary',
  },
  viewButton: {
    px: 2,
    py: 0.75,
    borderRadius: 1.5,
    fontWeight: 600,
    textTransform: 'none',
    bgcolor: 'action.hover',
    color: 'brand.accentText',
    boxShadow: 'none',
    border: '1px solid',
    borderColor: 'divider',
    '&:hover': {
      bgcolor: 'action.selected',
      boxShadow: 'none',
    },
  },
  leaderboardButton: {
    px: 2,
    py: 0.75,
    borderRadius: 1.5,
    fontWeight: 600,
    textTransform: 'none',
    boxShadow: 'none',
  },
};
