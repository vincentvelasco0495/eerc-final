import { useSearchParams } from 'react-router';
import { useRef, useMemo, useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import { useLmsMyQuizzesPaginated } from 'src/hooks/use-lms';

import { CONFIG } from 'src/global-config';
import { studentQuizStatuses } from 'src/features/student-profile/student-profile-data';
import { StudentWorkspaceShell } from 'src/features/student-profile/components/student-workspace-shell';

import { Iconify } from 'src/components/iconify';
import { ServerListPagination, ServerListPerPageControl } from 'src/components/server-pagination';

import { styles } from './styles';
import { groupQuizzesByCourse } from '../../student-enrolled-quiz-data';
import { EnrolledQuizToolbar } from '../../components/enrolled-quiz-toolbar';
import { EnrolledQuizCourseGroup } from '../../components/enrolled-quiz-course-group';

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

function EmptyState({ icon, title, description }) {
  return (
    <Box sx={styles.emptyState}>
      <Stack spacing={1.25} alignItems="center" textAlign="center">
        <Box sx={styles.emptyIconWrap}>
          <Iconify icon={icon} width={28} />
        </Box>
        <Typography variant="subtitle1" sx={styles.emptyTitle}>
          {title}
        </Typography>
        <Typography variant="body2" sx={styles.emptyText}>
          {description}
        </Typography>
      </Stack>
    </Box>
  );
}

export function QuizListView() {
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
  const { quizzes, meta, isLoading } = useLmsMyQuizzesPaginated(
    page,
    perPage,
    statusToApiParam(status),
    debouncedSearch,
    apiEnabled
  );

  const groups = useMemo(() => groupQuizzesByCourse(quizzes), [quizzes]);

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
      <Stack spacing={3.25} sx={styles.shell}>
        <EnrolledQuizToolbar
          query={searchDraft}
          status={status}
          statuses={studentQuizStatuses}
          onQueryChange={setSearchDraft}
          onStatusChange={setStatus}
        />

        {!apiEnabled ? (
          <EmptyState
            icon="solar:server-square-cloud-bold-duotone"
            title="LMS API not configured"
            description={
              <>
                Quizzes require the LMS API. Set <code>VITE_SERVER_URL</code> and sign in.
              </>
            }
          />
        ) : isLoading && !quizzes.length ? (
          <Box sx={styles.loadingState}>
            <CircularProgress size={32} aria-label="Loading quizzes" />
            <Typography variant="body2" sx={styles.loadingText}>
              Loading your quizzes…
            </Typography>
          </Box>
        ) : groups.length ? (
          <Stack spacing={1.75} sx={styles.groupsStack}>
            {groups.map((group) => (
              <EnrolledQuizCourseGroup key={group.courseId} group={group} />
            ))}
          </Stack>
        ) : (
          <EmptyState
            icon="solar:document-text-bold-duotone"
            title="No quizzes found"
            description={
              debouncedSearch || status !== 'All'
                ? 'No quizzes matched your current search and status filter. Try adjusting your filters.'
                : 'No quizzes are available for your enrolled programs yet.'
            }
          />
        )}

        {apiEnabled && total > 0 ? (
          <Box sx={styles.paginationBar}>
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
                singularItemLabel="quiz"
                pluralItemLabel="quizzes"
                sx={{ borderTop: 0, pt: 0, flex: 1 }}
              />
            </Stack>
          </Box>
        ) : null}
      </Stack>
    </StudentWorkspaceShell>
  );
}
