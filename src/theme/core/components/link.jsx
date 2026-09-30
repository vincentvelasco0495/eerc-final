// ----------------------------------------------------------------------

const MuiLink = {
  // ▼▼▼▼▼▼▼▼ ⚙️ PROPS ▼▼▼▼▼▼▼▼
  defaultProps: {
    underline: 'hover',
  },
  // ▼▼▼▼▼▼▼▼ 🎨 STYLE ▼▼▼▼▼▼▼▼
  styleOverrides: {
    root: ({ theme }) => ({
      // Bright gold is only ~1.4:1 on white; accentText is deep gold in light / bright gold in dark.
      color: theme.vars.palette.brand.accentText,
    }),
  },
};

const MuiTypography = {
  styleOverrides: {
    root: {
      variants: [
        {
          props: { color: 'primary' },
          style: ({ theme }) => ({
            color: theme.vars.palette.brand.accentText,
          }),
        },
      ],
    },
  },
};

/* **********************************************************************
 * 🚀 Export
 * **********************************************************************/
export const link = {
  MuiLink,
  MuiTypography,
};
