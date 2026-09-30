import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import TableContainer from '@mui/material/TableContainer';

import { enrollmentHasUnreviewedPayments } from 'src/features/enrollment/utils/enrollment-payments';

const STATUS_COLOR = {
  approved: 'success',
  pending: 'warning',
  rejected: 'error',
  hold: 'info',
};

function DetailItem({ label, value }) {
  return (
    <Box sx={{ minWidth: 0 }}>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
        {value || '—'}
      </Typography>
    </Box>
  );
}

export function EnrollmentLearnerDetailsDialog({
  open,
  learner,
  canManage = false,
  busyId = null,
  onClose,
  onView,
  onReject,
  onPaymentHistory,
  onStatusChange,
}) {
  const enrollments = Array.isArray(learner?.enrollments) ? learner.enrollments : [];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Learner details</DialogTitle>
      <DialogContent dividers>
        {learner ? (
          <Stack spacing={2.5}>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              useFlexGap
              flexWrap="wrap"
            >
              <DetailItem label="Learner" value={learner.userName} />
              <DetailItem label="Email" value={learner.userEmail} />
              <DetailItem label="Phone" value={learner.phoneNumber} />
              <DetailItem label="School" value={learner.schoolHeld} />
            </Stack>

            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Program applications
              </Typography>
              <TableContainer sx={{ overflowX: 'auto' }}>
                <Table size="small" sx={{ minWidth: 640 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Program</TableCell>
                      <TableCell>Submitted</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {enrollments.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                          <Typography variant="body2" color="text.secondary">
                            No program applications found for this learner.
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      enrollments.map((row) => {
                        const isBusy = busyId === row.id;
                        const isApproved = row.status === 'approved';
                        const isRejected = row.status === 'rejected';
                        const isHold = row.status === 'hold';
                        const highlight = enrollmentHasUnreviewedPayments(row);

                        return (
                          <TableRow
                            key={row.id}
                            hover
                            sx={
                              highlight
                                ? {
                                    bgcolor: (theme) =>
                                      `rgb(${theme.vars.palette.warning.mainChannel} / 0.16)`,
                                  }
                                : undefined
                            }
                          >
                            <TableCell>
                              <Typography variant="body2">
                                {row.programTitle || row.programId || '—'}
                              </Typography>
                              {row.courseTitle ? (
                                <Typography variant="caption" color="text.secondary">
                                  {row.courseTitle}
                                </Typography>
                              ) : null}
                            </TableCell>
                            <TableCell>{row.submittedAt || '—'}</TableCell>
                            <TableCell>
                              <Chip
                                label={row.status}
                                size="small"
                                color={STATUS_COLOR[row.status] ?? 'default'}
                              />
                            </TableCell>
                            <TableCell align="right">
                              <Stack
                                direction="row"
                                spacing={1}
                                justifyContent="flex-end"
                                flexWrap="wrap"
                                useFlexGap
                              >
                                <Button
                                  size="small"
                                  variant="outlined"
                                  disabled={isBusy}
                                  onClick={() => onView?.(row.id)}
                                >
                                  View
                                </Button>
                                {canManage ? (
                                  <>
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
                                      onClick={() => onReject?.(row)}
                                    >
                                      Reject
                                    </Button>
                                  </>
                                ) : null}
                              </Stack>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Stack>
        ) : null}
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
