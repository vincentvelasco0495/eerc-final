import { paths } from 'src/routes/paths';

import { resolveCourseMarketingBannerUrl } from 'src/utils/course-hero-image';

import { isLessonPreviewEnabled } from 'src/features/courses/utils/lesson-preview-access';
import { mergeTabsContentFromCourseApi } from 'src/features/courses/utils/merge-course-tabs-from-api';
import {
  deriveLessonType,
  coreLessonListTitle,
} from 'src/features/instructor-course-builder/utils/map-lms-modules-to-curriculum-builder';

// ----------------------------------------------------------------------

function formatQuestionCountMeta(count) {
  const n = typeof count === 'number' && Number.isFinite(count) ? Math.max(0, Math.round(count)) : 0;
  return `${n} ${n === 1 ? 'question' : 'questions'}`;
}

function plainTextFromRichLessonFields(row) {
  if (!row || typeof row !== 'object') {
    return '';
  }
  const ex = row.excerptHtml;
  if (typeof ex === 'string' && ex.trim()) {
    return ex.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  }
  const body = row.bodyHtml;
  if (typeof body === 'string' && body.trim()) {
    return body.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  }
  const sum = row.summary;
  if (typeof sum === 'string' && sum.trim()) {
    return sum.trim();
  }
  return '';
}

/**
 * When `lockLessonsInOrder` is true, sets each lesson row `locked` if any earlier row
 * in global curriculum order is incomplete (the first lesson is never locked).
 *
 * @param {object[]} curriculumModules
 * @param {boolean} lockLessonsInOrder
 */
/** Lock every lesson row (enrollment required). */
export function applyEnrollmentLessonLocks(curriculumModules) {
  if (!Array.isArray(curriculumModules)) {
    return curriculumModules;
  }

  return curriculumModules.map((mod) => ({
    ...mod,
    lessons: (mod.lessons ?? []).map((lesson) => ({ ...lesson, locked: true })),
  }));
}

export function applySequentialLessonLocks(curriculumModules, lockLessonsInOrder) {
  if (!Array.isArray(curriculumModules)) {
    return curriculumModules;
  }
  if (!lockLessonsInOrder) {
    return curriculumModules.map((mod) => ({
      ...mod,
      lessons: (mod.lessons ?? []).map((l) => ({ ...l, locked: false })),
    }));
  }
  let prevChainComplete = true;
  return curriculumModules.map((mod) => ({
    ...mod,
    lessons: (mod.lessons ?? []).map((lesson) => {
      const locked = !prevChainComplete;
      prevChainComplete = prevChainComplete && Boolean(lesson.completed);
      return { ...lesson, locked };
    }),
  }));
}

/** True when `/api/modules` rows include server-computed lock flags. */
function modulesExposeBackendLocks(modules) {
  return (modules ?? []).some((m) => typeof m?.coreLocked === 'boolean');
}

/** @param {object[]} curriculumModules output from `{@link applySequentialLessonLocks}` */
export function isLessonLockedInCurriculum(curriculumModules, lessonId) {
  const id = String(lessonId ?? '').trim();
  if (!id) {
    return false;
  }
  for (const mod of curriculumModules ?? []) {
    for (const les of mod.lessons ?? []) {
      if (String(les.id) === id) {
        return Boolean(les.locked);
      }
    }
  }
  return false;
}

function reviewsToRating(reviews = []) {
  if (reviews.length === 0) {
    return {
      value: 4,
      max: 5,
      scoreLabel: '—',
      reviewLine: '',
    };
  }

  const avg = reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) / reviews.length;
  const roundedStars = Math.min(5, Math.round(Math.max(0, avg)));

  let scoreLabel = '—';
  if (Number.isFinite(avg)) {
    scoreLabel =
      Math.abs(avg - Math.round(avg)) < 1e-6 ? String(Math.round(avg)) : avg.toFixed(1);
  }

  return {
    value: roundedStars,
    max: 5,
    scoreLabel,
    reviewLine: `${reviews.length} ${reviews.length === 1 ? 'review' : 'reviews'}`,
  };
}

/**
 * LMS API records → payloads for `{@link CourseDetailLayout}` (styled-components /course-detail UI).
 *
 * @param {object} course
 * @param {object[]} modules
 * @param {object[]} quizzesForCourse  quizzes where `quiz.courseId === course.id`
 * @param {object[]} [quizResults] learner attempt history (`/api/quiz-results`)
 * @param {string[]} [lessonProgressKeys] learner-completed lesson keys
 * @param {object|null} [courseStats]
 * @param {{ applyLessonLocks?: boolean, requiresEnrollment?: boolean }} [options]
 */
export function mapLmsToStyledCourseDetail(
  course,
  modules,
  quizzesForCourse,
  quizResults = [],
  lessonProgressKeys = [],
  courseStats = null,
  options = {}
) {
  const applyLessonLocks = options.applyLessonLocks !== false;
  const requiresEnrollment = Boolean(options.requiresEnrollment);
  const moduleEmbeddedQuizzes = (Array.isArray(modules) ? modules : []).flatMap((m) =>
    Array.isArray(m?.quizzes) ? m.quizzes : []
  );
  const effectiveQuizzes =
    Array.isArray(quizzesForCourse) && quizzesForCourse.length > 0 ? quizzesForCourse : moduleEmbeddedQuizzes;

  const tabs = mergeTabsContentFromCourseApi(course);
  const attemptedQuizIds = new Set(
    (Array.isArray(quizResults) ? quizResults : [])
      .map((row) => row?.quizId)
      .filter((id) => typeof id === 'string' && id.trim() !== '')
  );
  effectiveQuizzes.forEach((quiz) => {
    const used = Number(quiz?.attemptsUsed ?? 0);
    const completed = Boolean(quiz?.completed) || (Number.isFinite(used) && used > 0);
    if (completed && typeof quiz?.id === 'string' && quiz.id.trim() !== '') {
      attemptedQuizIds.add(quiz.id.trim());
    }
  });
  const completedLessonKeys = new Set(
    (Array.isArray(lessonProgressKeys) ? lessonProgressKeys : [])
      .filter((id) => typeof id === 'string' && id.trim() !== '')
      .map((id) => id.trim())
  );

  const sortedModules = (Array.isArray(modules) ? [...modules] : []).filter((m) => m && m.visible !== false);

  const visibleIds = new Set(sortedModules.map((m) => m.id));
  const quizzesForCourseVisible = effectiveQuizzes.filter(
    (quiz) => !quiz.moduleId || visibleIds.has(quiz.moduleId)
  );

  const quizzesByModule = new Map();
  quizzesForCourseVisible.forEach((quiz) => {
    if (!quiz.moduleId) {
      return;
    }
    const list = quizzesByModule.get(quiz.moduleId) ?? [];
    list.push(quiz);
    quizzesByModule.set(quiz.moduleId, list);
  });

  const curriculumModules =
    sortedModules.length > 0
      ? sortedModules.map((m, mi) => {
          const quizzes = quizzesByModule.get(m.id) ?? [];
          const moduleCompleted =
            typeof m?.progress === 'number' && Number.isFinite(m.progress) ? m.progress >= 100 : false;
          const mainType = deriveLessonType(m);
          const corePeek = plainTextFromRichLessonFields({
            excerptHtml: m.excerptHtml,
            bodyHtml: m.bodyHtml,
            summary: m.summary,
          });
          const expandable = !!corePeek;
          const peekBody = expandable ? corePeek : undefined;

          const standaloneSource = Array.isArray(m.standaloneLessons) ? m.standaloneLessons : [];
          const standaloneRows = standaloneSource.filter(
            (row) => row && typeof row.id === 'string' && row.kind && row.kind !== 'quiz'
          );

          const standaloneLessons = standaloneRows.map((sl, si) => {
            const peekText = plainTextFromRichLessonFields(sl);
            const slExpandable = !!peekText;
            const meta =
              sl.kind === 'document'
                ? 'Text'
                : `${String(sl.kind).replace(/^\w/, (c) => c.toUpperCase())}`;
            return {
              id: sl.id,
              order: 2 + si,
              type: sl.kind,
              title: sl.title ?? 'Lesson',
              meta,
              sortOrder: typeof sl.sortOrder === 'number' ? sl.sortOrder : Number.MAX_SAFE_INTEGER,
              completed: moduleCompleted || Boolean(sl.completed) || completedLessonKeys.has(sl.id),
              locked: typeof sl.locked === 'boolean' ? sl.locked : undefined,
              lessonPreview: isLessonPreviewEnabled(sl.lessonMeta),
              expandable: slExpandable,
              peekBody: slExpandable ? peekText.slice(0, 620) : undefined,
            };
          });
          const quizLessons = quizzes.map((q, qi) => ({
            id: q.id,
            order: 2 + standaloneRows.length + qi,
            type: 'quiz',
            title: q.title,
            meta: formatQuestionCountMeta(q.questionCount),
            sortOrder: typeof q.sortOrder === 'number' ? q.sortOrder : Number.MAX_SAFE_INTEGER,
            completed: attemptedQuizIds.has(q.id),
            locked: typeof q.locked === 'boolean' ? q.locked : undefined,
            expandable: false,
          }));
          const assignments = Array.isArray(m.assignments) ? m.assignments : [];
          const assignmentLessons = assignments.map((a) => {
            const peekText = plainTextFromRichLessonFields({
              excerptHtml: a.lessonContentHtml,
              bodyHtml: a.lessonContentHtml,
            });
            const aExpandable = !!peekText;
            return {
              id: a.id,
              type: 'assignment',
              title: a.title ?? 'Assignment',
              meta: formatQuestionCountMeta(a.questionCount),
              sortOrder: typeof a.sortOrder === 'number' ? a.sortOrder : Number.MAX_SAFE_INTEGER,
              completed: completedLessonKeys.has(a.id),
              locked: typeof a.locked === 'boolean' ? a.locked : undefined,
              lessonPreview: Boolean(a.lessonPreview),
              expandable: aExpandable,
              peekBody: aExpandable ? peekText.slice(0, 620) : undefined,
            };
          });
          const orderedSupplemental = [...standaloneLessons, ...quizLessons, ...assignmentLessons]
            .sort((a, b) => (a.sortOrder ?? Number.MAX_SAFE_INTEGER) - (b.sortOrder ?? Number.MAX_SAFE_INTEGER))
            .map(({ sortOrder, ...row }, index) => ({ ...row, order: index + 2 }));

          const lessons = [
            {
              id: `${m.id}-core`,
              order: 1,
              type: mainType,
              title: coreLessonListTitle(m),
              meta: m.duration ?? '—',
              completed: moduleCompleted || Boolean(m.coreCompleted) || completedLessonKeys.has(`${m.id}-core`),
              locked: typeof m.coreLocked === 'boolean' ? m.coreLocked : undefined,
              lessonPreview: isLessonPreviewEnabled(m.lessonMeta),
              expandable,
              peekBody,
            },
            ...orderedSupplemental,
          ];

          const titleParts = [];
          if (m.subject && String(m.subject).trim()) {
            titleParts.push(String(m.subject).trim());
          }
          titleParts.push(m.title ?? 'Lesson');

          return {
            id: `mod-wrap-${m.id}`,
            title: titleParts.join(' — '),
            defaultOpen: mi < 8,
            lessons,
          };
        })
      : [
          {
            id: 'mod-empty',
            title: 'Curriculum',
            defaultOpen: true,
            lessons: [
              {
                id: 'empty-lesson',
                order: 1,
                type: 'document',
                title: 'Modules will appear once this course publishes content.',
                meta: '—',
                expandable: false,
              },
            ],
          },
        ];

  const videoLessonsInCurriculum = curriculumModules.reduce(
    (sum, mod) =>
      sum +
      (mod.lessons ?? []).filter((lesson) => lesson.type === 'video' || lesson.type === 'stream').length,
    0
  );
  const statsTotalVideos = Number(courseStats?.totalVideos ?? NaN);
  const statsTotalLectures = Number(courseStats?.totalLectures ?? NaN);
  const statsTotalQuizzes = Number(courseStats?.totalQuizzes ?? NaN);
  const statsTotalAssignments = Number(courseStats?.totalAssignments ?? NaN);
  const assignmentsInCurriculum = curriculumModules.reduce(
    (sum, mod) => sum + (mod.lessons ?? []).filter((lesson) => lesson.type === 'assignment').length,
    0
  );
  const moduleEmbeddedAssignments = sortedModules.flatMap((m) =>
    Array.isArray(m.assignments) ? m.assignments : []
  );
  const assignmentsCount =
    moduleEmbeddedAssignments.length > 0
      ? moduleEmbeddedAssignments.length
      : assignmentsInCurriculum;

  const lecturesCount =
    Number.isFinite(statsTotalLectures) && statsTotalLectures >= 0
      ? statsTotalLectures
      : typeof course.totalModules === 'number' && course.totalModules > 0
      ? course.totalModules
      : sortedModules.length;

  const videoCount =
    videoLessonsInCurriculum > 0
      ? videoLessonsInCurriculum
      : Number.isFinite(statsTotalVideos) && statsTotalVideos >= 0
        ? statsTotalVideos
        : 0;

  const detailRows = [
    { key: 'duration', label: 'Duration', value: `${course.hours ?? 0} hours`, icon: 'clock' },
    { key: 'lectures', label: 'Lectures', value: String(lecturesCount), icon: 'book' },
    {
      key: 'video',
      label: 'Video',
      value: String(videoCount),
      icon: 'play',
    },
    {
      key: 'quizzes',
      label: 'Quizzes',
      value: String(Number.isFinite(statsTotalQuizzes) ? statsTotalQuizzes : quizzesForCourseVisible.length),
      icon: 'check',
    },
    {
      key: 'assignments',
      label: 'Assignments',
      value: String(
        Number.isFinite(statsTotalAssignments) && statsTotalAssignments >= 0
          ? statsTotalAssignments
          : assignmentsCount
      ),
      icon: 'clipboard',
    },
  ];

  const totalModsRaw =
    typeof course.totalModules === 'number' && course.totalModules > 0
      ? course.totalModules
      : Math.max(sortedModules.length, 1);
  const safeTotal = Math.max(totalModsRaw, 1);
  const doneMods = typeof course.completedModules === 'number' ? course.completedModules : 0;

  const moduleProgressRows = sortedModules
    .map((m) => (typeof m?.progress === 'number' && Number.isFinite(m.progress) ? m.progress : null))
    .filter((v) => v != null);
  const modulesProgressPercent =
    moduleProgressRows.length > 0
      ? Math.round(moduleProgressRows.reduce((sum, v) => sum + v, 0) / moduleProgressRows.length)
      : null;

  const totalLessonCount = curriculumModules.reduce((sum, mod) => sum + (mod.lessons?.length ?? 0), 0);
  const completedLessonCount = curriculumModules.reduce(
    (sum, mod) => sum + mod.lessons.filter((les) => les.completed).length,
    0
  );
  const lessonCompletionPercent =
    totalLessonCount > 0 ? Math.round((completedLessonCount / totalLessonCount) * 100) : null;

  let pct;
  if (lessonCompletionPercent != null) {
    // Primary signal: completed lesson rows (text/video, quizzes, assignments).
    pct = Math.min(100, Math.max(0, lessonCompletionPercent));
  } else
  if (modulesProgressPercent != null) {
    // Primary signal: learner lesson/module progress from module payload.
    pct = Math.min(100, Math.max(0, modulesProgressPercent));
  } else if (
    typeof course.averageModuleProgressPercent === 'number' &&
    Number.isFinite(course.averageModuleProgressPercent)
  ) {
    pct = Math.min(100, Math.max(0, Math.round(course.averageModuleProgressPercent)));
  } else {
    pct = Math.min(100, Math.round((doneMods / safeTotal) * 100));
  }

  if (course.preview_completed) {
    pct = 100;
  }

  let quizScorePercent = null;
  if (
    typeof course.averageQuizScorePercent === 'number' &&
    Number.isFinite(course.averageQuizScorePercent)
  ) {
    quizScorePercent = Math.min(100, Math.max(0, Math.round(course.averageQuizScorePercent)));
  }

  // Fallback only: if lesson/module progress is unavailable, estimate from attempted course quizzes.
  if (pct === 0 && quizzesForCourseVisible.length > 0) {
    const attemptedCount = quizzesForCourseVisible.reduce(
      (sum, q) => sum + (attemptedQuizIds.has(q.id) ? 1 : 0),
      0
    );
    pct = Math.min(100, Math.round((attemptedCount / quizzesForCourseVisible.length) * 100));
  }

  const completion = {
    label: pct >= 100 ? 'Course complete' : `${pct}% complete`,
    quizScorePercent,
  };

  const courseLookup =
    typeof course.slug === 'string' && course.slug.trim() ? course.slug.trim() : (course.id ?? '');

  const continueHref = courseLookup
    ? `${paths.dashboard.courseDetails(courseLookup)}#curriculum`
    : '#curriculum';

  const resolvedProgramTitle =
    typeof course.programTitle === 'string' && course.programTitle.trim()
      ? course.programTitle.trim()
      : 'Course';

  const data = {
    category: resolvedProgramTitle,
    programSlug:
      typeof course.programSlug === 'string' && course.programSlug.trim()
        ? course.programSlug.trim()
        : '',
    badge: '',
    title: course.title ?? 'Course',
    rating: reviewsToRating([]),
    shortDescription:
      typeof course.description === 'string' && course.description.trim()
        ? course.description.trim()
        : (tabs.paragraphs[0] ?? ''),
    paragraphs: tabs.paragraphs,
  };

  const heroImageUrl = resolveCourseMarketingBannerUrl(course);

  const fallbackNoticeBodies =
    tabs.noticeStrings.length > 0
      ? tabs.noticeStrings
      : ['Enrollment and pacing details will be posted before the cohort starts.'];

  const noticeContent = {
    heading: tabs.noticeHeading ?? `${data.title} — program notes`,
    /** One paragraph per LMS `marketing.notices` string; no fabricated title prefix (edited in Instructor → Notice). */
    items: fallbackNoticeBodies.map((text, i) => ({
      id: `notice-${course.id}-${i}`,
      titleBold: '',
      linkLabel: '',
      href: '',
      body: typeof text === 'string' ? text : String(text ?? ''),
    })),
  };

  const faqPairs =
    tabs.faqPairs.length > 0
      ? tabs.faqPairs
      : [
          {
            question: `What does ${course.title ?? 'this course'} cover?`,
            answer:
              typeof course.description === 'string' && course.description.trim()
                ? course.description.trim()
                : 'See the curriculum tab for module-by-module details.',
          },
        ];

  const faqItems = faqPairs.map((row, i) => ({
    id: `faq-${course.id}-${i}`,
    question: row.question,
    answer: row.answer,
  }));

  const lockLessonsInOrder = applyLessonLocks && Boolean(course?.marketing?.lockLessonsInOrder);
  let curriculumModulesWithLocks =
    !applyLessonLocks
      ? applySequentialLessonLocks(curriculumModules, false)
      : modulesExposeBackendLocks(sortedModules)
        ? curriculumModules
        : applySequentialLessonLocks(curriculumModules, lockLessonsInOrder);

  if (requiresEnrollment) {
    curriculumModulesWithLocks = applyEnrollmentLessonLocks(curriculumModulesWithLocks);
  }

  const enrollCtaHref =
    typeof course.programSlug === 'string' && course.programSlug.trim()
      ? `${paths.programCourseDetail}?program=${encodeURIComponent(course.programSlug.trim())}`
      : paths.dashboard.availablePrograms;

  return {
    data,
    heroImageUrl,
    completion,
    detailRows,
    curriculumModules: curriculumModulesWithLocks,
    noticeContent,
    faqItems,
    continueHref: requiresEnrollment ? enrollCtaHref : continueHref,
    courseLookup,
    requiresEnrollment,
  };
}
