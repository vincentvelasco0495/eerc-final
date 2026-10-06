import { useParams, useNavigate } from 'react-router';
import { useRef, useMemo, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Radio from '@mui/material/Radio';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';
import CircularProgress from '@mui/material/CircularProgress';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import {
  useLmsActions,
  useLmsCourseByLookup,
  useLmsLessonProgress,
  useLmsModulesByCourse,
  extractQuizzesFromModules,
  extractAssignmentsFromModules,
} from 'src/hooks/use-lms';

import { resolveApiAssetUrl } from 'src/utils/resolve-api-asset-url';

import { CONFIG } from 'src/global-config';
import { DashboardContent } from 'src/layouts/dashboard';
import { guestCanAccessLesson } from 'src/features/courses/utils/lesson-preview-access';
import { useLmsCourseDetailShell } from 'src/features/courses/hooks/use-lms-course-detail-shell';

import { Iconify } from 'src/components/iconify';
import { CourseDetailBackArrowSvg } from 'src/components/course-detail/course-detail-back-arrow';

import { useAuthContext } from 'src/auth/hooks';

import {
  rootSx,
  columnSx,
  timerBoxSx,
  bottomBarSx,
  headerRowSx,
  optionRowSx,
  resultBannerSx,
  resultActionBtnSx,
} from '../course-quiz-take-view/styles';
import {
  formatCountdown,
  computeAssignmentScore,
  readAssignmentAttemptsUsed,
  assignmentSessionStorageKey,
  writeAssignmentAttemptsUsed,
  normalizeAssignmentQuestions,
  resolveAssignmentDurationMinutes,
} from './assignment-take-utils';

function formatAssignmentDurationLabel(assignment) {
  const duration = Number(assignment?.duration);
  const unit = assignment?.timeUnit === 'hours' ? 'hours' : 'minutes';
  if (!Number.isFinite(duration) || duration <= 0) {
    return '—';
  }
  if (unit === 'hours') {
    return `${duration} hour${duration === 1 ? '' : 's'}`;
  }
  return `${duration} minute${duration === 1 ? '' : 's'}`;
}

function materialFileUrl(material) {
  const id = typeof material?.id === 'string' ? material.id.trim() : '';
  const base = String(CONFIG.serverUrl ?? '').trim().replace(/\/$/, '');
  if (id && base) {
    return `${base}/api/lesson-materials/${encodeURIComponent(id)}/file`;
  }
  return resolveApiAssetUrl(material?.fileUrl ?? material?.inlineFileUrl);
}

function AssignmentIntroPanel({
  title,
  courseLinkHref,
  assignment,
  questionCount,
  attemptsUsed,
  contentHtml,
  materials,
  questionsLoading,
  loadError,
  onStart,
  startDisabled,
  theme,
}) {
  const attemptsAllowed =
    typeof assignment?.attemptsAllowed === 'number' && Number.isFinite(assignment.attemptsAllowed)
      ? assignment.attemptsAllowed
      : 0;
  const attemptsRemaining =
    attemptsAllowed > 0 ? Math.max(0, attemptsAllowed - attemptsUsed) : null;

  return (
    <DashboardContent maxWidth="md" sx={{ py: { xs: 3, md: 4 } }}>
      <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 3 }}>
        <Box
          component={RouterLink}
          href={courseLinkHref}
          aria-label="Back to course"
          sx={{
            display: 'inline-flex',
            color: 'text.primary',
            '&:hover': { opacity: 0.72 },
          }}
        >
          <CourseDetailBackArrowSvg width={28} height={28} />
        </Box>
        <Typography variant="h4" sx={{ fontWeight: 700, lineHeight: 1.25 }}>
          {title}
        </Typography>
      </Stack>

      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        sx={{
          mb: 3,
          p: 2,
          borderRadius: 2,
          bgcolor: alpha(theme.palette.primary.main, 0.12),
        }}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <Iconify icon="solar:clipboard-list-bold-duotone" width={22} />
          <Typography variant="body2">
            {questionCount} {questionCount === 1 ? 'question' : 'questions'}
          </Typography>
        </Stack>
        <Stack direction="row" spacing={1} alignItems="center">
          <Iconify icon="solar:clock-circle-bold-duotone" width={22} />
          <Typography variant="body2">{formatAssignmentDurationLabel(assignment)}</Typography>
        </Stack>
        <Stack direction="row" spacing={1} alignItems="center">
          <Iconify icon="solar:restart-bold-duotone" width={22} />
          <Typography variant="body2">
            {attemptsAllowed > 0
              ? `${attemptsRemaining} of ${attemptsAllowed} attempt${attemptsAllowed === 1 ? '' : 's'} left`
              : 'Unlimited attempts'}
          </Typography>
        </Stack>
      </Stack>

      {contentHtml ? (
        <Box
          sx={{
            mb: 3,
            typography: 'body1',
            '& p': { mb: 1.5 },
            '& ul, & ol': { pl: 3, mb: 1.5 },
          }}
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />
      ) : (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Read each question carefully and select the best answer before submitting.
        </Typography>
      )}

      {materials.length > 0 ? (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1.5 }}>
            Assignment materials
          </Typography>
          <Stack spacing={1}>
            {materials.map((material) => {
              const href = materialFileUrl(material);
              const name = material?.name ?? 'File';
              return href ? (
                <Button
                  key={material.id}
                  component="a"
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="outlined"
                  color="inherit"
                  startIcon={<Iconify icon="solar:download-minimalistic-bold" />}
                  sx={{ justifyContent: 'flex-start' }}
                >
                  {name}
                </Button>
              ) : (
                <Typography key={material.id} variant="body2">
                  {name}
                </Typography>
              );
            })}
          </Stack>
        </Box>
      ) : null}

      {loadError ? (
        <Typography variant="body2" color="error.main" sx={{ mb: 2 }}>
          {loadError}
        </Typography>
      ) : null}

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={onStart}
          disabled={startDisabled || questionsLoading}
          startIcon={questionsLoading ? <CircularProgress size={18} color="inherit" /> : null}
        >
          {questionsLoading ? 'Loading questions…' : 'Start assignment'}
        </Button>
        <Button component={RouterLink} href={courseLinkHref} variant="outlined" color="inherit">
          Back to course
        </Button>
      </Stack>
    </DashboardContent>
  );
}

export function CourseAssignmentView() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { slug = '', courseId = '', assignmentId = '' } = useParams();
  const courseLookup = slug || courseId;
  const { authenticated } = useAuthContext();
  const isGuest = !authenticated;
  const { runCommand } = useLmsActions();

  const { course, isLoading: courseLoading } = useLmsCourseByLookup(courseLookup);
  const resolvedCourseId = course?.id ?? '';
  const { modules, isLoading: modulesLoading, mutate: mutateModules } =
    useLmsModulesByCourse(resolvedCourseId);
  const { mutate: mutateLessonProgress } = useLmsLessonProgress(
    resolvedCourseId,
    Boolean(resolvedCourseId && !isGuest)
  );

  const quizzesForCourse = useMemo(() => extractQuizzesFromModules(modules), [modules]);
  const assignmentsForCourse = useMemo(() => extractAssignmentsFromModules(modules), [modules]);
  const assignment = useMemo(
    () => assignmentsForCourse.find((row) => row.id === assignmentId) ?? null,
    [assignmentsForCourse, assignmentId]
  );

  const { shell, isLessonLocked } = useLmsCourseDetailShell(course, modules, quizzesForCourse);

  const [phase, setPhase] = useState('intro');
  const [questions, setQuestions] = useState([]);
  const [questionsLoading, setQuestionsLoading] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [selections, setSelections] = useState({});
  const [step, setStep] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [deadlineAtMs, setDeadlineAtMs] = useState(null);
  const [attemptsUsed, setAttemptsUsed] = useState(0);
  const attemptRecordedRef = useRef(false);
  const attemptSubmitRef = useRef('');
  const sentProgressRef = useRef('');

  const courseLinkHref = `${paths.dashboard.courseDetails(
    typeof course?.slug === 'string' && course.slug.trim() ? course.slug.trim() : courseLookup
  )}#quiz`;

  const durationMinutes = useMemo(() => resolveAssignmentDurationMinutes(assignment), [assignment]);
  const attemptsAllowed =
    typeof assignment?.attemptsAllowed === 'number' && Number.isFinite(assignment.attemptsAllowed)
      ? assignment.attemptsAllowed
      : 0;
  const attemptsExhausted = attemptsAllowed > 0 && attemptsUsed >= attemptsAllowed;

  useEffect(() => {
    if (!assignmentId) {
      return;
    }
    if (typeof assignment?.attemptsUsed === 'number' && Number.isFinite(assignment.attemptsUsed)) {
      setAttemptsUsed(assignment.attemptsUsed);
      return;
    }
    setAttemptsUsed(readAssignmentAttemptsUsed(assignmentId));
  }, [assignment?.attemptsUsed, assignmentId]);

  useEffect(() => {
    if (!assignmentId || courseLoading || modulesLoading) {
      return;
    }
    if (isGuest && !guestCanAccessLesson(assignmentId, modules)) {
      navigate(courseLinkHref, { replace: true });
      return;
    }
    if (shell && isLessonLocked(assignmentId)) {
      navigate(courseLinkHref, { replace: true });
    }
  }, [
    assignmentId,
    courseLoading,
    courseLinkHref,
    isGuest,
    isLessonLocked,
    modules,
    modulesLoading,
    navigate,
    shell,
  ]);

  const fetchQuestions = useCallback(async () => {
    if (!assignmentId) {
      return [];
    }
    setQuestionsLoading(true);
    setLoadError('');
    try {
      const rows = await runCommand('assignment.questions', { publicId: assignmentId });
      const normalized = normalizeAssignmentQuestions(rows);
      setQuestions(normalized);
      if (normalized.length === 0) {
        setLoadError('This assignment has no questions yet.');
      }
      return normalized;
    } catch {
      setLoadError('Could not load assignment questions.');
      setQuestions([]);
      return [];
    } finally {
      setQuestionsLoading(false);
    }
  }, [assignmentId, runCommand]);

  useEffect(() => {
    if (!assignmentId || isGuest) {
      return;
    }
    void fetchQuestions();
  }, [assignmentId, fetchQuestions, isGuest]);

  const beginAttempt = useCallback(
    async (resetTimer) => {
      let rows = questions;
      if (!rows.length) {
        rows = await fetchQuestions();
      }
      if (!rows.length) {
        return;
      }

      const totalSeconds = Math.max(0, Math.round(durationMinutes * 60));
      const shouldResetTimer = resetTimer !== false || Boolean(assignment?.resetTimeLimitOnRetake);
      const deadlineAt = totalSeconds > 0 && shouldResetTimer ? Date.now() + totalSeconds * 1000 : null;

      setSelections({});
      setStep(0);
      setDeadlineAtMs(deadlineAt);
      setSecondsLeft(totalSeconds > 0 && shouldResetTimer ? totalSeconds : 0);
      setPhase('taking');
      attemptRecordedRef.current = false;

      try {
        sessionStorage.setItem(
          assignmentSessionStorageKey(courseLookup, assignmentId),
          JSON.stringify({
            phase: 'taking',
            selections: {},
            step: 0,
            deadlineAt: deadlineAt ?? 0,
          })
        );
      } catch {
        // ignore
      }
    },
    [assignment?.resetTimeLimitOnRetake, assignmentId, courseLookup, durationMinutes, fetchQuestions, questions]
  );

  const finishAttempt = useCallback(() => {
    setPhase('complete');
    setSecondsLeft(0);
    if (!attemptRecordedRef.current) {
      attemptRecordedRef.current = true;
      const nextCount = attemptsUsed + 1;
      setAttemptsUsed(nextCount);
      writeAssignmentAttemptsUsed(assignmentId, nextCount);
    }
    try {
      sessionStorage.removeItem(assignmentSessionStorageKey(courseLookup, assignmentId));
    } catch {
      // ignore
    }
  }, [assignmentId, attemptsUsed, courseLookup]);

  useEffect(() => {
    if (phase !== 'complete' || !assignmentId || !questions.length || isGuest) {
      return;
    }
    const submissionKey = `${assignmentId}|${JSON.stringify(selections)}`;
    if (attemptSubmitRef.current === submissionKey) {
      return;
    }
    attemptSubmitRef.current = submissionKey;
    const totalSeconds = Math.max(0, Math.round(durationMinutes * 60));
    const durationUsedSeconds =
      totalSeconds > 0 && deadlineAtMs != null ? Math.max(0, totalSeconds - secondsLeft) : 0;
    void runCommand('assignment.attempt', {
      publicId: assignmentId,
      body: {
        selections,
        durationUsedSeconds,
      },
    })
      .then(() => mutateModules())
      .catch(() => {
        // Keep the assignment UX unblocked even if attempt logging fails.
      });
  }, [
    assignmentId,
    deadlineAtMs,
    durationMinutes,
    isGuest,
    mutateModules,
    phase,
    questions.length,
    runCommand,
    secondsLeft,
    selections,
  ]);

  useEffect(() => {
    if (phase !== 'complete' || !resolvedCourseId || !assignmentId || isGuest) {
      return;
    }
    const progressKey = `${resolvedCourseId}:${assignmentId}`;
    if (sentProgressRef.current === progressKey) {
      return;
    }
    sentProgressRef.current = progressKey;
    void runCommand('lessonProgress.complete', {
      coursePublicId: resolvedCourseId,
      lessonKey: assignmentId,
    })
      .then(() => Promise.all([mutateLessonProgress(), mutateModules()]))
      .catch(() => {
        sentProgressRef.current = '';
      });
  }, [
    assignmentId,
    isGuest,
    mutateLessonProgress,
    mutateModules,
    phase,
    resolvedCourseId,
    runCommand,
  ]);

  useEffect(() => {
    if (phase !== 'taking') {
      return undefined;
    }
    if (deadlineAtMs == null || deadlineAtMs <= 0) {
      setSecondsLeft(0);
      return undefined;
    }
    const tick = () => {
      const left = Math.max(0, Math.floor((deadlineAtMs - Date.now()) / 1000));
      setSecondsLeft(left);
      if (left <= 0) {
        finishAttempt();
      }
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [deadlineAtMs, finishAttempt, phase]);

  const loading = Boolean(
    courseLookup &&
      (courseLoading || modulesLoading || (resolvedCourseId && !course && !courseLoading))
  );

  if (!CONFIG.serverUrl?.trim()) {
    return (
      <DashboardContent maxWidth="md">
        <Typography variant="body2">
          Assignments require the LMS API. Set <code>VITE_SERVER_URL</code> and sign in.
        </Typography>
      </DashboardContent>
    );
  }

  if (loading) {
    return (
      <DashboardContent
        maxWidth={false}
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 'min(72dvh, 640px)',
          py: 4,
        }}
      >
        <CircularProgress aria-label="Loading assignment" />
      </DashboardContent>
    );
  }

  if (!assignment) {
    return (
      <DashboardContent maxWidth="md">
        <Button component={RouterLink} href={courseLinkHref} color="inherit" sx={{ mb: 2 }}>
          Back to course
        </Button>
        <Typography variant="body2">This assignment could not be found.</Typography>
      </DashboardContent>
    );
  }

  const title =
    typeof assignment.title === 'string' && assignment.title.trim() ? assignment.title.trim() : 'Assignment';
  const questionCount = questions.length || assignment.questionCount || 0;
  const contentHtml = String(assignment.lessonContentHtml ?? '').trim();
  const materials = Array.isArray(assignment.materials) ? assignment.materials : [];

  if (phase === 'intro') {
    return (
      <AssignmentIntroPanel
        title={title}
        courseLinkHref={courseLinkHref}
        assignment={assignment}
        questionCount={questionCount}
        attemptsUsed={attemptsUsed}
        contentHtml={contentHtml}
        materials={materials}
        questionsLoading={questionsLoading}
        loadError={loadError}
        onStart={() => void beginAttempt(true)}
        startDisabled={attemptsExhausted || questionCount === 0 || Boolean(loadError)}
        theme={theme}
      />
    );
  }

  if (!questions.length) {
    return (
      <DashboardContent maxWidth="md">
        <Button component={RouterLink} href={courseLinkHref} color="inherit" sx={{ mb: 2 }}>
          Back to course
        </Button>
        <Typography variant="body2">{loadError || 'This assignment has no questions yet.'}</Typography>
      </DashboardContent>
    );
  }

  const current = questions[step] ?? null;
  const lastIndex = Math.max(0, questions.length - 1);
  const score = computeAssignmentScore(questions, selections);
  const showRetake = phase === 'complete' && !attemptsExhausted;

  const handleSelectOption = (optionId) => {
    if (phase !== 'complete' && current) {
      setSelections((prev) => ({ ...prev, [current.id]: optionId }));
    }
  };

  const handleNext = () => {
    if (step >= lastIndex) {
      finishAttempt();
      return;
    }
    setStep((s) => Math.min(lastIndex, s + 1));
  };

  const handlePrev = () => {
    setStep((s) => Math.max(0, s - 1));
  };

  return (
    <DashboardContent maxWidth={false} sx={rootSx}>
      <Box sx={columnSx}>
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
          <Box
            component={RouterLink}
            href={courseLinkHref}
            aria-label="Back to course"
            sx={{
              display: 'inline-flex',
              color: 'text.primary',
              '&:hover': { opacity: 0.72 },
            }}
          >
            <CourseDetailBackArrowSvg width={28} height={28} />
          </Box>
          <Typography
            variant="body2"
            color="text.secondary"
            component={RouterLink}
            href={courseLinkHref}
            sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
          >
            Back to course
          </Typography>
        </Stack>

        <Box sx={headerRowSx(theme)}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
              {title}
            </Typography>
          </Box>
          <Box sx={timerBoxSx(theme)}>
            <Typography variant="caption" color="text.secondary" display="block">
              Time left
            </Typography>
            <Typography
              variant="h6"
              sx={{
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                fontWeight: 700,
                color:
                  secondsLeft <= 60 && phase === 'taking' && deadlineAtMs
                    ? 'error.main'
                    : 'text.primary',
              }}
            >
              {phase === 'taking' && deadlineAtMs ? formatCountdown(secondsLeft) : '0:00'}
            </Typography>
          </Box>
        </Box>

        {phase === 'complete' ? (
          <Box sx={resultBannerSx(theme, 'success')}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Result
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 800, color: 'success.main', lineHeight: 1.1 }}>
                {score.pct}%
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ maxWidth: 420 }}>
              {score.correct} out of {score.total} questions answered correctly.
            </Typography>
          </Box>
        ) : null}

        {phase === 'complete' && showRetake ? (
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mb: 2 }}>
            <Button
              type="button"
              variant="contained"
              color="inherit"
              sx={resultActionBtnSx}
              onClick={() => void beginAttempt(true)}
            >
              Retake assignment
            </Button>
            <Button component={RouterLink} href={courseLinkHref} variant="outlined" color="inherit" sx={resultActionBtnSx}>
              Back to course
            </Button>
          </Stack>
        ) : null}

        {current ? (
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, sm: 2.5 },
              mb: 2,
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
              bgcolor: 'background.paper',
            }}
          >
            <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', gap: 1, mb: 2 }}>
              <Typography component="span" variant="subtitle1" sx={{ fontWeight: 600, flexShrink: 0 }}>
                {step + 1}.
              </Typography>
              <Box
                component="div"
                sx={{
                  flex: '1 1 200px',
                  minWidth: 0,
                  typography: 'subtitle1',
                  fontWeight: 600,
                  color: 'text.primary',
                  '& p': { margin: '0 0 0.5em', '&:last-child': { mb: 0 } },
                  '& ul, & ol': { m: 0, pl: 2.5 },
                  '& a': { color: 'brand.accentText' },
                  '& img': { maxWidth: '100%', height: 'auto', borderRadius: 1 },
                }}
                dangerouslySetInnerHTML={{ __html: current.prompt }}
              />
            </Box>

            <Stack spacing={1.25}>
              {current.options.map((opt) => {
                const selected = selections[current.id] === opt.id;
                const disabled = phase === 'complete';
                return (
                  <Box
                    key={opt.id}
                    component="button"
                    type="button"
                    disabled={disabled}
                    onClick={() => handleSelectOption(opt.id)}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      width: '100%',
                      border: '1px solid',
                      cursor: disabled ? 'default' : 'pointer',
                      ...optionRowSx(theme, {
                        feedbackActive: false,
                        isSelected: selected,
                        isCorrect: false,
                        highlightCorrect: false,
                      }),
                    }}
                  >
                    <Radio checked={selected} size="small" sx={{ p: 0.5 }} tabIndex={-1} />
                    <Typography variant="body1" sx={{ textAlign: 'left', flex: 1 }}>
                      {opt.label}
                    </Typography>
                  </Box>
                );
              })}
            </Stack>
          </Paper>
        ) : null}

        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 2 }}>
          {questions.map((q, idx) => {
            const answered = Boolean(selections[q.id]);
            const active = idx === step;
            return (
              <Button
                key={q.id}
                size="small"
                variant={active ? 'contained' : 'outlined'}
                color={answered ? 'primary' : 'inherit'}
                onClick={() => setStep(idx)}
                sx={{ minWidth: 40 }}
              >
                {idx + 1}
              </Button>
            );
          })}
        </Stack>

        {phase === 'taking' ? (
          <Box sx={bottomBarSx(theme)}>
            <Stack direction="row" spacing={2}>
              <Button variant="outlined" color="inherit" onClick={handlePrev} disabled={step <= 0}>
                Previous
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleNext}
                disabled={!selections[current?.id]}
              >
                {step >= lastIndex ? 'Submit assignment' : 'Next'}
              </Button>
            </Stack>
          </Box>
        ) : null}

        {phase === 'complete' && !showRetake ? (
          <Button component={RouterLink} href={courseLinkHref} variant="contained" color="primary" sx={{ alignSelf: 'flex-start' }}>
            Back to course
          </Button>
        ) : null}
      </Box>
    </DashboardContent>
  );
}
