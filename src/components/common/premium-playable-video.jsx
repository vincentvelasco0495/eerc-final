import { useRef, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';

import {
  usePlayerFullscreen,
  getFullscreenElement,
  exitElementFullscreen,
  playerFullscreenBoxSx,
  htmlVideoNoNativeFullscreenSx,
} from 'src/hooks/use-redirect-video-fullscreen';

import { Iconify } from 'src/components/iconify';
import { VideoFrameWatermark } from 'src/components/common/video-frame-watermark';
import { PremiumVideoChrome, useHtmlVideoChrome } from 'src/components/common/premium-video-chrome';
import {
  premiumVideoSx,
  useBlockContextMenu,
  useLockPremiumVideoElement,
  premiumVideoProtectionProps,
} from 'src/components/common/premium-video-protection';

/**
 * Same playback chrome and download lock as lesson videos, without lesson progress.
 */
export function PremiumPlayableVideo({
  src,
  poster,
  title = 'Video',
  aspectRatio = '16 / 9',
  watermarkText = '',
  dateLabel,
  sx,
}) {
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const clickTimerRef = useRef(0);
  const { isFullscreen, toggle: toggleFullscreen } = usePlayerFullscreen(playerRef);
  useBlockContextMenu(playerRef, src);
  useLockPremiumVideoElement(videoRef, src);
  const chrome = useHtmlVideoChrome(videoRef, src);

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
        chrome.togglePlay();
      }, 250);
    },
    [chrome, toggleFullscreen]
  );

  useEffect(
    () => () => {
      window.clearTimeout(clickTimerRef.current);
    },
    []
  );

  useEffect(() => {
    const wrap = playerRef.current;
    if (!wrap) {
      return undefined;
    }
    const onKeyDown = (event) => {
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        chrome.skipBy(10);
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        chrome.skipBy(-10);
      } else if (event.key === ' ' || event.key === 'k') {
        event.preventDefault();
        chrome.togglePlay();
      }
    };
    wrap.addEventListener('keydown', onKeyDown);
    return () => wrap.removeEventListener('keydown', onKeyDown);
  }, [chrome]);

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
  }, [src]);

  if (!src) {
    return null;
  }

  return (
    <Box
      ref={playerRef}
      tabIndex={0}
      aria-label={title}
      sx={[
        {
          position: 'relative',
          width: 1,
          overflow: 'hidden',
          bgcolor: 'common.black',
          aspectRatio,
          outline: 'none',
          cursor: 'pointer',
          ...playerFullscreenBoxSx,
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      onContextMenu={(event) => event.preventDefault()}
      onClick={handleMediaClick}
    >
      <Box
        ref={videoRef}
        component="video"
        src={src}
        poster={poster || undefined}
        title={title}
        playsInline
        preload="metadata"
        {...premiumVideoProtectionProps}
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

      {watermarkText ? (
        <VideoFrameWatermark
          videoRef={videoRef}
          containerRef={playerRef}
          username={watermarkText}
          dateLabel={dateLabel}
          observeKey={src}
        />
      ) : null}

      {chrome.paused ? (
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            zIndex: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
          }}
        >
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'rgba(0,0,0,0.55)',
              color: 'common.white',
            }}
          >
            <Iconify icon="solar:play-bold" width={28} />
          </Box>
        </Box>
      ) : null}

      <PremiumVideoChrome
        paused={chrome.paused}
        muted={chrome.muted}
        volume={chrome.volume}
        currentTime={chrome.currentTime}
        duration={chrome.duration}
        isFullscreen={isFullscreen}
        onTogglePlay={chrome.togglePlay}
        onSeek={chrome.handleSeek}
        onSeekCommitted={chrome.handleSeekCommitted}
        onToggleMute={chrome.toggleMute}
        onVolume={chrome.handleVolume}
        onSkipBack={() => chrome.skipBy(-10)}
        onSkipForward={() => chrome.skipBy(10)}
        onToggleFullscreen={toggleFullscreen}
      />
    </Box>
  );
}
