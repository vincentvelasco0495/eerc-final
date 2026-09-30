import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';

import { resolveCmsMediaFromRecord } from 'src/features/homepage-v2/utils/resolve-cms-media-url';

import { ImagePlaceholder } from './ImagePlaceholder';

export function CmsImage({
  media,
  label = 'Image',
  aspectRatio = '4 / 3',
  sx,
  imgSx,
  fill = false,
  onLoad,
  imgRef,
}) {
  const url = resolveCmsMediaFromRecord(media);
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setFailed(false);
    setLoaded(false);
  }, [url]);

  const showImage = Boolean(url) && !failed;
  const showSkeleton = showImage && !loaded;
  const showPlaceholder = !url || failed;

  const fillSx = {
    position: 'absolute',
    inset: 0,
    width: 1,
    height: 1,
  };

  return (
    <Box
      sx={[
        fill
          ? fillSx
          : {
              position: 'relative',
              width: 1,
              aspectRatio,
              overflow: 'hidden',
              borderRadius: 3,
            },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {showSkeleton ? (
        <Skeleton
          variant="rounded"
          animation="wave"
          sx={{
            ...fillSx,
            borderRadius: fill ? 0 : 3,
            transform: 'none',
          }}
        />
      ) : null}

      {showImage ? (
        <Box
          ref={imgRef}
          component="img"
          src={url}
          alt={media?.alt || label}
          onLoad={(event) => {
            setLoaded(true);
            onLoad?.(event);
          }}
          onError={() => setFailed(true)}
          sx={[
            {
              ...(fill ? fillSx : { width: 1, height: 1, aspectRatio }),
              objectFit: 'cover',
              display: 'block',
              opacity: loaded ? 1 : 0,
            },
            ...(Array.isArray(imgSx) ? imgSx : [imgSx]),
          ]}
        />
      ) : null}

      {showPlaceholder ? (
        <ImagePlaceholder
          label={label}
          aspectRatio={aspectRatio}
          sx={
            fill
              ? {
                  ...fillSx,
                  aspectRatio: 'unset',
                  borderRadius: 0,
                }
              : undefined
          }
        />
      ) : null}
    </Box>
  );
}
