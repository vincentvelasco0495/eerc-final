import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';

import { Iconify } from 'src/components/iconify';

import { styles } from './styles';

export function EnrolledQuizToolbar({
  query,
  status,
  statuses,
  onQueryChange,
  onStatusChange,
}) {
  return (
    <Stack
      direction={{ xs: 'column', lg: 'row' }}
      spacing={{ xs: 2.5, lg: 3 }}
      justifyContent="space-between"
      alignItems={{ lg: 'flex-end' }}
      sx={styles.root}
    >
      <Stack spacing={0.5} sx={styles.titleBlock}>
        <Typography variant="h4" sx={styles.title}>
          Quizzes
        </Typography>
        <Typography variant="body2" sx={styles.subtitle}>
          Review your quiz progress, scores, and attempt history across enrolled courses.
        </Typography>
      </Stack>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={styles.filtersRow}>
        <TextField
          size="small"
          value={query}
          placeholder="Search by course or quiz title"
          onChange={(event) => onQueryChange(event.target.value)}
          sx={styles.searchField}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="solar:magnifer-linear" width={18} sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
            },
          }}
        />

        <TextField
          select
          size="small"
          label="Status"
          value={status}
          onChange={(event) => onStatusChange(event.target.value)}
          sx={styles.statusField}
        >
          {statuses.map((item) => (
            <MenuItem key={item} value={item}>
              {item}
            </MenuItem>
          ))}
        </TextField>
      </Stack>
    </Stack>
  );
}
