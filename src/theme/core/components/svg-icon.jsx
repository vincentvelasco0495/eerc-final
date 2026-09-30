// ----------------------------------------------------------------------

const MuiSvgIcon = {
  // ▼▼▼▼▼▼▼▼ 🎨 STYLE ▼▼▼▼▼▼▼▼
  styleOverrides: {
    fontSizeLarge: {
      width: 32,
      height: 32,
      fontSize: 'inherit',
    },
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
export const svgIcon = {
  MuiSvgIcon,
};
