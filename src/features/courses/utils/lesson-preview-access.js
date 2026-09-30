/** Whether instructor toggled "Lesson preview" in lesson settings. */
export function isLessonPreviewEnabled(lessonMeta) {
  if (!lessonMeta || typeof lessonMeta !== 'object') {
    return false;
  }

  return Boolean(lessonMeta.lessonPreview);
}

/**
 * Guests may open a curriculum lesson only when preview is enabled on that row.
 *
 * @param {string} lessonKey curriculum id (`{moduleId}-core` or standalone resource id)
 * @param {object[]} modules LMS module payloads
 */
export function guestCanAccessLesson(lessonKey, modules) {
  const key = String(lessonKey ?? '').trim();
  if (!key || !Array.isArray(modules)) {
    return false;
  }

  if (key.endsWith('-core')) {
    const modulePublicId = key.slice(0, -'-core'.length);
    const mod = modules.find((m) => m && m.id === modulePublicId);
    return isLessonPreviewEnabled(mod?.lessonMeta);
  }

  for (const mod of modules) {
    const row = (mod.standaloneLessons ?? []).find((r) => r && r.id === key);
    if (row) {
      return isLessonPreviewEnabled(row.lessonMeta);
    }

    const assignment = (mod.assignments ?? []).find((r) => r && r.id === key);
    if (assignment) {
      return Boolean(assignment.lessonPreview);
    }
  }

  return false;
}
