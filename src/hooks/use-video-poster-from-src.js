import { useState, useEffect } from 'react';

/**
 * Paint the first decoded frame of a local blob/file as a poster so the
 * upload preview looks ready immediately, without seeking into the file.
 */
export function useVideoPosterFromSrc(src) {
  const [poster, setPoster] = useState('');

  useEffect(() => {
    const url = typeof src === 'string' ? src.trim() : '';
    if (!url || !(url.startsWith('blob:') || url.startsWith('file:'))) {
      setPoster('');
      return undefined;
    }

    let cancelled = false;
    const video = document.createElement('video');
    video.muted = true;
    video.playsInline = true;
    video.preload = 'metadata';

    const capture = () => {
      if (cancelled || !video.videoWidth || !video.videoHeight) {
        return;
      }
      try {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return;
        }
        ctx.drawImage(video, 0, 0);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.72);
        if (!cancelled && dataUrl.startsWith('data:image')) {
          setPoster(dataUrl);
        }
      } catch {
        if (!cancelled) {
          setPoster('');
        }
      }
    };

    video.addEventListener('loadeddata', capture);
    video.src = url;
    return () => {
      cancelled = true;
      video.removeEventListener('loadeddata', capture);
      video.removeAttribute('src');
    };
  }, [src]);

  return poster;
}
