import {
  deriveLessonType,
  coreLessonListTitle,
} from 'src/features/instructor-course-builder/utils/map-lms-modules-to-curriculum-builder';

import { moduleCurriculumTitle } from './resolve-text-lesson-from-modules';

const VIDEO_KINDS = new Set(['video', 'stream', 'zoom']);

/**
 * First uploaded file suitable for HTML5 video (`lesson_materials.storage_path` via API `id`).
 *
 * @param {object[]|undefined} materials
 * @returns {{ id: string, name?: string, mime?: string, fileUrl?: string, inlineFileUrl?: string } | null}
 */
export function pickPrimaryVideoMaterial(materials) {
  const list = Array.isArray(materials) ? materials : [];
  const byMime = list.find(
    (m) => m && typeof m.id === 'string' && typeof m.mime === 'string' && m.mime.toLowerCase().startsWith('video/')
  );
  if (byMime) {
    return {
      id: byMime.id,
      name: byMime.name,
      mime: byMime.mime,
      fileUrl: byMime.fileUrl,
      inlineFileUrl: byMime.inlineFileUrl,
    };
  }
  const byName = list.find(
    (m) =>
      m &&
      typeof m.id === 'string' &&
      typeof m.name === 'string' &&
      /\.(mp4|webm|ogg|mov|m4v)(\?|$)/i.test(m.name)
  );
  if (byName) {
    return {
      id: byName.id,
      name: byName.name,
      mime: byName.mime,
      fileUrl: byName.fileUrl,
      inlineFileUrl: byName.inlineFileUrl,
    };
  }
  return null;
}

function bodyFromModule(mod) {
  if (!mod || typeof mod !== 'object') {
    return '';
  }
  if (typeof mod.bodyHtml === 'string' && mod.bodyHtml.trim()) {
    return mod.bodyHtml;
  }
  if (typeof mod.excerptHtml === 'string' && mod.excerptHtml.trim()) {
    return mod.excerptHtml;
  }
  if (typeof mod.summary === 'string') {
    return mod.summary;
  }
  return '';
}

function lessonWatermarkText(lessonMeta) {
  if (!lessonMeta || typeof lessonMeta !== 'object') {
    return '';
  }
  const raw = lessonMeta.watermarkText ?? lessonMeta.watermark_text;
  return typeof raw === 'string' ? raw.trim() : '';
}

function bodyFromStandaloneRow(row) {
  if (!row || typeof row !== 'object') {
    return '';
  }
  if (typeof row.bodyHtml === 'string' && row.bodyHtml.trim()) {
    return row.bodyHtml;
  }
  if (typeof row.excerptHtml === 'string' && row.excerptHtml.trim()) {
    return row.excerptHtml;
  }
  if (typeof row.summary === 'string') {
    return row.summary;
  }
  return '';
}

/**
 * Resolve a learner video-style lesson (`video` / `stream` / `zoom` standalone, or `-core` when primary type is video).
 *
 * @param {string} lessonKey
 * @param {object[]} modules
 * @returns {{ kind: 'standalone' | 'core', lessonKind: string, title: string, bodyHtml: string, moduleId: string, moduleTitle: string, lessonMaterials: object[], primaryVideoMaterial: { id: string, name?: string, mime?: string } | null, watermarkText: string } | null}
 */
export function resolveVideoLessonFromModules(lessonKey, modules) {
  if (!lessonKey || !Array.isArray(modules)) {
    return null;
  }

  if (lessonKey.endsWith('-core')) {
    const modulePublicId = lessonKey.slice(0, -'-core'.length);
    const mod = modules.find((m) => m && m.id === modulePublicId);
    if (!mod) {
      return null;
    }
    if (deriveLessonType(mod) !== 'video') {
      return null;
    }
    const body = bodyFromModule(mod);
    const lessonMaterials = Array.isArray(mod.lessonMaterials) ? mod.lessonMaterials : [];
    return {
      kind: 'core',
      lessonKind: 'video',
      moduleId: mod.id,
      moduleTitle: moduleCurriculumTitle(mod),
      title: coreLessonListTitle(mod),
      bodyHtml: body,
      lessonMaterials,
      primaryVideoMaterial: pickPrimaryVideoMaterial(lessonMaterials),
      watermarkText: lessonWatermarkText(mod.lessonMeta),
    };
  }

  for (const mod of modules) {
    const rows = Array.isArray(mod.standaloneLessons) ? mod.standaloneLessons : [];
    const row = rows.find((r) => r && r.id === lessonKey && VIDEO_KINDS.has(r.kind));
    if (row) {
      const lessonMaterials = Array.isArray(row.lessonMaterials) ? row.lessonMaterials : [];
      return {
        kind: 'standalone',
        lessonKind: row.kind,
        moduleId: mod.id,
        moduleTitle: moduleCurriculumTitle(mod),
        title: typeof row.title === 'string' && row.title.trim() ? row.title.trim() : 'Video lesson',
        bodyHtml: bodyFromStandaloneRow(row),
        lessonMaterials,
        primaryVideoMaterial: pickPrimaryVideoMaterial(lessonMaterials),
        watermarkText: lessonWatermarkText(row.lessonMeta),
      };
    }
  }

  return null;
}
