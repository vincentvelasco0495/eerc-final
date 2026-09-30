import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';

import { Iconify } from 'src/components/iconify';

import { styles } from './styles';

export function InstructorAssignmentsToolbar({
  title,
  query,
  course,
  status,
  courseOptions,
  statusOptions,
  onQueryChange,
  onCourseChange,
  onStatusChange,
}) {
  return (
    <Stack spacing={2.5}>
      <Typography variant="h3" sx={styles.title}>
        {title}
      </Typography>

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} sx={styles.filtersRow}>
        <TextField
          value={query}
          placeholder="Search assignment..."
          onChange={(event) => onQueryChange(event.target.value)}
          sx={styles.searchField}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <Iconify icon="solar:magnifer-linear" width={20} sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
            },
          }}
        />

        <TextField
          select
          value={course}
          onChange={(event) => onCourseChange(event.target.value)}
          sx={styles.selectField}
        >
          {courseOptions.map((item) => (
            <MenuItem key={item.value} value={item.value}>
              {item.label}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          value={status}
          onChange={(event) => onStatusChange(event.target.value)}
          sx={styles.selectField}
        >
          {statusOptions.map((item) => (
            <MenuItem key={item.value} value={item.value}>
              {item.label}
            </MenuItem>
          ))}
        </TextField>
      </Stack>
    </Stack>
  );
}
