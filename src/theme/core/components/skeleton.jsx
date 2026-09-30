// ----------------------------------------------------------------------

const MuiSkeleton = {
  // ▼▼▼▼▼▼▼▼ ⚙️ PROPS ▼▼▼▼▼▼▼▼
  defaultProps: {
    animation: 'wave',
    variant: 'rounded',
  },
  // ▼▼▼▼▼▼▼▼ 🎨 STYLE ▼▼▼▼▼▼▼▼
  styleOverrides: {
    root: ({ theme }) => ({
      backgroundColor: theme.vars.palette.brand.skeleton,
      '&::after': {
        background: `linear-gradient(90deg, transparent, ${theme.vars.palette.brand.skeletonHighlight}, transparent)`,
      },
    }),
    rounded: ({ theme }) => ({
      borderRadius: Number(theme.shape.borderRadius) * 2,
    }),
  },
};

/* **********************************************************************
 * 🚀 Export
 * **********************************************************************/
export const skeleton = {
  MuiSkeleton,
};
