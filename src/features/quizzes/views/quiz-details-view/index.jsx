import { useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import LinearProgress from '@mui/material/LinearProgress';

import { paths } from 'src/routes/paths';

import { useLmsQuiz, useLmsActions, useLmsQuizHistory, useLmsQuestionSets } from 'src/hooks/use-lms';

import { Iconify } from 'src/components/iconify';
import { LmsStatCard } from 'src/components/ui/lms-stat-card';
import { LmsPageShell } from 'src/components/layout/lms-page-shell';

import { styles } from './styles';

function SettingRow({ icon, label, value, hint }) {
  return (
    <Stack direction="row" spacing={1.5} alignItems="flex-start" sx={styles.settingRow}>
      <Box sx={styles.settingIconWrap}>
        <Iconify icon={icon} width={18} />
      </Box>
      <Stack spacing={0.25} sx={styles.settingText}>
        <Typography variant="caption" sx={styles.settingLabel}>
          {label}
        </Typography>
        <Typography variant="body2" sx={styles.settingValue}>
          {value}
        </Typography>
        {hint ? (
          <Typography variant="caption" sx={styles.settingHint}>
            {hint}
          </Typography>
        ) : null}
      </Stack>
    </Stack>
  );
}

function formatDurationLabel(quiz) {
  const minutes = Number(quiz?.durationMinutes);
  if (Number.isFinite(minutes) && minutes > 0) {
    return `${minutes} minute${minutes === 1 ? '' : 's'}`;
  }
  return 'No time limit';
}

function resolvePassingGrade(quiz) {
  const grade = Number(quiz?.passingGrade);
  return Number.isFinite(grade) && grade > 0 ? grade : 70;
}

function resolveAttemptsLabel(quiz) {
  const allowed = Number(quiz?.attemptsAllowed);
  const used = Number(quiz?.attemptsUsed) || 0;
  if (!Number.isFinite(allowed) || allowed <= 0) {
    return { value: 'Unlimited', hint: `${used} attempt${used === 1 ? '' : 's'} recorded` };
  }
  const remaining = Math.max(0, allowed - used);
  return {
    value: `${remaining} of ${allowed} remaining`,
    hint: `${used} used so far`,
  };
}

function QuestionPreviewItem({ question, index }) {
  const choices = Array.isArray(question?.choices) ? question.choices : [];

  return (
    <Box sx={styles.questionItem}>
      <Stack direction="row" spacing={1.25} alignItems="flex-start">
        <Chip label={`Q${index + 1}`} size="small" color="primary" variant="soft" sx={styles.questionChip} />
        <Stack spacing={0.75} sx={styles.questionBody}>
          <Typography variant="subtitle2" sx={styles.questionPrompt}>
            {question.prompt}
          </Typography>
          {choices.length ? (
            <Stack spacing={0.5}>
              {choices.map((choice, choiceIndex) => (
                <Typography key={`${question.id}-${choiceIndex}`} variant="caption" sx={styles.choiceLine}>
                  {String.fromCharCode(65 + choiceIndex)}. {choice}
                </Typography>
              ))}
            </Stack>
          ) : (
            <Typography variant="caption" sx={styles.choiceLine}>
              No answer choices configured.
            </Typography>
          )}
        </Stack>
      </Stack>
    </Box>
  );
}

export function QuizDetailsView({ quizId }) {
  const quiz = useLmsQuiz(quizId);
  const history = useLmsQuizHistory(quizId);
  const questionSets = useLmsQuestionSets();
  const { fetchQuestionSet, simulateQuiz } = useLmsActions();

  useEffect(() => {
    if (quizId) {
      fetchQuestionSet(quizId);
    }
  }, [fetchQuestionSet, quizId]);

  if (!quiz) {
    return (
      <LmsPageShell heading="Quiz not found" links={[{ name: 'Quizzes', href: paths.dashboard.quizzes.root }]}>
        <Box sx={styles.emptyState}>
          <Typography variant="subtitle1" sx={styles.emptyTitle}>
            Quiz unavailable
          </Typography>
          <Typography variant="body2" sx={styles.emptyText}>
            This quiz could not be loaded. It may have been removed or you may not have access.
          </Typography>
        </Box>
      </LmsPageShell>
    );
  }

  const questions = questionSets[quizId] ?? [];
  const previewCount = Math.max(0, Number(quiz.questionCount) || 0);
  const previewQuestions = questions.slice(0, previewCount || questions.length);
  const passingGrade = resolvePassingGrade(quiz);
  const attempts = resolveAttemptsLabel(quiz);
  const bestScore = Number(quiz.bestScore) || 0;
  const attemptsAllowed = Number(quiz.attemptsAllowed) || 0;
  const attemptsUsed = Number(quiz.attemptsUsed) || 0;
  const attemptProgress =
    attemptsAllowed > 0 ? Math.min(100, Math.round((attemptsUsed / attemptsAllowed) * 100)) : 0;

  return (
    <LmsPageShell
      heading={quiz.title}
      eyebrow="Assessment detail"
      description="Review quiz rules, preview the question pool, and simulate an attempt before taking the assessment."
      links={[
        { name: 'Quizzes', href: paths.dashboard.quizzes.root },
        { name: quiz.title },
      ]}
      action={
        <Button
          onClick={() => simulateQuiz(quiz.id)}
          variant="contained"
          disableElevation
          startIcon={<Iconify icon="solar:play-circle-bold" width={20} />}
        >
          Simulate attempt
        </Button>
      }
    >
      <Stack spacing={3}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6, xl: 3 }}>
            <LmsStatCard
              title="Time limit"
              value={formatDurationLabel(quiz)}
              caption="Per quiz attempt"
              icon="solar:clock-circle-bold-duotone"
              tone="warning"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, xl: 3 }}>
            <LmsStatCard
              title="Question pool"
              value={quiz.questionPoolCount}
              caption={`${quiz.questionCount} drawn each attempt`}
              icon="solar:question-circle-bold-duotone"
              tone="info"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, xl: 3 }}>
            <LmsStatCard
              title="Attempts"
              value={attemptsAllowed > 0 ? `${attemptsUsed}/${attemptsAllowed}` : attemptsUsed}
              caption={attemptsAllowed > 0 ? attempts.value : 'Unlimited attempts'}
              icon="solar:restart-bold-duotone"
              tone="primary"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, xl: 3 }}>
            <LmsStatCard
              title="Best score"
              value={`${bestScore}%`}
              caption={`${history.length} recorded attempt${history.length === 1 ? '' : 's'}`}
              icon="solar:trophy-bold-duotone"
              tone="success"
            />
          </Grid>
        </Grid>

        <Grid container spacing={3} alignItems="stretch">
          <Grid size={{ xs: 12, lg: 4 }}>
            <Stack spacing={2.5} sx={styles.sidebarStack}>
              <Card sx={styles.card}>
                <CardContent sx={styles.cardContent}>
                  <Stack spacing={2.5}>
                    <Stack spacing={0.5}>
                      <Typography variant="h6" sx={styles.sectionTitle}>
                        Quiz configuration
                      </Typography>
                      <Typography variant="body2" sx={styles.sectionSubtitle}>
                        Rules and grading applied to each attempt.
                      </Typography>
                    </Stack>

                    <Stack spacing={2}>
                      <SettingRow
                        icon="solar:medal-ribbons-star-bold-duotone"
                        label="Passing grade"
                        value={`${passingGrade}%`}
                        hint="Minimum score required to pass"
                      />
                      <SettingRow
                        icon="solar:clock-circle-bold-duotone"
                        label="Time limit"
                        value={formatDurationLabel(quiz)}
                      />
                      <SettingRow
                        icon="solar:shuffle-bold-duotone"
                        label="Question selection"
                        value={
                          quiz.randomizeQuestions
                            ? `Random ${quiz.questionCount} from ${quiz.questionPoolCount}`
                            : `${quiz.questionCount} fixed questions`
                        }
                      />
                      <SettingRow
                        icon="solar:restart-bold-duotone"
                        label="Attempt allowance"
                        value={attempts.value}
                        hint={attempts.hint}
                      />
                    </Stack>

                    {attemptsAllowed > 0 ? (
                      <Box>
                        <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.75 }}>
                          <Typography variant="caption" sx={styles.progressCaption}>
                            Attempt usage
                          </Typography>
                          <Typography variant="caption" sx={styles.progressCaption}>
                            {attemptsUsed}/{attemptsAllowed}
                          </Typography>
                        </Stack>
                        <LinearProgress
                          variant="determinate"
                          value={attemptProgress}
                          sx={styles.attemptProgress}
                        />
                      </Box>
                    ) : null}

                    <Divider />

                    <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap>
                      {quiz.randomizeQuestions ? (
                        <Chip size="small" label="Randomized questions" variant="soft" color="info" />
                      ) : null}
                      {quiz.randomizeAnswers ? (
                        <Chip size="small" label="Randomized answers" variant="soft" color="info" />
                      ) : null}
                      {quiz.showCorrectAnswer ? (
                        <Chip size="small" label="Shows correct answer" variant="soft" color="success" />
                      ) : null}
                      {quiz.quizAttemptHistory ? (
                        <Chip size="small" label="Attempt history enabled" variant="soft" />
                      ) : null}
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>

              {history.length > 0 ? (
                <Card sx={styles.card}>
                  <CardContent sx={styles.cardContent}>
                    <Stack spacing={1.5}>
                      <Typography variant="h6" sx={styles.sectionTitle}>
                        Recent attempts
                      </Typography>
                      <Stack spacing={1}>
                        {history.slice(0, 3).map((attempt, index) => (
                          <Stack
                            key={attempt.id ?? index}
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                            sx={styles.historyRow}
                          >
                            <Typography variant="body2" sx={styles.historyLabel}>
                              Attempt {history.length - index}
                            </Typography>
                            <Chip
                              size="small"
                              label={`${attempt.score ?? 0}%`}
                              color={(attempt.score ?? 0) >= passingGrade ? 'success' : 'error'}
                              variant="soft"
                            />
                          </Stack>
                        ))}
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              ) : null}
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, lg: 8 }}>
            <Card sx={[styles.card, styles.previewCard]}>
              <CardContent sx={styles.cardContent}>
                <Stack spacing={2.5}>
                  <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={1.5}
                    justifyContent="space-between"
                    alignItems={{ xs: 'flex-start', sm: 'center' }}
                  >
                    <Stack spacing={0.5}>
                      <Typography variant="h6" sx={styles.sectionTitle}>
                        Question preview
                      </Typography>
                      <Typography variant="body2" sx={styles.sectionSubtitle}>
                        Sample of questions that may appear on your next attempt.
                      </Typography>
                    </Stack>
                    <Chip
                      label={`${previewQuestions.length} shown`}
                      size="small"
                      variant="soft"
                      color="primary"
                      sx={styles.previewCountChip}
                    />
                  </Stack>

                  {previewQuestions.length ? (
                    <Stack spacing={0} sx={styles.questionList}>
                      {previewQuestions.map((question, index) => (
                        <QuestionPreviewItem
                          key={question.id}
                          question={question}
                          index={index}
                        />
                      ))}
                    </Stack>
                  ) : (
                    <Box sx={styles.emptyPreview}>
                      <Stack spacing={1.25} alignItems="center" textAlign="center">
                        <Box sx={styles.emptyPreviewIcon}>
                          <Iconify icon="solar:document-text-bold-duotone" width={28} />
                        </Box>
                        <Typography variant="subtitle2" sx={styles.emptyTitle}>
                          No questions to preview yet
                        </Typography>
                        <Typography variant="body2" sx={styles.emptyText}>
                          Questions will appear here once the quiz pool is configured by your instructor.
                        </Typography>
                      </Stack>
                    </Box>
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Stack>
    </LmsPageShell>
  );
}
