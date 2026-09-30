import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';

import { Iconify } from 'src/components/iconify';

import { styles } from './styles';

export function StudentAssignmentsToolbar({
  title,
  query,
  status,
  statuses,
  onQueryChange,
  onStatusChange,
}) {
  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      spacing={2}
      justifyContent="space-between"
      alignItems={{ xs: 'stretch', md: 'center' }}
    >
      <Typography variant="h4" sx={styles.title}>
        {title}
      </Typography>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={styles.filtersRow}>
        <TextField
          value={query}
          placeholder="Search"
          onChange={(event) => onQueryChange(event.target.value)}
          sx={styles.searchField}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <Iconify icon="solar:magnifer-linear" width={18} />
                </InputAdornment>
              ),
            },
          }}
        />

        <TextField
          select
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
