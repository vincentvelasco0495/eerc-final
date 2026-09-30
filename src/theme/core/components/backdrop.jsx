// ----------------------------------------------------------------------

const MuiBackdrop = {
  // ▼▼▼▼▼▼▼▼ 🎨 STYLE ▼▼▼▼▼▼▼▼
  styleOverrides: {
    root: ({ theme }) => ({
      variants: [
        {
          props: (props) => !props.invisible,
          style: {
            backgroundColor: theme.vars.palette.brand.overlay,
          },
        },
      ],
    }),
  },
};

/* **********************************************************************
 * 🚀 Export
 * **********************************************************************/
export const backdrop = {
  MuiBackdrop,
};
