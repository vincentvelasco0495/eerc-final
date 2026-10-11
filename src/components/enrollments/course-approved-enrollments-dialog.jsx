import { useMemo, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Tooltip from '@mui/material/Tooltip';
import Checkbox from '@mui/material/Checkbox';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import CircularProgress from '@mui/material/CircularProgress';

import { lmsApi } from 'src/redux/api/lmsApi';
import { getLmsAxiosErrorMessage } from 'src/lib/lms-instructor-api';
import { shortLearningModeLabel } from 'src/features/enrollment/utils/enrollment-learning-mode';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';

const STATUS_COLOR = {
  approved: 'success',
  pending: 'warning',
  hold: 'info',
  rejected: 'error',
};

function matchesSearch(row, search) {
  if (!search) {
    return true;
  }
  const haystack = `${row.userName ?? ''} ${row.userEmail ?? ''} ${row.status ?? ''}`.toLowerCase();
  return haystack.includes(search);
}

export function CourseEnrollmentsDialog({ open, courseId, courseTitle, onClose }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchDraft, setSearchDraft] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [busy, setBusy] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);

  const loadRows = useCallback(async () => {
    if (!courseId) {
      setRows([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const payload = await lmsApi.fetchCourseEnrollments(courseId);
      setRows(Array.isArray(payload?.data) ? payload.data : []);
      setSelectedIds([]);
    } catch (err) {
      setError(getLmsAxiosErrorMessage(err, 'Could not load enrolled students.'));
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    if (!open) {
      setSearchDraft('');
      setSelectedIds([]);
      setPendingDelete(null);
      return;
    }
    if (!courseId) {
      return;
    }
    void loadRows();
  }, [open, courseId, loadRows]);

  const search = searchDraft.trim().toLowerCase();
  const visibleRows = useMemo(
    () => rows.filter((row) => matchesSearch(row, search)),
    [rows, search]
  );
  const visibleIds = visibleRows.map((row) => row.id);
  const selectedVisibleCount = visibleIds.filter((id) => selectedIds.includes(id)).length;
  const allVisibleSelected =
    visibleRows.length > 0 && selectedVisibleCount === visibleRows.length;

  const toggleAllVisible = () => {
    if (allVisibleSelected) {
      setSelectedIds((prev) => prev.filter((id) => !visibleIds.includes(id)));
      return;
    }
    setSelectedIds((prev) => [...new Set([...prev, ...visibleIds])]);
  };

  const toggleRow = (rowId) => {
    setSelectedIds((prev) =>
      prev.includes(rowId) ? prev.filter((id) => id !== rowId) : [...prev, rowId]
    );
  };

  const handleConfirmDelete = async () => {
    if (!pendingDelete || busy) {
      return;
    }
    const ids =
      pendingDelete.kind === 'one'
        ? [pendingDelete.row.id]
        : pendingDelete.kind === 'selected'
          ? selectedIds
          : rows.map((row) => row.id);
    if (ids.length === 0) {
      setPendingDelete(null);
      return;
    }
    setBusy(true);
    try {
      if (ids.length === 1) {
        await lmsApi.deleteEnrollment(ids[0]);
      } else {
        await lmsApi.deleteEnrollments(ids);
      }
      setRows((prev) => prev.filter((row) => !ids.includes(row.id)));
      setSelectedIds((prev) => prev.filter((id) => !ids.includes(id)));
      toast.success(
        ids.length === 1
          ? `${pendingDelete.row?.userName || 'Learner'} was removed from this course.`
          : `Removed ${ids.length} course enrollments.`
      );
      setPendingDelete(null);
    } catch (err) {
      toast.error(getLmsAxiosErrorMessage(err, 'Could not delete enrollment.'));
    } finally {
      setBusy(false);
    }
  };

  const title = courseTitle ? `Enrolled students — ${courseTitle}` : 'Enrolled students';
  const confirmCount =
    pendingDelete?.kind === 'one'
      ? 1
      : pendingDelete?.kind === 'selected'
        ? selectedIds.length
        : rows.length;

  return (
    <>
      <Dialog open={open} onClose={busy ? undefined : onClose} maxWidth="md" fullWidth>
        <DialogTitle sx={{ pb: 1 }}>{title}</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Students with a pending, on-hold, or approved access request for this course. Deleting a
            row removes that course access only; the program enrollment stays.
          </Typography>

          <TextField
            size="small"
            label="Search"
            placeholder="Name, email, or status…"
            value={searchDraft}
            onChange={(event) => setSearchDraft(event.target.value)}
            sx={{ mb: 2, maxWidth: 360 }}
          />

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

          {!loading && !error && visibleRows.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              {rows.length === 0
                ? 'No students have enrolled or been approved for this course yet.'
                : 'No students match your search.'}
            </Typography>
          ) : null}

          {!loading && !error && visibleRows.length > 0 ? (
            <Box sx={{ overflowX: 'auto' }}>
              <Table size="small" sx={{ minWidth: 720 }}>
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox" sx={{ width: 48 }}>
                      <Checkbox
                        size="small"
                        checked={allVisibleSelected}
                        indeterminate={selectedVisibleCount > 0 && !allVisibleSelected}
                        onChange={toggleAllVisible}
                        inputProps={{ 'aria-label': 'Select all enrolled students' }}
                      />
                    </TableCell>
                    <TableCell>Learner</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Mode of learning</TableCell>
                    <TableCell>Submitted</TableCell>
                    <TableCell align="right" sx={{ width: 88 }}>
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {visibleRows.map((row) => {
                    const checked = selectedIds.includes(row.id);
                    return (
                      <TableRow key={row.id} hover selected={checked}>
                        <TableCell padding="checkbox">
                          <Checkbox
                            size="small"
                            checked={checked}
                            onChange={() => toggleRow(row.id)}
                            inputProps={{ 'aria-label': `Select ${row.userName || 'learner'}` }}
                          />
                        </TableCell>
                        <TableCell>{row.userName || '—'}</TableCell>
                        <TableCell>{row.userEmail || '—'}</TableCell>
                        <TableCell>
                          <Chip
                            size="small"
                            label={row.status}
                            color={STATUS_COLOR[row.status] ?? 'default'}
                          />
                        </TableCell>
                        <TableCell>
                          {shortLearningModeLabel(row.learningModeId, row.learningModeName)}
                        </TableCell>
                        <TableCell>{row.submittedAt || '—'}</TableCell>
                        <TableCell align="right">
                          <Tooltip title="Delete enrollment">
                            <span>
                              <IconButton
                                size="small"
                                color="error"
                                disabled={busy}
                                aria-label={`Delete ${row.userName || 'learner'}`}
                                onClick={() => setPendingDelete({ kind: 'one', row })}
                              >
                                <Iconify icon="solar:trash-bin-trash-bold" width={18} />
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
            <>
              <Button
                color="error"
                variant="outlined"
                disabled={busy || selectedIds.length === 0}
                onClick={() => setPendingDelete({ kind: 'selected' })}
              >
                Delete selected ({selectedIds.length})
              </Button>
              <Button
                color="error"
                variant="contained"
                disabled={busy}
                onClick={() => setPendingDelete({ kind: 'all' })}
              >
                Delete all ({rows.length})
              </Button>
            </>
          ) : null}
          <Box sx={{ flex: 1 }} />
          <Button onClick={onClose} disabled={busy}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        onClose={() => {
          if (!busy) {
            setPendingDelete(null);
          }
        }}
        title={confirmCount === 1 ? 'Delete enrollment' : 'Delete enrollments'}
        content={
          pendingDelete?.kind === 'one' ? (
            <>
              Delete <strong>{pendingDelete.row?.userName || 'this learner'}</strong> from this
              course? They will lose course access and can request it again.
            </>
          ) : pendingDelete?.kind === 'selected' ? (
            <>
              Delete <strong>{selectedIds.length}</strong> selected course enrollment
              {selectedIds.length === 1 ? '' : 's'}? Those learners will lose access to this course.
            </>
          ) : (
            <>
              Delete all <strong>{rows.length}</strong> course enrollment
              {rows.length === 1 ? '' : 's'} for this course? Learners will lose access and can
              request it again.
            </>
          )
        }
        action={
          <Button variant="contained" color="error" onClick={handleConfirmDelete} disabled={busy}>
            {busy ? 'Deleting…' : 'Delete'}
          </Button>
        }
      />
    </>
  );
}

export function CourseApprovedEnrollmentsDialog(props) {
  return <CourseEnrollmentsDialog {...props} />;
}
