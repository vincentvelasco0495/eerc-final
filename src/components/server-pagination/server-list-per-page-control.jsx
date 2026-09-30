import Stack from '@mui/material/Stack';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';

import { PROGRAMS_PER_PAGE_OPTIONS } from 'src/services/programService';

// ----------------------------------------------------------------------

/** Label + dropdown for server-side page size (e.g. header row, top-right). */
export function ServerListPerPageControl({
  perPage = 10,
  onPerPageChange,
  disabled = false,
  options = PROGRAMS_PER_PAGE_OPTIONS,
  label = 'Items per page',
  selectSx,
}) {
  return (
    <Stack direction="row" spacing={1} alignItems="center" sx={{ flexShrink: 0 }}>
      <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
        {label}
      </Typography>
      <Select
        size="small"
        value={perPage}
        disabled={disabled}
        onChange={(e) => onPerPageChange(Number(e.target.value))}
        sx={{ minWidth: 72, ...selectSx }}
      >
        {options.map((n) => (
          <MenuItem key={n} value={n}>
            {n}
          </MenuItem>
        ))}
      </Select>
    </Stack>
  );
}
