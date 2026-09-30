/** @typedef {{ id: string, name?: string, mime?: string|null, sizeBytes?: number, fileUrl?: string|null, inlineFileUrl?: string|null, moduleResourceId?: string|null }} LessonMaterialRow */

export function normalizeUploadedLessonMaterial(payload) {
  const row = payload?.data ?? payload;
  if (!row?.id) {
    return null;
  }

  return {
    id: String(row.id),
    name: row.name ?? 'File',
    mime: row.mime ?? null,
    sizeBytes: row.sizeBytes != null ? Number(row.sizeBytes) : undefined,
    fileUrl: row.fileUrl ?? null,
    inlineFileUrl: row.inlineFileUrl ?? row.fileUrl ?? null,
    moduleResourceId: row.moduleResourceId ?? null,
    usage: row.usage ?? 'lesson',
  };
}

export function excludeQuizQuestionImages(rows, hiddenIds = []) {
  const hide = new Set(
    (Array.isArray(hiddenIds) ? hiddenIds : []).map((id) => String(id).trim()).filter(Boolean)
  );

  return (Array.isArray(rows) ? rows : []).filter((row) => {
    if (!row?.id) {
      return false;
    }
    if (hide.has(String(row.id))) {
      return false;
    }
    return String(row.usage ?? 'lesson') !== 'quiz_question_image';
  });
}

/**
 * Patch `lessonMaterials` on one module or standalone lesson in the cached `/modules` list.
 */
export function patchLessonMaterialsInModulesList(
  modules,
  { modulePublicId, standaloneLessonPublicId, assignmentPublicId, add = [], removeIds = [] }
) {
  if (!modulePublicId) {
    return modules;
  }

  const removeSet = new Set(
    (Array.isArray(removeIds) ? removeIds : []).map((id) => String(id).trim()).filter(Boolean)
  );
  const toAdd = (Array.isArray(add) ? add : []).filter((row) => row?.id);

  return (Array.isArray(modules) ? modules : []).map((mod) => {
    if (mod.id !== modulePublicId) {
      return mod;
    }

    const applyPatch = (current) => {
      let next = (Array.isArray(current) ? current : []).filter((row) => !removeSet.has(String(row.id)));
      for (const row of toAdd) {
        if (!next.some((item) => String(item.id) === String(row.id))) {
          next = [...next, row];
        }
      }
      return next;
    };

    if (standaloneLessonPublicId) {
      const standalone = Array.isArray(mod.standaloneLessons) ? mod.standaloneLessons : [];
      return {
        ...mod,
        standaloneLessons: standalone.map((lessonRow) =>
          lessonRow.id === standaloneLessonPublicId
            ? { ...lessonRow, lessonMaterials: applyPatch(lessonRow.lessonMaterials) }
            : lessonRow
        ),
      };
    }

    if (assignmentPublicId) {
      const assignments = Array.isArray(mod.assignments) ? mod.assignments : [];
      return {
        ...mod,
        assignments: assignments.map((row) =>
          row.id === assignmentPublicId
            ? { ...row, materials: applyPatch(row.materials) }
            : row
        ),
      };
    }

    return {
      ...mod,
      lessonMaterials: applyPatch(mod.lessonMaterials),
    };
  });
}

export function buildLessonAuthoringTargetKey(lesson, liveLessonAuthoring) {
  if (!lesson?.id || !liveLessonAuthoring) {
    return '';
  }
  const standalone =
    liveLessonAuthoring.standaloneLessonPublicId != null &&
    String(liveLessonAuthoring.standaloneLessonPublicId).trim() !== ''
      ? String(liveLessonAuthoring.standaloneLessonPublicId).trim()
      : 'core';
  return `${lesson.id}|${standalone}`;
}
