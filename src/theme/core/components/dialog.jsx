// ----------------------------------------------------------------------

const MuiDialog = {
  // ▼▼▼▼▼▼▼▼ 🎨 STYLE ▼▼▼▼▼▼▼▼
  styleOverrides: {
    paper: ({ theme }) => ({
      backgroundColor: theme.vars.palette.brand.sunken,
      backgroundImage: 'none',
      variants: [
        {
          props: (props) => !props.fullScreen,
          style: {
            margin: theme.spacing(2),
            border: `1px solid ${theme.vars.palette.brand.borderDefault}`,
            boxShadow: theme.vars.customShadows.dialog,
            borderRadius: Number(theme.shape.borderRadius) * 2,
          },
        },
      ],
    }),
  },
};

const MuiDialogTitle = {
  // ▼▼▼▼▼▼▼▼ 🎨 STYLE ▼▼▼▼▼▼▼▼
  styleOverrides: {
    root: ({ theme }) => ({
      padding: theme.spacing(3),
    }),
  },
};

const MuiDialogContent = {
  // ▼▼▼▼▼▼▼▼ 🎨 STYLE ▼▼▼▼▼▼▼▼
  styleOverrides: {
    root: ({ theme }) => ({
      padding: theme.spacing(0, 3),
    }),
    dividers: ({ theme }) => ({
      borderTop: 0,
      borderBottomStyle: 'solid',
      paddingBottom: theme.spacing(3),
    }),
  },
};

const MuiDialogActions = {
  // ▼▼▼▼▼▼▼▼ ⚙️ PROPS ▼▼▼▼▼▼▼▼
  defaultProps: {
    disableSpacing: true,
  },
  // ▼▼▼▼▼▼▼▼ 🎨 STYLE ▼▼▼▼▼▼▼▼
  styleOverrides: {
    root: ({ theme }) => ({
      padding: theme.spacing(3),
      '& > :not(:first-of-type)': {
        marginLeft: theme.spacing(1.5),
      },
    }),
  },
};

/* **********************************************************************
 * 🚀 Export
 * **********************************************************************/
export const dialog = {
  MuiDialog,
  MuiDialogTitle,
  MuiDialogContent,
  MuiDialogActions,
};
