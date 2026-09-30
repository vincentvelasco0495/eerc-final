export const styles = {
  cardBorderVars: {
    border: (theme) => `1px solid ${theme.vars.palette.divider}`,
    boxShadow: 'none',
  },
  cardFullHeight: {
    height: '100%',
    border: (theme) => `1px solid ${theme.vars.palette.divider}`,
    boxShadow: 'none',
  },
  cardContentFull: { height: '100%' },
  innerStackFull: { height: '100%', justifyContent: 'space-between' },
  progressCaption: { color: 'text.secondary' },
  suggestedListItem: { px: 0 },
  listItemCaption: { color: 'text.secondary' },
  sectionHeadingMargin: { mb: 2 },
};
