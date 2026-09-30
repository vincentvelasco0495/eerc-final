export const styles = {
  tabs: {
    minHeight: 40,
    maxWidth: 1,
    '& .MuiTabs-flexContainer': { gap: { xs: 0.75, sm: 1 } },
    '& .MuiTabs-indicator': { display: 'none' },
    '& .MuiTabScrollButton-root': {
      width: { xs: 32, sm: 40 },
    },
  },
};

export function tabSx(isSelected) {
  return {
    px: { xs: 1.25, sm: 1.6 },
    py: 0.9,
    minHeight: 40,
    minWidth: { xs: 'max-content', sm: 'auto' },
    flexShrink: 0,
    borderRadius: 999,
    color: isSelected ? 'brand.accentText' : 'text.secondary',
    bgcolor: (theme) => (isSelected ? theme.vars.palette.brand.accentSoft : 'transparent'),
    fontWeight: isSelected ? 700 : 600,
  };
}
