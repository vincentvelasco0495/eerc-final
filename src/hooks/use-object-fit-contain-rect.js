import { useState, useEffect, useCallback, useLayoutEffect } from 'react';

/**
 * Pixel box of the painted media (object-fit: contain) relative to `containerRef`.
 */
export function useObjectFitContainRect(mediaRef, containerRef, observeKey) {
  const [rect, setRect] = useState({ top: 0, left: 0, width: 0, height: 0 });

  const update = useCallback(() => {
    const media = mediaRef.current;
    const container = containerRef.current;
    if (!media || !container) {
      return;
    }

    const mediaBox = media.getBoundingClientRect();
    const containerBox = container.getBoundingClientRect();
    const elemW = media.clientWidth;
    const elemH = media.clientHeight;
    const intrinsicW = Number(media.videoWidth || media.naturalWidth || 0);
    const intrinsicH = Number(media.videoHeight || media.naturalHeight || 0);

    let containW = elemW;
    let containH = elemH;
    let containLeft = 0;
    let containTop = 0;

    if (intrinsicW > 0 && intrinsicH > 0 && elemW > 0 && elemH > 0) {
      const mediaRatio = intrinsicW / intrinsicH;
      const elemRatio = elemW / elemH;
      if (elemRatio > mediaRatio) {
        containH = elemH;
        containW = elemH * mediaRatio;
        containLeft = (elemW - containW) / 2;
        containTop = 0;
      } else {
        containW = elemW;
        containH = elemW / mediaRatio;
        containLeft = 0;
        containTop = (elemH - containH) / 2;
      }
    }

    setRect({
      top: mediaBox.top - containerBox.top - container.clientTop + containTop,
      left: mediaBox.left - containerBox.left - container.clientLeft + containLeft,
      width: containW,
      height: containH,
    });
  }, [containerRef, mediaRef]);

  useLayoutEffect(() => {
    update();
  }, [observeKey, update]);

  useEffect(() => {
    const media = mediaRef.current;
    const container = containerRef.current;
    if (!media || !container) {
      return undefined;
    }

    update();
    media.addEventListener('loadedmetadata', update);
    media.addEventListener('loadeddata', update);
    media.addEventListener('resize', update);
    const observer = new ResizeObserver(update);
    observer.observe(media);
    observer.observe(container);
    const timeoutIds = [];
    const onFullscreen = () => {
      update();
      requestAnimationFrame(update);
      timeoutIds.push(window.setTimeout(update, 150));
    };
    document.addEventListener('fullscreenchange', onFullscreen);
    document.addEventListener('webkitfullscreenchange', onFullscreen);
    window.addEventListener('resize', update);

    return () => {
      timeoutIds.forEach((id) => window.clearTimeout(id));
      media.removeEventListener('loadedmetadata', update);
      media.removeEventListener('loadeddata', update);
      media.removeEventListener('resize', update);
      observer.disconnect();
      document.removeEventListener('fullscreenchange', onFullscreen);
      document.removeEventListener('webkitfullscreenchange', onFullscreen);
      window.removeEventListener('resize', update);
    };
  }, [observeKey, update, mediaRef, containerRef]);

  return rect;
}
