export function nid() {
  return globalThis.crypto?.randomUUID?.() ?? `q-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export const LETTER_ANSWERS = ['A', 'B', 'C', 'D'];

export { QUIZ_PDF_MAX_ITEMS } from '../../utils/quiz-pdf-constants';

/** Stored when the stem is the attached image (options are printed on it). */
export const DEFAULT_IMAGE_QUESTION_PROMPT = 'Select the correct answer';

export function createLetterAnswers(correctIndex = 0) {
  const answers = LETTER_ANSWERS.map((text) => ({ id: nid(), text }));
  const idx =
    Number.isInteger(correctIndex) && correctIndex >= 0 && correctIndex < answers.length
      ? correctIndex
      : 0;
  return { answers, correctAnswerId: answers[idx].id };
}

/** Map loaded options onto A–D, keeping the correct choice by index when possible. */
export function answersToLetterChoices(answers, correctAnswerId) {
  const list = Array.isArray(answers) ? answers : [];
  const alreadyLetters =
    list.length === LETTER_ANSWERS.length &&
    list.every((a, i) => String(a?.text ?? '').trim().toUpperCase() === LETTER_ANSWERS[i]);

  if (alreadyLetters) {
    const id = list.some((a) => a.id === correctAnswerId) ? correctAnswerId : list[0].id;
    return {
      answers: list.map((a, i) => ({ id: a.id, text: LETTER_ANSWERS[i] })),
      correctAnswerId: id,
    };
  }

  const foundIdx = list.findIndex((a) => a.id === correctAnswerId || a.isCorrect);
  return createLetterAnswers(foundIdx < 0 ? 0 : Math.min(foundIdx, LETTER_ANSWERS.length - 1));
}

/** Seed question when opening a quiz lesson (demo content). */
export function createDemoQuestion() {
  const { answers, correctAnswerId } = createLetterAnswers(2);
  return {
    id: nid(),
    collapsed: true,
    questionText: '',
    questionType: 'single_choice',
    required: false,
    problemImageMaterialPublicId: null,
    problemImagePreviewUrl: null,
    problemImageName: null,
    problemImageMime: null,
    solutionImageMaterialPublicId: null,
    solutionImagePreviewUrl: null,
    solutionImageName: null,
    answers,
    correctAnswerId,
    newAnswerDraft: '',
  };
}

/** New quiz row from “+ Question” — image stem, A–D answers, starts collapsed. */
export function createBlankQuizQuestion() {
  const { answers, correctAnswerId } = createLetterAnswers(0);
  return {
    id: nid(),
    collapsed: true,
    questionText: '',
    questionType: 'single_choice',
    required: false,
    problemImageMaterialPublicId: null,
    problemImagePreviewUrl: null,
    problemImageName: null,
    problemImageMime: null,
    solutionImageMaterialPublicId: null,
    solutionImagePreviewUrl: null,
    solutionImageName: null,
    answers,
    correctAnswerId,
    newAnswerDraft: '',
  };
}

/** New assignment row — empty stem, two answer slots. */
export function createBlankQuestion() {
  const a1 = nid();
  const a2 = nid();
  return {
    id: nid(),
    collapsed: true,
    questionText: '',
    questionType: 'single_choice',
    required: false,
    problemImageMaterialPublicId: null,
    problemImagePreviewUrl: null,
    problemImageName: null,
    problemImageMime: null,
    solutionImageMaterialPublicId: null,
    solutionImagePreviewUrl: null,
    solutionImageName: null,
    answers: [
      { id: a1, text: '' },
      { id: a2, text: '' },
    ],
    correctAnswerId: a1,
    newAnswerDraft: '',
  };
}

export function isPlaceholderQuizQuestion(q) {
  const hasImage =
    typeof q?.problemImageMaterialPublicId === 'string' && q.problemImageMaterialPublicId.trim() !== '';
  const text = String(q?.questionText ?? '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return !hasImage && text === '';
}

export function createImportedPdfQuestion({
  materialPublicId,
  previewUrl,
  itemNumber,
  collapsed = true,
}) {
  const { answers, correctAnswerId } = createLetterAnswers(0);
  const label = Number.isInteger(itemNumber) ? `Item ${itemNumber}` : 'PDF item';
  return {
    id: nid(),
    collapsed,
    questionText: '',
    questionType: 'single_choice',
    required: false,
    problemImageMaterialPublicId: materialPublicId,
    problemImagePreviewUrl: previewUrl ?? null,
    problemImageName: label,
    problemImageMime: 'application/pdf',
    solutionImageMaterialPublicId: null,
    solutionImagePreviewUrl: null,
    solutionImageName: null,
    answers,
    correctAnswerId,
    newAnswerDraft: '',
    itemNumber: Number.isInteger(itemNumber) ? itemNumber : null,
  };
}
