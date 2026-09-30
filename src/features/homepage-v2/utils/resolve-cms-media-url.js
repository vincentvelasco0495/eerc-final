import { resolveApiAssetUrl } from 'src/utils/resolve-api-asset-url';

import { CONFIG } from 'src/global-config';

/** CMS media public ids look like `media-{ulid}`, not slot ids such as `ins-1`. */
export function cmsMediaPublicId(media) {
  const fromMediaId = typeof media?.mediaId === 'string' ? media.mediaId.trim() : '';
  if (fromMediaId) {
    return fromMediaId;
  }

  const fromId = typeof media?.id === 'string' ? media.id.trim() : '';
  if (fromId.startsWith('media-')) {
    return fromId;
  }

  return '';
}

/** Resolve API storage URLs for `<img src>` (handles relative `/storage/...`). */
export function resolveCmsMediaUrl(url, mediaId = null) {
  const base = (CONFIG.serverUrl ?? '').replace(/\/$/, '');
  const id = typeof mediaId === 'string' ? mediaId.trim() : '';
  if (base && id) {
    // Prefer API delivery so media still loads when direct `/storage` is forbidden by web server.
    return `${base}/api/media/${encodeURIComponent(id)}/file`;
  }

  if (!url || typeof url !== 'string') {
    return '';
  }
  return resolveApiAssetUrl(url);
}

export function resolveCmsMediaFromRecord(media) {
  return resolveCmsMediaUrl(media?.url, cmsMediaPublicId(media) || null);
}
