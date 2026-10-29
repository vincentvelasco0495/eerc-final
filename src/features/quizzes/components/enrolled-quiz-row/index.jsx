import { useState } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { styles } from './styles';
import { QuizAttemptHistoryDialog } from '../quiz-attempt-history-dialog';

function QuizMetaBlock({ label, value }) {
  return (
    <Stack spacing={0.35} sx={styles.metaBlock}>
      <Typography variant="caption" sx={styles.metaCaption}>
        {label}
      </Typography>
      <Typography variant="body2" sx={styles.metaValue}>
        {value}
      </Typography>
    </Stack>
  );
}

function statusChipColor(status) {
  if (status === 'Passed') {
    return 'success';
  }
  if (status === 'Failed') {
    return 'error';
  }
  return 'warning';
}

function gradeAvatarSx(status) {
  if (status === 'Passed') {
    return { bgcolor: 'success.main', color: 'common.white' };
  }
  if (status === 'Failed') {
    return { bgcolor: 'error.main', color: 'common.white' };
  }
  return { bgcolor: 'warning.darker', color: 'warning.light' };
}

function resolveQuizId(quiz) {
  return (
    (typeof quiz?.quizId === 'string' && quiz.quizId.trim()) ||
    (typeof quiz?.id === 'string' && quiz.id.trim()) ||
    ''
  );
}

function resolveCourseKey(quiz) {
  return (
    (typeof quiz?.courseSlug === 'string' && quiz.courseSlug.trim()) ||
    (typeof quiz?.courseId === 'string' && quiz.courseId.trim()) ||
    ''
  );
}

function resolveQuizHref(quiz) {
  const courseKey = resolveCourseKey(quiz);
  const quizId = resolveQuizId(quiz);

  if (courseKey && quizId) {
    return paths.dashboard.courseQuiz(courseKey, quizId);
  }

  return quizId ? paths.dashboard.quizzes.details(quizId) : null;
}

function canRetakeQuiz(quiz) {
  if (quiz?.status !== 'Passed' && quiz?.status !== 'Failed') {
    return false;
  }

  const used = Number(quiz?.attemptsUsed) || 0;
  const allowed = Number(quiz?.attemptsAllowed) || 0;
  if (quiz?.limitedRetakeAttempts && allowed > 0 && used >= allowed) {
    return false;
  }

  if (quiz.status === 'Passed' && !quiz.retakeAfterPass) {
    return false;
  }

  return true;
}

function resolveRetakeHref(quiz) {
  const courseKey = resolveCourseKey(quiz);
  const quizId = resolveQuizId(quiz);
  if (!canRetakeQuiz(quiz) || !courseKey || !quizId) {
    return null;
  }

  return `${paths.dashboard.courseQuizTake(courseKey, quizId)}?new=1`;
}

export function EnrolledQuizRow({ quiz, isLast }) {
  const startHref = resolveQuizHref(quiz);
  const quizId = resolveQuizId(quiz);
  const leaderboardHref =
    quizId && quiz.status !== 'Pending' ? paths.dashboard.quizzes.leaderboard(quizId) : null;
  const actionHref = quiz.status === 'Pending' ? startHref : leaderboardHref;
  const actionLabel = quiz.status === 'Pending' ? 'Start' : 'Leaderboard';
  const retakeHref = resolveRetakeHref(quiz);
  const [historyOpen, setHistoryOpen] = useState(false);
  const showHistory = Boolean(quizId) && (Number(quiz?.attemptsUsed) || 0) > 0;

  return (
    <Box sx={styles.row(isLast)}>
      <Stack
        direction={{ xs: 'row', md: 'column' }}
        spacing={{ xs: 1, md: 1.25 }}
        alignItems={{ xs: 'center', md: 'flex-start' }}
        justifyContent="space-between"
        sx={styles.titleCol}
      >
        <Typography variant="subtitle2" sx={styles.quizTitle}>
          {quiz.title}
        </Typography>
        <Chip
          size="small"
          label={quiz.status}
          color={statusChipColor(quiz.status)}
          variant="soft"
          sx={[styles.statusChip, { flexShrink: 0 }]}
        />
      </Stack>

      <Box sx={styles.metricsCol}>
        <QuizMetaBlock label="Attempts" value={quiz.attemptsLabel} />
        <QuizMetaBlock label="Questions" value={quiz.questionsLabel} />
      </Box>

      <Stack direction="row" spacing={1.25} alignItems="center" sx={styles.scoreCol}>
        <Avatar sx={[styles.gradeAvatar, gradeAvatarSx(quiz.status)]}>{quiz.gradeLabel}</Avatar>
        <Stack spacing={0.15} sx={styles.scoreText}>
          <Typography variant="body2" sx={styles.gradeScoreLine}>
            {quiz.scoreLabel}
          </Typography>
          <Typography variant="caption" sx={styles.gradeProgress}>
            {quiz.progressLabel}
          </Typography>
        </Stack>
      </Stack>

      <Box sx={styles.actionCol}>
        {showHistory ? (
          <Button
            size="small"
            variant="outlined"
            color="inherit"
            sx={styles.actionBtn}
            onClick={() => setHistoryOpen(true)}
          >
            History
          </Button>
        ) : null}
        {retakeHref ? (
          <Button
            component={RouterLink}
            href={retakeHref}
            size="small"
            variant="outlined"
            color="inherit"
            sx={styles.actionBtn}
          >
            Retake
          </Button>
        ) : null}
        {actionHref ? (
          <Button
            component={RouterLink}
            href={actionHref}
            size="small"
            variant={quiz.status === 'Pending' ? 'contained' : 'soft'}
            color={quiz.status === 'Pending' ? 'primary' : 'inherit'}
            disableElevation
            sx={styles.actionBtn}
          >
            {actionLabel}
          </Button>
        ) : null}
      </Box>

      {showHistory ? (
        <QuizAttemptHistoryDialog open={historyOpen} quiz={quiz} onClose={() => setHistoryOpen(false)} />
      ) : null}
    </Box>
  );
}
