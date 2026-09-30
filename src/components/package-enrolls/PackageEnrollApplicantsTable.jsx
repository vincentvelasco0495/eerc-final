import { useState } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
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

import {
  PAYMENT_VERIFICATION,
  paymentVerificationLabel,
} from 'src/features/enrollment/utils/enrollment-payments';

import { EnrollmentApplicationDialog } from 'src/components/enrollments/enrollment-application-dialog';

const SKELETON_ROWS = 5;

const STATUS_COLOR = {
  approved: 'success',
  pending: 'warning',
  rejected: 'error',
  hold: 'info',
};

function packagePaymentStatusLabel(status) {
  const raw = String(status ?? '').trim().toLowerCase();
  if (!raw || raw === 'none') {
    return 'None';
  }
  return paymentVerificationLabel(raw);
}

function packagePaymentStatusColor(status) {
  const raw = String(status ?? '').trim().toLowerCase();
  if (raw === PAYMENT_VERIFICATION.CORRECT) {
    return 'success';
  }
  if (raw === PAYMENT_VERIFICATION.INVALID) {
    return 'error';
  }
  if (raw === PAYMENT_VERIFICATION.PENDING) {
    return 'warning';
  }
  return 'default';
}

export function PackageEnrollApplicantsTable({
  applicants = [],
  loading = false,
  emptyMessage = 'No applicants selected this package yet',
}) {
  const [viewTargetId, setViewTargetId] = useState(null);
  const showSkeleton = loading && (!Array.isArray(applicants) || applicants.length === 0);

  return (
    <Box sx={{ position: 'relative' }}>
      {loading && applicants.length > 0 ? (
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
          opacity: loading && applicants.length > 0 ? 0.72 : 1,
          transition: (theme) => theme.transitions.create('opacity', { duration: 160 }),
        }}
      >
        <TableHead>
          <TableRow>
            <TableCell>Applicant name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Program</TableCell>
            <TableCell>Enrollment batch</TableCell>
            <TableCell>Branch</TableCell>
            <TableCell>Learning mode</TableCell>
            <TableCell>Application date</TableCell>
            <TableCell>Application status</TableCell>
            <TableCell>Payment status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {showSkeleton
            ? Array.from({ length: SKELETON_ROWS }).map((_, i) => (
                <TableRow key={`sk-${i}`}>
                  <TableCell colSpan={10} sx={{ py: 1.5 }}>
                    <Skeleton variant="rounded" height={40} animation="wave" />
                  </TableCell>
                </TableRow>
              ))
            : null}

          {!showSkeleton && !loading && applicants.length === 0 ? (
            <TableRow>
              <TableCell colSpan={10} align="center" sx={{ py: 6 }}>
                <Typography variant="body2" color="text.secondary">
                  {emptyMessage}
                </Typography>
              </TableCell>
            </TableRow>
          ) : null}

          {!showSkeleton && applicants.length > 0
            ? applicants.map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell>{row.userName || '—'}</TableCell>
                  <TableCell>{row.userEmail || '—'}</TableCell>
                  <TableCell>{row.programTitle || row.programId || '—'}</TableCell>
                  <TableCell>{row.batchName || '—'}</TableCell>
                  <TableCell>{row.branchName || '—'}</TableCell>
                  <TableCell>{row.learningModeName || '—'}</TableCell>
                  <TableCell>{row.appliedAt || row.submittedAt || '—'}</TableCell>
                  <TableCell>
                    <Chip
                      label={row.status || '—'}
                      size="small"
                      color={STATUS_COLOR[row.status] ?? 'default'}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={packagePaymentStatusLabel(row.paymentStatus)}
                      size="small"
                      color={packagePaymentStatusColor(row.paymentStatus)}
                      variant={
                        String(row.paymentStatus ?? '').trim().toLowerCase() === 'none' ||
                        !row.paymentStatus
                          ? 'outlined'
                          : 'filled'
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1} sx={{ flexWrap: 'nowrap' }}>
                      <Button size="small" variant="text" onClick={() => setViewTargetId(row.id)}>
                        View Details
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            : null}
        </TableBody>
      </Table>

      <EnrollmentApplicationDialog
        open={Boolean(viewTargetId)}
        enrollmentId={viewTargetId}
        onClose={() => setViewTargetId(null)}
      />
    </Box>
  );
}
