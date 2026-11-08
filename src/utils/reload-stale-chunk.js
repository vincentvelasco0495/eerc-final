const RELOAD_KEY = 'eerc-chunk-reload';
const RELOAD_PARAM = 'eerc_reload';

const STALE_CHUNK_MESSAGE =
  /Failed to fetch dynamically imported module|Importing a module script failed|error loading dynamically imported module|Unable to preload CSS/i;

export function isStaleChunkError(error) {
  const message = error instanceof Error ? error.message : String(error ?? '');
  return STALE_CHUNK_MESSAGE.test(message);
}

/** Reload once so an open tab picks up the files from the latest publish. */
export function reloadOnceForStaleChunk() {
  try {
    if (sessionStorage.getItem(RELOAD_KEY) === '1') {
      return false;
    }
    sessionStorage.setItem(RELOAD_KEY, '1');
  } catch {
    return false;
  }

  const next = new URL(window.location.href);
  next.searchParams.set(RELOAD_PARAM, String(Date.now()));
  window.location.replace(next.toString());
  return true;
}

export function installStaleChunkRecovery() {
  window.addEventListener('vite:preloadError', (event) => {
    event.preventDefault();
    reloadOnceForStaleChunk();
  });

  window.addEventListener('unhandledrejection', (event) => {
    if (!isStaleChunkError(event.reason)) {
      return;
    }
    event.preventDefault();
    reloadOnceForStaleChunk();
  });

  const current = new URL(window.location.href);
  if (current.searchParams.has(RELOAD_PARAM)) {
    current.searchParams.delete(RELOAD_PARAM);
    const cleaned = `${current.pathname}${current.search}${current.hash}`;
    window.history.replaceState(window.history.state, '', cleaned);
  }

  window.setTimeout(() => {
    try {
      sessionStorage.removeItem(RELOAD_KEY);
    } catch {
      /* sessionStorage can be unavailable in private mode */
    }
  }, 8000);
}
