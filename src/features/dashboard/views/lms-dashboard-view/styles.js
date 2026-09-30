export const styles = {
  cardBorderVars: {
    border: (theme) => `1px solid ${theme.vars.palette.divider}`,
    boxShadow: 'none',
  },
  welcomeCardContent: { p: { xs: 3, md: 4 } },
  avatar: {
    width: 56,
    height: 56,
    bgcolor: (theme) => theme.vars.palette.brand.accentSoft,
    color: 'brand.accentText',
  },
  welcomeEyebrow: { color: 'brand.accentText' },
  welcomeBody: { color: 'text.secondary', maxWidth: 680 },
  moduleListDescription: { color: 'text.secondary' },
  strengthCard: {
    height: '100%',
    border: (theme) => `1px solid ${theme.vars.palette.divider}`,
    boxShadow: 'none',
  },
  strengthsCardContent: { height: '100%' },
};
