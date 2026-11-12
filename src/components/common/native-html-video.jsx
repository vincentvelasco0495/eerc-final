import { useRef, useMemo, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';

import { VideoFrameWatermark } from './video-frame-watermark';

export function NativeHtmlVideo({
  src,
  sources,
  poster,
  title = 'Video',
  aspectRatio = '16 / 9',
  watermarkText = '',
  sx,
}) {
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const playlist = useMemo(() => {
    const list = Array.isArray(sources) ? sources.filter(Boolean) : [];
    if (src) {
      list.unshift(src);
    }
    return [...new Set(list.map((url) => String(url || '').trim()).filter(Boolean))];
  }, [src, sources]);
  const sourceKey = playlist.join('\n');
  const [sourceIndex, setSourceIndex] = useState(0);
  const activeSrc = playlist[Math.min(sourceIndex, Math.max(playlist.length - 1, 0))] || '';

  useEffect(() => {
    setSourceIndex(0);
  }, [sourceKey]);

  const tryNextSource = useCallback(() => {
    setSourceIndex((current) => (current + 1 < playlist.length ? current + 1 : current));
  }, [playlist.length]);

  if (!activeSrc) {
    return null;
  }

  return (
    <Box
      ref={playerRef}
      sx={[
        { position: 'relative', width: 1, bgcolor: 'common.black' },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <Box
        ref={videoRef}
        component="video"
        key={activeSrc}
        src={activeSrc}
        poster={poster || undefined}
        title={title}
        controls
        playsInline
        preload="metadata"
        onClick={(event) => event.stopPropagation()}
        onMouseDown={(event) => event.stopPropagation()}
        onError={tryNextSource}
        sx={{
          display: 'block',
          width: 1,
          aspectRatio,
          objectFit: 'contain',
          bgcolor: 'common.black',
        }}
      />
      {watermarkText ? (
        <VideoFrameWatermark
          videoRef={videoRef}
          containerRef={playerRef}
          username={watermarkText}
          observeKey={activeSrc}
        />
      ) : null}
    </Box>
  );
}
