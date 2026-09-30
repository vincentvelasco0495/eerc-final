import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Skeleton from '@mui/material/Skeleton';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';

const SKELETON_ROWS = 5;

export function InstructorTable({
  rows = [],
  loading = false,
  resolveProfileSrc,
  onEdit,
  onDelete,
  busyId = null,
  emptyMessage = 'No instructors found',
}) {
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
      <Table
        size="small"
        sx={{
          opacity: loading && rows.length > 0 ? 0.72 : 1,
          transition: (theme) => theme.transitions.create('opacity', { duration: 160 }),
        }}
      >
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
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
                  <TableCell colSpan={5} sx={{ py: 1.5 }}>
                    <Skeleton variant="rounded" height={40} animation="wave" />
                  </TableCell>
                </TableRow>
              ))
            : null}

          {!showSkeleton && !loading && rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
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
                    <Stack direction="row" spacing={1}>
                      <Button size="small" variant="text" onClick={() => onEdit(row)}>
                        Edit
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        variant="text"
                        disabled={busyId === row.id}
                        onClick={() => onDelete(row)}
                      >
                        Delete
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            : null}
        </TableBody>
      </Table>
    </Box>
  );
}
