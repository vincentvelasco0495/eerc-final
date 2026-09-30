export const workspaceContentSx = [
  {
    mt: { xs: 2, md: 3 },
    pb: { xs: 3, md: 4 },
  },
  (theme) => ({
    [theme.breakpoints.up('xl')]: {
      maxWidth: 'min(1600px, 92vw)',
    },
    '@media (min-width: 2000px)': {
      maxWidth: 'min(1800px, 94vw)',
    },
  }),
];
