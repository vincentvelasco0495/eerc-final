import { useParams, useSearchParams } from 'react-router';
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

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useLmsUser, useLmsProgramApplicantsPaginated } from 'src/hooks/use-lms';

import { CONFIG } from 'src/global-config';
import { normalizeProgramsPage, normalizeProgramsPerPage } from 'src/services/programService';
import { StudentWorkspaceShell } from 'src/features/student-profile/components/student-workspace-shell';
import { InstructorWorkspaceShell } from 'src/features/instructor-profile/components/instructor-workspace-shell';

import { Iconify } from 'src/components/iconify';
import { ProgramApplicantsTable } from 'src/components/programs/ProgramApplicantsTable';
import { ServerListPagination, ServerListPerPageControl } from 'src/components/server-pagination';

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

export default function ProgramApplicantsPage() {
  const { programId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = normalizeProgramsPage(searchParams.get('page'));
  const perPage = normalizeProgramsPerPage(searchParams.get('per_page'));
  const statusFilter = normalizeApplicantStatus(searchParams.get('status'));

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

  const { user } = useLmsUser();
  const {
    program,
    applicantCount,
    applicants,
    meta,
    isLoading: listLoading,
    error: listError,
  } = useLmsProgramApplicantsPaginated(programId, page, perPage, debouncedSearch, statusFilter);

  const currentPage = meta?.current_page ?? page;
  const lastPage = meta?.last_page ?? 1;
  const total = meta?.total ?? 0;
  const rangeFrom = meta?.from ?? 0;
  const rangeTo = meta?.to ?? 0;

  const listErrorMessage =
    typeof listError === 'string' ? listError : listError?.message ?? null;

  const role = typeof user?.role === 'string' ? user.role.trim().toLowerCase() : '';
  const isInstructorLike = role === 'instructor' || role === 'admin';
  const WorkspaceShell = isInstructorLike ? InstructorWorkspaceShell : StudentWorkspaceShell;

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

  const changeStatus = useCallback(
    (event) => {
      const nextStatus = normalizeApplicantStatus(event.target.value);
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.set('page', '1');
          if (nextStatus) {
            next.set('status', nextStatus);
          } else {
            next.delete('status');
          }
          return next;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );

  const programTitle = program?.title || 'Program applicants';
  const hasActiveFilters = Boolean(debouncedSearch) || Boolean(statusFilter);
  const emptyMessage = hasActiveFilters
    ? 'No applicants match your search.'
    : 'No applicants yet';

  return (
    <>
      <title>{`${programTitle} applicants | Dashboard - ${CONFIG.appName}`}</title>
      <WorkspaceShell>
        <Stack spacing={3}>
          <Button
            component={RouterLink}
            href={paths.dashboard.settingProgram}
            color="inherit"
            startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
            sx={{ alignSelf: 'flex-start' }}
          >
            Back to Programs
          </Button>

          <Box>
            <Typography variant="h4">{programTitle}</Typography>
            <Typography variant="body2" color="text.secondary">
              {listLoading && !program
                ? 'Loading applicants…'
                : `${applicantCount} applicant${applicantCount === 1 ? '' : 's'}`}
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
                    Applicants
                  </Typography>
                  <ServerListPerPageControl
                    perPage={perPage}
                    onPerPageChange={changePerPage}
                    disabled={listLoading}
                  />
                </Stack>
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={2}
                  alignItems={{ xs: 'stretch', sm: 'center' }}
                >
                  <TextField
                    size="small"
                    label="Search"
                    placeholder="Filter by applicant name or email…"
                    value={searchDraft}
                    onChange={(event) => setSearchDraft(event.target.value)}
                    sx={{ maxWidth: { xs: '100%', sm: 360 }, flex: 1 }}
                  />
                  <FormControl size="small" sx={{ minWidth: 180 }}>
                    <InputLabel id="program-applicant-status-label">Status</InputLabel>
                    <Select
                      labelId="program-applicant-status-label"
                      label="Status"
                      value={statusFilter}
                      onChange={changeStatus}
                    >
                      {STATUS_OPTIONS.map((option) => (
                        <MenuItem key={option.value || 'all'} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Stack>
                <ProgramApplicantsTable
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
      </WorkspaceShell>
    </>
  );
}
