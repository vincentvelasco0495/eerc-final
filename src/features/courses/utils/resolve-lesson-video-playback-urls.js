import { CONFIG } from 'src/global-config';

export function resolveLessonVideoPlaybackUrls(materialId, playbackUrl = '') {
  const base = String(CONFIG.serverUrl ?? '')
    .trim()
    .replace(/\/$/, '');
  const id = typeof materialId === 'string' ? materialId.trim() : '';
  const urls = [];
  const extra = typeof playbackUrl === 'string' ? playbackUrl.trim() : '';
  if (extra) {
    urls.push(extra);
  }
  if (base && id) {
    urls.push(`${base}/api/lesson-materials/${encodeURIComponent(id)}/file?inline=1`);
    urls.push(`${base}/api/lesson-materials/${encodeURIComponent(id)}/file`);
  }
  return [...new Set(urls.filter(Boolean))];
}
