import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import CircularProgress from '@mui/material/CircularProgress';

import axios from 'src/lib/axios';
import { lmsApi } from 'src/redux/api/lmsApi';
import { lmsEndpoints } from 'src/redux/api/lmsEndpoints';
import { getLmsAxiosErrorMessage } from 'src/lib/lms-instructor-api';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';

import { EnrollmentRejectDialog } from './enrollment-reject-dialog';

// ----------------------------------------------------------------------

function enrollmentScopeLabel(row) {
  return row?.courseId ? 'This course' : 'Entire program';
}

async function fetchApprovedRows(courseId) {
  const res = await axios.get(
    lmsEndpoints.enrollmentsPaginated({
      page: 1,
      perPage: 100,
      course: courseId,
      status: 'approved',
    })
  );
  return Array.isArray(res.data?.data) ? res.data.data : [];
}

export function CourseApprovedEnrollmentsDialog({ open, courseId, courseTitle, onClose }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [busyId, setBusyId] = useState(null);
  const [removingAll, setRemovingAll] = useState(false);
  const [pendingRemove, setPendingRemove] = useState(null);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);

  const loadRows = useCallback(async () => {
    if (!courseId) {
      setRows([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await fetchApprovedRows(courseId);
      setRows(data);
    } catch (err) {
      setError(getLmsAxiosErrorMessage(err, 'Could not load enrolled students.'));
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    if (!open) {
      setPendingRemove(null);
      setRejectDialogOpen(false);
      return;
    }
    if (!courseId) {
      return;
    }
    void loadRows();
  }, [open, courseId, loadRows]);

  const openRemoveOneConfirm = useCallback(
    (row) => {
      if (!row?.id || busyId || removingAll) {
        return;
      }
      setPendingRemove(row);
      setRejectDialogOpen(true);
    },
    [busyId, removingAll]
  );

  const openRemoveAllConfirm = useCallback(() => {
    if (rows.length === 0 || busyId || removingAll) {
      return;
    }
    setPendingRemove(null);
    setRejectDialogOpen(true);
  }, [rows.length, busyId, removingAll]);

  const handleConfirmReject = useCallback(
    async (rejectionReason) => {
      if (busyId || removingAll) {
        return;
      }

      if (pendingRemove?.id) {
        const row = pendingRemove;
        setBusyId(row.id);
        try {
          await lmsApi.updateEnrollmentStatus({
            enrollmentId: row.id,
            status: 'rejected',
            rejectionReason,
          });
          setRows((prev) => prev.filter((item) => item.id !== row.id));
          toast.success(`${row.userName || 'Learner'} removed from approved enrollments.`);
          setRejectDialogOpen(false);
          setPendingRemove(null);
        } catch (err) {
          toast.error(getLmsAxiosErrorMessage(err, 'Could not remove enrollment.'));
        } finally {
          setBusyId(null);
        }
        return;
      }

      setRemovingAll(true);
      const count = rows.length;
      try {
        await Promise.all(
          rows.map((row) =>
            lmsApi.updateEnrollmentStatus({
              enrollmentId: row.id,
              status: 'rejected',
              rejectionReason,
            })
          )
        );
        setRows([]);
        toast.success(
          count === 1 ? 'Removed 1 approved enrollment.' : `Removed ${count} approved enrollments.`
        );
        setRejectDialogOpen(false);
        setPendingRemove(null);
      } catch (err) {
        toast.error(getLmsAxiosErrorMessage(err, 'Could not remove all enrollments.'));
        await loadRows();
      } finally {
        setRemovingAll(false);
      }
    },
    [busyId, removingAll, pendingRemove, rows, loadRows]
  );

  const title = courseTitle ? `Approved enrollments — ${courseTitle}` : 'Approved enrollments';
  const actionsBusy = Boolean(busyId) || removingAll;

  return (
    <Dialog open={open} onClose={actionsBusy ? undefined : onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ pb: 1 }}>{title}</DialogTitle>
      <DialogContent dividers>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Learners with an approved application for this course, including whole-program approvals in
          the same program. Use Remove to revoke access (enrollment status becomes rejected).
        </Typography>

        {loading ? (
          <Stack alignItems="center" py={4}>
            <CircularProgress size={32} />
          </Stack>
        ) : null}

        {!loading && error ? (
          <Typography variant="body2" color="error">
            {error}
          </Typography>
        ) : null}

        {!loading && !error && rows.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No approved enrollments for this course yet.
          </Typography>
        ) : null}

        {!loading && !error && rows.length > 0 ? (
          <Box sx={{ overflowX: 'auto' }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Learner</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Submitted</TableCell>
                  <TableCell>Scope</TableCell>
                  <TableCell align="right" sx={{ width: 88 }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => {
                  const rowBusy = busyId === row.id;
                  return (
                    <TableRow key={row.id}>
                      <TableCell>{row.userName || '—'}</TableCell>
                      <TableCell>{row.userEmail || '—'}</TableCell>
                      <TableCell>{row.submittedAt || '—'}</TableCell>
                      <TableCell>
                        <Chip size="small" label={enrollmentScopeLabel(row)} variant="outlined" />
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="Remove enrollment">
                          <span>
                            <IconButton
                              size="small"
                              color="error"
                              disabled={actionsBusy}
                              aria-label={`Remove ${row.userName || 'learner'}`}
                              onClick={() => openRemoveOneConfirm(row)}
                            >
                              {rowBusy ? (
                                <CircularProgress size={18} color="inherit" />
                              ) : (
                                <Iconify icon="solar:trash-bin-trash-bold" width={18} />
                              )}
                            </IconButton>
                          </span>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Box>
        ) : null}
      </DialogContent>
      <DialogActions sx={{ flexWrap: 'wrap', gap: 1 }}>
        {!loading && !error && rows.length > 0 ? (
          <Button
            color="error"
            variant="outlined"
            disabled={actionsBusy}
            onClick={openRemoveAllConfirm}
            startIcon={removingAll ? <CircularProgress size={16} color="inherit" /> : null}
          >
            {removingAll ? 'Removing…' : 'Remove all'}
          </Button>
        ) : null}
        <Box sx={{ flex: 1 }} />
        <Button onClick={onClose} disabled={actionsBusy}>
          Close
        </Button>
      </DialogActions>

      <EnrollmentRejectDialog
        open={rejectDialogOpen}
        learnerName={
          pendingRemove?.userName ??
          (rows.length > 1 ? `all ${rows.length} learners` : rows[0]?.userName ?? '')
        }
        submitting={actionsBusy}
        onClose={() => {
          if (!actionsBusy) {
            setRejectDialogOpen(false);
            setPendingRemove(null);
          }
        }}
        onConfirm={(rejectionReason) => void handleConfirmReject(rejectionReason)}
      />
    </Dialog>
  );
}
