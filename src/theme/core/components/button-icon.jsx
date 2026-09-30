import { colorKeys } from '../palette';

// ----------------------------------------------------------------------

/* **********************************************************************
 * 🗳️ Variants
 * **********************************************************************/
const colorVariants = [
  {
    props: (props) => props.color === 'primary',
    style: ({ theme }) => ({
      color: theme.vars.palette.brand.accentText,
    }),
  },
  ...colorKeys.common.map((colorKey) => ({
    props: (props) => props.color === colorKey,
    style: ({ theme }) => ({
      color: theme.vars.palette.common[colorKey],
    }),
  })),
];

/* **********************************************************************
 * 🧩 Components
 * **********************************************************************/
const MuiIconButton = {
  // ▼▼▼▼▼▼▼▼ 🎨 STYLE ▼▼▼▼▼▼▼▼
  styleOverrides: {
    root: {
      variants: [...colorVariants],
    },
  },
};

/* **********************************************************************
 * 🚀 Export
 * **********************************************************************/
export const iconButton = {
  MuiIconButton,
};
