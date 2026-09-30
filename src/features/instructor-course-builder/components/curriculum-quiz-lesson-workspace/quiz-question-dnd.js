/** Payload marker for pragmatic-drag-and-drop (vertical quiz question list). */

export const QUIZ_QUESTION_DND_TYPE = 'application/x-eerc-quiz-question';

export function getQuizQuestionItemData({ itemId, rect }) {
  return { [QUIZ_QUESTION_DND_TYPE]: true, item: { id: itemId }, rect };
}

export function isQuizQuestionDndData(value) {
  return Boolean(value?.[QUIZ_QUESTION_DND_TYPE]);
}

export const QUIZ_QUESTION_ITEM_ATTR = 'data-quiz-question-item-id';
