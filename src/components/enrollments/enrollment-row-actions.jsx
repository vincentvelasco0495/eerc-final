import { useState } from 'react';

import Menu from '@mui/material/Menu';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';

import { Iconify } from 'src/components/iconify';

export function EnrollmentRowActions({
  row,
  canManage,
  isBusy,
  onStatusChange,
  onView,
  onReject,
  onPaymentHistory,
  compact = false,
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const isApproved = row.status === 'approved';
  const isRejected = row.status === 'rejected';
  const isHold = row.status === 'hold';
  const menuOpen = Boolean(anchorEl);

  const closeMenu = () => setAnchorEl(null);

  const runAndClose = (fn) => {
    closeMenu();
    fn?.();
  };

  if (!canManage) {
    return (
      <Button size="small" variant="outlined" disabled={isBusy} onClick={() => onView(row.id)}>
        View
      </Button>
    );
  }

  if (compact) {
    return (
      <>
        <Stack direction="row" spacing={1} justifyContent="flex-end" alignItems="center">
          <Button size="small" variant="outlined" disabled={isBusy} onClick={() => onView(row.id)}>
            View
          </Button>
          <IconButton
            size="small"
            disabled={isBusy}
            aria-label="More enrollment actions"
            aria-haspopup="true"
            aria-expanded={menuOpen ? 'true' : undefined}
            onClick={(event) => setAnchorEl(event.currentTarget)}
          >
            <Iconify icon="eva:more-vertical-fill" width={20} />
          </IconButton>
        </Stack>
        <Menu
          anchorEl={anchorEl}
          open={menuOpen}
          onClose={closeMenu}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          slotProps={{ paper: { sx: { minWidth: 196 } } }}
        >
          <MenuItem disabled={isBusy} onClick={() => runAndClose(() => onPaymentHistory?.(row))}>
            <ListItemText>Payment history</ListItemText>
          </MenuItem>
          <MenuItem
            disabled={isBusy || isApproved}
            onClick={() => runAndClose(() => onStatusChange?.(row, 'approved'))}
          >
            <ListItemText>Approve</ListItemText>
          </MenuItem>
          <MenuItem
            disabled={isBusy || isHold || isRejected}
            onClick={() => runAndClose(() => onStatusChange?.(row, 'hold'))}
          >
            <ListItemText>Hold</ListItemText>
          </MenuItem>
          <MenuItem
            disabled={isBusy || isRejected}
            onClick={() => runAndClose(() => onReject(row))}
          >
            <ListItemText>Reject</ListItemText>
          </MenuItem>
        </Menu>
      </>
    );
  }

  return (
    <Stack direction="row" spacing={1} justifyContent="flex-end" flexWrap="wrap" useFlexGap>
      <Button size="small" variant="outlined" disabled={isBusy} onClick={() => onView(row.id)}>
        View
      </Button>
      <Button
        size="small"
        variant="outlined"
        color="inherit"
        disabled={isBusy}
        onClick={() => onPaymentHistory?.(row)}
      >
        Payment history
      </Button>
      <Button
        size="small"
        variant="contained"
        color="success"
        disabled={isBusy || isApproved}
        onClick={() => onStatusChange?.(row, 'approved')}
      >
        Approve
      </Button>
      <Button
        size="small"
        variant="outlined"
        color="warning"
        disabled={isBusy || isHold || isRejected}
        onClick={() => onStatusChange?.(row, 'hold')}
      >
        Hold
      </Button>
      <Button
        size="small"
        variant="outlined"
        color="error"
        disabled={isBusy || isRejected}
        onClick={() => onReject(row)}
      >
        Reject
      </Button>
    </Stack>
  );
}
