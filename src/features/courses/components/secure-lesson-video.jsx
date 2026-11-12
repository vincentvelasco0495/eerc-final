import { useRef, useMemo, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';

import { formatVideoClock } from 'src/components/common/premium-video-chrome';
import { VideoFrameWatermark } from 'src/components/common/video-frame-watermark';

export function SecureLessonVideo({
  src,
  sources,
  poster,
  title,
  watermarkText,
  watermarkColor,
  watermarkOpacity,
  dateLabel,
  initialPercent = 0,
  initialPositionSeconds = 0,
  watchingNow = 0,
  onProgress,
}) {
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const lastFlushRef = useRef(0);
  const completedRef = useRef(Number(initialPercent) >= 90);
  const seekedRef = useRef(false);
  const [percent, setPercent] = useState(() => Math.max(0, Math.min(100, Number(initialPercent) || 0)));
  const [position, setPosition] = useState(() => Math.max(0, Number(initialPositionSeconds) || 0));
  const [liveWatching, setLiveWatching] = useState(() => Math.max(0, Number(watchingNow) || 0));
  const playbackSources = useMemo(() => {
    const list = Array.isArray(sources) ? sources.filter(Boolean) : [];
    if (src) {
      list.unshift(src);
    }
    return [...new Set(list)];
  }, [src, sources]);
  const [sourceIndex, setSourceIndex] = useState(0);
  const activeSrc =
    playbackSources[Math.min(sourceIndex, Math.max(playbackSources.length - 1, 0))] || '';
  const sourceKey = playbackSources.join('\n');

  useEffect(() => {
    setSourceIndex(0);
  }, [sourceKey]);

  const tryNextSource = useCallback(() => {
    setSourceIndex((current) => (current + 1 < playbackSources.length ? current + 1 : current));
  }, [playbackSources.length]);

  useEffect(() => {
    setLiveWatching(Math.max(0, Number(watchingNow) || 0));
  }, [watchingNow]);

  const flush = useCallback(
    async (next, { force = false } = {}) => {
      const now = Date.now();
      if (!force && now - lastFlushRef.current < 8000) {
        return;
      }
      lastFlushRef.current = now;
      if (!onProgress) {
        return;
      }
      try {
        const result = await onProgress(next);
        if (result && Number.isFinite(Number(result.watchingNow))) {
          setLiveWatching(Number(result.watchingNow));
        }
      } catch {
        /* keep playback uninterrupted */
      }
    },
    [onProgress]
  );

  const handleTimeUpdate = useCallback(() => {
    const node = videoRef.current;
    if (!node) {
      return;
    }
    const mediaDuration = Number(node.duration);
    const current = Number(node.currentTime);
    if (!Number.isFinite(current) || !Number.isFinite(mediaDuration) || mediaDuration <= 0) {
      return;
    }
    const nextPercent = Math.min(100, Math.round((current / mediaDuration) * 100));
    const nextPosition = Math.floor(current);
    setPercent(nextPercent);
    setPosition(nextPosition);
    const completed = nextPercent >= 90 || node.ended;
    if (completed) {
      completedRef.current = true;
    }
    void flush(
      {
        progressPercent: nextPercent,
        lastPositionSeconds: nextPosition,
        completed: completedRef.current,
      },
      { force: completed && nextPercent >= 90 }
    );
  }, [flush]);

  const handleEnded = useCallback(() => {
    completedRef.current = true;
    setPercent(100);
    void flush(
      {
        progressPercent: 100,
        lastPositionSeconds: Math.floor(Number(videoRef.current?.duration) || position),
        completed: true,
      },
      { force: true }
    );
  }, [flush, position]);

  const handleLoadedMetadata = useCallback(() => {
    const node = videoRef.current;
    if (!node || seekedRef.current) {
      return;
    }
    const resumeAt = Math.max(0, Number(initialPositionSeconds) || 0);
    if (resumeAt > 2 && Number.isFinite(node.duration) && resumeAt < node.duration - 2) {
      node.currentTime = resumeAt;
      setPosition(Math.floor(resumeAt));
    }
    seekedRef.current = true;
  }, [initialPositionSeconds]);

  useEffect(() => {
    seekedRef.current = false;
  }, [activeSrc]);

  const percentRef = useRef(percent);
  const positionRef = useRef(position);
  percentRef.current = percent;
  positionRef.current = position;

  useEffect(
    () => () => {
      void flush(
        {
          progressPercent: percentRef.current,
          lastPositionSeconds: positionRef.current,
          completed: completedRef.current,
          presence: true,
        },
        { force: true }
      );
    },
    [flush]
  );

  if (!activeSrc) {
    return null;
  }

  return (
    <Stack spacing={1.25} sx={{ mb: 3 }}>
      <Box
        ref={playerRef}
        sx={{
          position: 'relative',
          width: 1,
          borderRadius: 1.5,
          overflow: 'hidden',
          bgcolor: 'common.black',
          border: '1px solid',
          borderColor: 'divider',
        }}
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
          onError={tryNextSource}
          onPause={handleTimeUpdate}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleEnded}
          onLoadedMetadata={handleLoadedMetadata}
          onSeeked={handleTimeUpdate}
          sx={{
            display: 'block',
            width: 1,
            aspectRatio: '16 / 9',
            objectFit: 'contain',
            bgcolor: 'common.black',
          }}
        />
        {watermarkText ? (
          <VideoFrameWatermark
            videoRef={videoRef}
            containerRef={playerRef}
            username={watermarkText}
            dateLabel={dateLabel}
            color={watermarkColor}
            opacity={watermarkOpacity}
            observeKey={activeSrc}
          />
        ) : null}
      </Box>

      <Stack spacing={0.75}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={1}>
          <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
            Progression {percent}%
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {position > 0 ? (
              <Chip size="small" variant="soft" color="default" label={`Resume ${formatVideoClock(position)}`} />
            ) : null}
            <Chip size="small" variant="soft" color="primary" label={`${liveWatching} watching now`} />
          </Stack>
        </Stack>
        <LinearProgress variant="determinate" value={percent} sx={{ height: 8, borderRadius: 99 }} />
      </Stack>
    </Stack>
  );
}
