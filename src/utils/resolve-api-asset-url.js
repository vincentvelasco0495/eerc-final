import { CONFIG } from 'src/global-config';

function getBaseOrigin() {
  return String(CONFIG.serverUrl ?? '').trim().replace(/\/$/, '');
}

function toPublicStorageProxy(base, storagePath) {
  const normalized = String(storagePath ?? '').trim().replace(/^\/+/, '');
  if (!base || !normalized) return '';
  return `${base}/api/public-storage/file?path=${encodeURIComponent(normalized)}`;
}

export function resolveApiAssetUrl(value) {
  const raw = String(value ?? '').trim();
  if (!raw) return '';
  if (/^(blob:|data:)/i.test(raw)) return raw;

  const base = getBaseOrigin();
  if (!base) return raw;

  if (/^https?:\/\//i.test(raw)) {
    try {
      const parsed = new URL(raw);
      const isLocalHost =
        parsed.hostname === 'localhost' ||
        parsed.hostname === '127.0.0.1' ||
        parsed.hostname === '0.0.0.0';
      if (parsed.pathname.startsWith('/storage/')) {
        return toPublicStorageProxy(base, parsed.pathname.slice('/storage/'.length));
      }
      if (isLocalHost) {
        return `${base}${parsed.pathname}${parsed.search}${parsed.hash}`;
      }
      return raw;
    } catch {
      return raw;
    }
  }

  if (raw.startsWith('/storage/')) {
    return toPublicStorageProxy(base, raw.slice('/storage/'.length));
  }
  if (raw.startsWith('/api/')) {
    return `${base}${raw}`;
  }
  if (raw.startsWith('/')) {
    return `${base}${raw}`;
  }

  return toPublicStorageProxy(base, raw);
}

