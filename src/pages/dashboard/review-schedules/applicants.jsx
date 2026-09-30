import { useParams, useSearchParams } from 'react-router';
import { useRef, useMemo, useState, useEffect, useCallback } from 'react';

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

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useLmsReviewScheduleApplicantsPaginated } from 'src/hooks/use-lms';

import { CONFIG } from 'src/global-config';
import { downloadBlob } from 'src/features/enrollment/utils/enrollment-excel';
import { fetchReviewScheduleApplicantsExcelExport } from 'src/redux/api/lmsApi';
import { InstructorWorkspaceShell } from 'src/features/instructor-profile/components/instructor-workspace-shell';
import {
  normalizeReviewSchedulePage,
  normalizeReviewSchedulePerPage,
} from 'src/services/reviewScheduleService';

import { Iconify } from 'src/components/iconify';
import { ExportExcelButton } from 'src/components/export-excel-button';
import { ServerListPagination, ServerListPerPageControl } from 'src/components/server-pagination';
import { BranchEnrollApplicantsTable } from 'src/components/branch-enrolls/BranchEnrollApplicantsTable';

const STATUS_OPTIONS = [
  { value: '', label: 'All statuses' },
  { value: 'pending', label: 'pending' },
  { value: 'approved', label: 'approved' },
  { value: 'rejected', label: 'rejected' },
  { value: 'hold', label: 'hold' },
];

function normalizeApplicantStatus(value) {
  const status = String(value ?? '').trim().toLowerCase();
  return STATUS_OPTIONS.some((option) => option.value === status) ? status : '';
}

export default function ReviewScheduleApplicantsPage() {
  const { scheduleId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = normalizeReviewSchedulePage(searchParams.get('page'));
  const perPage = normalizeReviewSchedulePerPage(searchParams.get('per_page'));
  const statusFilter = normalizeApplicantStatus(searchParams.get('status'));
  const programFilter = String(searchParams.get('program') ?? '').trim();
  const batchFilter = String(searchParams.get('batch') ?? '').trim();
  const learningModeFilter = String(searchParams.get('learningMode') ?? '').trim();

  const [searchDraft, setSearchDraft] = useState(() => searchParams.get('search') ?? '');
  const [debouncedSearch, setDebouncedSearch] = useState(() =>
    String(searchParams.get('search') ?? '').trim()
  );
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
        if (debouncedSearch) {
          next.set('search', debouncedSearch);
        } else {
          next.delete('search');
        }
        return next;
      },
      { replace: true }
    );
  }, [debouncedSearch, setSearchParams]);

  const {
    reviewSchedule,
    applicantCount,
    occupiedSeats,
    remainingSeats,
    applicants,
    filters,
    meta,
    isLoading: listLoading,
    error: listError,
  } = useLmsReviewScheduleApplicantsPaginated(
    scheduleId,
    page,
    perPage,
    debouncedSearch,
    statusFilter,
    programFilter,
    batchFilter,
    learningModeFilter
  );

  const currentPage = meta?.current_page ?? page;
  const lastPage = meta?.last_page ?? 1;
  const total = meta?.total ?? 0;
  const rangeFrom = meta?.from ?? 0;
  const rangeTo = meta?.to ?? 0;

  const listErrorMessage =
    typeof listError === 'string' ? listError : listError?.message ?? null;

  const programs = Array.isArray(filters?.programs) ? filters.programs : [];
  const batches = useMemo(
    () => (Array.isArray(filters?.batches) ? filters.batches : []),
    [filters?.batches]
  );
  const learningModes = Array.isArray(filters?.learningModes) ? filters.learningModes : [];
  const visibleBatches = useMemo(
    () =>
      programFilter
        ? batches.filter((batch) => batch.programId === programFilter)
        : batches,
    [batches, programFilter]
  );

  const goToPage = useCallback(
    (nextPage) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.set('page', String(nextPage));
          return next;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );

  const changePerPage = useCallback(
    (nextPerPage) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.set('page', '1');
          next.set('per_page', String(nextPerPage));
          return next;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );

  const patchFilters = useCallback(
    (updater) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.set('page', '1');
          updater(next);
          return next;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );

  const handleExportExcel = useCallback(async () => {
    const { blob, fileName } = await fetchReviewScheduleApplicantsExcelExport({
      scheduleId,
      search: debouncedSearch,
      status: statusFilter,
      program: programFilter,
      batch: batchFilter,
      learningMode: learningModeFilter,
    });
    downloadBlob(blob, fileName);
  }, [batchFilter, debouncedSearch, learningModeFilter, programFilter, scheduleId, statusFilter]);

  const scheduleName = reviewSchedule?.name || 'Review schedule applicants';
  const branchName = reviewSchedule?.branchName || '—';
  const studentCapacity = reviewSchedule?.studentCapacity ?? 0;
  const hasActiveFilters =
    Boolean(debouncedSearch) ||
    Boolean(statusFilter) ||
    Boolean(programFilter) ||
    Boolean(batchFilter) ||
    Boolean(learningModeFilter);
  const emptyMessage = hasActiveFilters
    ? 'No applicants match your search.'
    : 'No applicants for this review schedule yet';

  return (
    <>
      <title>{`${scheduleName} applicants | Dashboard - ${CONFIG.appName}`}</title>
      <InstructorWorkspaceShell>
        <Stack spacing={3}>
          <Button
            component={RouterLink}
            href={paths.dashboard.settingReviewSchedule}
            color="inherit"
            startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
            sx={{ alignSelf: 'flex-start' }}
          >
            Back to Review Schedules
          </Button>

          <Box>
            <Typography variant="h4">{scheduleName}</Typography>
            <Typography variant="body2" color="text.secondary">
              {listLoading && !reviewSchedule
                ? 'Loading applicants…'
                : `${branchName} · Student capacity ${studentCapacity} · ${applicantCount} application${applicantCount === 1 ? '' : 's'}`}
            </Typography>
            {reviewSchedule ? (
              <Typography variant="body2" color="text.secondary">
                Occupied seats (approved only): {occupiedSeats} · Remaining confirmed seats:{' '}
                {remainingSeats}
              </Typography>
            ) : null}
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
                    Applicants
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap" useFlexGap>
                    <ExportExcelButton
                      disabled={listLoading}
                      onExport={handleExportExcel}
                      successMessage="Review schedule applicants exported to Excel."
                    />
                    <ServerListPerPageControl
                      perPage={perPage}
                      onPerPageChange={changePerPage}
                      disabled={listLoading}
                    />
                  </Stack>
                </Stack>
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={2}
                  alignItems={{ xs: 'stretch', sm: 'center' }}
                  flexWrap="wrap"
                  useFlexGap
                >
                  <TextField
                    size="small"
                    label="Search"
                    placeholder="Filter by applicant name or email…"
                    value={searchDraft}
                    onChange={(event) => setSearchDraft(event.target.value)}
                    sx={{ maxWidth: { xs: '100%', sm: 280 }, flex: 1 }}
                  />
                  <FormControl size="small" sx={{ minWidth: 180 }}>
                    <InputLabel id="review-schedule-applicant-program-label">Program</InputLabel>
                    <Select
                      labelId="review-schedule-applicant-program-label"
                      label="Program"
                      value={programFilter}
                      onChange={(event) => {
                        const nextProgram = String(event.target.value ?? '').trim();
                        patchFilters((next) => {
                          if (nextProgram) {
                            next.set('program', nextProgram);
                          } else {
                            next.delete('program');
                          }
                          const currentBatch = String(next.get('batch') ?? '').trim();
                          const stillValid = batches.some(
                            (batch) =>
                              batch.id === currentBatch &&
                              (!nextProgram || batch.programId === nextProgram)
                          );
                          if (!stillValid) {
                            next.delete('batch');
                          }
                        });
                      }}
                    >
                      <MenuItem value="">All programs</MenuItem>
                      {programs.map((program) => (
                        <MenuItem key={program.id} value={program.id}>
                          {program.title}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl size="small" sx={{ minWidth: 220 }}>
                    <InputLabel id="review-schedule-applicant-batch-label">Batch</InputLabel>
                    <Select
                      labelId="review-schedule-applicant-batch-label"
                      label="Batch"
                      value={batchFilter}
                      onChange={(event) => {
                        const nextBatch = String(event.target.value ?? '').trim();
                        patchFilters((next) => {
                          if (nextBatch) {
                            next.set('batch', nextBatch);
                          } else {
                            next.delete('batch');
                          }
                        });
                      }}
                    >
                      <MenuItem value="">All batches</MenuItem>
                      {visibleBatches.map((batch) => {
                        const programTitle = programs.find((program) => program.id === batch.programId)
                          ?.title;
                        const label =
                          programFilter || !programTitle
                            ? batch.name
                            : `${batch.name} (${programTitle})`;
                        return (
                          <MenuItem key={batch.id} value={batch.id}>
                            {label}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                  <FormControl size="small" sx={{ minWidth: 200 }}>
                    <InputLabel id="review-schedule-applicant-mode-label">Learning mode</InputLabel>
                    <Select
                      labelId="review-schedule-applicant-mode-label"
                      label="Learning mode"
                      value={learningModeFilter}
                      onChange={(event) => {
                        const nextMode = String(event.target.value ?? '').trim();
                        patchFilters((next) => {
                          if (nextMode) {
                            next.set('learningMode', nextMode);
                          } else {
                            next.delete('learningMode');
                          }
                        });
                      }}
                    >
                      <MenuItem value="">All learning modes</MenuItem>
                      {learningModes.map((mode) => (
                        <MenuItem key={mode.id} value={mode.id}>
                          {mode.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl size="small" sx={{ minWidth: 160 }}>
                    <InputLabel id="review-schedule-applicant-status-label">Status</InputLabel>
                    <Select
                      labelId="review-schedule-applicant-status-label"
                      label="Status"
                      value={statusFilter}
                      onChange={(event) => {
                        const nextStatus = normalizeApplicantStatus(event.target.value);
                        patchFilters((next) => {
                          if (nextStatus) {
                            next.set('status', nextStatus);
                          } else {
                            next.delete('status');
                          }
                        });
                      }}
                    >
                      {STATUS_OPTIONS.map((option) => (
                        <MenuItem key={option.value || 'all'} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Stack>
                <BranchEnrollApplicantsTable
                  applicants={applicants}
                  loading={listLoading}
                  emptyMessage={emptyMessage}
                />
                <ServerListPagination
                  page={currentPage}
                  lastPage={lastPage}
                  total={total}
                  from={rangeFrom}
                  to={rangeTo}
                  onPageChange={goToPage}
                  disabled={listLoading}
                  singularItemLabel="applicant"
                  pluralItemLabel="applicants"
                />
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      </InstructorWorkspaceShell>
    </>
  );
}
