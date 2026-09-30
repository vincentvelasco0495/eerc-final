import { useSearchParams } from 'react-router';
import { useRef, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';

import { useLmsUser, useLmsEnrollmentsPaginated } from 'src/hooks/use-lms';

import { CONFIG } from 'src/global-config';
import { lmsApi, fetchEnrollmentExcelExport } from 'src/redux/api/lmsApi';
import { downloadBlob } from 'src/features/enrollment/utils/enrollment-excel';
import { normalizeProgramsPage, normalizeProgramsPerPage } from 'src/services/programService';
import { InstructorWorkspaceShell } from 'src/features/instructor-profile/components/instructor-workspace-shell';

import { toast } from 'src/components/snackbar';
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
  const [busyId, setBusyId] = useState(null);

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

  const handleExportExcel = useCallback(async () => {
    const { blob, fileName } = await fetchEnrollmentExcelExport({
      search: debouncedSearch,
      rows: enrollments,
    });
    downloadBlob(blob, fileName);
  }, [debouncedSearch, enrollments]);

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
                    {isInstructorLike ? 'Enrollment list' : 'My enrollments'}
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap" useFlexGap>
                    {isInstructorLike ? (
                      <ExportExcelButton
                        disabled={listLoading}
                        onExport={handleExportExcel}
                        successMessage="Enrollment list exported."
                      />
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
                    ? 'Search matches learner name, email, program title, enrollment id, or status. Click a learner name to view their details. Each learner appears once; expand to review individual programs. Rows highlighted in yellow have student payments waiting for your review in Payment history. Export Excel downloads every matching application, not only this page.'
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
                  onStatusChange={handleStatusChange}
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
    </>
  );
}
