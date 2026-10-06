import { useRef, useMemo, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';

import { useInstantVideoStart } from 'src/hooks/use-instant-video-start';
import { useVideoPosterFromSrc } from 'src/hooks/use-video-poster-from-src';
import { usePaintVideoPreviewFrame } from 'src/hooks/use-paint-video-preview-frame';
import {
  usePlayerFullscreen,
  getFullscreenElement,
  exitElementFullscreen,
  playerFullscreenBoxSx,
  htmlVideoNoNativeFullscreenSx,
} from 'src/hooks/use-redirect-video-fullscreen';

import { VideoFrameWatermark } from 'src/components/common/video-frame-watermark';
import { PremiumVideoStartOverlay } from 'src/components/common/premium-video-start-overlay';
import { formatVideoClock, PremiumVideoChrome } from 'src/components/common/premium-video-chrome';
import {
  premiumVideoSx,
  useBlockContextMenu,
  useLockPremiumVideoElement,
  premiumVideoProtectionProps,
} from 'src/components/common/premium-video-protection';

export function SecureLessonVideo({
  src,
  sources,
  poster,
  title,
  watermarkText,
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
  const [currentTime, setCurrentTime] = useState(() => Math.max(0, Number(initialPositionSeconds) || 0));
  const [duration, setDuration] = useState(0);
  const [paused, setPaused] = useState(true);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [liveWatching, setLiveWatching] = useState(() => Math.max(0, Number(watchingNow) || 0));
  const draggingRef = useRef(false);
  const clickTimerRef = useRef(0);
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
  const blobPoster = useVideoPosterFromSrc(activeSrc);
  const resolvedPoster = poster || blobPoster;
  const { showPoster, buffering, hidePoster, handlePlaying, handleWaiting } = useInstantVideoStart(
    resolvedPoster,
    sourceKey,
    videoRef
  );

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
    if (!Number.isFinite(current)) {
      return;
    }
    if (!draggingRef.current) {
      setCurrentTime(current);
    }
    if (!Number.isFinite(mediaDuration) || mediaDuration <= 0) {
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

  const syncDuration = useCallback(() => {
    const node = videoRef.current;
    if (!node) {
      return;
    }
    const nextDuration = Number(node.duration);
    if (Number.isFinite(nextDuration) && nextDuration > 0) {
      setDuration(nextDuration);
    }
  }, []);

  const handleLoadedMetadata = useCallback(() => {
    const node = videoRef.current;
    if (!node) {
      return;
    }
    syncDuration();
    if (!seekedRef.current) {
      const resumeAt = Math.max(0, Number(initialPositionSeconds) || 0);
      if (resumeAt > 2 && Number.isFinite(node.duration) && resumeAt < node.duration - 2) {
        node.currentTime = resumeAt;
        setCurrentTime(resumeAt);
        setPosition(Math.floor(resumeAt));
      }
      seekedRef.current = true;
    }
  }, [initialPositionSeconds, syncDuration]);

  const togglePlay = useCallback(() => {
    const node = videoRef.current;
    if (!node) {
      return;
    }
    if (node.paused) {
      void node.play();
      return;
    }
    node.pause();
  }, []);

  const seekTo = useCallback((seconds) => {
    const node = videoRef.current;
    const next = Number(seconds);
    if (!node || !Number.isFinite(next)) {
      return;
    }
    const mediaDuration = Number(node.duration);
    const max = Number.isFinite(mediaDuration) && mediaDuration > 0 ? mediaDuration : next;
    const clamped = Math.min(Math.max(0, next), max);
    node.currentTime = clamped;
    setCurrentTime(clamped);
    setPosition(Math.floor(clamped));
  }, []);

  const handleSeek = useCallback(
    (_, value) => {
      draggingRef.current = true;
      seekTo(value);
    },
    [seekTo]
  );

  const handleSeekCommitted = useCallback(() => {
    draggingRef.current = false;
    handleTimeUpdate();
  }, [handleTimeUpdate]);

  const skipBy = useCallback(
    (deltaSeconds) => {
      const node = videoRef.current;
      if (!node) {
        return;
      }
      seekTo(Number(node.currentTime) + deltaSeconds);
    },
    [seekTo]
  );

  const handleVolume = useCallback((_, value) => {
    const node = videoRef.current;
    const next = Math.max(0, Math.min(1, Number(value)));
    if (node) {
      node.volume = next;
      node.muted = next === 0;
    }
    setVolume(next);
    setMuted(next === 0);
  }, []);

  const toggleMute = useCallback(() => {
    const node = videoRef.current;
    if (!node) {
      return;
    }
    const nextMuted = !node.muted;
    node.muted = nextMuted;
    setMuted(nextMuted);
  }, []);

  useEffect(() => {
    seekedRef.current = false;
  }, [activeSrc]);

  const { isFullscreen, toggle: toggleFullscreen } = usePlayerFullscreen(playerRef);
  useBlockContextMenu(playerRef, activeSrc);
  useLockPremiumVideoElement(videoRef, activeSrc);
  usePaintVideoPreviewFrame(videoRef, activeSrc, initialPositionSeconds);

  const handleMediaClick = useCallback(
    (event) => {
      if (clickTimerRef.current) {
        window.clearTimeout(clickTimerRef.current);
        clickTimerRef.current = 0;
        toggleFullscreen(event);
        return;
      }
      clickTimerRef.current = window.setTimeout(() => {
        clickTimerRef.current = 0;
        togglePlay();
      }, 250);
    },
    [toggleFullscreen, togglePlay]
  );

  useEffect(
    () => () => {
      window.clearTimeout(clickTimerRef.current);
    },
    []
  );

  useEffect(() => {
    const video = videoRef.current;
    if (!video) {
      return undefined;
    }
    const abortNativeVideoFullscreen = () => {
      if (typeof video.webkitExitFullscreen === 'function' && video.webkitDisplayingFullscreen) {
        video.webkitExitFullscreen();
      }
      if (getFullscreenElement() === video) {
        void exitElementFullscreen();
      }
    };
    video.addEventListener('webkitbeginfullscreen', abortNativeVideoFullscreen);
    document.addEventListener('fullscreenchange', abortNativeVideoFullscreen);
    document.addEventListener('webkitfullscreenchange', abortNativeVideoFullscreen);
    return () => {
      video.removeEventListener('webkitbeginfullscreen', abortNativeVideoFullscreen);
      document.removeEventListener('fullscreenchange', abortNativeVideoFullscreen);
      document.removeEventListener('webkitfullscreenchange', abortNativeVideoFullscreen);
    };
  }, [activeSrc]);

  useEffect(() => {
    const wrap = playerRef.current;
    if (!wrap) {
      return undefined;
    }
    const onKeyDown = (event) => {
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        skipBy(10);
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        skipBy(-10);
      } else if (event.key === ' ' || event.key === 'k') {
        event.preventDefault();
        togglePlay();
      }
    };
    wrap.addEventListener('keydown', onKeyDown);
    return () => wrap.removeEventListener('keydown', onKeyDown);
  }, [skipBy, togglePlay]);

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

  return (
    <Stack spacing={1.25} sx={{ mb: 3 }}>
      <Box
        ref={playerRef}
        tabIndex={0}
        sx={{
          position: 'relative',
          width: 1,
          borderRadius: 1.5,
          overflow: 'hidden',
          bgcolor: 'common.black',
          border: '1px solid',
          borderColor: 'divider',
          aspectRatio: '16 / 9',
          outline: 'none',
          cursor: 'pointer',
          ...playerFullscreenBoxSx,
        }}
        onContextMenu={(event) => event.preventDefault()}
        onClick={handleMediaClick}
      >
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            zIndex: 0,
            overflow: 'hidden',
            isolation: 'isolate',
          }}
        >
          <Box
            ref={videoRef}
            component="video"
            src={activeSrc}
            poster={resolvedPoster || undefined}
            title={title}
            playsInline
            preload="metadata"
            {...premiumVideoProtectionProps}
            onError={tryNextSource}
            onWaiting={handleWaiting}
            onPlaying={() => {
              setPaused(false);
              handlePlaying();
            }}
            onPlay={() => setPaused(false)}
            onPause={() => {
              setPaused(true);
              handleTimeUpdate();
            }}
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleEnded}
            onLoadedMetadata={handleLoadedMetadata}
            onLoadedData={syncDuration}
            onCanPlay={resolvedPoster ? undefined : hidePoster}
            onSeeked={handleTimeUpdate}
            onDurationChange={syncDuration}
            sx={{
              position: 'absolute',
              inset: 0,
              width: 1,
              height: 1,
              objectFit: 'contain',
              bgcolor: 'common.black',
              pointerEvents: 'none',
              ...htmlVideoNoNativeFullscreenSx,
              ...premiumVideoSx,
            }}
          />
        </Box>
        {watermarkText ? (
          <VideoFrameWatermark
            videoRef={videoRef}
            containerRef={playerRef}
            username={watermarkText}
            dateLabel={dateLabel}
            observeKey={activeSrc}
          />
        ) : null}
        <PremiumVideoStartOverlay
          poster={resolvedPoster}
          showPoster={showPoster}
          buffering={buffering}
          paused={paused}
          onPosterError={hidePoster}
        />
        <PremiumVideoChrome
          paused={paused}
          muted={muted}
          volume={volume}
          currentTime={currentTime}
          duration={duration}
          isFullscreen={isFullscreen}
          onTogglePlay={togglePlay}
          onSeek={handleSeek}
          onSeekCommitted={handleSeekCommitted}
          onToggleMute={toggleMute}
          onVolume={handleVolume}
          onSkipBack={() => skipBy(-10)}
          onSkipForward={() => skipBy(10)}
          onToggleFullscreen={toggleFullscreen}
        />
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
            <Chip
              size="small"
              variant="soft"
              color="primary"
              label={`${liveWatching} watching now`}
            />
          </Stack>
        </Stack>
        <LinearProgress
          variant="determinate"
          value={percent}
          sx={{ height: 8, borderRadius: 99 }}
        />
      </Stack>
    </Stack>
  );
}
