import { useRef, useState, useEffect, useCallback } from 'react';

export function getFullscreenElement() {
  return (
    document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.msFullscreenElement ||
    null
  );
}

export function requestElementFullscreen(element) {
  if (!element) {
    return Promise.reject(new Error('Missing fullscreen target'));
  }
  if (typeof element.requestFullscreen === 'function') {
    return element.requestFullscreen();
  }
  if (typeof element.webkitRequestFullscreen === 'function') {
    element.webkitRequestFullscreen();
    return Promise.resolve();
  }
  if (typeof element.webkitRequestFullScreen === 'function') {
    element.webkitRequestFullScreen();
    return Promise.resolve();
  }
  return Promise.reject(new Error('Fullscreen API is not available'));
}

export function exitElementFullscreen() {
  if (document.exitFullscreen) {
    return document.exitFullscreen();
  }
  if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
    return Promise.resolve();
  }
  if (document.msExitFullscreen) {
    return document.msExitFullscreen();
  }
  return Promise.resolve();
}

export const htmlVideoNoNativeFullscreenSx = {
  '&::-webkit-media-controls-fullscreen-button': {
    display: 'none !important',
  },
};

export const playerFullscreenBoxSx = {
  isolation: 'isolate',
  '&:fullscreen, &:-webkit-full-screen, &.is-player-fullscreen': {
    width: '100%',
    height: '100%',
    minHeight: '100%',
    aspectRatio: 'auto',
    borderRadius: 0,
    border: 'none',
    maxHeight: 'none',
    bgcolor: 'common.black',
    overflow: 'hidden',
  },
  '&:fullscreen .premium-video-chrome, &:-webkit-full-screen .premium-video-chrome, &.is-player-fullscreen .premium-video-chrome': {
    zIndex: 2147483646,
  },
  '&.is-player-fullscreen': {
    position: 'fixed',
    inset: 0,
    zIndex: 2000,
  },
};

export function usePlayerFullscreen(containerRef) {
  const [isApiFullscreen, setIsApiFullscreen] = useState(false);
  const [isPseudoFullscreen, setIsPseudoFullscreen] = useState(false);
  const pendingTimerRef = useRef(0);
  const isFullscreen = isApiFullscreen || isPseudoFullscreen;

  useEffect(() => {
    const sync = () => {
      setIsApiFullscreen(getFullscreenElement() === containerRef.current);
    };
    document.addEventListener('fullscreenchange', sync);
    document.addEventListener('webkitfullscreenchange', sync);
    sync();
    return () => {
      document.removeEventListener('fullscreenchange', sync);
      document.removeEventListener('webkitfullscreenchange', sync);
    };
  }, [containerRef]);

  useEffect(() => {
    const wrap = containerRef.current;
    if (!wrap) {
      return undefined;
    }
    wrap.classList.toggle('is-player-fullscreen', isPseudoFullscreen);
    return () => {
      wrap.classList.remove('is-player-fullscreen');
    };
  }, [containerRef, isPseudoFullscreen]);

  useEffect(() => {
    if (!isPseudoFullscreen) {
      return undefined;
    }
    const onKey = (event) => {
      if (event.key === 'Escape') {
        setIsPseudoFullscreen(false);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isPseudoFullscreen]);

  useEffect(
    () => () => {
      window.clearTimeout(pendingTimerRef.current);
    },
    []
  );

  const toggle = useCallback(
    (event) => {
      event?.preventDefault?.();
      event?.stopPropagation?.();
      const wrap = containerRef.current;
      if (!wrap) {
        return;
      }

      window.clearTimeout(pendingTimerRef.current);

      if (getFullscreenElement() === wrap) {
        void exitElementFullscreen();
        return;
      }
      if (isPseudoFullscreen) {
        setIsPseudoFullscreen(false);
        return;
      }

      void Promise.resolve(requestElementFullscreen(wrap))
        .then(() => {
          pendingTimerRef.current = window.setTimeout(() => {
            if (getFullscreenElement() !== wrap) {
              setIsPseudoFullscreen(true);
            }
          }, 120);
        })
        .catch(() => {
          setIsPseudoFullscreen(true);
        });
    },
    [containerRef, isPseudoFullscreen]
  );

  return { isFullscreen, toggle };
}
