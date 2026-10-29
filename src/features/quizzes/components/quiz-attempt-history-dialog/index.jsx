import { useMemo, useEffect } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import LinearProgress from '@mui/material/LinearProgress';
import CircularProgress from '@mui/material/CircularProgress';

import { useLmsQuizResults, useLmsAssignmentResults } from 'src/hooks/use-lms';

import { fDate } from 'src/utils/format-time';

import { Iconify } from 'src/components/iconify';

import { styles } from './styles';

function formatDuration(label) {
  const match = String(label ?? '').match(/(\d+)\s*m\s+(\d+)\s*s/i);
  if (!match) {
    return label || '—';
  }

  const minutes = Number(match[1]);
  const seconds = Number(match[2]);
  if (minutes <= 0) {
    return `${seconds}s`;
  }

  return `${minutes}m ${String(seconds).padStart(2, '0')}s`;
}

function SummaryTile({ label, value }) {
  return (
    <Box sx={styles.summaryTile}>
      <Typography variant="caption" sx={styles.summaryLabel}>
        {label}
      </Typography>
      <Typography variant="subtitle1" sx={styles.summaryValue}>
        {value}
      </Typography>
    </Box>
  );
}

export function QuizAttemptHistoryDialog({
  open,
  quiz,
  onClose,
  resultKey = 'quizId',
  useResults = useLmsQuizResults,
}) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const itemId = quiz?.quizId || quiz?.id || '';
  const { results, isLoading, mutate } = useResults(open);

  useEffect(() => {
    if (open) {
      void mutate();
    }
  }, [mutate, open]);

  const passingGrade = Number(quiz?.passingGrade) > 0 ? Number(quiz.passingGrade) : 70;

  const attempts = useMemo(() => {
    if (!itemId) {
      return [];
    }
    return results.filter((result) => result[resultKey] === itemId);
  }, [itemId, resultKey, results]);

  const bestScore = attempts.length ? Math.max(...attempts.map((result) => Number(result.score) || 0)) : null;
  const latest = attempts[0] ?? null;
  const courseTitle = typeof quiz?.courseTitle === 'string' ? quiz.courseTitle.trim() : '';

  return (
    <Dialog
      fullWidth
      fullScreen={fullScreen}
      maxWidth="sm"
      open={open}
      onClose={onClose}
      aria-labelledby="quiz-attempt-history-title"
    >
      <IconButton aria-label="Close attempt history" onClick={onClose} sx={styles.closeBtn}>
        <Iconify icon="mingcute:close-line" />
      </IconButton>

      <DialogTitle id="quiz-attempt-history-title" sx={styles.title}>
        {quiz?.title || 'Attempt history'}
      </DialogTitle>
      <Typography variant="body2" sx={styles.subtitle}>
        {courseTitle ? `${courseTitle} · ` : ''}
        Passing grade {passingGrade}%. Newest attempt first.
      </Typography>

      <DialogContent dividers sx={styles.content}>
        {isLoading && attempts.length === 0 ? (
          <Stack sx={{ py: 6, alignItems: 'center' }}>
            <CircularProgress size={28} aria-label="Loading attempt history" />
          </Stack>
        ) : null}

        {!isLoading && attempts.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No attempts found yet.
          </Typography>
        ) : null}

        {attempts.length > 0 ? (
          <>
            <Box sx={styles.summaryGrid}>
              <SummaryTile label="Attempts" value={String(attempts.length)} />
              <SummaryTile label="Best score" value={`${bestScore}%`} />
              <SummaryTile label="Latest" value={fDate(latest?.date) || '—'} />
            </Box>

            <Stack sx={styles.attemptList}>
              {attempts.map((result, index) => {
                const score = Number(result.score) || 0;
                const passed = score >= passingGrade;
                const attemptNumber = attempts.length - index;
                const isLatest = index === 0;
                const isBest = score === bestScore;

                return (
                  <Box key={result.id ?? `${result.date}-${index}`} sx={styles.attemptCard(passed)}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Box sx={styles.scoreBadge(passed)}>{score}%</Box>
                      <Stack spacing={0.5} sx={{ flex: 1, minWidth: 0 }}>
                        <Stack direction="row" spacing={0.75} alignItems="center" flexWrap="wrap" useFlexGap>
                          <Typography variant="subtitle2" sx={styles.attemptTitle}>
                            Attempt {attemptNumber}
                          </Typography>
                          <Chip
                            size="small"
                            label={passed ? 'Passed' : 'Failed'}
                            color={passed ? 'success' : 'error'}
                            variant="soft"
                            sx={styles.chip}
                          />
                          {isLatest ? (
                            <Chip size="small" label="Latest" variant="soft" sx={styles.chip} />
                          ) : null}
                          {isBest && attempts.length > 1 ? (
                            <Chip size="small" label="Best" color="success" variant="soft" sx={styles.chip} />
                          ) : null}
                        </Stack>
                        <Typography variant="caption" sx={styles.attemptMeta}>
                          {fDate(result.date) || result.date} · {result.correctAnswers}/{result.totalQuestions}{' '}
                          correct · {formatDuration(result.durationUsed)}
                        </Typography>
                      </Stack>
                    </Stack>
                    <LinearProgress
                      variant="determinate"
                      value={Math.max(0, Math.min(100, score))}
                      color={passed ? 'success' : 'error'}
                      sx={styles.scoreBar}
                    />
                  </Box>
                );
              })}
            </Stack>
          </>
        ) : null}
      </DialogContent>

      <DialogActions>
        <Button color="inherit" onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export function AssignmentAttemptHistoryDialog({ open, assignment, onClose }) {
  return (
    <QuizAttemptHistoryDialog
      open={open}
      onClose={onClose}
      resultKey="assignmentId"
      useResults={useLmsAssignmentResults}
      quiz={{
        id: assignment?.id,
        title: assignment?.title,
        courseTitle: typeof assignment?.course === 'string' ? assignment.course : '',
        passingGrade: assignment?.passingGrade,
      }}
    />
  );
}
