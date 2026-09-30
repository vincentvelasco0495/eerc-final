export const styles = {
  root: {
    flexDirection: { xs: 'column', md: 'row' },
    alignItems: { xs: 'stretch', md: 'center' },
    gap: { xs: 1.5, md: 2 },
    pb: 2,
    borderBottom: '1px solid',
    borderColor: 'divider',
  },
  typeLabel: {
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    gap: 1,
    minWidth: { md: 140 },
  },
  typeTitle: {
    fontWeight: 700,
    fontSize: 15,
    color: 'text.primary',
  },
  nameField: {
    flex: 1,
    '& .MuiOutlinedInput-root': { bgcolor: 'background.paper' },
  },
  createButton: {
    flexShrink: 0,
    px: 2.5,
    py: 1,
    fontWeight: 600,
    textTransform: 'none',
    borderRadius: 1.5,
  },
};
