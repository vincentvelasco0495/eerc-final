export const styles = {
  paper: {
    borderRadius: 3,
    overflow: 'visible',
  },
  titleBlock: {
    pr: 1,
  },
  title: {
    fontWeight: 700,
    fontSize: '1.125rem',
    letterSpacing: -0.01,
    color: 'text.primary',
  },
  subtitle: {
    mt: 0.35,
    color: 'text.secondary',
    fontSize: 13,
    fontWeight: 400,
  },
  closeButton: {
    color: 'text.secondary',
    alignSelf: 'flex-start',
    mt: -0.5,
    mr: -0.5,
  },
  content: {
    pt: 0,
    pb: 3,
    px: { xs: 2, sm: 3 },
  },
  section: {
    mt: 2.5,
    '&:first-of-type': { mt: 0.5 },
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: '0.12em',
    color: 'text.secondary',
    textTransform: 'uppercase',
    mb: 1.5,
  },
  tileGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 1.5,
  },
  tile: (theme) => ({
    flex: '1 1 120px',
    minWidth: 108,
    maxWidth: 160,
    borderRadius: 2,
    border: '2px solid',
    borderColor: theme.palette.divider,
    bgcolor: 'background.paper',
    py: 2,
    px: 1.5,
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 1.25,
    textAlign: 'center',
    transition: theme.transitions.create(['border-color', 'box-shadow'], {
      duration: theme.transitions.duration.shorter,
    }),
    '&:hover': {
      borderColor: theme.palette.primary.main,
      boxShadow: theme.customShadows?.z8 ?? theme.shadows[4],
    },
    '&:focus-visible': {
      outline: `2px solid ${theme.palette.primary.main}`,
      outlineOffset: 2,
    },
  }),
  tileIcon: {
    color: 'brand.accentText',
  },
  tileLabel: {
    fontSize: 13,
    fontWeight: 500,
    lineHeight: 1.3,
    color: 'text.primary',
  },
};
