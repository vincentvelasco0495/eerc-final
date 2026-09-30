import { useRef, useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import Tabs from '@mui/material/Tabs';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import CircularProgress from '@mui/material/CircularProgress';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useLmsQuizStudentsPaginated } from 'src/hooks/use-lms';

import { CONFIG } from 'src/global-config';
import { normalizeProgramsPage, normalizeProgramsPerPage } from 'src/services/programService';
import { GradebookStudentCell } from 'src/features/instructor-gradebook/components/gradebook-student-cell';
import { InstructorWorkspaceShell } from 'src/features/instructor-profile/components/instructor-workspace-shell';
import { InstructorAssignmentMetricCell } from 'src/features/instructor-assignments/components/instructor-assignment-metric-cell';

import { Iconify } from 'src/components/iconify';
import { ExportExcelButton } from 'src/components/export-excel-button';
import { ServerListPagination, ServerListPerPageControl } from 'src/components/server-pagination';

import { styles } from './styles';

const STATUS_TABS = [
  { value: 'passed', label: 'Passed' },
  { value: 'non_passed', label: 'Non passed' },
  { value: 'pending', label: 'Pending' },
];

function formatScoreLabel(row) {
  if (row.status === 'pending') {
    return '—';
  }
  if (typeof row.score === 'number') {
    return `${row.score}%`;
  }
  return '—';
}

function formatSubmissionLabel(row) {
  if (row.status === 'pending') {
    return 'Not attempted';
  }
  if (row.attemptedOn) {
    return row.attemptedOn;
  }
  return '—';
}

function formatDetailLabel(row) {
  if (row.status === 'pending') {
    return '—';
  }
  if (typeof row.correctAnswers === 'number' && typeof row.totalQuestions === 'number') {
    return `${row.correctAnswers} / ${row.totalQuestions} correct`;
  }
  return '—';
}

export function InstructorQuizStudentsView() {
  const { quizId = '' } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = normalizeProgramsPage(searchParams.get('page'));
  const perPage = normalizeProgramsPerPage(searchParams.get('per_page'));
  const statusParam = searchParams.get('status') ?? 'passed';
  const status = STATUS_TABS.some((tab) => tab.value === statusParam) ? statusParam : 'passed';

  const [searchDraft, setSearchDraft] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const prevDebouncedSearch = useRef(debouncedSearch);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(searchDraft.trim()), 400);
    return () => window.clearTimeout(timer);
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

  const apiEnabled = Boolean(CONFIG.serverUrl?.trim());
  const { quiz, counts, students, meta, isLoading } = useLmsQuizStudentsPaginated(
    quizId,
    page,
    perPage,
    status,
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

  const handleStatusChange = (_event, nextStatus) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set('status', nextStatus);
        next.set('page', '1');
        return next;
      },
      { replace: true }
    );
  };

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

  const title = quiz?.title ?? 'Quiz';
  const courseName = quiz?.course ?? '';

  return (
    <InstructorWorkspaceShell>
      <Stack spacing={3}>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Button
            component={RouterLink}
            href={paths.dashboard.studentQuizzes}
            color="inherit"
            startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
            sx={{ alignSelf: 'flex-start' }}
          >
            Back
          </Button>
        </Stack>

        <Stack spacing={0.5}>
          <Typography variant="h4" sx={styles.title}>
            {title}
          </Typography>
          {courseName ? (
            <Typography variant="body2" color="text.secondary">
              {courseName}
            </Typography>
          ) : null}
        </Stack>

        {counts ? (
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} flexWrap="wrap">
            <InstructorAssignmentMetricCell variant="passed" value={counts.passed ?? 0} />
            <InstructorAssignmentMetricCell variant="nonPassed" value={counts.nonPassed ?? 0} />
            <InstructorAssignmentMetricCell variant="pending" value={counts.pending ?? 0} />
          </Stack>
        ) : null}

        <Card variant="outlined" sx={styles.panel}>
          <Tabs
            value={status}
            onChange={handleStatusChange}
            sx={styles.tabs}
            variant="scrollable"
            scrollButtons="auto"
          >
            {STATUS_TABS.map((tab) => (
              <Tab key={tab.value} value={tab.value} label={tab.label} />
            ))}
          </Tabs>

          <Box sx={styles.panelBody}>
            <TextField
              size="small"
              label="Search"
              value={searchDraft}
              onChange={(event) => setSearchDraft(event.target.value)}
              placeholder="Student name or email..."
              sx={{ maxWidth: 360, mb: 2 }}
            />

            <Stack direction="row" justifyContent="flex-end" sx={{ mb: 2 }}>
              <ExportExcelButton
                fileName="quiz-students"
                sheetName="Students"
                headers={['Student', 'Email', 'Score', 'Attempted', 'Result']}
                rows={students}
                mapRow={(row) => [
                  row.name ?? '',
                  row.email ?? '',
                  formatScoreLabel(row),
                  formatSubmissionLabel(row),
                  formatDetailLabel(row),
                ]}
                disabled={isLoading || !students.length}
              />
            </Stack>

            {apiEnabled && isLoading && !students.length ? (
              <Box sx={styles.loadingWrap}>
                <CircularProgress aria-label="Loading students" />
              </Box>
            ) : (
              <>
                <TableContainer component={Paper} variant="outlined" sx={styles.tableContainer}>
                  <Table size="medium">
                    <TableHead>
                      <TableRow sx={styles.headRow}>
                        <TableCell sx={{ minWidth: 240 }}>Student</TableCell>
                        <TableCell sx={{ minWidth: 100 }}>Score</TableCell>
                        <TableCell sx={{ minWidth: 140 }}>Attempted</TableCell>
                        <TableCell sx={{ minWidth: 160 }}>Result</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {students.length ? (
                        students.map((row) => (
                          <TableRow key={row.id} hover>
                            <TableCell>
                              <GradebookStudentCell name={row.name} email={row.email} />
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" sx={styles.score}>
                                {formatScoreLabel(row)}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" color="text.secondary">
                                {formatSubmissionLabel(row)}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" color="text.secondary">
                                {formatDetailLabel(row)}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4}>
                            <Typography variant="body2" color="text.secondary" sx={{ py: 3, textAlign: 'center' }}>
                              No students in this category.
                            </Typography>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>

                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={2}
                  alignItems={{ xs: 'stretch', sm: 'center' }}
                  justifyContent="space-between"
                  sx={{ mt: 2 }}
                >
                  <ServerListPerPageControl value={perPage} onChange={handlePerPageChange} disabled={isLoading} />
                  <ServerListPagination
                    page={currentPage}
                    lastPage={lastPage}
                    total={total}
                    from={rangeFrom}
                    to={rangeTo}
                    onPageChange={handlePageChange}
                    disabled={isLoading}
                    singularItemLabel="student"
                    pluralItemLabel="students"
                    sx={{ borderTop: 0, pt: 0, flex: 1 }}
                  />
                </Stack>
              </>
            )}
          </Box>
        </Card>
      </Stack>
    </InstructorWorkspaceShell>
  );
}
