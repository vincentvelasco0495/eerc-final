export const styles = {
  heading: { fontSize: { xs: '1.7rem', md: '2rem' }, flexShrink: 0 },
  tabs: {
    minHeight: 44,
    maxWidth: { xs: '100%', sm: 'none' },
    width: { xs: '100%', sm: 'auto' },
    minWidth: 0,
    flex: { sm: '1 1 auto' },
    alignSelf: { sm: 'center' },
    '& .MuiTabs-indicator': { height: 3, borderRadius: 99 },
    '& .MuiTabScrollButton-root': {
      width: { xs: 32, sm: 40 },
    },
  },
  tabRoot: {
    px: { xs: 0.35, sm: 0.5 },
    minHeight: 44,
    minWidth: { xs: 'max-content', sm: 'auto' },
    flexShrink: 0,
    mr: { xs: 1.5, sm: 2 },
    color: 'text.secondary',
    '&.Mui-selected': { color: 'text.primary' },
  },
  tabLabelTypography: { fontWeight: 700 },
};

export function tabCountBadgeSx(isSelected) {
  return {
    minWidth: 20,
    height: 20,
    px: 0.75,
    borderRadius: 999,
    display: 'grid',
    placeItems: 'center',
    bgcolor: isSelected ? 'primary.main' : 'background.neutral',
    color: isSelected ? 'primary.contrastText' : 'text.secondary',
    fontSize: 12,
    fontWeight: 700,
    lineHeight: 1,
  };
}
