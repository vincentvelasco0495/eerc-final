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

function cmsFilename(media) {
  const fromName = String(media?.filename ?? '').trim();
  if (fromName && /\.(mp4|webm|ogg)$/i.test(fromName)) {
    return fromName.replace(/^.*[/\\]/, '');
  }
  const fromUrl = String(media?.url ?? '').split('?')[0].trim();
  const match = fromUrl.match(/([^/\\]+\.(mp4|webm|ogg))$/i);
  return match ? match[1] : '';
}

function cmsStoragePathFromUrl(url) {
  const raw = String(url ?? '').trim();
  if (!raw) {
    return '';
  }
  const withoutQuery = raw.split('?')[0];
  const storageIndex = withoutQuery.indexOf('/storage/');
  if (storageIndex >= 0) {
    return withoutQuery.slice(storageIndex + '/storage/'.length).replace(/^\/+/, '');
  }
  const pathOnly = withoutQuery.replace(/^https?:\/\/[^/]+/i, '');
  if (pathOnly.startsWith('/cms/') || pathOnly.startsWith('cms/')) {
    return pathOnly.replace(/^\/+/, '');
  }
  return '';
}

export function resolveCmsVideoPlaybackUrls(media) {
  const base = (CONFIG.serverUrl ?? '').replace(/\/$/, '');
  const urls = [];
  const filename = cmsFilename(media);

  if (base && filename) {
    urls.push(`${base}/cms-videos/${encodeURIComponent(filename)}`);
    urls.push(`${base}/api/cms-videos/${encodeURIComponent(filename)}`);
  }

  const storagePath = cmsStoragePathFromUrl(media?.url);
  if (base && storagePath) {
    urls.push(`${base}/api/public-storage/file?path=${encodeURIComponent(storagePath)}`);
  }

  const id = cmsMediaPublicId(media);
  if (base && id) {
    urls.push(`${base}/api/media/${encodeURIComponent(id)}/file`);
  }

  const fromUrl = media?.url ? resolveApiAssetUrl(media.url) : '';
  if (fromUrl) {
    urls.push(fromUrl);
  }

  return [...new Set(urls.filter(Boolean))];
}

/** Resolve API storage URLs for `<img src>` / `<video src>` (handles relative `/storage/...`). */
export function resolveCmsMediaUrl(url, mediaId = null) {
  const filename = cmsFilename({ url });
  if (filename) {
    const playback = resolveCmsVideoPlaybackUrls({ url, mediaId, filename });
    if (playback[0]) {
      return playback[0];
    }
  }

  const base = (CONFIG.serverUrl ?? '').replace(/\/$/, '');
  const storagePath = cmsStoragePathFromUrl(url);
  if (base && storagePath) {
    return `${base}/api/public-storage/file?path=${encodeURIComponent(storagePath)}`;
  }

  const fromUrl = url ? resolveApiAssetUrl(url) : '';
  if (fromUrl) {
    return fromUrl;
  }

  const id = typeof mediaId === 'string' ? mediaId.trim() : '';
  if (base && id) {
    return `${base}/api/media/${encodeURIComponent(id)}/file`;
  }

  return '';
}

export function resolveCmsMediaFromRecord(media) {
  const mime = String(media?.mime ?? '').toLowerCase();
  if (mime.startsWith('video/') || cmsFilename(media)) {
    const playback = resolveCmsVideoPlaybackUrls(media);
    if (playback[0]) {
      return playback[0];
    }
  }
  return resolveCmsMediaUrl(media?.url, cmsMediaPublicId(media) || null);
}
