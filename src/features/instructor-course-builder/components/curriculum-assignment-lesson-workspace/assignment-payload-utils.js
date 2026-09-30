import { nid, createBlankQuestion } from '../curriculum-quiz-lesson-workspace/quiz-question-factory';

export function normalizeLoadedAssignmentQuestions(rows) {
  const list = Array.isArray(rows) ? rows : [];
  if (list.length === 0) {
    return [{ ...createBlankQuestion(), collapsed: false }];
  }

  return list.map((q) => {
    const optionsRaw = Array.isArray(q?.options)
      ? q.options
      : Array.isArray(q?.choices)
        ? q.choices.map((label) => ({ label, isCorrect: false }))
        : [];
    const answers = optionsRaw.map((opt) => ({
      id: typeof opt?.id === 'string' ? opt.id : nid(),
      text: String(opt?.label ?? ''),
      isCorrect: Boolean(opt?.isCorrect),
    }));
    const fallbackId = answers[0]?.id ?? nid();
    const correct = answers.find((a) => a.isCorrect)?.id ?? fallbackId;

    return {
      id: typeof q?.id === 'string' ? q.id : nid(),
      collapsed: true,
      questionText: typeof q?.prompt === 'string' ? q.prompt : '',
      questionType: 'single_choice',
      answers: answers.length > 0 ? answers.map(({ id, text }) => ({ id, text })) : [{ id: fallbackId, text: '' }],
      correctAnswerId: correct,
      newAnswerDraft: '',
    };
  });
}

export function toPersistedAssignmentQuestions(questions) {
  return (Array.isArray(questions) ? questions : [])
    .map((q) => ({
      prompt: String(q?.questionText ?? '').trim(),
      choices: (Array.isArray(q?.answers) ? q.answers : [])
        .map((a) => ({
          label: String(a?.text ?? '').trim(),
          isCorrect: String(a?.id ?? '') === String(q?.correctAnswerId ?? ''),
        }))
        .filter((c) => c.label !== ''),
    }))
    .filter((q) => q.prompt !== '' && q.choices.length >= 2);
}
