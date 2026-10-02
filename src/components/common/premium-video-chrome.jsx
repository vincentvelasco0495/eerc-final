import { useRef, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Slider, { sliderClasses } from '@mui/material/Slider';

import { Iconify } from 'src/components/iconify';

export function formatVideoClock(totalSeconds) {
  const value = Math.max(0, Math.floor(Number(totalSeconds) || 0));
  const hours = Math.floor(value / 3600);
  const minutes = Math.floor((value % 3600) / 60);
  const seconds = value % 60;
  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

const PILL_BG = 'rgba(232, 235, 240, 0.96)';
const PILL_FG = '#1c1e21';
const PROGRESS_RED = '#e53935';

const pillButtonSx = {
  width: 40,
  height: 40,
  color: PILL_FG,
  bgcolor: PILL_BG,
  '&:hover': { bgcolor: '#fff' },
};

/**
 * Facebook-style playback chrome. Lives in HTML above <video> so it stays visible
 * in wrapper fullscreen. Does not use native `controls` (keeps download locked).
 */
export function PremiumVideoChrome({
  paused,
  muted,
  volume,
  currentTime,
  duration,
  isFullscreen,
  onTogglePlay,
  onSeek,
  onSeekCommitted,
  onToggleMute,
  onVolume,
  onSkipBack,
  onSkipForward,
  onToggleFullscreen,
}) {
  const durationSafe = Number.isFinite(duration) && duration > 0 ? duration : 0;
  const timeSafe = Math.max(0, Number(currentTime) || 0);

  return (
    <Box
      className="premium-video-chrome"
      sx={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 20,
        px: { xs: 1.25, sm: 2 },
        pt: 5,
        pb: { xs: 1.25, sm: 1.75 },
        pointerEvents: 'auto',
        transform: 'translateZ(0)',
        background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.55) 70%)',
      }}
      onClick={(event) => event.stopPropagation()}
      onMouseDown={(event) => event.stopPropagation()}
      onDoubleClick={(event) => event.stopPropagation()}
    >
      <Slider
        min={0}
        max={Math.max(durationSafe, timeSafe, 0.1)}
        step={0.1}
        value={durationSafe > 0 ? Math.min(timeSafe, durationSafe) : 0}
        onChange={onSeek}
        onChangeCommitted={onSeekCommitted}
        valueLabelDisplay="auto"
        valueLabelFormat={formatVideoClock}
        aria-label="Video progress"
        sx={{
          py: 0.75,
          mb: 0.5,
          color: PROGRESS_RED,
          height: 4,
          [`& .${sliderClasses.rail}`]: {
            opacity: 1,
            height: 3,
            borderRadius: 99,
            backgroundColor: 'rgba(255,255,255,0.45)',
          },
          [`& .${sliderClasses.track}`]: {
            height: 3,
            border: 'none',
            borderRadius: 99,
            backgroundColor: PROGRESS_RED,
          },
          [`& .${sliderClasses.thumb}`]: {
            width: 14,
            height: 14,
            color: PROGRESS_RED,
            border: 'none',
            boxShadow: 'none',
            backgroundColor: PROGRESS_RED,
            '&::before': { display: 'none' },
            '&:hover, &.Mui-focusVisible, &.Mui-active': {
              boxShadow: '0 0 0 6px rgba(229,57,53,0.28)',
            },
          },
        }}
      />

      <Stack direction="row" alignItems="center" spacing={1}>
        <IconButton size="small" onClick={onTogglePlay} sx={pillButtonSx} aria-label={paused ? 'Play' : 'Pause'}>
          <Iconify icon={paused ? 'solar:play-bold' : 'solar:pause-bold'} width={18} />
        </IconButton>
        {onSkipBack ? (
          <IconButton size="small" onClick={onSkipBack} sx={pillButtonSx} aria-label="Back 10 seconds">
            <Iconify icon="solar:forward-bold" width={18} sx={{ transform: 'scaleX(-1)' }} />
          </IconButton>
        ) : null}
        {onSkipForward ? (
          <IconButton size="small" onClick={onSkipForward} sx={pillButtonSx} aria-label="Forward 10 seconds">
            <Iconify icon="solar:forward-bold" width={18} />
          </IconButton>
        ) : null}
        <IconButton size="small" onClick={onToggleMute} sx={pillButtonSx} aria-label={muted ? 'Unmute' : 'Mute'}>
          <Iconify icon={muted || volume === 0 ? 'solar:volume-cross-bold' : 'solar:volume-loud-bold'} width={18} />
        </IconButton>
        <Slider
          size="small"
          min={0}
          max={1}
          step={0.05}
          value={muted ? 0 : volume}
          onChange={onVolume}
          aria-label="Volume"
          sx={{
            width: 72,
            color: PILL_FG,
            [`& .${sliderClasses.rail}`]: { opacity: 1, backgroundColor: 'rgba(255,255,255,0.45)' },
            [`& .${sliderClasses.thumb}`]: {
              width: 12,
              height: 12,
              color: '#fff',
              backgroundColor: '#fff',
              '&::before': { display: 'none' },
            },
          }}
        />
        <Box
          sx={{
            px: 1.25,
            py: 0.85,
            borderRadius: 99,
            bgcolor: PILL_BG,
            minWidth: 92,
          }}
        >
          <Typography sx={{ color: PILL_FG, fontWeight: 700, fontSize: 13, lineHeight: 1, whiteSpace: 'nowrap' }}>
            {formatVideoClock(timeSafe)} / {formatVideoClock(durationSafe)}
          </Typography>
        </Box>
        <Box sx={{ flex: 1 }} />
        <IconButton
          size="small"
          onClick={onToggleFullscreen}
          sx={pillButtonSx}
          aria-label={isFullscreen ? 'Exit full screen' : 'Full screen'}
        >
          <Iconify
            icon={
              isFullscreen
                ? 'solar:quit-full-screen-square-outline'
                : 'solar:full-screen-square-outline'
            }
            width={18}
          />
        </IconButton>
      </Stack>
    </Box>
  );
}

export function useHtmlVideoChrome(videoRef, observeKey) {
  const draggingRef = useRef(false);
  const [paused, setPaused] = useState(true);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const node = videoRef.current;
    if (!node) {
      return undefined;
    }

    const pull = () => {
      setPaused(Boolean(node.paused));
      setMuted(Boolean(node.muted));
      setVolume(Number.isFinite(node.volume) ? node.volume : 1);
      const nextDuration = Number(node.duration);
      if (Number.isFinite(nextDuration) && nextDuration > 0) {
        setDuration(nextDuration);
      }
      if (!draggingRef.current) {
        const nextTime = Number(node.currentTime);
        if (Number.isFinite(nextTime)) {
          setCurrentTime(nextTime);
        }
      }
    };

    setDuration(0);
    setCurrentTime(0);
    pull();
    node.addEventListener('play', pull);
    node.addEventListener('pause', pull);
    node.addEventListener('ended', pull);
    node.addEventListener('timeupdate', pull);
    node.addEventListener('volumechange', pull);
    node.addEventListener('loadedmetadata', pull);
    node.addEventListener('loadeddata', pull);
    node.addEventListener('canplay', pull);
    node.addEventListener('seeked', pull);
    node.addEventListener('durationchange', pull);
    return () => {
      node.removeEventListener('play', pull);
      node.removeEventListener('pause', pull);
      node.removeEventListener('ended', pull);
      node.removeEventListener('timeupdate', pull);
      node.removeEventListener('volumechange', pull);
      node.removeEventListener('loadedmetadata', pull);
      node.removeEventListener('loadeddata', pull);
      node.removeEventListener('canplay', pull);
      node.removeEventListener('seeked', pull);
      node.removeEventListener('durationchange', pull);
    };
  }, [observeKey, videoRef]);

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
  }, [videoRef]);

  const seekTo = useCallback(
    (seconds) => {
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
    },
    [videoRef]
  );

  const handleSeek = useCallback(
    (_, value) => {
      draggingRef.current = true;
      seekTo(value);
    },
    [seekTo]
  );

  const handleSeekCommitted = useCallback(() => {
    draggingRef.current = false;
  }, []);

  const skipBy = useCallback(
    (deltaSeconds) => {
      const node = videoRef.current;
      if (!node) {
        return;
      }
      seekTo(Number(node.currentTime) + deltaSeconds);
    },
    [seekTo, videoRef]
  );

  const handleVolume = useCallback(
    (_, value) => {
      const node = videoRef.current;
      const next = Math.max(0, Math.min(1, Number(value)));
      if (node) {
        node.volume = next;
        node.muted = next === 0;
      }
      setVolume(next);
      setMuted(next === 0);
    },
    [videoRef]
  );

  const toggleMute = useCallback(() => {
    const node = videoRef.current;
    if (!node) {
      return;
    }
    const nextMuted = !node.muted;
    node.muted = nextMuted;
    setMuted(nextMuted);
  }, [videoRef]);

  return {
    paused,
    muted,
    volume,
    currentTime,
    duration,
    togglePlay,
    handleSeek,
    handleSeekCommitted,
    skipBy,
    handleVolume,
    toggleMute,
  };
}
