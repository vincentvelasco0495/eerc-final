import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';

import { Iconify } from 'src/components/iconify';

export function moveItem(list, from, to) {
  if (from === to || from < 0 || to < 0 || from >= list.length || to >= list.length) {
    return list;
  }
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

export function ReorderControls({ index, total, onMoveUp, onMoveDown, disabled }) {
  return (
    <Stack direction="row" spacing={0.5}>
      <IconButton size="small" disabled={disabled || index <= 0} onClick={onMoveUp} aria-label="Move up">
        <Iconify icon="solar:alt-arrow-up-linear" width={18} />
      </IconButton>
      <IconButton
        size="small"
        disabled={disabled || index >= total - 1}
        onClick={onMoveDown}
        aria-label="Move down"
      >
        <Iconify icon="solar:alt-arrow-down-linear" width={18} />
      </IconButton>
    </Stack>
  );
}
