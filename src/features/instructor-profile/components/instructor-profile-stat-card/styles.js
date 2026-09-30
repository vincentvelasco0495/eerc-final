export const styles = {
  card: {
    width: 1,
    height: 1,
    borderRadius: 2.5,
    border: '1px solid',
    borderColor: 'divider',
    boxShadow: 'none',
  },
  cardContent: { p: 2 },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    bgcolor: (theme) => theme.vars.palette.brand.accentSoft,
    color: 'brand.accentText',
    flexShrink: 0,
  },
  metaStack: { minWidth: 0 },
  caption: { color: 'text.secondary' },
};
