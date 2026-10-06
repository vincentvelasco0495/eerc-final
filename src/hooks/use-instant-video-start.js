import { useState, useEffect, useCallback } from 'react';

/**
 * YouTube-style start: keep the poster visible, stream on play, and only
 * show a spinner after the student actually presses play.
 */
export function useInstantVideoStart(poster, sourceKey, videoRef) {
  const [showPoster, setShowPoster] = useState(() => Boolean(poster));
  const [buffering, setBuffering] = useState(false);

  useEffect(() => {
    setShowPoster(Boolean(poster));
    setBuffering(false);
  }, [poster, sourceKey]);

  const hidePoster = useCallback(() => {
    setShowPoster(false);
  }, []);

  const handlePlaying = useCallback(() => {
    setBuffering(false);
    hidePoster();
  }, [hidePoster]);

  const handleWaiting = useCallback(() => {
    const node = videoRef?.current;
    if (node && !node.paused) {
      setBuffering(true);
    }
  }, [videoRef]);

  return {
    showPoster,
    buffering,
    hidePoster,
    handlePlaying,
    handleWaiting,
  };
}
