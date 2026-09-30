export const pageContentStyles = {
  maxWidthContent: {
    width: 1,
    maxWidth: 1400,
    mx: 'auto',
  },
  homeContainers: {
    '& .MuiContainer-root': {
      width: 1,
      maxWidth: '1400px !important',
      mx: 'auto',
    },
  },
};

export const lmsPageShellStyles = {
  content: pageContentStyles.maxWidthContent,
};
