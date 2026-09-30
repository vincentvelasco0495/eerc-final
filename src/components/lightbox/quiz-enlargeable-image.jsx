import Box from '@mui/material/Box';

import { Iconify } from '../iconify';

const defaultImgSx = {
  display: 'block',
  width: '100%',
  maxHeight: { xs: 280, sm: 420 },
  objectFit: 'contain',
  mx: 'auto',
};

export function QuizEnlargeableImage({ src, alt, onOpen, imgSx, wrapSx }) {
  return (
    <Box
      role="button"
      tabIndex={0}
      title="Click to enlarge"
      aria-label={`${alt}. Click to enlarge`}
      onClick={() => onOpen(src)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onOpen(src);
        }
      }}
      sx={{
        position: 'relative',
        cursor: 'zoom-in',
        borderRadius: 1,
        width: '100%',
        maxWidth: '100%',
        mx: 'auto',
        outlineOffset: 2,
        '&:focus-visible': {
          outline: '2px solid',
          outlineColor: 'brand.accentText',
        },
        ...wrapSx,
      }}
    >
      <Box component="img" src={src} alt={alt} sx={imgSx ?? defaultImgSx} />
      <Box
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          width: 32,
          height: 32,
          display: 'grid',
          placeItems: 'center',
          borderRadius: 1,
          bgcolor: 'rgba(0, 22, 50, 0.55)',
          color: 'common.white',
          pointerEvents: 'none',
        }}
      >
        <Iconify icon="eva:expand-fill" width={18} />
      </Box>
    </Box>
  );
}
