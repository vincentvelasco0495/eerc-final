import { useEffect } from 'react';

/**
 * After the file is ready, seek slightly (or to a resume point) so a decoded
 * frame paints while paused. That is how the user can tell the video loaded.
 */
export function usePaintVideoPreviewFrame(videoRef, observeKey, resumeSeconds = 0) {
  useEffect(() => {
    const node = videoRef.current;
    if (!node || !observeKey) {
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
      const resume = Math.max(0, Number(resumeSeconds) || 0);
      if (resume > 2 && resume < duration - 2) {
        if (Math.abs(Number(node.currentTime) - resume) > 0.35) {
          node.currentTime = resume;
        }
        return;
      }
      if (Number(node.currentTime) > 0.25) {
        return;
      }
      node.currentTime = duration > 60 ? 5 : duration > 3 ? 1 : Math.min(0.2, duration / 5);
    };

    node.addEventListener('loadedmetadata', paint);
    node.addEventListener('loadeddata', paint);
    node.addEventListener('canplay', paint);
    if (node.readyState >= 1) {
      paint();
    }
    return () => {
      node.removeEventListener('loadedmetadata', paint);
      node.removeEventListener('loadeddata', paint);
      node.removeEventListener('canplay', paint);
    };
  }, [observeKey, resumeSeconds, videoRef]);
}
