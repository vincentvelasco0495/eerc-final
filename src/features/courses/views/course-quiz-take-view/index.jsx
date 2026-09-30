import { useParams, useNavigate, useSearchParams } from 'react-router';
import { useRef, useMemo, useState, useEffect, useCallback, useLayoutEffect } from 'react';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Badge from '@mui/material/Badge';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';
import CircularProgress from '@mui/material/CircularProgress';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import {
  useLmsCourse,
  useLmsActions,
  useLmsCourses,
  useLmsQuizResults,
  useLmsModulesByCourse,
  extractQuizzesFromModules,
  useResolvedCourseIdFromLookup,
} from 'src/hooks/use-lms';

import { resolveApiAssetUrl } from 'src/utils/resolve-api-asset-url';

import { CONFIG } from 'src/global-config';
import { DashboardContent } from 'src/layouts/dashboard';
import { useLmsCourseDetailShell } from 'src/features/courses/hooks/use-lms-course-detail-shell';
import { isQuizPdfAsset } from 'src/features/instructor-course-builder/utils/quiz-pdf-constants';

import { Iconify } from 'src/components/iconify';
import { QuizPdfDocument } from 'src/components/quiz-pdf-document';
import { Lightbox, useLightbox, QuizEnlargeableImage } from 'src/components/lightbox';
import { CourseDetailBackArrowSvg } from 'src/components/course-detail/course-detail-back-arrow';

import {
  rootSx,
  columnSx,
  timerBoxSx,
  bottomBarSx,
  headerRowSx,
  optionRowSx,
  resultBannerSx,
  resultActionBtnSx,
  postResultActionsSx,
} from './styles';

// ----------------------------------------------------------------------

function isPlaceholderQuizPrompt(html) {
  const text = String(html ?? '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
  return !text || text === 'select the correct answer';
}

function formatCountdown(totalSec) {
  const s = Math.max(0, Math.floor(totalSec));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${String(r).padStart(2, '0')}`;
}

function quizQuestionImageSrc(path, materialPublicId = null) {
  const id = typeof materialPublicId === 'string' ? materialPublicId.trim() : '';
  const base = String(CONFIG.serverUrl ?? '').trim().replace(/\/$/, '');
  if (id && base) {
    return `${base}/api/lesson-materials/${encodeURIComponent(id)}/file?inline=1`;
  }
  const resolved = resolveApiAssetUrl(path);
  return resolved || '';
}

function readMaterialPublicId(row, ...keys) {
  for (const key of keys) {
    const value = typeof row?.[key] === 'string' ? row[key].trim() : '';
    if (value) {
      return value;
    }
  }
  return '';
}

function normalizeQuestions(rows) {
  return (Array.isArray(rows) ? rows : []).map((q, idx) => {
    const problemMaterialId = readMaterialPublicId(
      q,
      'problemImageMaterialPublicId',
      'diagramMaterialPublicId'
    );
    const solutionMaterialId = readMaterialPublicId(q, 'solutionImageMaterialPublicId');
    const rawProblemUrl =
      typeof q?.problemImageUrl === 'string'
        ? q.problemImageUrl
        : typeof q?.diagramUrl === 'string'
          ? q.diagramUrl
          : '';
    const rawSolutionUrl = typeof q?.solutionImageUrl === 'string' ? q.solutionImageUrl : '';
    const problemImageUrl = quizQuestionImageSrc(rawProblemUrl, problemMaterialId) || null;
    const solutionImageUrl = quizQuestionImageSrc(rawSolutionUrl, solutionMaterialId) || null;

    return {
      id: String(q?.id ?? `q-${idx}`),
      prompt: String(q?.prompt ?? ''),
      questionType: q?.questionType === 'simulation_diagram' ? 'simulation_diagram' : 'single_choice',
      problemImageMaterialPublicId: problemMaterialId || null,
      problemImageUrl,
      problemImageMime: typeof q?.problemImageMime === 'string' ? q.problemImageMime : null,
      problemImageName:
        typeof q?.problemImageName === 'string'
          ? q.problemImageName
          : typeof q?.diagramName === 'string'
            ? q.diagramName
            : null,
      solutionImageUrl,
      solutionImageName: typeof q?.solutionImageName === 'string' ? q.solutionImageName : null,
    options: (Array.isArray(q?.options) ? q.options : []).map((o, oi) => ({
      id: String(o?.id ?? `o-${idx}-${oi}`),
      label: String(o?.label ?? ''),
      isCorrect: Boolean(o?.isCorrect),
    })),
    };
  });
}

function computeScore(questions, selections) {
  let correct = 0;
  const total = questions.length;
  questions.forEach((q) => {
    const sel = selections[q.id];
    const picked = q.options.find((o) => o.id === sel);
    if (picked?.isCorrect) {
      correct += 1;
    }
  });
  const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
  return { correct, total, pct };
}

function isQuestionAnsweredWrong(question, selections) {
  if (!question) {
    return false;
  }
  const sel = selections[question.id];
  if (!sel) {
    return false;
  }
  const picked = question.options.find((o) => o.id === sel);
  return Boolean(picked && !picked.isCorrect);
}

function getCorrectOptionLabel(question) {
  const label = question?.options?.find((o) => o.isCorrect)?.label;
  return typeof label === 'string' ? label.trim() : '';
}

const QUIZ_SESSION_VERSION = 1;

function quizSessionStorageKey(courseLookup, quizId) {
  return `lms-quiz-take:${encodeURIComponent(String(courseLookup ?? ''))}:${encodeURIComponent(String(quizId ?? ''))}`;
}

function readQuizSession(key) {
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw);
    if (
      !parsed ||
      parsed.version !== QUIZ_SESSION_VERSION ||
      typeof parsed.quizId !== 'string' ||
      parsed.quizId === ''
    ) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function questionIdsSignature(qs) {
  return (Array.isArray(qs) ? qs : []).map((q) => q.id).join(',');
}

function shuffleCopy(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function cloneQuestions(qs) {
  return (Array.isArray(qs) ? qs : []).map((q) => ({
    ...q,
    options: (q.options ?? []).map((o) => ({ ...o })),
  }));
}

function settingsSignature(meta) {
  if (!meta) {
    return 'na';
  }
  return [
    meta.randomizeQuestions ? '1' : '0',
    meta.randomizeAnswers ? '1' : '0',
    meta.showCorrectAnswer ? '1' : '0',
    meta.quizAttemptHistory ? '1' : '0',
    meta.retakeAfterPass ? '1' : '0',
    meta.limitedRetakeAttempts ? '1' : '0',
    String(meta.passingGrade ?? ''),
  ].join('|');
}

/**
 * @param {ReturnType<typeof normalizeQuestions>} apiQs
 * @param {object|null} meta quiz row from catalog (may be null on restore before SWR)
 * @param {{ questionOrder?: string[]|null, optionOrders?: Record<string, string[]>|null }|null} saved
 */
function buildDisplayQuestions(apiQs, meta, saved) {
  const randQ = Boolean(meta?.randomizeQuestions);
  const randA = Boolean(meta?.randomizeAnswers);
  let qs = cloneQuestions(apiQs);

  const savedOrder = saved?.questionOrder;
  if (Array.isArray(savedOrder) && savedOrder.length) {
    const map = new Map(qs.map((q) => [q.id, q]));
    qs = savedOrder.map((id) => map.get(id)).filter(Boolean);
  } else if (randQ) {
    qs = shuffleCopy(qs);
  }

  const savedOpt = saved?.optionOrders;
  if (savedOpt && typeof savedOpt === 'object') {
    qs = qs.map((q) => {
      const ord = savedOpt[q.id];
      if (!Array.isArray(ord) || !ord.length) {
        return q;
      }
      const om = new Map(q.options.map((o) => [o.id, o]));
      const next = ord.map((id) => om.get(id)).filter(Boolean);
      return next.length ? { ...q, options: next } : q;
    });
  } else if (randA) {
    qs = qs.map((q) => ({ ...q, options: shuffleCopy(q.options) }));
  }

  return qs;
}

function passBlockStorageKey(quizId) {
  return `lms-quiz-pass-block:${encodeURIComponent(String(quizId ?? ''))}`;
}

// ----------------------------------------------------------------------

export function CourseQuizTakeView() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { slug = '', courseId = '', quizId = '' } = useParams();
  const courseLookup = slug || courseId;
  const [searchParams, setSearchParams] = useSearchParams();
  const { runCommand } = useLmsActions();

  const { isLoading: coursesLoading } = useLmsCourses(1, 500);
  const { mutate: mutateQuizResults } = useLmsQuizResults();
  const resolvedCourseId = useResolvedCourseIdFromLookup(courseLookup);
  const course = useLmsCourse(resolvedCourseId);
  const { modules, mutate: mutateModules, isLoading: modulesLoading } =
    useLmsModulesByCourse(resolvedCourseId);
  const quizzesForCourse = useMemo(() => extractQuizzesFromModules(modules), [modules]);
  const quizMeta = useMemo(
    () => quizzesForCourse.find((item) => item.id === quizId) ?? null,
    [quizzesForCourse, quizId]
  );

  const { shell, isLessonLocked } = useLmsCourseDetailShell(course, modules, quizzesForCourse);

  const courseLinkHref = paths.dashboard.courseDetails(
    typeof course?.slug === 'string' && course.slug.trim() ? course.slug.trim() : courseLookup
  );

  useEffect(() => {
    if (!quizId || !resolvedCourseId || modulesLoading || !course || !shell) {
      return;
    }
    if (isLessonLocked(quizId)) {
      navigate(`${courseLinkHref}#curriculum`, { replace: true });
    }
  }, [quizId, resolvedCourseId, modulesLoading, course, shell, isLessonLocked, navigate, courseLinkHref]);

  const [apiQuestions, setApiQuestions] = useState([]);
  /** Order / option shuffle applied when instructor toggles are ON (stable across refresh via session). */
  const [displayQuestions, setDisplayQuestions] = useState([]);
  const [loadError, setLoadError] = useState(null);
  const [loadingQuestions, setLoadingQuestions] = useState(true);

  const [step, setStep] = useState(0);
  const [selections, setSelections] = useState({});
  const [phase, setPhase] = useState('taking');

  const [secondsLeft, setSecondsLeft] = useState(0);
  /** Absolute end time (ms); drives countdown. State (not ref) so the tick effect re-subscribes after hydrate when `quizMeta` arrives after questions. */
  const [deadlineAtMs, setDeadlineAtMs] = useState(null);
  const [attemptResetToken, setAttemptResetToken] = useState(0);

  const hydrateKeyRef = useRef('');
  const attemptSubmitRef = useRef('');
  const phaseRef = useRef(phase);
  phaseRef.current = phase;
  /** Block take UI: `pass` = passed with retake-after-pass OFF; `attempts` = no attempts left. */
  const [takeBlocked, setTakeBlocked] = useState('');

  useEffect(() => {
    hydrateKeyRef.current = '';
    setDeadlineAtMs(null);
    setTakeBlocked('');
  }, [quizId, courseLookup]);

  const beginFreshAttempt = useCallback(() => {
    if (!quizId || !courseLookup) {
      return;
    }
    try {
      sessionStorage.removeItem(quizSessionStorageKey(courseLookup, quizId));
    } catch {
      // ignore
    }
    try {
      localStorage.removeItem(passBlockStorageKey(quizId));
    } catch {
      // ignore
    }
    attemptSubmitRef.current = '';
    hydrateKeyRef.current = '';
    setTakeBlocked('');
    setPhase('taking');
    setSelections({});
    setStep(0);
    setSecondsLeft(0);
    setDeadlineAtMs(null);
    setAttemptResetToken((n) => n + 1);
  }, [courseLookup, quizId]);

  /** New attempt from Start Quiz (`?new=1`) or Retake — drop stored "complete" session so inputs unlock. */
  useLayoutEffect(() => {
    if (searchParams.get('new') !== '1' || !quizId || !courseLookup) {
      return;
    }
    beginFreshAttempt();
    const next = new URLSearchParams(searchParams);
    next.delete('new');
    setSearchParams(next, { replace: true });
  }, [beginFreshAttempt, courseLookup, quizId, searchParams, setSearchParams]);

  useEffect(() => {
    let cancelled = false;
    if (!quizId || !CONFIG.serverUrl?.trim()) {
      setLoadingQuestions(false);
      setApiQuestions([]);
      setDisplayQuestions([]);
      return () => {
        cancelled = true;
      };
    }
    setLoadingQuestions(true);
    setLoadError(null);
    void (async () => {
      try {
        const rows = await runCommand('quiz.questions', { publicId: quizId });
        if (!cancelled) {
          setApiQuestions(normalizeQuestions(rows));
        }
      } catch {
        if (!cancelled) {
          setLoadError('Unable to load this quiz.');
          setApiQuestions([]);
          setDisplayQuestions([]);
        }
      } finally {
        if (!cancelled) {
          setLoadingQuestions(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [quizId, runCommand]);

  const finishQuiz = useCallback(() => {
    setPhase('complete');
  }, []);

  const hasQuizContent = displayQuestions.length > 0 && apiQuestions.length > 0;

  /** Hydrate or start session: timer uses absolute `deadlineAt` so refresh does not reset time remaining. */
  useEffect(() => {
    if (!quizId || !courseLookup || apiQuestions.length === 0) {
      return;
    }

    const storageKey = quizSessionStorageKey(courseLookup, quizId);
    const sig = questionIdsSignature(apiQuestions);
    const versionKey = `${courseLookup}|${quizId}|${sig}|${settingsSignature(quizMeta)}`;

    if (hydrateKeyRef.current === versionKey) {
      return;
    }

    let existing = readQuizSession(storageKey);

    // Keep review UI stable after submit while modules revalidate in the background.
    if (
      phaseRef.current === 'complete' &&
      displayQuestions.length > 0 &&
      existing?.phase === 'complete'
    ) {
      hydrateKeyRef.current = versionKey;
      return;
    }
    if (
      existing &&
      quizMeta &&
      existing.settingsSig &&
      existing.settingsSig !== settingsSignature(quizMeta)
    ) {
      sessionStorage.removeItem(storageKey);
      existing = null;
    }

    const baseValid =
      Boolean(existing) &&
      existing.quizId === quizId &&
      typeof existing.deadlineAt === 'number' &&
      (existing.questionIdsSig == null || existing.questionIdsSig === sig);
    const validSession = baseValid;

    const metaForBuild = quizMeta ?? existing?.sessionSettings ?? {};

    if (validSession && existing) {
      setTakeBlocked('');
      setDeadlineAtMs(existing.deadlineAt > 0 ? existing.deadlineAt : null);
      const qIds = new Set(apiQuestions.map((q) => q.id));
      const nextSelections = {};
      Object.entries(existing.selections ?? {}).forEach(([qk, v]) => {
        if (qIds.has(qk)) {
          nextSelections[qk] = v;
        }
      });
      setSelections(nextSelections);
      const built = buildDisplayQuestions(apiQuestions, metaForBuild, {
        questionOrder: existing.questionOrder ?? null,
        optionOrders: existing.optionOrders ?? null,
      });
      setDisplayQuestions(built);
      const maxStep = Math.max(0, built.length - 1);
      setStep(typeof existing.step === 'number' ? Math.min(Math.max(0, existing.step), maxStep) : 0);

      if (existing.phase === 'complete') {
        setPhase('complete');
        setSecondsLeft(0);
      } else {
        setPhase('taking');
        const left =
          existing.deadlineAt > 0
            ? Math.max(0, Math.floor((existing.deadlineAt - Date.now()) / 1000))
            : 0;
        setSecondsLeft(left);
        if (left <= 0 && existing.deadlineAt > 0) {
          setPhase('complete');
        }
      }
      hydrateKeyRef.current = versionKey;
      return;
    }

    if (quizMeta == null) {
      return;
    }

    if (
      quizMeta.limitedRetakeAttempts &&
      typeof quizMeta.attemptsUsed === 'number' &&
      typeof quizMeta.attemptsAllowed === 'number' &&
      quizMeta.attemptsAllowed > 0 &&
      quizMeta.attemptsUsed >= quizMeta.attemptsAllowed
    ) {
      setTakeBlocked('attempts');
      hydrateKeyRef.current = versionKey;
      return;
    }

    if (quizMeta.retakeAfterPass === false) {
      try {
        if (localStorage.getItem(passBlockStorageKey(quizId)) === '1') {
          setTakeBlocked('pass');
          hydrateKeyRef.current = versionKey;
          return;
        }
      } catch {
        // ignore
      }
    } else {
      try {
        localStorage.removeItem(passBlockStorageKey(quizId));
      } catch {
        // ignore
      }
    }

    setTakeBlocked('');
    attemptSubmitRef.current = '';

    const ts = Math.max(0, Math.round((quizMeta.durationMinutes ?? 0) * 60));
    const deadlineAt = ts > 0 ? Date.now() + ts * 1000 : null;
    setDeadlineAtMs(deadlineAt);
    setPhase('taking');
    setSelections({});
    setStep(0);
    setSecondsLeft(ts > 0 ? ts : 0);

    const built = buildDisplayQuestions(apiQuestions, quizMeta, null);
    setDisplayQuestions(built);
    const sessionSettings = {
      randomizeQuestions: Boolean(quizMeta.randomizeQuestions),
      randomizeAnswers: Boolean(quizMeta.randomizeAnswers),
      showCorrectAnswer: Boolean(quizMeta.showCorrectAnswer),
      quizAttemptHistory: Boolean(quizMeta.quizAttemptHistory),
      retakeAfterPass: Boolean(quizMeta.retakeAfterPass),
      limitedRetakeAttempts: Boolean(quizMeta.limitedRetakeAttempts),
      passingGrade: Number(quizMeta.passingGrade) || 0,
    };
    sessionStorage.setItem(
      storageKey,
      JSON.stringify({
        version: QUIZ_SESSION_VERSION,
        quizId,
        questionIdsSig: sig,
        settingsSig: settingsSignature(quizMeta),
        sessionSettings,
        questionOrder: built.map((q) => q.id),
        optionOrders: Object.fromEntries(built.map((q) => [q.id, q.options.map((o) => o.id)])),
        deadlineAt: deadlineAt ?? 0,
        phase: 'taking',
        selections: {},
        step: 0,
      })
    );
    hydrateKeyRef.current = versionKey;
  }, [quizId, courseLookup, apiQuestions, quizMeta, attemptResetToken, displayQuestions.length]);

  useEffect(() => {
    if (!quizId || !courseLookup || apiQuestions.length === 0) {
      return;
    }
    if (!hydrateKeyRef.current) {
      return;
    }
    const storageKey = quizSessionStorageKey(courseLookup, quizId);
    const sig = questionIdsSignature(apiQuestions);
    const sessionSettings = quizMeta
      ? {
          randomizeQuestions: Boolean(quizMeta.randomizeQuestions),
          randomizeAnswers: Boolean(quizMeta.randomizeAnswers),
          showCorrectAnswer: Boolean(quizMeta.showCorrectAnswer),
          quizAttemptHistory: Boolean(quizMeta.quizAttemptHistory),
          retakeAfterPass: Boolean(quizMeta.retakeAfterPass),
          limitedRetakeAttempts: Boolean(quizMeta.limitedRetakeAttempts),
          passingGrade: Number(quizMeta.passingGrade) || 0,
        }
      : undefined;
    sessionStorage.setItem(
      storageKey,
      JSON.stringify({
        version: QUIZ_SESSION_VERSION,
        quizId,
        questionIdsSig: sig,
        settingsSig: quizMeta ? settingsSignature(quizMeta) : undefined,
        sessionSettings,
        questionOrder: displayQuestions.map((q) => q.id),
        optionOrders: Object.fromEntries(displayQuestions.map((q) => [q.id, q.options.map((o) => o.id)])),
        deadlineAt: deadlineAtMs ?? 0,
        phase,
        selections,
        step,
      })
    );
  }, [
    courseLookup,
    quizId,
    apiQuestions,
    displayQuestions,
    phase,
    selections,
    step,
    deadlineAtMs,
    quizMeta,
  ]);

  useEffect(() => {
    if (phase !== 'complete' || !quizMeta || displayQuestions.length === 0) {
      return;
    }
    const { pct } = computeScore(displayQuestions, selections);
    const pg = Number(quizMeta.passingGrade) || 0;
    if (pg > 0 && pct >= pg && quizMeta.retakeAfterPass === false) {
      try {
        localStorage.setItem(passBlockStorageKey(quizId), '1');
      } catch {
        // ignore
      }
    }
  }, [phase, quizMeta, displayQuestions, selections, quizId]);

  useEffect(() => {
    if (phase !== 'complete' || !quizId || displayQuestions.length === 0) {
      return;
    }
    const submissionKey = `${quizId}|${questionIdsSignature(displayQuestions)}|${JSON.stringify(selections)}`;
    if (attemptSubmitRef.current === submissionKey) {
      return;
    }
    attemptSubmitRef.current = submissionKey;
    const totalSeconds = Math.max(0, Math.round((quizMeta?.durationMinutes ?? 0) * 60));
    const durationUsedSeconds = totalSeconds > 0 ? Math.max(0, totalSeconds - secondsLeft) : 0;
    void runCommand('quiz.attempt', {
      publicId: quizId,
      body: {
        selections,
        durationUsedSeconds,
      },
    })
      .then(() => {
        void mutateQuizResults();
        void mutateModules();
      })
      .catch(() => {
        // Keep the quiz UX unblocked even if attempt logging fails.
      });
  }, [
    phase,
    quizId,
    displayQuestions,
    selections,
    quizMeta,
    secondsLeft,
    mutateQuizResults,
    mutateModules,
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
        setPhase('complete');
      }
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [phase, quizId, deadlineAtMs]);

  const title = typeof quizMeta?.title === 'string' && quizMeta.title.trim() ? quizMeta.title.trim() : 'Quiz';

  const current = displayQuestions[step] ?? null;
  const lastIndex = Math.max(0, displayQuestions.length - 1);
  const currentIsPdf = Boolean(
    current &&
      isQuizPdfAsset({
        mime: current.problemImageMime,
        fileName: current.problemImageName,
        url: current.problemImageUrl,
      })
  );

  const score = useMemo(
    () => computeScore(displayQuestions, selections),
    [displayQuestions, selections]
  );

  const revealCorrect = Boolean(quizMeta?.showCorrectAnswer);
  const answerFeedbackActive = phase === 'complete' && revealCorrect;
  const currentAnsweredWrong = isQuestionAnsweredWrong(current, selections);
  const correctOptionLabel = getCorrectOptionLabel(current);

  const imageSlides = useMemo(() => {
    if (!current) {
      return [];
    }
    const slides = [];
    if (current.problemImageUrl && !isQuizPdfAsset({
      mime: current.problemImageMime,
      fileName: current.problemImageName,
      url: current.problemImageUrl,
    })) {
      slides.push({
        src: current.problemImageUrl,
        alt: current.problemImageName
          ? `Question: ${current.problemImageName}`
          : 'Question image',
      });
    }
    if (
      current.questionType === 'simulation_diagram' &&
      current.solutionImageUrl &&
      answerFeedbackActive
    ) {
      slides.push({
        src: current.solutionImageUrl,
        alt: current.solutionImageName
          ? `Solution: ${current.solutionImageName}`
          : 'Solution diagram',
      });
    }
    return slides;
  }, [current, answerFeedbackActive]);

  const lightbox = useLightbox(imageSlides);
  const passingGrade = Number(quizMeta?.passingGrade) || 0;
  const passedCut = phase === 'complete' && passingGrade > 0 && score.pct >= passingGrade;
  const failedCut = phase === 'complete' && passingGrade > 0 && score.pct < passingGrade;

  const historyHref = useMemo(() => {
    const q = new URLSearchParams();
    if (quizId) {
      q.set('quizId', quizId);
    }
    if (courseLookup) {
      q.set('course', courseLookup);
    }
    const s = q.toString();
    return s ? `${paths.dashboard.quizzes.history}?${s}` : paths.dashboard.quizzes.history;
  }, [quizId, courseLookup]);

  const attemptsExhausted =
    Boolean(quizMeta?.limitedRetakeAttempts) &&
    typeof quizMeta?.attemptsUsed === 'number' &&
    typeof quizMeta?.attemptsAllowed === 'number' &&
    quizMeta.attemptsAllowed > 0 &&
    quizMeta.attemptsUsed >= quizMeta.attemptsAllowed;

  const passBlocksRetake =
    quizMeta != null &&
    quizMeta.retakeAfterPass === false &&
    passingGrade > 0 &&
    passedCut;

  const showRetakeCta =
    phase === 'complete' && quizMeta != null && !attemptsExhausted && !passBlocksRetake;

  const handleRetakeClick = useCallback(() => {
    beginFreshAttempt();
    navigate(paths.dashboard.courseQuizTake(courseLookup, quizId), { replace: true });
  }, [beginFreshAttempt, courseLookup, navigate, quizId]);

  const handleSelectOption = (optionId) => {
    if (phase !== 'complete' && current) {
      setSelections((prev) => ({ ...prev, [current.id]: optionId }));
    }
  };

  const handleNext = () => {
    if (step >= lastIndex) {
      finishQuiz();
      return;
    }
    setStep((s) => Math.min(lastIndex, s + 1));
  };

  const handlePrev = () => {
    setStep((s) => Math.max(0, s - 1));
  };

  const handlePillClick = (idx) => {
    setStep(idx);
  };

  const bootstrapping = Boolean(
    courseLookup &&
      (coursesLoading ||
        (modulesLoading && !quizMeta) ||
        (resolvedCourseId && !course && !coursesLoading))
  );
  const awaitingDisplay =
    apiQuestions.length > 0 && !takeBlocked && !loadError && displayQuestions.length === 0;

  if (!CONFIG.serverUrl?.trim()) {
    return (
      <DashboardContent maxWidth="md">
        <Typography variant="body2">
          Quiz delivery requires the LMS API. Set <code>VITE_SERVER_URL</code> and sign in.
        </Typography>
      </DashboardContent>
    );
  }

  if (!hasQuizContent && (bootstrapping || loadingQuestions || awaitingDisplay)) {
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
        <CircularProgress aria-label="Loading quiz" />
      </DashboardContent>
    );
  }

  if (takeBlocked) {
    const msg =
      takeBlocked === 'attempts'
        ? 'You have used all allowed attempts for this quiz.'
        : 'You passed this quiz. Retakes are not available for this assignment.';
    return (
      <DashboardContent maxWidth="md">
        <Button component={RouterLink} href={courseLinkHref} color="inherit" sx={{ mb: 2 }}>
          Back to course
        </Button>
        <Typography variant="body1">{msg}</Typography>
        {quizMeta?.quizAttemptHistory ? (
          <Button
            component={RouterLink}
            href={historyHref}
            variant="contained"
            color="inherit"
            sx={{ ...resultActionBtnSx, mt: 2 }}
          >
            View quiz attempt history
          </Button>
        ) : null}
      </DashboardContent>
    );
  }

  if (loadError || apiQuestions.length === 0) {
    return (
      <DashboardContent maxWidth="md">
        <Button component={RouterLink} href={courseLinkHref} color="inherit" sx={{ mb: 2 }}>
          Back to course
        </Button>
        <Typography variant="body2">{loadError || 'This quiz has no questions yet.'}</Typography>
      </DashboardContent>
    );
  }

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
          <Typography variant="body2" color="text.secondary" component={RouterLink} href={courseLinkHref} sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
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
              {phase === 'taking'
                ? deadlineAtMs
                  ? formatCountdown(secondsLeft)
                  : '—'
                : '0:00'}
            </Typography>
          </Box>
        </Box>

        {phase === 'complete' ? (
          <Box sx={resultBannerSx(theme, failedCut ? 'error' : 'success')}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Result
              </Typography>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 800,
                  color: failedCut ? 'error.main' : 'success.main',
                  lineHeight: 1.1,
                }}
              >
                {score.pct}%
              </Typography>
              {passingGrade > 0 ? (
                <Typography variant="subtitle2" sx={{ mt: 0.5, fontWeight: 600 }}>
                  {passedCut ? 'Passed' : 'Did not pass'} — passing grade {passingGrade}%
                </Typography>
              ) : null}
            </Box>
            <Typography variant="body1" sx={{ maxWidth: 420 }}>
              {score.correct} out of {score.total} questions answered correctly.
            </Typography>
          </Box>
        ) : null}

        {phase === 'complete' && (quizMeta?.quizAttemptHistory || showRetakeCta) ? (
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            alignItems={{ xs: 'flex-start', sm: 'center' }}
            flexWrap="wrap"
            useFlexGap
            spacing={1.5}
            sx={postResultActionsSx}
          >
            {quizMeta?.quizAttemptHistory ? (
              <Button
                component={RouterLink}
                href={historyHref}
                variant="contained"
                color="inherit"
                sx={resultActionBtnSx}
              >
                View quiz attempt history
              </Button>
            ) : null}
            {showRetakeCta ? (
              <Button type="button" variant="contained" color="inherit" sx={resultActionBtnSx} onClick={handleRetakeClick}>
                Retake quiz
              </Button>
            ) : null}
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
            {current.problemImageUrl || current.problemImageMaterialPublicId ? (
              <Box
                sx={{
                  mb: 2,
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  bgcolor: 'background.neutral',
                  p: { xs: 1.5, sm: 2 },
                }}
              >
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                  Question
                </Typography>
                {currentIsPdf ? (
                  <QuizPdfDocument
                    materialPublicId={current.problemImageMaterialPublicId}
                    src={current.problemImageUrl}
                    fileName={current.problemImageName || 'Question PDF'}
                    maxHeight={640}
                  />
                ) : (
                  <QuizEnlargeableImage
                    src={current.problemImageUrl}
                    alt={
                      current.problemImageName
                        ? `Question: ${current.problemImageName}`
                        : 'Question image'
                    }
                    onOpen={lightbox.onOpen}
                  />
                )}
              </Box>
            ) : null}

            {current.questionType === 'simulation_diagram' &&
            current.solutionImageUrl &&
            answerFeedbackActive ? (
              <Box
                sx={{
                  mb: 2,
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: alpha(theme.palette.success.main, 0.35),
                  bgcolor: alpha(theme.palette.success.main, 0.14),
                  p: { xs: 1.5, sm: 2 },
                }}
              >
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                  Solution
                </Typography>
                <QuizEnlargeableImage
                  src={current.solutionImageUrl}
                  alt={
                    current.solutionImageName
                      ? `Solution: ${current.solutionImageName}`
                      : 'Solution diagram'
                  }
                  onOpen={lightbox.onOpen}
                />
              </Box>
            ) : null}

            {!isPlaceholderQuizPrompt(current.prompt) ? (
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'flex-start',
                gap: 1,
                mb: 2,
              }}
            >
              <Typography component="span" variant="subtitle1" sx={{ fontWeight: 600, flexShrink: 0 }}>
                {step + 1}.
              </Typography>
              <Box
                component="div"
                className="quiz-question-prompt-html"
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
            ) : current.problemImageUrl || current.problemImageMaterialPublicId ? (
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                {step + 1}. Select the correct answer
              </Typography>
            ) : (
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                {step + 1}.
              </Typography>
            )}

            {answerFeedbackActive && currentAnsweredWrong && correctOptionLabel ? (
              <Alert severity="info" sx={{ mb: 2 }}>
                Correct answer: <strong>{correctOptionLabel}</strong>
              </Alert>
            ) : null}

            <Stack spacing={1.25}>
              {current.options.map((opt) => {
                const isSelected = selections[current.id] === opt.id;
                const highlightCorrect = answerFeedbackActive && opt.isCorrect;
                return (
                  <Button
                    key={opt.id}
                    variant="outlined"
                    fullWidth
                    disabled={phase === 'complete'}
                    onClick={() => handleSelectOption(opt.id)}
                    sx={optionRowSx(theme, {
                      feedbackActive: answerFeedbackActive,
                      isSelected,
                      isCorrect: opt.isCorrect,
                      highlightCorrect,
                    })}
                    endIcon={
                      answerFeedbackActive ? (
                        isSelected && !opt.isCorrect ? (
                          <Iconify icon="solar:close-circle-bold" width={22} color="error.main" />
                        ) : highlightCorrect ? (
                          <Iconify icon="solar:check-circle-bold" width={22} color="info.main" />
                        ) : null
                      ) : null
                    }
                  >
                    <Typography variant="body2" sx={{ flex: 1, textAlign: 'left' }}>
                      {opt.label}
                    </Typography>
                  </Button>
                );
              })}
            </Stack>
          </Paper>
        ) : null}

        <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 2 }}>
          {displayQuestions.map((q, idx) => {
            const answered = Boolean(selections[q.id]);
            return (
              <Badge
                key={q.id}
                variant="dot"
                color="success"
                overlap="rectangular"
                invisible={!answered}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                sx={{
                  '& .MuiBadge-badge': {
                    minWidth: 8,
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    border: '2px solid',
                    borderColor: 'background.default',
                  },
                }}
              >
                <Button
                  size="small"
                  variant={idx === step ? 'contained' : 'outlined'}
                  onClick={() => handlePillClick(idx)}
                  aria-label={`Question ${idx + 1}${answered ? ', answered' : ''}${idx === step ? ', current' : ''}`}
                  sx={{ minWidth: 40, px: 1 }}
                >
                  {idx + 1}
                </Button>
              </Badge>
            );
          })}
          <Button
            size="small"
            variant="outlined"
            disabled={step >= lastIndex}
            onClick={() => setStep((s) => Math.min(lastIndex, s + 1))}
            sx={{ minWidth: 40 }}
            aria-label="Next question"
          >
            <Iconify icon="eva:arrow-ios-forward-fill" width={20} />
          </Button>
        </Stack>

        <Box sx={bottomBarSx(theme)}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            spacing={2}
            sx={{ maxWidth: 720, mx: 'auto' }}
          >
            <Button
              color="inherit"
              disabled={step <= 0}
              onClick={handlePrev}
              startIcon={<Iconify icon="eva:arrow-ios-back-fill" width={20} />}
            >
              Previous
            </Button>
            <Stack direction="row" alignItems="center" spacing={0.75}>
              {phase === 'complete' ? (
                <>
                  <Iconify icon="solar:check-circle-bold" width={20} color="brand.accentText" />
                  <Typography variant="body2" color="text.secondary">
                    Completed
                  </Typography>
                </>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  In progress
                </Typography>
              )}
            </Stack>
            <Button
              type="button"
              color="inherit"
              onClick={(event) => {
                event.preventDefault();
                if (phase === 'taking' && step >= lastIndex) {
                  finishQuiz();
                  return;
                }
                handleNext();
              }}
              endIcon={<Iconify icon="eva:arrow-ios-forward-fill" width={20} />}
            >
              {phase === 'taking' && step >= lastIndex ? 'Submit' : 'Next'}
            </Button>
          </Stack>
        </Box>
      </Box>
      <Lightbox
        index={lightbox.selected}
        slides={imageSlides}
        open={lightbox.open}
        close={lightbox.onClose}
        disableThumbnails
        disableSlideshow
        disableCaptions
        disableVideo
        disableTotal={imageSlides.length < 2}
      />
    </DashboardContent>
  );
}
