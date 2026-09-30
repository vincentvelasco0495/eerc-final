// ----------------------------------------------------------------------

const MuiCard = {
  // ▼▼▼▼▼▼▼▼ 🎨 STYLE ▼▼▼▼▼▼▼▼
  styleOverrides: {
    root: ({ theme }) => ({
      position: 'relative',
      backgroundImage: `var(--card-bg, ${theme.vars.palette.brand.gradientSurface})`,
      border: `1px solid var(--card-border, ${theme.vars.palette.brand.borderDefault})`,
      boxShadow: `var(--card-shadow, ${theme.vars.customShadows.card})`,
      borderRadius: `var(--card-radius, ${Number(theme.shape.borderRadius) * 1.5}px)`,
      zIndex: 0, // Fix Safari overflow: hidden with border radius
      /**
       * Opt-in lift for clickable cards (program tiles, course cards):
       * add `data-interactive` to the Card. Deliberately not global, because
       * full-width page-section cards should never shift on hover.
       */
      '&[data-interactive]': {
        transition: theme.transitions.create(['transform', 'border-color', 'box-shadow'], {
          duration: theme.transitions.duration.shorter,
        }),
        '@media (hover: hover)': {
          '&:hover': {
            transform: 'translateY(-2px)',
            borderColor: theme.vars.palette.brand.borderStrong,
            boxShadow: theme.vars.customShadows.z20,
          },
        },
        '@media (prefers-reduced-motion: reduce)': {
          transition: 'none',
          '&:hover': { transform: 'none' },
        },
      },
    }),
  },
};

const MuiCardHeader = {
  // ▼▼▼▼▼▼▼▼ ⚙️ PROPS ▼▼▼▼▼▼▼▼
  defaultProps: {
    titleTypographyProps: { variant: 'h6' },
    subheaderTypographyProps: { variant: 'body2', marginTop: '4px' },
  },
  // ▼▼▼▼▼▼▼▼ 🎨 STYLE ▼▼▼▼▼▼▼▼
  styleOverrides: {
    root: ({ theme }) => ({
      padding: theme.spacing(3, 3, 0),
    }),
  },
};

const MuiCardContent = {
  // ▼▼▼▼▼▼▼▼ 🎨 STYLE ▼▼▼▼▼▼▼▼
  styleOverrides: {
    root: ({ theme }) => ({
      padding: theme.spacing(3),
    }),
  },
};

/* **********************************************************************
 * 🚀 Export
 * **********************************************************************/
export const card = {
  MuiCard,
  MuiCardHeader,
  MuiCardContent,
};
