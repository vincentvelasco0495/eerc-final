import { useState } from 'react';

import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Skeleton from '@mui/material/Skeleton';
import TableRow from '@mui/material/TableRow';
import { useTheme } from '@mui/material/styles';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import useMediaQuery from '@mui/material/useMediaQuery';
import TableContainer from '@mui/material/TableContainer';
import LinearProgress from '@mui/material/LinearProgress';

import { Iconify } from 'src/components/iconify';

const SKELETON_ROWS = 5;

function InstructorRowActions({ row, compact, busyId, onEdit, onDelete, onResetPassword }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const isBusy = busyId === row.id;
  const menuOpen = Boolean(anchorEl);
  const closeMenu = () => setAnchorEl(null);
  const runAndClose = (fn) => {
    closeMenu();
    fn?.();
  };

  if (compact) {
    return (
      <>
        <IconButton
          size="small"
          disabled={isBusy}
          aria-label={`Actions for ${row.name}`}
          aria-haspopup="true"
          aria-expanded={menuOpen ? 'true' : undefined}
          onClick={(event) => setAnchorEl(event.currentTarget)}
        >
          <Iconify icon="eva:more-vertical-fill" width={20} />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={menuOpen}
          onClose={closeMenu}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          slotProps={{ paper: { sx: { minWidth: 180 } } }}
        >
          <MenuItem onClick={() => runAndClose(() => onEdit(row))}>
            <ListItemText>Edit</ListItemText>
          </MenuItem>
          {typeof onResetPassword === 'function' ? (
            <MenuItem disabled={isBusy} onClick={() => runAndClose(() => onResetPassword(row))}>
              <ListItemText>Reset password</ListItemText>
            </MenuItem>
          ) : null}
          <MenuItem disabled={isBusy} onClick={() => runAndClose(() => onDelete(row))}>
            <ListItemText>Delete</ListItemText>
          </MenuItem>
        </Menu>
      </>
    );
  }

  return (
    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
      <Button size="small" variant="text" onClick={() => onEdit(row)}>
        Edit
      </Button>
      {typeof onResetPassword === 'function' ? (
        <Button
          size="small"
          variant="text"
          disabled={isBusy}
          onClick={() => onResetPassword(row)}
        >
          Reset password
        </Button>
      ) : null}
      <Button
        size="small"
        color="error"
        variant="text"
        disabled={isBusy}
        onClick={() => onDelete(row)}
      >
        Delete
      </Button>
    </Stack>
  );
}

function InstructorMobileCard({
  row,
  showAliasName,
  resolveProfileSrc,
  onEdit,
  onDelete,
  onResetPassword,
  busyId,
}) {
  const profileSrc = row.profileUrl || row.profilePath;

  return (
    <Box
      sx={{
        p: 1.5,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1.5,
      }}
    >
      <Stack direction="row" spacing={1.25} alignItems="flex-start">
        {profileSrc ? (
          <Box
            component="img"
            src={resolveProfileSrc(profileSrc)}
            alt={`${row.name} profile`}
            sx={{ width: 48, height: 48, objectFit: 'cover', borderRadius: '50%', flexShrink: 0 }}
          />
        ) : null}
        <Stack spacing={0.5} sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="subtitle2" sx={{ overflowWrap: 'anywhere' }}>
            {row.name}
          </Typography>
          {showAliasName ? (
            <Typography variant="caption" color="text.secondary">
              Alias {row.aliasName?.trim() ? row.aliasName : '—'}
            </Typography>
          ) : null}
          <Typography variant="caption" color="text.secondary" sx={{ overflowWrap: 'anywhere' }}>
            {row.email ?? '—'}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'capitalize' }}>
            {row.status ?? 'active'}
          </Typography>
        </Stack>
        <InstructorRowActions
          row={row}
          compact
          busyId={busyId}
          onEdit={onEdit}
          onDelete={onDelete}
          onResetPassword={onResetPassword}
        />
      </Stack>
    </Box>
  );
}

export function InstructorTable({
  rows = [],
  loading = false,
  resolveProfileSrc,
  onEdit,
  onDelete,
  onResetPassword,
  busyId = null,
  emptyMessage = 'No instructors found',
  showAliasName = false,
}) {
  const theme = useTheme();
  const isCompact = useMediaQuery(theme.breakpoints.down('md'));
  const colCount = showAliasName ? 6 : 5;
  const showSkeleton = loading && (!Array.isArray(rows) || rows.length === 0);

  return (
    <Box sx={{ position: 'relative' }}>
      {loading && rows.length > 0 ? (
        <LinearProgress
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1,
            borderRadius: 1,
          }}
        />
      ) : null}

      {isCompact ? (
        <Stack
          spacing={1.25}
          sx={{
            opacity: loading && rows.length > 0 ? 0.72 : 1,
            transition: (t) => t.transitions.create('opacity', { duration: 160 }),
          }}
        >
          {showSkeleton
            ? Array.from({ length: SKELETON_ROWS }).map((_, i) => (
                <Skeleton key={`sk-${i}`} variant="rounded" height={88} animation="wave" />
              ))
            : null}
          {!showSkeleton && !loading && rows.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ py: 6, textAlign: 'center' }}>
              {emptyMessage}
            </Typography>
          ) : null}
          {!showSkeleton && rows.length > 0
            ? rows.map((row) => (
                <InstructorMobileCard
                  key={row.id}
                  row={row}
                  showAliasName={showAliasName}
                  resolveProfileSrc={resolveProfileSrc}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onResetPassword={onResetPassword}
                  busyId={busyId}
                />
              ))
            : null}
        </Stack>
      ) : (
        <TableContainer sx={{ overflowX: 'auto' }}>
          <Table
            size="small"
            sx={{
              minWidth: showAliasName ? 720 : 640,
              opacity: loading && rows.length > 0 ? 0.72 : 1,
              transition: (t) => t.transitions.create('opacity', { duration: 160 }),
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                {showAliasName ? <TableCell>Alias name</TableCell> : null}
                <TableCell>Email</TableCell>
                <TableCell>Profile</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {showSkeleton
                ? Array.from({ length: SKELETON_ROWS }).map((_, i) => (
                    <TableRow key={`sk-${i}`}>
                      <TableCell colSpan={colCount} sx={{ py: 1.5 }}>
                        <Skeleton variant="rounded" height={40} animation="wave" />
                      </TableCell>
                    </TableRow>
                  ))
                : null}

              {!showSkeleton && !loading && rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={colCount} align="center" sx={{ py: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      {emptyMessage}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : null}

              {!showSkeleton && rows.length > 0
                ? rows.map((row) => (
                    <TableRow key={row.id} hover>
                      <TableCell>{row.name}</TableCell>
                      {showAliasName ? (
                        <TableCell>{row.aliasName?.trim() ? row.aliasName : '—'}</TableCell>
                      ) : null}
                      <TableCell>{row.email ?? '—'}</TableCell>
                      <TableCell>
                        {row.profileUrl || row.profilePath ? (
                          <Box
                            component="img"
                            src={resolveProfileSrc(row.profileUrl || row.profilePath)}
                            alt={`${row.name} profile`}
                            sx={{ width: 56, height: 56, objectFit: 'cover', borderRadius: '50%' }}
                          />
                        ) : (
                          '—'
                        )}
                      </TableCell>
                      <TableCell>{row.status ?? 'active'}</TableCell>
                      <TableCell>
                        <InstructorRowActions
                          row={row}
                          busyId={busyId}
                          onEdit={onEdit}
                          onDelete={onDelete}
                          onResetPassword={onResetPassword}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                : null}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
