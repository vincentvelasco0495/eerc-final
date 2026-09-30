/** Same display title as curriculum module headers in `map-lms-to-styled-shell`. */
export function moduleCurriculumTitle(mod) {
  if (!mod || typeof mod !== 'object') {
    return '';
  }
  const subj = mod.subject && String(mod.subject).trim() ? String(mod.subject).trim() : '';
  const ttl = typeof mod.title === 'string' && mod.title.trim() ? mod.title.trim() : 'Lesson';
  return subj ? `${subj} — ${ttl}` : ttl;
}

/**
 * Resolve a learner text-lesson payload from `/api/modules?courseId=…` rows.
 *
 * `lessonKey` matches curriculum UI ids: standalone `ModuleResource.public_id`, or
 * `{modulePublicId}-core` for the module's primary lesson row.
 *
 * @param {string} lessonKey
 * @param {object[]} modules – LMS `formatModule` payloads
 * @returns {{ kind: 'standalone' | 'core', title: string, bodyHtml: string, lessonMaterials: object[], moduleId?: string, moduleTitle: string } | null}
 */
export function resolveTextLessonFromModules(lessonKey, modules) {
  if (!lessonKey || !Array.isArray(modules)) {
    return null;
  }

  if (lessonKey.endsWith('-core')) {
    const modulePublicId = lessonKey.slice(0, -'-core'.length);
    const mod = modules.find((m) => m && m.id === modulePublicId);
    if (!mod) {
      return null;
    }
    const body =
      typeof mod.bodyHtml === 'string' && mod.bodyHtml.trim()
        ? mod.bodyHtml
        : typeof mod.excerptHtml === 'string' && mod.excerptHtml.trim()
          ? mod.excerptHtml
          : typeof mod.summary === 'string'
            ? mod.summary
            : '';
    return {
      kind: 'core',
      moduleId: mod.id,
      moduleTitle: moduleCurriculumTitle(mod),
      title: typeof mod.title === 'string' && mod.title.trim() ? mod.title.trim() : 'Lesson',
      bodyHtml: body,
      lessonMaterials: Array.isArray(mod.lessonMaterials) ? mod.lessonMaterials : [],
    };
  }

  for (const mod of modules) {
    const rows = Array.isArray(mod.standaloneLessons) ? mod.standaloneLessons : [];
    const row = rows.find((r) => r && r.id === lessonKey && r.kind === 'document');
    if (row) {
      const body =
        typeof row.bodyHtml === 'string' && row.bodyHtml.trim()
          ? row.bodyHtml
          : typeof row.excerptHtml === 'string' && row.excerptHtml.trim()
            ? row.excerptHtml
            : typeof row.summary === 'string'
              ? row.summary
              : '';
      return {
        kind: 'standalone',
        moduleId: mod.id,
        moduleTitle: moduleCurriculumTitle(mod),
        title: typeof row.title === 'string' && row.title.trim() ? row.title.trim() : 'Text lesson',
        bodyHtml: body,
        lessonMaterials: Array.isArray(row.lessonMaterials) ? row.lessonMaterials : [],
      };
    }
  }

  return null;
}
