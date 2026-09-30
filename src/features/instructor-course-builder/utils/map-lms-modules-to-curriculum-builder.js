/**
 * Sidebar / mapper title for the primary (-core) lesson row.
 * Persisted as `lessonMeta.coreLessonTitle`; falls back to module title for legacy rows.
 */
export function coreLessonListTitle(m) {
  if (!m || typeof m !== 'object') {
    return 'Lesson';
  }
  const meta = m.lessonMeta && typeof m.lessonMeta === 'object' ? m.lessonMeta : {};
  const explicit =
    typeof meta.coreLessonTitle === 'string' && meta.coreLessonTitle.trim() !== ''
      ? meta.coreLessonTitle.trim()
      : null;
  if (explicit) {
    return explicit;
  }
  return m.title ?? 'Lesson';
}

/** Exported for learner course Curriculum tab — keep in sync with sidebar lesson typing. */
export function deriveLessonType(m) {
  if (m.streamingOnly) {
    return 'video';
  }
  const coreResources = Array.isArray(m.coreResources)
    ? m.coreResources
    : Array.isArray(m.resources)
      ? m.resources
      : [];
  if (coreResources.includes('Video')) {
    return 'video';
  }
  const step = typeof m.type === 'string' ? m.type.toLowerCase() : '';
  if (step.includes('practice') || step.includes('coach') || step.includes('final')) {
    return 'quiz';
  }
  return 'document';
}

/**
 * Mirrors learner curriculum mapping → curriculum builder sidebar/module shape.
 *
 * @param {object[]} modules `/api/modules?courseId=…`
 * @param {object[]} quizzesForCourse quizzes with `courseId` / `moduleId`
 */
export function mapLmsModulesToCurriculumBuilder(modules, quizzesForCourse = []) {
  const sorted = [...(modules ?? [])].filter((m) => m && m.visible !== false);

  const quizzesByModule = new Map();
  (Array.isArray(quizzesForCourse) ? quizzesForCourse : []).forEach((q) => {
    if (!q?.moduleId) {
      return;
    }
    const list = quizzesByModule.get(q.moduleId) ?? [];
    list.push(q);
    quizzesByModule.set(q.moduleId, list);
  });

  return sorted.map((m, mi) => {
    const quizzes = quizzesByModule.get(m.id) ?? [];
    const mainType = deriveLessonType(m);
    const standalone = Array.isArray(m.standaloneLessons)
      ? m.standaloneLessons.slice()
      : [];
    const standaloneRows = standalone
      .filter((row) => row && typeof row.id === 'string' && row.kind && row.kind !== 'quiz' && row.kind !== 'assignment')
      .map((sl) => ({
        id: sl.id,
        draft: false,
        type: sl.kind,
        title: sl.title ?? 'Lesson',
        meta: sl.kind === 'document' ? 'Text' : `${String(sl.kind).replace(/^\w/, (c) => c.toUpperCase())}`,
        sortOrder: typeof sl.sortOrder === 'number' ? sl.sortOrder : Number.MAX_SAFE_INTEGER,
      }));
    const quizRows = quizzes.map((q) => ({
      id: q.id,
      draft: false,
      type: 'quiz',
      title: q.title ?? 'Quiz',
      meta: `${q.questionCount ?? 0} questions`,
      sortOrder: typeof q.sortOrder === 'number' ? q.sortOrder : Number.MAX_SAFE_INTEGER,
    }));
    const assignments = Array.isArray(m.assignments) ? m.assignments : [];
    const assignmentRows = assignments.map((a) => ({
      id: a.id,
      draft: false,
      type: 'assignment',
      title: a.title ?? 'Assignment',
      meta: `${a.questionCount ?? 0} ${(a.questionCount ?? 0) === 1 ? 'question' : 'questions'}`,
      sortOrder: typeof a.sortOrder === 'number' ? a.sortOrder : Number.MAX_SAFE_INTEGER,
    }));
    const orderedRows = [...standaloneRows, ...quizRows, ...assignmentRows].sort(
      (a, b) => (a.sortOrder ?? Number.MAX_SAFE_INTEGER) - (b.sortOrder ?? Number.MAX_SAFE_INTEGER)
    );
    const lessons = [
      {
        id: `${m.id}-core`,
        draft: false,
        type: mainType,
        title: coreLessonListTitle(m),
        meta: m.duration ?? '—',
      },
      ...orderedRows.map(({ sortOrder, ...row }) => row),
    ];

    const titleParts = [];
    if (m.subject && String(m.subject).trim()) {
      titleParts.push(String(m.subject).trim());
    }
    titleParts.push(m.title ?? 'Lesson');

    return {
      id: m.id,
      title: titleParts.join(' — '),
      defaultOpen: mi < 8,
      lessons,
    };
  });
}
