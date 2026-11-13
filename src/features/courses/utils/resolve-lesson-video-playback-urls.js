import { CONFIG } from 'src/global-config';

export function resolveLessonVideoPlaybackUrls(materialId, playbackUrl = '') {
  const base = String(CONFIG.serverUrl ?? '')
    .trim()
    .replace(/\/$/, '');
  const id = typeof materialId === 'string' ? materialId.trim() : '';
  let extra = typeof playbackUrl === 'string' ? playbackUrl.trim() : '';
  if (extra && /[?&]play=/.test(extra)) {
    return [extra];
  }
  if (/^https?:\/\//i.test(extra)) {
    try {
      const host = new URL(extra).hostname;
      const apiHost = base ? new URL(base).hostname : '';
      if (host && apiHost && host !== apiHost) {
        extra = '';
      }
    } catch {
      extra = '';
    }
  }
  const urls = [];
  if (extra) {
    urls.push(extra);
  }
  if (base && id) {
    urls.push(`${base}/api/lesson-materials/${encodeURIComponent(id)}/file?inline=1`);
    urls.push(`${base}/api/lesson-materials/${encodeURIComponent(id)}/file`);
  }
  return [...new Set(urls.filter(Boolean))];
}
