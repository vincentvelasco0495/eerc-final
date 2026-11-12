/**
 * LMS lesson workspace ↔ API `{ lesson_meta, duration_* }` helpers.
 */

/** Build `lesson_meta` object for PATCH (snake payloads use `lesson_meta` key server-side). */
export function normalizeLessonMetaForApi(meta, extras = {}) {
  const dl =
    typeof meta?.durationLabel === 'string'
      ? meta.durationLabel.trim()
      : typeof extras.durationLabelFallback === 'string'
        ? extras.durationLabelFallback.trim()
        : '';
  const out = {
    lessonPreview: !!meta?.lessonPreview,
    unlockAfterPurchase: !!meta?.unlockAfterPurchase,
    startDate: null,
    startTime: null,
  };
  if (dl !== '') {
    out.durationLabel = dl;
  }
  return out;
}

export const VIDEO_WATERMARK_MAX_LENGTH = 120;
export const HTML_MP4_VIDEO_SOURCE = 'html-mp4';
export const TEAMS_LINK_VIDEO_SOURCE = 'teams-link';
export const EXTERNAL_VIDEO_URL_MAX_LENGTH = 4000;
export const DEFAULT_VIDEO_WATERMARK_COLOR = '#FFFFFF';
/** Percent, matching the previous fixed tile opacity of 0.42. */
export const DEFAULT_VIDEO_WATERMARK_OPACITY = 42;

export function normalizeVideoWatermarkText(value) {
  if (typeof value !== 'string') {
    return '';
  }
  return value.replace(/\s+/g, ' ').trim().slice(0, VIDEO_WATERMARK_MAX_LENGTH);
}

export function normalizeVideoWatermarkColor(value) {
  const raw = String(value ?? '').trim();
  const match = raw.match(/^#?([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/);
  if (!match) {
    return DEFAULT_VIDEO_WATERMARK_COLOR;
  }
  const hex = match[1].length === 3 ? match[1].replace(/./g, (char) => char + char) : match[1];
  return `#${hex.toUpperCase()}`;
}

/** Opacity is a percent from 0 to 100. A decimal between 0 and 1 is treated as a fraction. */
export function normalizeVideoWatermarkOpacity(value) {
  const amount = Number(value);
  if (!Number.isFinite(amount)) {
    return DEFAULT_VIDEO_WATERMARK_OPACITY;
  }
  const raw = typeof value === 'string' ? value.trim() : value;
  const isFraction =
    (typeof raw === 'number' && !Number.isInteger(raw)) ||
    (typeof raw === 'string' && raw.includes('.'));
  const percent = isFraction && amount > 0 && amount <= 1 ? amount * 100 : amount;
  return Math.max(0, Math.min(100, Math.round(percent)));
}

function externalVideoHostAllowed(hostname) {
  const host = String(hostname || '').toLowerCase();
  return (
    host === 'sharepoint.com' ||
    host.endsWith('.sharepoint.com') ||
    host === 'sharepoint.us' ||
    host.endsWith('.sharepoint.us') ||
    host === 'teams.microsoft.com' ||
    host.endsWith('.teams.microsoft.com')
  );
}

/** Teams or SharePoint https link. Anything else is dropped. */
export function normalizeExternalVideoUrl(value) {
  const raw = String(value ?? '').trim();
  if (!raw || raw.length > EXTERNAL_VIDEO_URL_MAX_LENGTH) {
    return '';
  }
  try {
    const parsed = new URL(raw);
    if (parsed.protocol !== 'https:' || parsed.username || parsed.password) {
      return '';
    }
    if (!externalVideoHostAllowed(parsed.hostname)) {
      return '';
    }
    return raw;
  } catch {
    return '';
  }
}

/**
 * Video lesson workspace: schedule / toggles + source + optional linked lesson-material public ids.
 */
export function normalizeVideoWorkspaceMeta(bundle, extras = {}) {
  const {
    lessonPreview,
    durationLabel,
    videoSourceType,
    videoLessonMaterialPublicId,
    videoExternalUrl,
    watermarkText,
    watermarkColor,
    watermarkOpacity,
  } = bundle ?? {};

  const base = normalizeLessonMetaForApi(
    { lessonPreview, unlockAfterPurchase: false, durationLabel },
    extras
  );

  const out = { ...base };
  const requested =
    typeof videoSourceType === 'string' && videoSourceType.trim()
      ? videoSourceType.trim()
      : HTML_MP4_VIDEO_SOURCE;
  const vst = requested === TEAMS_LINK_VIDEO_SOURCE ? TEAMS_LINK_VIDEO_SOURCE : HTML_MP4_VIDEO_SOURCE;
  out.videoSourceType = vst;
  const externalUrl = vst === TEAMS_LINK_VIDEO_SOURCE ? normalizeExternalVideoUrl(videoExternalUrl) : '';
  out.videoExternalUrl = externalUrl || null;

  if (videoLessonMaterialPublicId != null && String(videoLessonMaterialPublicId).trim() !== '') {
    out.videoLessonMaterialPublicId = String(videoLessonMaterialPublicId).trim();
  } else {
    out.videoLessonMaterialPublicId = null;
  }

  const watermark = normalizeVideoWatermarkText(watermarkText);
  out.watermarkText = watermark || null;
  out.watermarkColor = normalizeVideoWatermarkColor(watermarkColor);
  out.watermarkOpacity = normalizeVideoWatermarkOpacity(watermarkOpacity);

  return out;
}
