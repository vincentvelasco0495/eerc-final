import { useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router';

import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import TableContainer from '@mui/material/TableContainer';
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

import { LmsStatCard } from 'src/components/ui/lms-stat-card';
import { LmsPageShell } from 'src/components/layout/lms-page-shell';
import { ExportExcelButton } from 'src/components/export-excel-button';

import { styles } from './styles';

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
    if (!quizId) {
      return results;
    }
    return results.filter((result) => result.quizId === quizId);
  }, [results, quizId]);

  const bestScore = scopedResults.length ? Math.max(...scopedResults.map((result) => result.score)) : 0;
  const backToCourseHref = courseLookup ? paths.dashboard.courseDetails(courseLookup) : null;

  return (
    <LmsPageShell
      heading={quizId ? `${quiz?.title || 'Quiz'} attempt history` : 'Quiz history'}
      links={[{ name: 'Quizzes' }, { name: 'History' }]}
      eyebrow="Attempt archive"
      description="Cleaner historical visibility into quiz performance, scoring trends, and previous timed attempts."
    >
      {backToCourseHref ? (
        <Button component={RouterLink} href={backToCourseHref} color="inherit" sx={{ mb: 2 }}>
          Back to course
        </Button>
      ) : null}

      {isLoading ? (
        <Stack sx={{ py: 6, alignItems: 'center' }}>
          <CircularProgress aria-label="Loading quiz history" />
        </Stack>
      ) : null}

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <LmsStatCard
            title="Attempts logged"
            value={scopedResults.length}
            caption={quizId ? 'For this quiz' : 'Across all tracked quizzes'}
            icon="solar:history-bold-duotone"
            tone="primary"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <LmsStatCard
            title="Best score"
            value={`${bestScore}%`}
            caption="Top result in history"
            icon="solar:trophy-bold-duotone"
            tone="success"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <LmsStatCard
            title="Latest activity"
            value={scopedResults[0]?.date ?? 'N/A'}
            caption="Most recent recorded attempt"
            icon="solar:calendar-bold-duotone"
            tone="info"
          />
        </Grid>

        <Grid item xs={12}>
          <Card sx={styles.cardBorderVars}>
            <CardContent>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                spacing={2}
                sx={styles.tableHeading}
              >
                <Typography variant="h6">Attempt records</Typography>
                <ExportExcelButton
                  fileName="quiz-history"
                  sheetName="Attempts"
                  headers={['Date', 'Quiz', 'Score', 'Correct', 'Time used']}
                  rows={scopedResults}
                  mapRow={(row) => [
                    row.date ?? '',
                    row.quizId ?? '',
                    row.score != null ? `${row.score}%` : '',
                    `${row.correctAnswers ?? ''}/${row.totalQuestions ?? ''}`,
                    row.durationUsed ?? '',
                  ]}
                  disabled={!scopedResults.length}
                />
              </Stack>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Quiz</TableCell>
                      <TableCell>Score</TableCell>
                      <TableCell>Correct</TableCell>
                      <TableCell>Time used</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {scopedResults.map((result) => (
                      <TableRow key={result.id} hover>
                        <TableCell>{result.date}</TableCell>
                        <TableCell>{result.quizId}</TableCell>
                        <TableCell>{result.score}%</TableCell>
                        <TableCell>
                          {result.correctAnswers}/{result.totalQuestions}
                        </TableCell>
                        <TableCell>{result.durationUsed}</TableCell>
                      </TableRow>
                    ))}
                    {scopedResults.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5}>
                          <Typography variant="body2" color="text.secondary">
                            No attempts found yet.
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : null}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </LmsPageShell>
  );
}
