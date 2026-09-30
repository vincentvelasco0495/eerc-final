import { varAlpha } from 'minimal-shared/utils';

// ----------------------------------------------------------------------

const MuiDrawer = {
  // ▼▼▼▼▼▼▼▼ 🎨 STYLE ▼▼▼▼▼▼▼▼
  styleOverrides: {
    paper: {
      variants: [
        {
          props: (props) => props.variant === 'temporary' && props.anchor === 'left',
          style: ({ theme }) => ({
            ...theme.mixins.paperStyles(theme),
            borderRight: `1px solid ${theme.vars.palette.brand.borderSubtle}`,
            boxShadow: `40px 40px 80px -8px ${varAlpha(theme.vars.palette.grey['900Channel'], 0.16)}`,
            ...theme.applyStyles('dark', {
              boxShadow: `40px 40px 80px -8px ${varAlpha(theme.vars.palette.common.blackChannel, 0.4)}`,
            }),
          }),
        },
        {
          props: (props) => props.variant === 'temporary' && props.anchor === 'right',
          style: ({ theme }) => ({
            ...theme.mixins.paperStyles(theme),
            borderLeft: `1px solid ${theme.vars.palette.brand.borderSubtle}`,
            boxShadow: `-40px 40px 80px -8px ${varAlpha(theme.vars.palette.grey['900Channel'], 0.16)}`,
            ...theme.applyStyles('dark', {
              boxShadow: `-40px 40px 80px -8px ${varAlpha(theme.vars.palette.common.blackChannel, 0.4)}`,
            }),
          }),
        },
      ],
    },
  },
};

/* **********************************************************************
 * 🚀 Export
 * **********************************************************************/
export const drawer = {
  MuiDrawer,
};
