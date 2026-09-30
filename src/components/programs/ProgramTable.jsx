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

import { formatPesoAmount } from 'src/config/enrollment-payment';

const SKELETON_ROWS = 5;

export function ProgramTable({
  programs = [],
  loading = false,
  resolveBannerSrc,
  onEdit,
  onDelete,
  busyId = null,
  emptyMessage = 'No programs found',
}) {
  const showSkeleton = loading && (!Array.isArray(programs) || programs.length === 0);

  return (
    <Box sx={{ position: 'relative' }}>
      {loading && programs.length > 0 ? (
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
          opacity: loading && programs.length > 0 ? 0.72 : 1,
          transition: (theme) => theme.transitions.create('opacity', { duration: 160 }),
        }}
      >
        <TableHead>
          <TableRow>
            <TableCell>Code</TableCell>
            <TableCell>Slug</TableCell>
            <TableCell>Title</TableCell>
            <TableCell>Enrollment fee</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Banner image</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {showSkeleton
            ? Array.from({ length: SKELETON_ROWS }).map((_, i) => (
                <TableRow key={`sk-${i}`}>
                  <TableCell colSpan={7} sx={{ py: 1.5 }}>
                    <Skeleton variant="rounded" height={40} animation="wave" />
                  </TableCell>
                </TableRow>
              ))
            : null}

          {!showSkeleton && !loading && programs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                <Typography variant="body2" color="text.secondary">
                  {emptyMessage}
                </Typography>
              </TableCell>
            </TableRow>
          ) : null}

          {!showSkeleton && programs.length > 0
            ? programs.map((row) => {
                const feeValue = row.enrollmentFee ?? row.enrollment_fee;
                return (
                  <TableRow key={row.id} hover>
                    <TableCell>{row.code}</TableCell>
                    <TableCell>{row.slug ?? '—'}</TableCell>
                    <TableCell>{row.title}</TableCell>
                    <TableCell>
                      {feeValue != null && Number.isFinite(Number(feeValue))
                        ? formatPesoAmount(Number(feeValue))
                        : '—'}
                    </TableCell>
                    <TableCell>{row.status ?? 'active'}</TableCell>
                    <TableCell>
                      {row.bannerUrl || row.bannerPath ? (
                        <Box
                          component="img"
                          src={resolveBannerSrc(row.bannerUrl || row.bannerPath)}
                          alt={`${row.title} banner`}
                          sx={{ width: 120, height: 56, objectFit: 'cover', borderRadius: 1 }}
                        />
                      ) : (
                        '—'
                      )}
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1} sx={{ flexWrap: 'nowrap' }}>
                        <Button
                          size="small"
                          variant="text"
                          component={RouterLink}
                          href={paths.dashboard.settingProgramApplicants(row.id)}
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
                );
              })
            : null}
        </TableBody>
      </Table>
    </Box>
  );
}
