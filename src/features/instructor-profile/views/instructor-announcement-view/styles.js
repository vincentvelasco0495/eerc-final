export const styles = {
  pageTitle: {
    fontWeight: 600,
    color: 'text.primary',
    fontSize: { xs: '1.35rem', sm: '1.5rem' },
  },
  formSurface: {
    bgcolor: 'background.neutral',
    borderRadius: 2,
    p: { xs: 2.5, sm: 3 },
  },
  textField: {
    '& .MuiOutlinedInput-root': {
      bgcolor: 'background.paper',
      borderRadius: 1.5,
    },
    '& .MuiInputBase-input::placeholder': { opacity: 0.55 },
  },
  actionsRow: { pt: 1 },
  submitButton: {
    px: 3.5,
    borderRadius: 1.5,
    bgcolor: 'primary.main',
    color: 'primary.contrastText',
    boxShadow: 'none',
    '&:hover': { bgcolor: 'primary.dark', boxShadow: 'none' },
  },
};
