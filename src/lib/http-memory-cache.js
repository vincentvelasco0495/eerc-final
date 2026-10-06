const MAX_ENTRIES = 80;
const MAX_PERSISTED = 24;
const MAX_PERSIST_BYTES = 180_000;
const PERSIST_KEY = 'eerc-http-get-cache-v1';
const cache = new Map();

const PUBLIC_GET = [
  /\/api\/homepage-v2(?:\?|$)/i,
  /\/api\/about-us(?:\?|$)/i,
  /\/api\/contact-page(?:\?|$)/i,
  /\/api\/meta(?:\?|$)/i,
  /\/api\/programs(?:\?|$)/i,
  /\/api\/programs\/[^/]+\/stats(?:\?|$)/i,
  /\/api\/courses\/[^/]+\/stats(?:\?|$)/i,
  /\/api\/payment-methods(?:\?|$)/i,
  /\/api\/enrollment-form\/options(?:\?|$)/i,
  /\/api\/health(?:\?|$)/i,
];

function requestUrl(config) {
  const base = String(config?.baseURL ?? '').replace(/\/$/, '');
  const path = String(config?.url ?? '');
  if (/^https?:\/\//i.test(path)) {
    return path;
  }
  const query = config?.params
    ? `?${new URLSearchParams(
        Object.entries(config.params).filter(([, value]) => value !== undefined && value !== null)
      ).toString()}`
    : '';
  const cleanQuery = query === '?' ? '' : query;
  return `${base}${path.startsWith('/') ? path : `/${path}`}${path.includes('?') ? '' : cleanQuery}`;
}

function cacheKey(config) {
  return `${String(config?.method ?? 'get').toLowerCase()} ${requestUrl(config)}`;
}

function isPreviewUrl(url) {
  return /[?&]preview=1(?:&|$)/i.test(url) || /[?&]preview=true(?:&|$)/i.test(url);
}

function isPublicGet(config) {
  const method = String(config?.method ?? 'get').toLowerCase();
  if (method !== 'get') {
    return false;
  }
  if (config?.responseType && config.responseType !== 'json' && config.responseType !== undefined) {
    return false;
  }
  const url = requestUrl(config);
  if (isPreviewUrl(url)) {
    return false;
  }
  if (/[?&]page=/i.test(url)) {
    return false;
  }
  return PUBLIC_GET.some((pattern) => pattern.test(url));
}

function parseMaxAgeMs(headers) {
  const raw = String(headers?.['cache-control'] ?? headers?.['Cache-Control'] ?? '');
  const match = raw.match(/max-age=(\d+)/i);
  if (!match) {
    return 60_000;
  }
  return Math.min(Math.max(Number(match[1]) * 1000, 5_000), 10 * 60_000);
}

function headerMap(headers) {
  if (!headers) {
    return {};
  }
  if (typeof headers.toJSON === 'function') {
    return headers.toJSON();
  }
  return { ...headers };
}

function persist() {
  if (typeof sessionStorage === 'undefined') {
    return;
  }
  try {
    const rows = [];
    for (const [key, hit] of cache.entries()) {
      if (hit.expires <= Date.now()) {
        continue;
      }
      rows.push([key, hit]);
      if (rows.length >= MAX_PERSISTED) {
        break;
      }
    }
    const serialized = JSON.stringify(rows);
    if (serialized.length > MAX_PERSIST_BYTES) {
      sessionStorage.removeItem(PERSIST_KEY);
      return;
    }
    sessionStorage.setItem(PERSIST_KEY, serialized);
  } catch {
    // Quota or private mode.
  }
}

function hydrate() {
  if (typeof sessionStorage === 'undefined') {
    return;
  }
  try {
    const raw = sessionStorage.getItem(PERSIST_KEY);
    if (!raw) {
      return;
    }
    const rows = JSON.parse(raw);
    if (!Array.isArray(rows)) {
      return;
    }
    const now = Date.now();
    rows.forEach((row) => {
      if (!Array.isArray(row) || row.length < 2) {
        return;
      }
      const [key, hit] = row;
      if (typeof key !== 'string' || !hit?.expires || hit.expires <= now) {
        return;
      }
      cache.set(key, hit);
    });
  } catch {
    sessionStorage.removeItem(PERSIST_KEY);
  }
}

hydrate();

function prune() {
  while (cache.size > MAX_ENTRIES) {
    const first = cache.keys().next().value;
    cache.delete(first);
  }
}

function asAxiosResponse(hit, config) {
  return {
    data: hit.data,
    status: hit.status,
    statusText: 'OK',
    headers: hit.headers,
    config,
    request: {},
  };
}

export function readHttpGetCache(config) {
  if (!isPublicGet(config)) {
    return null;
  }
  const key = cacheKey(config);
  const hit = cache.get(key);
  if (!hit) {
    return null;
  }
  if (hit.expires <= Date.now()) {
    return null;
  }
  cache.delete(key);
  cache.set(key, hit);
  return asAxiosResponse(hit, config);
}

export function peekHttpGetEtag(config) {
  if (!isPublicGet(config)) {
    return '';
  }
  const hit = cache.get(cacheKey(config));
  if (!hit) {
    return '';
  }
  return String(hit.headers?.etag ?? hit.headers?.ETag ?? '');
}

export function reviveHttpGetCache(config) {
  if (!isPublicGet(config)) {
    return null;
  }
  const hit = cache.get(cacheKey(config));
  if (!hit) {
    return null;
  }
  const maxAge = Math.max(hit.expires - Date.now(), parseMaxAgeMs(hit.headers));
  const next = { ...hit, expires: Date.now() + Math.min(maxAge, 10 * 60_000) };
  cache.set(cacheKey(config), next);
  persist();
  return asAxiosResponse(next, config);
}

export function writeHttpGetCache(response) {
  const config = response?.config;
  if (!isPublicGet(config) || (response.status !== 200 && response.status !== 304)) {
    return;
  }
  if (response.status === 304) {
    return;
  }
  const key = cacheKey(config);
  cache.set(key, {
    data: response.data,
    status: response.status,
    headers: headerMap(response.headers),
    expires: Date.now() + parseMaxAgeMs(response.headers),
  });
  prune();
  persist();
}

export function clearHttpGetCache() {
  cache.clear();
  if (typeof sessionStorage !== 'undefined') {
    sessionStorage.removeItem(PERSIST_KEY);
  }
}

export function invalidateHttpGetCache(url = '') {
  const needle = String(url);
  if (!needle) {
    cache.clear();
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.removeItem(PERSIST_KEY);
    }
    return;
  }
  for (const key of [...cache.keys()]) {
    if (key.includes(needle)) {
      cache.delete(key);
    }
  }
  persist();
}
