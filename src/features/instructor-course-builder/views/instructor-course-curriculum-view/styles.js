export const styles = {
  content: {
    pt: 0,
    px: { xs: 2, sm: 2.5 },
    pb: 0,
  },
  shell: (theme) => ({
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    mx: { xs: -2, sm: -2.5 },
  }),
  body: {
    flex: 1,
    minHeight: 0,
    alignItems: 'stretch',
  },
};
