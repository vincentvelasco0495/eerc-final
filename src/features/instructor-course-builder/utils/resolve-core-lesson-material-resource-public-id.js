/**
 * Pick a `module_resources.public_id` for tagging uploads from the “core” lesson row in the builder.
 *
 * @param {object} moduleRow
 * @param {'document'|'video'} lessonType
 * @returns {string|null}
 */
export function resolveCoreLessonMaterialResourcePublicId(moduleRow, lessonType) {
  const rows = Array.isArray(moduleRow?.resourceRows) ? moduleRow.resourceRows : [];
  const nonStandalone = rows.filter((r) => r && !r.isStandalone);
  if (lessonType === 'video') {
    const row = nonStandalone.find((r) => r.format === 'Video');
    if (row?.id) {
      return row.id;
    }
  }
  if (lessonType === 'document') {
    const row = nonStandalone.find((r) => ['Text', 'PDF', 'eBook'].includes(r.format));
    if (row?.id) {
      return row.id;
    }
  }
  const fallback = nonStandalone[0];
  return fallback?.id ?? null;
}
