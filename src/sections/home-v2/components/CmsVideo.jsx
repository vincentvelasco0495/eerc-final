import Box from '@mui/material/Box';

import { resolveCmsMediaFromRecord } from 'src/features/homepage-v2/utils/resolve-cms-media-url';

import { PremiumPlayableVideo } from 'src/components/common/premium-playable-video';

import { ImagePlaceholder } from './ImagePlaceholder';

export function CmsVideo({
  media,
  posterMedia,
  label = 'Video',
  aspectRatio = '16 / 9',
  watermarkText = '',
  sx,
}) {
  const url = resolveCmsMediaFromRecord(media);
  const posterUrl = resolveCmsMediaFromRecord(posterMedia);

  if (url) {
    return (
      <Box
        sx={[
          { width: 1, borderRadius: 3, overflow: 'hidden' },
          ...(Array.isArray(sx) ? sx : [sx]),
        ]}
      >
        <PremiumPlayableVideo
          src={url}
          poster={posterUrl}
          title={media?.alt || label}
          aspectRatio={aspectRatio}
          watermarkText={watermarkText}
        />
      </Box>
    );
  }

  return <ImagePlaceholder label={label} aspectRatio={aspectRatio} sx={sx} />;
}
