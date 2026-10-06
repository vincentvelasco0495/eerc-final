import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

import { Iconify } from 'src/components/iconify';

export function PremiumVideoStartOverlay({
  poster,
  showPoster = false,
  buffering = false,
  paused = true,
  onPosterError,
}) {
  return (
    <>
      {showPoster && poster ? (
        <Box
          component="img"
          src={poster}
          alt=""
          onError={onPosterError}
          sx={{
            position: 'absolute',
            inset: 0,
            zIndex: 1,
            width: 1,
            height: 1,
            objectFit: 'contain',
            pointerEvents: 'none',
            bgcolor: 'common.black',
          }}
        />
      ) : null}

      {paused || buffering ? (
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
            {buffering ? (
              <CircularProgress size={28} thickness={5} sx={{ color: 'common.white' }} />
            ) : (
              <Iconify icon="solar:play-bold" width={28} />
            )}
          </Box>
        </Box>
      ) : null}
    </>
  );
}
