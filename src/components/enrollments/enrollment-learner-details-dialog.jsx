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

import { shortLearningModeLabel } from 'src/features/enrollment/utils/enrollment-learning-mode';
import { enrollmentHasUnreviewedPayments } from 'src/features/enrollment/utils/enrollment-payments';

import { EnrollmentRowActions } from './enrollment-row-actions';
import { useFullScreenDialog, stackedDialogActionsSx } from './use-full-screen-dialog';

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

function highlightSx(highlight) {
  if (!highlight) {
    return undefined;
  }
  return {
    bgcolor: (theme) => `rgb(${theme.vars.palette.warning.mainChannel} / 0.16)`,
  };
}

function LearningModeBlock({ row, canManage, isBusy, onSwitchLearningMode, wrap = false }) {
  const modeLabel = shortLearningModeLabel(row.learningModeId, row.learningModeName);

  return (
    <Stack spacing={0.25} alignItems="flex-start">
      <Typography
        variant="body2"
        title={row.learningModeName || undefined}
        noWrap={!wrap}
        sx={wrap ? { overflowWrap: 'anywhere' } : { maxWidth: 180 }}
      >
        {modeLabel}
      </Typography>
      {canManage ? (
        <Button
          size="small"
          variant="text"
          disabled={isBusy}
          onClick={() => onSwitchLearningMode?.(row)}
          sx={{ px: 0.5, minWidth: 0, textTransform: 'none' }}
        >
          Switch
        </Button>
      ) : null}
    </Stack>
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
  onSwitchLearningMode,
}) {
  const fullScreen = useFullScreenDialog();
  const enrollments = Array.isArray(learner?.enrollments) ? learner.enrollments : [];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth fullScreen={fullScreen}>
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
              {fullScreen ? (
                <Stack spacing={1.25}>
                  {enrollments.length === 0 ? (
                    <Typography variant="body2" color="text.secondary" sx={{ py: 3, textAlign: 'center' }}>
                      No program applications found for this learner.
                    </Typography>
                  ) : (
                    enrollments.map((row) => {
                      const isBusy = busyId === row.id;
                      const highlight = enrollmentHasUnreviewedPayments(row);

                      return (
                        <Box
                          key={row.id}
                          sx={{
                            p: 1.5,
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: 1.5,
                            ...highlightSx(highlight),
                          }}
                        >
                          <Stack spacing={1}>
                            <Box>
                              <Typography variant="body2" sx={{ overflowWrap: 'anywhere' }}>
                                {row.programTitle || row.programId || '—'}
                              </Typography>
                              {row.courseTitle ? (
                                <Typography variant="caption" color="text.secondary">
                                  {row.courseTitle}
                                </Typography>
                              ) : null}
                            </Box>
                            <Stack
                              direction="row"
                              spacing={1}
                              alignItems="center"
                              justifyContent="space-between"
                              flexWrap="wrap"
                              useFlexGap
                            >
                              <LearningModeBlock
                                row={row}
                                canManage={canManage}
                                isBusy={isBusy}
                                onSwitchLearningMode={onSwitchLearningMode}
                                wrap
                              />
                              <Chip
                                label={row.status}
                                size="small"
                                color={STATUS_COLOR[row.status] ?? 'default'}
                              />
                            </Stack>
                            <Typography variant="caption" color="text.secondary">
                              Submitted {row.submittedAt || '—'}
                            </Typography>
                            <EnrollmentRowActions
                              row={row}
                              canManage={canManage}
                              isBusy={isBusy}
                              compact
                              onStatusChange={onStatusChange}
                              onView={onView}
                              onReject={onReject}
                              onPaymentHistory={onPaymentHistory}
                            />
                          </Stack>
                        </Box>
                      );
                    })
                  )}
                </Stack>
              ) : (
                <TableContainer sx={{ overflowX: 'auto' }}>
                  <Table size="small" sx={{ minWidth: 760 }}>
                    <TableHead>
                      <TableRow>
                        <TableCell>Program</TableCell>
                        <TableCell>Mode of learning</TableCell>
                        <TableCell>Submitted</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {enrollments.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                            <Typography variant="body2" color="text.secondary">
                              No program applications found for this learner.
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ) : (
                        enrollments.map((row) => {
                          const isBusy = busyId === row.id;
                          const highlight = enrollmentHasUnreviewedPayments(row);

                          return (
                            <TableRow key={row.id} hover sx={highlightSx(highlight)}>
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
                              <TableCell>
                                <LearningModeBlock
                                  row={row}
                                  canManage={canManage}
                                  isBusy={isBusy}
                                  onSwitchLearningMode={onSwitchLearningMode}
                                />
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
                                <EnrollmentRowActions
                                  row={row}
                                  canManage={canManage}
                                  isBusy={isBusy}
                                  onStatusChange={onStatusChange}
                                  onView={onView}
                                  onReject={onReject}
                                  onPaymentHistory={onPaymentHistory}
                                />
                              </TableCell>
                            </TableRow>
                          );
                        })
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Box>
          </Stack>
        ) : null}
      </DialogContent>
      <DialogActions sx={stackedDialogActionsSx}>
        <Button variant="contained" onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
