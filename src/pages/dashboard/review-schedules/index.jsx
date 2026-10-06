import { useSearchParams } from 'react-router';
import { useRef, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';

import { useLmsActions, useLmsBranchEnrolls, useLmsReviewSchedulesPaginated } from 'src/hooks/use-lms';

import { CONFIG } from 'src/global-config';
import { downloadLmsExcelExport } from 'src/lib/lms-excel-export';
import { getLmsAxiosErrorMessage } from 'src/lib/lms-instructor-api';
import { InstructorWorkspaceShell } from 'src/features/instructor-profile/components/instructor-workspace-shell';
import {
  normalizeReviewSchedulePage,
  normalizeReviewSchedulePerPage,
} from 'src/services/reviewScheduleService';

import { toast } from 'src/components/snackbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { ExportExcelButton } from 'src/components/export-excel-button';
import { ReviewScheduleTable } from 'src/components/review-schedules/ReviewScheduleTable';
import { ServerListPagination, ServerListPerPageControl } from 'src/components/server-pagination';

const DEFAULT_FORM = {
  branchEnrollId: '',
  name: '',
  description: '',
  status: 'active',
  sortOrder: '1',
  studentCapacity: '30',
};

export default function ReviewSchedulesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = normalizeReviewSchedulePage(searchParams.get('page'));
  const perPage = normalizeReviewSchedulePerPage(searchParams.get('per_page'));

  const [searchDraft, setSearchDraft] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const prevDebouncedSearch = useRef(debouncedSearch);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchDraft.trim()), 400);
    return () => clearTimeout(t);
  }, [searchDraft]);

  useEffect(() => {
    if (prevDebouncedSearch.current === debouncedSearch) {
      return;
    }
    prevDebouncedSearch.current = debouncedSearch;
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set('page', '1');
        return next;
      },
      { replace: true }
    );
  }, [debouncedSearch, setSearchParams]);

  const {
    reviewSchedules,
    meta,
    isLoading: listLoading,
    error: listError,
    mutate: mutateReviewSchedulesPage,
  } = useLmsReviewSchedulesPaginated(page, perPage, debouncedSearch);
  const { branchEnrolls } = useLmsBranchEnrolls();
  const { runCommand } = useLmsActions();
  const [form, setForm] = useState(DEFAULT_FORM);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [busyId, setBusyId] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDeleteRow, setPendingDeleteRow] = useState(null);

  const currentPage = meta?.current_page ?? page;
  const lastPage = meta?.last_page ?? 1;
  const total = meta?.total ?? 0;
  const rangeFrom = meta?.from ?? 0;
  const rangeTo = meta?.to ?? 0;

  const listErrorMessage =
    typeof listError === 'string' ? listError : listError?.message ?? null;

  useEffect(() => {
    if (!listErrorMessage) {
      return;
    }
    toast.error(listErrorMessage);
  }, [listErrorMessage]);

  useEffect(() => {
    if (!meta?.last_page) {
      return;
    }
    const lp = meta.last_page;
    if (page > lp) {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.set('page', String(lp));
          return next;
        },
        { replace: true }
      );
    }
  }, [meta, page, setSearchParams]);

  const goToPage = useCallback(
    (nextPage) => {
      const lp = Math.max(1, lastPage);
      const safe = Math.max(1, Math.min(lp, nextPage));
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.set('page', String(safe));
          return next;
        },
        { replace: true }
      );
    },
    [lastPage, setSearchParams]
  );

  const changePerPage = useCallback(
    (nextPer) => {
      const normalized = normalizeReviewSchedulePerPage(nextPer);
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.set('per_page', String(normalized));
          next.set('page', '1');
          return next;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );

  const canSubmit =
    form.branchEnrollId.trim() !== '' &&
    form.name.trim() !== '' &&
    Number.parseInt(String(form.studentCapacity ?? ''), 10) >= 1;

  const handleChange = (key) => (event) =>
    setForm((prev) => ({
      ...prev,
      [key]: event.target.value,
    }));

  const resetForm = () => {
    setForm(DEFAULT_FORM);
    setEditingId(null);
  };

  const handleSubmit = async () => {
    if (!canSubmit) {
      toast.error('Branch, schedule label, and student capacity are required.');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        branchEnrollId: form.branchEnrollId.trim(),
        name: form.name.trim(),
        description: form.description.trim() || null,
        status: form.status,
        sortOrder: Number.parseInt(String(form.sortOrder ?? '1'), 10) || 1,
        studentCapacity: Number.parseInt(String(form.studentCapacity ?? '1'), 10) || 1,
      };

      if (editingId) {
        await runCommand('reviewSchedule.update', { publicId: editingId, body: payload });
        toast.success('Review schedule updated.');
      } else {
        await runCommand('reviewSchedule.create', payload);
        toast.success('Review schedule created.');
      }

      await mutateReviewSchedulesPage();
      resetForm();
    } catch (err) {
      toast.error(getLmsAxiosErrorMessage(err, 'Could not save review schedule.'));
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (row) => {
    setEditingId(row.id);
    setForm({
      branchEnrollId: row.branchEnrollId ?? '',
      name: row.name ?? '',
      description: row.description ?? '',
      status: row.status === 'inactive' ? 'inactive' : 'active',
      sortOrder: String(row.sortOrder ?? 1),
      studentCapacity: String(row.studentCapacity ?? 30),
    });
  };

  const handleDelete = async () => {
    const scheduleId = pendingDeleteRow?.id;
    if (!scheduleId) {
      return;
    }

    setBusyId(scheduleId);
    try {
      await runCommand('reviewSchedule.delete', { publicId: scheduleId });
      toast.success('Review schedule deleted.');
      setConfirmOpen(false);
      setPendingDeleteRow(null);
      await mutateReviewSchedulesPage();
    } catch (err) {
      toast.error(getLmsAxiosErrorMessage(err, 'Could not delete review schedule.'));
    } finally {
      setBusyId(null);
    }
  };

  return (
    <>
      <title>{`Review schedule | Dashboard - ${CONFIG.appName}`}</title>
      <InstructorWorkspaceShell>
        <Stack spacing={3}>
          <Box>
            <Typography variant="h4">Review schedule</Typography>
            <Typography variant="body2" color="text.secondary">
              Manage review schedule options shown to students during enrollment (face-to-face class
              times for blended learning).
            </Typography>
          </Box>

          <Card>
            <CardContent>
              <Stack spacing={2}>
                <Typography variant="h6">
                  {editingId ? 'Edit review schedule' : 'Create new review schedule'}
                </Typography>
                <Grid container spacing={2} alignItems="stretch" columns={{ xs: 12, md: 15 }}>
                  <Grid size={{ xs: 12, md: 3 }}>
                    <Select
                      value={form.branchEnrollId}
                      onChange={handleChange('branchEnrollId')}
                      displayEmpty
                      fullWidth
                    >
                      <MenuItem value="" disabled>
                        Select branch
                      </MenuItem>
                      {(branchEnrolls ?? []).map((branch) => (
                        <MenuItem key={branch.id} value={branch.id}>
                          {branch.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </Grid>
                  <Grid size={{ xs: 12, md: 5 }}>
                    <TextField
                      label="Schedule label"
                      value={form.name}
                      onChange={handleChange('name')}
                      placeholder="SECTION D TUESDAY TO FRIDAY 4:30PM TO 8:30PM"
                      fullWidth
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 2 }}>
                    <TextField
                      label="Student capacity"
                      type="number"
                      value={form.studentCapacity}
                      onChange={handleChange('studentCapacity')}
                      fullWidth
                      inputProps={{ min: 1 }}
                      helperText="Max students for this schedule"
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 2 }}>
                    <Select value={form.status} onChange={handleChange('status')} fullWidth>
                      <MenuItem value="active">active</MenuItem>
                      <MenuItem value="inactive">inactive</MenuItem>
                    </Select>
                  </Grid>
                  <Grid size={{ xs: 12, md: 3 }}>
                    <TextField
                      label="Sort order"
                      type="number"
                      value={form.sortOrder}
                      onChange={handleChange('sortOrder')}
                      fullWidth
                      inputProps={{ min: 1 }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      label="Description / notes"
                      value={form.description}
                      onChange={handleChange('description')}
                      fullWidth
                      multiline
                      minRows={3}
                    />
                  </Grid>
                </Grid>
                <Stack direction="row" spacing={1}>
                  <Button variant="contained" onClick={handleSubmit} disabled={saving || !canSubmit}>
                    {editingId ? 'Update' : 'Create'}
                  </Button>
                  {editingId ? (
                    <Button variant="outlined" onClick={resetForm} disabled={saving}>
                      Cancel edit
                    </Button>
                  ) : null}
                </Stack>
              </Stack>
            </CardContent>
          </Card>

          {listErrorMessage ? <Alert severity="error">{listErrorMessage}</Alert> : null}

          <Card>
            <CardContent>
              <Stack spacing={2}>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  flexWrap="wrap"
                  columnGap={2}
                  rowGap={1}
                >
                  <Typography variant="h6" sx={{ minWidth: 0 }}>
                    Review schedule list
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap" useFlexGap>
                    <ExportExcelButton
                      disabled={listLoading}
                      onExport={({ from, to }) =>
                        downloadLmsExcelExport(
                          '/api/review-schedules/export',
                          { search: debouncedSearch, from, to },
                          'review-schedules.xlsx'
                        )
                      }
                      successMessage="Review schedule list exported to Excel."
                    />
                    <ServerListPerPageControl
                      perPage={perPage}
                      onPerPageChange={changePerPage}
                      disabled={listLoading}
                    />
                  </Stack>
                </Stack>
                <TextField
                  size="small"
                  label="Search"
                  placeholder="Filter by branch, schedule label, or description…"
                  value={searchDraft}
                  onChange={(e) => setSearchDraft(e.target.value)}
                  sx={{ maxWidth: { xs: '100%', sm: 360 } }}
                />
                <ReviewScheduleTable
                  rows={reviewSchedules}
                  loading={listLoading}
                  onEdit={handleEdit}
                  onDelete={(row) => {
                    setPendingDeleteRow(row);
                    setConfirmOpen(true);
                  }}
                  busyId={busyId}
                  emptyMessage={
                    debouncedSearch
                      ? 'No review schedules match your search.'
                      : 'No review schedules found'
                  }
                />
                <ServerListPagination
                  page={currentPage}
                  lastPage={lastPage}
                  total={total}
                  from={rangeFrom}
                  to={rangeTo}
                  onPageChange={goToPage}
                  disabled={listLoading}
                />
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      </InstructorWorkspaceShell>
      <ConfirmDialog
        open={confirmOpen}
        onClose={() => {
          setConfirmOpen(false);
          setPendingDeleteRow(null);
        }}
        title="Delete review schedule"
        content={
          <>
            Delete schedule <strong>{pendingDeleteRow?.name ?? ''}</strong>? This action cannot be
            undone.
          </>
        }
        action={
          <Button variant="contained" color="error" onClick={handleDelete} disabled={!!busyId}>
            Delete
          </Button>
        }
      />
    </>
  );
}
