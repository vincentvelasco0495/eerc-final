import IconButton from '@mui/material/IconButton';

import { Iconify } from 'src/components/iconify';

export function PlayerFullscreenButton({ isFullscreen, onToggle }) {
  return (
    <IconButton
      type="button"
      size="small"
      onClick={onToggle}
      onMouseDown={(event) => event.stopPropagation()}
      aria-label={isFullscreen ? 'Exit full screen' : 'Full screen'}
      sx={{
        position: 'absolute',
        right: 40,
        bottom: 6,
        zIndex: 4,
        width: 32,
        height: 32,
        color: 'common.white',
        bgcolor: 'transparent',
        '&:hover': { bgcolor: 'rgba(255,255,255,0.12)' },
      }}
    >
      <Iconify
        icon={
          isFullscreen
            ? 'solar:quit-full-screen-square-outline'
            : 'solar:full-screen-square-outline'
        }
        width={20}
      />
    </IconButton>
  );
}
