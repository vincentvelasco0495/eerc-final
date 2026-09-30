export const styles = {
  container: {
    borderRadius: 2,
    boxShadow: 'none',
    overflow: 'auto',
    borderColor: 'divider',
  },
  table: {
    minWidth: 960,
  },
  headRow: {
    '& th': {
      bgcolor: 'background.paper',
      color: 'text.primary',
      fontWeight: 700,
      fontSize: 13,
      borderBottom: '1px solid',
      borderColor: 'divider',
      py: 1.5,
    },
  },
  sortLabel: {
    '& .MuiTableSortLabel-icon': {
      opacity: 0.45,
    },
  },
};
