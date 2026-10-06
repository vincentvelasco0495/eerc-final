import { useEffect } from 'react';

/**
 * Restore a saved watch position after metadata is ready.
 * Does not seek just to "preview" a later frame — that forces a large
 * download on progressive MP4s and can stall the player for minutes.
 */
export function usePaintVideoPreviewFrame(videoRef, observeKey, resumeSeconds = 0) {
  useEffect(() => {
    const node = videoRef.current;
    const resume = Math.max(0, Number(resumeSeconds) || 0);
    if (!node || !observeKey || resume <= 2) {
      return undefined;
    }

    const paint = () => {
      if (!node.paused) {
        return;
      }
      const duration = Number(node.duration);
      if (!Number.isFinite(duration) || duration <= 0) {
        return;
      }
      if (resume >= duration - 2) {
        return;
      }
      if (Math.abs(Number(node.currentTime) - resume) > 0.35) {
        node.currentTime = resume;
      }
    };

    node.addEventListener('loadedmetadata', paint);
    node.addEventListener('loadeddata', paint);
    if (node.readyState >= 1) {
      paint();
    }
    return () => {
      node.removeEventListener('loadedmetadata', paint);
      node.removeEventListener('loadeddata', paint);
    };
  }, [observeKey, resumeSeconds, videoRef]);
}
