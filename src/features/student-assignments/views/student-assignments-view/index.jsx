import { useSearchParams } from 'react-router';
import { useRef, useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import { useLmsMyAssignmentsPaginated } from 'src/hooks/use-lms';

import { CONFIG } from 'src/global-config';
import { studentAssignmentStatuses } from 'src/features/student-profile/student-profile-data';
import { StudentWorkspaceShell } from 'src/features/student-profile/components/student-workspace-shell';

import { ServerListPagination, ServerListPerPageControl } from 'src/components/server-pagination';

import { styles } from './styles';
import { StudentAssignmentList } from '../../components/student-assignment-list';
import { StudentAssignmentsToolbar } from '../../components/student-assignments-toolbar';

const PAGE_SIZE_OPTIONS = [10, 20, 30];

function normalizePage(value) {
  const n = Number.parseInt(String(value ?? ''), 10);
  return Number.isFinite(n) && n >= 1 ? n : 1;
}

function normalizePerPage(value) {
  const n = Number.parseInt(String(value ?? ''), 10);
  return PAGE_SIZE_OPTIONS.includes(n) ? n : PAGE_SIZE_OPTIONS[0];
}

function statusToApiParam(status) {
  const raw = String(status ?? 'All').trim();
  if (!raw || raw.toLowerCase() === 'all') {
    return 'all';
  }
  return raw.toLowerCase();
}

export function StudentAssignmentsView() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = normalizePage(searchParams.get('page'));
  const perPage = normalizePerPage(searchParams.get('per_page'));

  const [searchDraft, setSearchDraft] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [status, setStatus] = useState('All');
  const prevDebouncedSearch = useRef(debouncedSearch);
  const prevStatus = useRef(status);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(searchDraft.trim()), 400);
    return () => window.clearTimeout(timer);
  }, [searchDraft]);

  useEffect(() => {
    if (prevDebouncedSearch.current === debouncedSearch && prevStatus.current === status) {
      return;
    }
    prevDebouncedSearch.current = debouncedSearch;
    prevStatus.current = status;
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set('page', '1');
        return next;
      },
      { replace: true }
    );
  }, [debouncedSearch, setSearchParams, status]);

  const apiEnabled = Boolean(CONFIG.serverUrl?.trim());
  const { assignments, meta, isLoading } = useLmsMyAssignmentsPaginated(
    page,
    perPage,
    statusToApiParam(status),
    debouncedSearch,
    apiEnabled
  );

  const currentPage = meta?.current_page ?? page;
  const lastPage = meta?.last_page ?? 1;
  const total = meta?.total ?? 0;
  const rangeFrom = meta?.from ?? 0;
  const rangeTo = meta?.to ?? 0;

  useEffect(() => {
    if (!meta?.last_page || page <= meta.last_page) {
      return;
    }
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set('page', String(meta.last_page));
        return next;
      },
      { replace: true }
    );
  }, [meta?.last_page, page, setSearchParams]);

  const handlePageChange = (nextPage) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set('page', String(nextPage));
        return next;
      },
      { replace: true }
    );
  };

  const handlePerPageChange = (nextPerPage) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set('per_page', String(nextPerPage));
        next.set('page', '1');
        return next;
      },
      { replace: true }
    );
  };

  return (
    <StudentWorkspaceShell>
      <Stack spacing={3.25}>
        <StudentAssignmentsToolbar
          title="Assignments"
          query={searchDraft}
          status={status}
          statuses={studentAssignmentStatuses}
          onQueryChange={setSearchDraft}
          onStatusChange={setStatus}
        />

        {!apiEnabled ? (
          <Box sx={styles.emptyState}>
            <Typography variant="body2" sx={styles.emptyText}>
              Assignments require the LMS API. Set <code>VITE_SERVER_URL</code> and sign in.
            </Typography>
          </Box>
        ) : isLoading && !assignments.length ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress aria-label="Loading assignments" />
          </Box>
        ) : assignments.length ? (
          <StudentAssignmentList assignments={assignments} />
        ) : (
          <Box sx={styles.emptyState}>
            <Typography variant="body2" sx={styles.emptyText}>
              {debouncedSearch || status !== 'All'
                ? 'No assignments matched your current search and status filter.'
                : 'No assignments are available for your enrolled programs yet.'}
            </Typography>
          </Box>
        )}

        {apiEnabled && total > 0 ? (
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            alignItems={{ xs: 'stretch', sm: 'center' }}
            justifyContent="space-between"
          >
            <ServerListPerPageControl
              perPage={perPage}
              onPerPageChange={handlePerPageChange}
              pageSizeOptions={PAGE_SIZE_OPTIONS}
              options={PAGE_SIZE_OPTIONS}
              disabled={isLoading}
            />
            <ServerListPagination
              page={currentPage}
              lastPage={lastPage}
              total={total}
              from={rangeFrom}
              to={rangeTo}
              onPageChange={handlePageChange}
              disabled={isLoading}
              singularItemLabel="assignment"
              pluralItemLabel="assignments"
              sx={{ borderTop: 0, pt: 0, flex: 1 }}
            />
          </Stack>
        ) : null}
      </Stack>
    </StudentWorkspaceShell>
  );
}
