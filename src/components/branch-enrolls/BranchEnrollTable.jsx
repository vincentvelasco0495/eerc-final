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

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { htmlToPlainText } from 'src/utils/html-content';

const SKELETON_ROWS = 5;

function truncateDescription(value, max = 72) {
  const text = htmlToPlainText(value);
  if (!text) {
    return '—';
  }
  if (text.length <= max) {
    return text;
  }
  return `${text.slice(0, max).trimEnd()}…`;
}

export function BranchEnrollTable({
  rows = [],
  loading = false,
  onEdit,
  onDelete,
  busyId = null,
  emptyMessage = 'No branches found',
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
            <TableCell>Status</TableCell>
            <TableCell>Sort order</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Applications</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {showSkeleton
            ? Array.from({ length: SKELETON_ROWS }).map((_, i) => (
                <TableRow key={`sk-${i}`}>
                  <TableCell colSpan={6} sx={{ py: 1.5 }}>
                    <Skeleton variant="rounded" height={40} animation="wave" />
                  </TableCell>
                </TableRow>
              ))
            : null}

          {!showSkeleton && !loading && rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
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
                  <TableCell>{row.status ?? 'active'}</TableCell>
                  <TableCell>{row.sortOrder ?? 1}</TableCell>
                  <TableCell>{truncateDescription(row.description)}</TableCell>
                  <TableCell>{row.applicantCount ?? 0}</TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1} sx={{ flexWrap: 'nowrap' }}>
                      <Button
                        size="small"
                        variant="text"
                        component={RouterLink}
                        href={paths.dashboard.settingBranchEnrollApplicants(row.id)}
                      >
                        View Applicants
                      </Button>
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
