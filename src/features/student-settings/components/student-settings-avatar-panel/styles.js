export const styles = {
  root: { position: 'relative', width: 'fit-content', mx: 'auto' },
  avatar: {
    width: 126,
    height: 126,
    bgcolor: 'secondary.dark',
    color: 'primary.main',
    fontSize: 34,
    fontWeight: 700,
  },
  editButton: {
    right: -4,
    bottom: 8,
    position: 'absolute',
    bgcolor: 'primary.main',
    color: 'primary.contrastText',
    boxShadow: (theme) => theme.shadows[8],
    '&:hover': { bgcolor: 'primary.dark' },
  },
};
