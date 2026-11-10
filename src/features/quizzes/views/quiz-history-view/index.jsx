import { useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import CircularProgress from '@mui/material/CircularProgress';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import {
  useLmsQuiz,
  useLmsQuizResults,
  useLmsModulesByCourse,
  extractQuizzesFromModules,
  useResolvedCourseIdFromLookup,
} from 'src/hooks/use-lms';

import { fDate } from 'src/utils/format-time';

import { downloadLmsExcelExport } from 'src/lib/lms-excel-export';
import { sortAttemptsNewestFirst } from 'src/features/quizzes/utils/sort-attempts';
import { StudentWorkspaceShell } from 'src/features/student-profile/components/student-workspace-shell';

import { Iconify } from 'src/components/iconify';
import { ExportExcelButton } from 'src/components/export-excel-button';

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

function passingGradeFor(result, quiz, quizId) {
  const fromResult = Number(result?.passingGrade);
  if (fromResult > 0) {
    return fromResult;
  }
  if (quiz && (result?.quizId === quiz.id || result?.quizId === quizId)) {
    const fromQuiz = Number(quiz.passingGrade);
    if (fromQuiz > 0) {
      return fromQuiz;
    }
  }
  return 70;
}

function quizTitleFor(result, quiz, quizId) {
  const fromResult = typeof result?.quizTitle === 'string' ? result.quizTitle.trim() : '';
  if (fromResult) {
    return fromResult;
  }
  if (quiz?.title && (!quizId || result?.quizId === quizId || result?.quizId === quiz.id)) {
    return quiz.title;
  }
  return 'Quiz';
}

function SummaryTile({ label, value }) {
  return (
    <Box sx={styles.summaryTile}>
      <Typography variant="caption" sx={styles.summaryLabel}>
        {label}
      </Typography>
      <Typography variant="h5" sx={styles.summaryValue}>
        {value}
      </Typography>
    </Box>
  );
}

export function QuizHistoryView() {
  const [searchParams] = useSearchParams();
  const quizId = searchParams.get('quizId') ?? '';
  const courseLookup = searchParams.get('course') ?? '';
  const { results, isLoading, mutate } = useLmsQuizResults();
  const quizFromCatalog = useLmsQuiz(quizId);
  const resolvedCourseId = useResolvedCourseIdFromLookup(courseLookup);
  const { modules } = useLmsModulesByCourse(resolvedCourseId);
  const quizFromCourse = useMemo(() => {
    if (!quizId) {
      return null;
    }
    return extractQuizzesFromModules(modules).find((item) => item.id === quizId) ?? null;
  }, [modules, quizId]);
  const quiz = quizFromCourse ?? quizFromCatalog;

  useEffect(() => {
    void mutate();
  }, [mutate, quizId]);

  const scopedResults = useMemo(() => {
    const filtered = quizId ? results.filter((result) => result.quizId === quizId) : results;
    return sortAttemptsNewestFirst(filtered);
  }, [quizId, results]);

  const attemptNumberById = useMemo(() => {
    const counts = new Map();
    const numbers = new Map();
    for (let index = scopedResults.length - 1; index >= 0; index -= 1) {
      const result = scopedResults[index];
      const key = result.quizId || result.id;
      const next = (counts.get(key) || 0) + 1;
      counts.set(key, next);
      numbers.set(result.id ?? `${key}-${index}`, next);
    }
    return numbers;
  }, [scopedResults]);

  const bestScore = scopedResults.length
    ? Math.max(...scopedResults.map((result) => Number(result.score) || 0))
    : null;
  const latest = scopedResults[0] ?? null;
  const pagePassingGrade = passingGradeFor(latest, quiz, quizId);
  const pageTitle = quizId ? quiz?.title || 'Quiz' : 'Quiz history';
  const backHref = courseLookup
    ? paths.dashboard.courseDetails(courseLookup)
    : paths.dashboard.quizzes.root;
  const backLabel = courseLookup ? 'Back to course' : 'Back to quizzes';

  return (
    <StudentWorkspaceShell>
      <Stack spacing={3}>
        <Button
          component={RouterLink}
          href={backHref}
          color="inherit"
          startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
          sx={{ alignSelf: 'flex-start' }}
        >
          {backLabel}
        </Button>

        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={2}
          alignItems={{ md: 'flex-start' }}
          justifyContent="space-between"
        >
          <Stack spacing={0.75}>
            <Typography variant="overline" sx={styles.overline}>
              Attempt history
            </Typography>
            <Typography variant="h4" sx={styles.title}>
              {pageTitle}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {quizId
                ? `Passing grade ${pagePassingGrade}%. Newest attempt first.`
                : 'Newest attempt first.'}
            </Typography>
          </Stack>

          <ExportExcelButton
            disabled={isLoading}
            onExport={({ from, to }) =>
              downloadLmsExcelExport('/api/quiz-results/export', { quizId, from, to }, 'quiz-history.xlsx')
            }
            successMessage="Quiz history exported to Excel."
          />
        </Stack>

        {isLoading && scopedResults.length === 0 ? (
          <Stack sx={{ py: 8, alignItems: 'center' }}>
            <CircularProgress aria-label="Loading quiz history" />
          </Stack>
        ) : null}

        {!isLoading && scopedResults.length === 0 ? (
          <Box sx={styles.emptyState}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              No attempts yet
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
              Finish this quiz to see your score, correct answers, and time here.
            </Typography>
          </Box>
        ) : null}

        {scopedResults.length > 0 ? (
          <>
            <Box sx={styles.summaryGrid}>
              <SummaryTile label="Attempts" value={String(scopedResults.length)} />
              <SummaryTile label="Best score" value={`${bestScore}%`} />
              <SummaryTile label="Latest" value={fDate(latest?.date) || latest?.date || '—'} />
            </Box>

            <Stack sx={styles.attemptList}>
              {scopedResults.map((result, index) => {
                const score = Number(result.score) || 0;
                const passingGrade = passingGradeFor(result, quiz, quizId);
                const passed = score >= passingGrade;
                const attemptKey = result.id ?? `${result.quizId}-${index}`;
                const attemptNumber = attemptNumberById.get(attemptKey) ?? scopedResults.length - index;
                const quizTitle = quizTitleFor(result, quiz, quizId);
                const isLatest = index === 0;
                const isBest = score === bestScore;

                return (
                  <Box key={attemptKey} sx={styles.attemptCard(passed)}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Box sx={styles.scoreBadge(passed)}>{score}%</Box>
                      <Stack spacing={0.75} sx={{ flex: 1, minWidth: 0 }}>
                        <Stack direction="row" spacing={0.75} alignItems="center" flexWrap="wrap" useFlexGap>
                          <Typography variant="subtitle1" sx={styles.attemptTitle}>
                            {quizId ? `Attempt ${attemptNumber}` : quizTitle}
                          </Typography>
                          <Chip
                            size="small"
                            label={passed ? 'Passed' : 'Failed'}
                            color={passed ? 'success' : 'error'}
                            variant="soft"
                            sx={styles.chip}
                          />
                          {isLatest ? <Chip size="small" label="Latest" variant="soft" sx={styles.chip} /> : null}
                          {isBest && scopedResults.length > 1 ? (
                            <Chip size="small" label="Best" color="success" variant="soft" sx={styles.chip} />
                          ) : null}
                        </Stack>
                        {!quizId ? (
                          <Typography variant="body2" color="text.secondary">
                            Attempt {attemptNumber}
                          </Typography>
                        ) : null}
                        <Typography variant="body2" sx={styles.attemptMeta}>
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
      </Stack>
    </StudentWorkspaceShell>
  );
}
