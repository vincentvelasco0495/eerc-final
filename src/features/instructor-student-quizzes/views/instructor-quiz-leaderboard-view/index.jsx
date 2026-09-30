import { useRef, useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
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

import { useLmsQuizLeaderboardPaginated } from 'src/hooks/use-lms';

import { CONFIG } from 'src/global-config';
import { normalizeProgramsPage, normalizeProgramsPerPage } from 'src/services/programService';
import { GradebookStudentCell } from 'src/features/instructor-gradebook/components/gradebook-student-cell';
import { InstructorWorkspaceShell } from 'src/features/instructor-profile/components/instructor-workspace-shell';

import { Iconify } from 'src/components/iconify';
import { ExportExcelButton } from 'src/components/export-excel-button';
import { ServerListPagination, ServerListPerPageControl } from 'src/components/server-pagination';

import { styles } from './styles';

function rankColor(rank) {
  if (rank === 1) {
    return 'warning.main';
  }
  if (rank === 2) {
    return 'text.primary';
  }
  if (rank === 3) {
    return 'info.main';
  }
  return 'text.secondary';
}

export function InstructorQuizLeaderboardView() {
  const { quizId = '' } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = normalizeProgramsPage(searchParams.get('page'));
  const perPage = normalizeProgramsPerPage(searchParams.get('per_page'));

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
  const { quiz, leaderboard, meta, isLoading } = useLmsQuizLeaderboardPaginated(
    quizId,
    page,
    perPage,
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

  const title = quiz?.title ?? 'Quiz';
  const courseName = quiz?.course ?? '';

  return (
    <InstructorWorkspaceShell>
      <Stack spacing={3}>
        <Button
          component={RouterLink}
          href={paths.dashboard.studentQuizzes}
          color="inherit"
          startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
          sx={{ alignSelf: 'flex-start' }}
        >
          Back
        </Button>

        <Stack spacing={0.75}>
          <Typography variant="h4" sx={styles.title}>
            Quiz Leaderboard
          </Typography>
          <Typography variant="subtitle1" sx={styles.quizTitle}>
            {title}
          </Typography>
          {courseName ? (
            <Typography variant="body2" color="text.secondary">
              {courseName}
            </Typography>
          ) : null}
          <Typography variant="body2" color="text.secondary">
            Ranked by best attempt score, then fastest completion time.
          </Typography>
        </Stack>

        <Card variant="outlined" sx={styles.panel}>
          <Stack spacing={2.5} sx={styles.panelBody}>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              alignItems={{ xs: 'stretch', sm: 'center' }}
              justifyContent="space-between"
            >
              <TextField
                size="small"
                value={searchDraft}
                placeholder="Search student name or email"
                onChange={(event) => setSearchDraft(event.target.value)}
                sx={styles.searchField}
              />
              <ExportExcelButton
                fileName="quiz-leaderboard"
                sheetName="Leaderboard"
                headers={['Rank', 'Student', 'Email', 'Score', 'Finish time', 'Result', 'Attempted']}
                rows={leaderboard}
                mapRow={(row) => [
                  row.rank ?? '',
                  row.name ?? '',
                  row.email ?? '',
                  row.scoreLabel ?? `${row.score ?? ''}%`,
                  row.durationUsed ?? '',
                  row.detailLabel ?? (row.passed ? 'Passed' : 'Failed'),
                  row.attemptedAt ?? row.submittedAt ?? '',
                ]}
                disabled={isLoading || !leaderboard.length}
              />
            </Stack>

            {apiEnabled && isLoading && !leaderboard.length ? (
              <Box sx={styles.loadingWrap}>
                <CircularProgress aria-label="Loading leaderboard" />
              </Box>
            ) : leaderboard.length ? (
              <TableContainer sx={styles.tableContainer}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={styles.headRow}>
                      <TableCell>Rank</TableCell>
                      <TableCell>Student</TableCell>
                      <TableCell>Score</TableCell>
                      <TableCell>Finish time</TableCell>
                      <TableCell>Result</TableCell>
                      <TableCell>Attempted</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {leaderboard.map((row) => (
                      <TableRow key={row.id} hover>
                        <TableCell>
                          <Typography variant="subtitle2" sx={{ color: rankColor(row.rank), fontWeight: 700 }}>
                            #{row.rank}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <GradebookStudentCell name={row.name} email={row.email} />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={styles.score}>
                            {row.scoreLabel ?? `${row.score}%`}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={styles.metric}>
                            {row.durationUsed ?? '—'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
                            <Typography variant="body2" sx={styles.metric}>
                              {row.detailLabel ?? '—'}
                            </Typography>
                            <Chip
                              size="small"
                              label={row.passed ? 'Passed' : 'Failed'}
                              color={row.passed ? 'success' : 'error'}
                              variant="soft"
                            />
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={styles.metric}>
                            {row.attemptedOn ?? '—'}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Box sx={styles.emptyState}>
                <Typography variant="body2" color="text.secondary">
                  No submitted attempts yet. Rankings appear after students complete this quiz.
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
                  singularItemLabel="student"
                  pluralItemLabel="students"
                  sx={{ borderTop: 0, pt: 0, flex: 1 }}
                />
              </Stack>
            ) : null}
          </Stack>
        </Card>
      </Stack>
    </InstructorWorkspaceShell>
  );
}
