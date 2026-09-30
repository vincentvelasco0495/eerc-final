export const styles = {
  mainStack: {
    flexDirection: { xs: 'column', sm: 'row' },
    alignItems: { xs: 'stretch', sm: 'center' },
    justifyContent: 'space-between',
  },
  paginationWrap: { display: 'flex', justifyContent: { xs: 'center', sm: 'flex-start' } },
  pagination: {
    '& .MuiPaginationItem-root': { fontSize: 13, minWidth: 32, height: 32 },
    '& .MuiPagination-ul': { flexWrap: 'wrap', justifyContent: 'center' },
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: { xs: 'flex-start', sm: 'flex-end' },
    gap: 1,
  },
  pageSizeField: { width: 88 },
  perPage: { whiteSpace: 'nowrap' },
};
