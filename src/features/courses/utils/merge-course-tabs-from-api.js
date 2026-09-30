/** @typedef {{ question?: string; answer?: string }} FaqLike */

/** @returns {string[]} */
function normalizeStringList(value) {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.map((x) => String(x).trim()).filter(Boolean);
}

/**
 * API-only tab content from LMS `course.marketing`.
 * @param {object} course LMS course payload (includes optional `marketing` from `/api/courses`)
 */
export function mergeTabsContentFromCourseApi(course) {
  const m = course?.marketing && typeof course.marketing === 'object' ? course.marketing : {};

  const paragraphs = (() => {
    const api = normalizeStringList(m.description ?? m.paragraphs);
    return api;
  })();

  const noticeStrings = (() => {
    const api = normalizeStringList(m.notices);
    return api;
  })();

  const faqPairs = (() => {
    const raw = Array.isArray(m.faq) ? m.faq : [];
    const fromApi = raw
      .filter((row) => row && typeof row === 'object')
      .map((row) => ({
        question: String(row.question ?? '').trim(),
        answer: String(row.answer ?? '').trim(),
      }))
      .filter((row) => row.question || row.answer);
    if (fromApi.length > 0) {
      return fromApi;
    }

    return [
      {
        question: `What does ${course.title ?? 'this course'} cover?`,
        answer:
          typeof course.description === 'string' && course.description.trim()
            ? course.description.trim()
            : 'See the curriculum tab for module-by-module details.',
      },
    ];
  })();

  const noticeHeading =
    typeof m.noticeHeading === 'string' && m.noticeHeading.trim() ? m.noticeHeading.trim() : null;

  return {
    paragraphs,
    faqPairs,
    noticeStrings,
    noticeHeading,
  };
}
