import { useParams } from 'react-router';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TableRow from '@mui/material/TableRow';
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
import { getInstructorNameInitials } from 'src/features/instructor-profile/instructor-profile-data';
import { StudentWorkspaceShell } from 'src/features/student-profile/components/student-workspace-shell';

import { Iconify } from 'src/components/iconify';

import { styles } from './styles';

const TOP_LIMIT = 20;

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

function leaderboardStudentName(row) {
  const alias = typeof row?.aliasName === 'string' ? row.aliasName.trim() : '';
  if (alias) {
    return alias;
  }
  return typeof row?.name === 'string' ? row.name : '';
}

function LeaderboardNameCell({ name }) {
  return (
    <Stack direction="row" spacing={1.5} alignItems="center">
      <Avatar sx={{ width: 36, height: 36, fontSize: 14 }}>{getInstructorNameInitials(name)}</Avatar>
      <Typography variant="body2" sx={styles.studentName}>
        {name}
      </Typography>
    </Stack>
  );
}

function LeaderboardRow({ row }) {
  return (
    <TableRow hover>
      <TableCell>
        <Typography variant="subtitle2" sx={{ color: rankColor(row.rank), fontWeight: 700 }}>
          #{row.rank}
        </Typography>
      </TableCell>
      <TableCell>
        <LeaderboardNameCell name={leaderboardStudentName(row)} />
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
    </TableRow>
  );
}

export function StudentQuizLeaderboardView() {
  const { quizId = '' } = useParams();
  const apiEnabled = Boolean(CONFIG.serverUrl?.trim());
  const { quiz, leaderboard, myRank, meta, isLoading, error } = useLmsQuizLeaderboardPaginated(
    quizId,
    1,
    TOP_LIMIT,
    '',
    apiEnabled
  );

  const title = quiz?.title ?? 'Quiz';
  const courseName = quiz?.course ?? '';
  const totalRanked = meta?.total ?? leaderboard.length;
  const errorMessage = typeof error === 'string' ? error : error?.message;

  return (
    <StudentWorkspaceShell>
      <Stack spacing={3}>
        <Button
          component={RouterLink}
          href={paths.dashboard.quizzes.root}
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
            Top {TOP_LIMIT} students ranked by best attempt score, then fastest completion time.
          </Typography>
        </Stack>

        {myRank ? (
          <Card variant="outlined" sx={styles.myRankCard}>
            <Stack spacing={1.5}>
              <Typography variant="overline" sx={styles.myRankLabel}>
                Your ranking
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ sm: 'center' }}>
                <Typography variant="h3" sx={{ color: rankColor(myRank.rank), fontWeight: 800 }}>
                  #{myRank.rank}
                </Typography>
                <Stack spacing={0.5} sx={{ flex: 1 }}>
                  <LeaderboardNameCell name={leaderboardStudentName(myRank)} />
                  <Typography variant="body2" color="text.secondary">
                    {myRank.scoreLabel ?? `${myRank.score}%`} · {myRank.durationUsed ?? '—'} ·{' '}
                    {myRank.detailLabel ?? '—'}
                  </Typography>
                </Stack>
                <Chip
                  size="small"
                  label={myRank.passed ? 'Passed' : 'Failed'}
                  color={myRank.passed ? 'success' : 'error'}
                  variant="soft"
                />
              </Stack>
            </Stack>
          </Card>
        ) : errorMessage ? (
          <Card variant="outlined" sx={styles.myRankCard}>
            <Typography variant="body2" color="error">
              {errorMessage}
            </Typography>
          </Card>
        ) : !isLoading ? (
          <Card variant="outlined" sx={styles.myRankCard}>
            <Typography variant="body2" color="text.secondary">
              You do not have a ranking yet. Complete this quiz to appear on the leaderboard.
            </Typography>
          </Card>
        ) : null}

        <Card variant="outlined" sx={styles.panel}>
          <Stack spacing={2.5} sx={styles.panelBody}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
              <Typography variant="h6">Top {TOP_LIMIT}</Typography>
              {totalRanked > 0 ? (
                <Typography variant="body2" color="text.secondary">
                  {totalRanked} student{totalRanked === 1 ? '' : 's'} ranked
                </Typography>
              ) : null}
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
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {leaderboard.map((row) => (
                      <LeaderboardRow key={row.id} row={row} />
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Box sx={styles.emptyState}>
                <Typography variant="body2" color={errorMessage ? 'error' : 'text.secondary'}>
                  {errorMessage ||
                    'No submitted attempts yet. Rankings appear after students complete this quiz.'}
                </Typography>
              </Box>
            )}
          </Stack>
        </Card>
      </Stack>
    </StudentWorkspaceShell>
  );
}
