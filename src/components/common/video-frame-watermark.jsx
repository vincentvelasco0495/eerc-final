import Box from '@mui/material/Box';

import { useObjectFitContainRect } from 'src/hooks/use-object-fit-contain-rect';

import { WatermarkOverlay } from './watermark-overlay';

export function VideoFrameWatermark({
  videoRef,
  containerRef,
  username,
  dateLabel,
  observeKey,
}) {
  const rect = useObjectFitContainRect(videoRef, containerRef, observeKey);

  if (!username || rect.width < 8 || rect.height < 8) {
    return null;
  }

  return (
    <Box
      sx={{
        position: 'absolute',
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 2,
      }}
    >
      <WatermarkOverlay variant="video" username={username} dateLabel={dateLabel} />
    </Box>
  );
}
