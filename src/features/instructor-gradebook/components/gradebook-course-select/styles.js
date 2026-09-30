export const styles = {
  root: {
    p: 1.5,
    borderRadius: 2,
    bgcolor: 'background.neutral',
    border: '1px solid',
    borderColor: 'divider',
  },
  field: {
    '& .MuiOutlinedInput-root': { bgcolor: (theme) => theme.vars.palette.brand.input },
  },
};
