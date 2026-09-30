import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Pagination from '@mui/material/Pagination';
import Typography from '@mui/material/Typography';

import { styles } from './styles';

export function GradebookPaginationBar({
  page,
  pageCount,
  onPageChange,
  pageSize,
  pageSizeOptions,
  onPageSizeChange,
}) {
  return (
    <Stack spacing={2} sx={styles.mainStack}>
      <Box sx={styles.paginationWrap}>
        <Pagination
          count={pageCount}
          page={page}
          onChange={(_, value) => onPageChange(value)}
          showFirstButton
          showLastButton
          size="small"
          color="primary"
          shape="rounded"
          siblingCount={0}
          boundaryCount={1}
          sx={styles.pagination}
        />
      </Box>

      <Box sx={styles.right}>
        <TextField
          select
          size="small"
          value={pageSize}
          onChange={(event) => onPageSizeChange(Number(event.target.value))}
          sx={styles.pageSizeField}
        >
          {pageSizeOptions.map((n) => (
            <MenuItem key={n} value={n}>
              {n}
            </MenuItem>
          ))}
        </TextField>
        <Typography variant="body2" color="text.secondary" sx={styles.perPage}>
          per page
        </Typography>
      </Box>
    </Stack>
  );
}
