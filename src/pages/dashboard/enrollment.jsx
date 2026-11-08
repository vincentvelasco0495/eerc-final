import { useSearchParams } from 'react-router';
import { useRef, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import CardContent from '@mui/material/CardContent';

import { useLmsUser, useLmsPrograms, useLmsEnrollmentsPaginated } from 'src/hooks/use-lms';

import { CONFIG } from 'src/global-config';
import { getLmsAxiosErrorMessage } from 'src/lib/lms-instructor-api';
import { lmsApi, fetchEnrollmentExcelExport } from 'src/redux/api/lmsApi';
import { downloadBlob } from 'src/features/enrollment/utils/enrollment-excel';
import { normalizeProgramsPage, normalizeProgramsPerPage } from 'src/services/programService';
import { enrollmentSelectionId, enrollmentIdsForSelection } from 'src/features/enrollment/utils/enrollment-rows';
import { InstructorWorkspaceShell } from 'src/features/instructor-profile/components/instructor-workspace-shell';

import { toast } from 'src/components/snackbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { ExportExcelButton } from 'src/components/export-excel-button';
import { EnrollmentTable } from 'src/components/enrollments/EnrollmentTable';
import { ServerListPagination, ServerListPerPageControl } from 'src/components/server-pagination';

import { useAuthContext } from 'src/auth/hooks';

export default function EnrollmentPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = normalizeProgramsPage(searchParams.get('page'));
  const perPage = normalizeProgramsPerPage(searchParams.get('per_page'));

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
    enrollments,
    meta,
    isLoading: listLoading,
    error: listError,
    mutate: mutateEnrollmentsPage,
  } = useLmsEnrollmentsPaginated(page, perPage, debouncedSearch);
  const { user } = useLmsUser();
  const { user: authUser } = useAuthContext();
  const { programs } = useLmsPrograms();
  const [busyId, setBusyId] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDeleteRows, setPendingDeleteRows] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [exportProgramId, setExportProgramId] = useState('');

  const normalizeRole = (account) =>
    typeof account?.role === 'string' ? account.role.trim().toLowerCase() : '';

  const effectiveRole = normalizeRole(user) || normalizeRole(authUser);

  const currentPage = meta?.current_page ?? page;
  const lastPage = meta?.last_page ?? 1;
  const total = meta?.total ?? 0;
  const rangeFrom = meta?.from ?? 0;
  const rangeTo = meta?.to ?? 0;

  const listErrorMessage =
    typeof listError === 'string' ? listError : listError?.message ?? null;

  useEffect(() => {
    const visibleIds = new Set(enrollments.map((row) => enrollmentSelectionId(row)).filter(Boolean));
    setSelectedIds((current) => {
      const next = current.filter((id) => visibleIds.has(id));
      return next.length === current.length ? current : next;
    });
  }, [enrollments]);

  const toggleEnrollmentSelection = useCallback((enrollmentId) => {
    setSelectedIds((current) =>
      current.includes(enrollmentId)
        ? current.filter((id) => id !== enrollmentId)
        : [...current, enrollmentId]
    );
  }, []);

  const toggleAllEnrollmentSelection = useCallback(
    (checked) => {
      setSelectedIds(checked ? enrollments.map((row) => enrollmentSelectionId(row)).filter(Boolean) : []);
    },
    [enrollments]
  );

  const isInstructorLike = effectiveRole === 'instructor' || effectiveRole === 'admin';

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
      const normalized = normalizeProgramsPerPage(nextPer);
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

  const handleStatusChange = useCallback(
    async (row, nextStatus, rejectionReason = '') => {
      if (!row?.id || row.status === nextStatus) {
        return;
      }
      setBusyId(row.id);
      try {
        await lmsApi.updateEnrollmentStatus({
          enrollmentId: row.id,
          status: nextStatus,
          rejectionReason,
        });
        await mutateEnrollmentsPage();
        toast.success(`Enrollment updated to "${nextStatus}".`);
      } catch (error) {
        const message =
          typeof error === 'string' ? error : error?.message ?? 'Could not update enrollment status.';
        toast.error(message);
      } finally {
        setBusyId(null);
      }
    },
    [mutateEnrollmentsPage]
  );

  const handleLearningModeChange = useCallback(
    async (row, learningMode) => {
      if (!row?.id || !learningMode) {
        return;
      }
      setBusyId(row.id);
      try {
        await lmsApi.updateEnrollmentLearningMode({
          enrollmentId: row.id,
          learningMode,
        });
        await mutateEnrollmentsPage();
        const nextLabel =
          learningMode === 'online'
            ? 'Pure online'
            : learningMode === 'blended'
              ? 'Blended'
              : 'Face to face';
        toast.success(`Mode of learning switched to ${nextLabel}.`);
      } catch (error) {
        toast.error(getLmsAxiosErrorMessage(error, 'Could not switch mode of learning.'));
      } finally {
        setBusyId(null);
      }
    },
    [mutateEnrollmentsPage]
  );

  const handleExportExcel = useCallback(async ({ from, to } = {}) => {
    const { blob, fileName } = await fetchEnrollmentExcelExport({
      search: debouncedSearch,
      program: exportProgramId,
      from,
      to,
    });
    downloadBlob(blob, fileName);
  }, [debouncedSearch, exportProgramId]);

  const handleDelete = useCallback(async () => {
    const rows = pendingDeleteRows.filter((row) => enrollmentIdsForSelection(row).length > 0);
    const ids = [...new Set(rows.flatMap((row) => enrollmentIdsForSelection(row)))];
    if (!ids.length) {
      setConfirmOpen(false);
      setPendingDeleteRows([]);
      return;
    }
    setBusyId(ids.length === 1 ? ids[0] : 'batch');
    try {
      if (ids.length === 1) {
        await lmsApi.deleteEnrollment(ids[0]);
      } else {
        const result = await lmsApi.deleteEnrollments(ids);
        const deletedCount = Number(result?.deletedCount ?? ids.length);
        if (deletedCount < ids.length) {
          toast.error(`Removed ${deletedCount}. ${ids.length - deletedCount} could not be removed.`);
          await mutateEnrollmentsPage();
          setConfirmOpen(false);
          setPendingDeleteRows([]);
          return;
        }
      }
      const removedSelectionIds = new Set(rows.map((row) => enrollmentSelectionId(row)));
      setSelectedIds((current) => current.filter((id) => !removedSelectionIds.has(id)));
      toast.success(ids.length === 1 ? 'Enrollment removed.' : `${ids.length} enrollments removed.`);
      setConfirmOpen(false);
      setPendingDeleteRows([]);
      await mutateEnrollmentsPage();
    } catch (error) {
      toast.error(getLmsAxiosErrorMessage(error, 'Could not delete enrollment.'));
    } finally {
      setBusyId(null);
    }
  }, [mutateEnrollmentsPage, pendingDeleteRows]);

  const pendingApplicationCount = pendingDeleteRows.reduce(
    (sum, row) => sum + enrollmentIdsForSelection(row).length,
    0
  );

  return (
    <>
      <title>{`Enrollment | Dashboard - ${CONFIG.appName}`}</title>
      <InstructorWorkspaceShell>
        <Stack spacing={3}>
          <Box>
            <Typography variant="h4">Enrollment</Typography>
            <Typography variant="body2" color="text.secondary">
              {isInstructorLike
                ? 'Review learner applications grouped by student. Expand a row to manage each program or course enrollment separately.'
                : 'View your course enrollment applications and approval status.'}
            </Typography>
          </Box>

          {listErrorMessage ? <Alert severity="error">{listErrorMessage}</Alert> : null}

          <Card>
            <CardContent sx={{ px: { xs: 1.5, sm: 3 }, py: { xs: 2, sm: 3 } }}>
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
                    {isInstructorLike ? 'Enrollment list' : 'My enrollments'}
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap" useFlexGap>
                    {isInstructorLike && selectedIds.length > 0 ? (
                      <Button
                        size="small"
                        color="error"
                        variant="outlined"
                        disabled={listLoading || !!busyId}
                        onClick={() => {
                          setPendingDeleteRows(
                            enrollments.filter((row) => selectedIds.includes(enrollmentSelectionId(row)))
                          );
                          setConfirmOpen(true);
                        }}
                      >
                        Delete selected ({selectedIds.length})
                      </Button>
                    ) : null}
                    {isInstructorLike ? (
                      <ExportExcelButton
                        disabled={listLoading}
                        onExport={handleExportExcel}
                        successMessage="Enrollment list exported."
                      >
                        <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 200 } }}>
                          <InputLabel id="enrollment-export-program-label">Program</InputLabel>
                          <Select
                            labelId="enrollment-export-program-label"
                            label="Program"
                            value={exportProgramId}
                            onChange={(event) => setExportProgramId(String(event.target.value ?? ''))}
                          >
                            <MenuItem value="">All programs</MenuItem>
                            {(programs ?? []).map((program) => (
                              <MenuItem key={program.id} value={program.id}>
                                {program.title || program.id}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </ExportExcelButton>
                    ) : null}
                    <ServerListPerPageControl
                      perPage={perPage}
                      onPerPageChange={changePerPage}
                      disabled={listLoading}
                    />
                  </Stack>
                </Stack>
                <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 720 }}>
                  {isInstructorLike
                    ? 'Search matches learner name, email, program title, enrollment id, or status. Click a learner name to view their details. Each learner appears once; expand to review individual programs. Rows highlighted in yellow have student payments waiting for your review in Payment history. Export Excel includes the application form details. Uploaded photos are embedded in the spreadsheet; PDFs are listed by file name. Choose a program in the toolbar to limit the spreadsheet to that program.'
                    : 'Courses you have applied for appear below with their current approval status.'}
                </Typography>
                {isInstructorLike ? (
                  <TextField
                    size="small"
                    label="Search"
                    placeholder="Learner, program, status, or enrollment id…"
                    value={searchDraft}
                    onChange={(e) => setSearchDraft(e.target.value)}
                    sx={{ maxWidth: { xs: '100%', sm: 360 } }}
                  />
                ) : null}
                <EnrollmentTable
                  rows={enrollments}
                  loading={listLoading}
                  showActionsColumn
                  canManage={isInstructorLike}
                  selectable={isInstructorLike}
                  selectedIds={selectedIds}
                  onToggleRow={toggleEnrollmentSelection}
                  onToggleAll={toggleAllEnrollmentSelection}
                  onStatusChange={handleStatusChange}
                  onLearningModeChange={handleLearningModeChange}
                  busyId={busyId}
                  onPaymentVerified={mutateEnrollmentsPage}
                  emptyMessage={
                    debouncedSearch ? 'No enrollments match your search.' : 'No enrollments found'
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
          if (busyId) {
            return;
          }
          setConfirmOpen(false);
          setPendingDeleteRows([]);
        }}
        title={pendingDeleteRows.length > 1 ? 'Delete selected enrollments' : 'Delete enrollment'}
        content={
          pendingDeleteRows.length > 1 ? (
            <>
              Remove <strong>{pendingDeleteRows.length}</strong> selected enrollments? Every
              application in those rows will be removed.
            </>
          ) : pendingApplicationCount > 1 ? (
            <>
              Remove <strong>{pendingApplicationCount}</strong> applications for{' '}
              <strong>{pendingDeleteRows[0]?.userName || 'this learner'}</strong>?
            </>
          ) : (
            <>
              Remove the enrollment for{' '}
              <strong>{pendingDeleteRows[0]?.userName || 'this learner'}</strong>? This application
              will be removed.
            </>
          )
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
