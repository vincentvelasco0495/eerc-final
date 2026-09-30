import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';

import { placeholderStyles } from '../styles/placeholder-styles';

export function ImagePlaceholder({ label = 'Image', sx, aspectRatio = '4 / 3', ...other }) {
  return (
    <Box
      role="img"
      aria-label={label}
      sx={[placeholderStyles.root(aspectRatio), ...(Array.isArray(sx) ? sx : [sx])]}
      {...other}
    >
      <Iconify icon="solar:gallery-bold-duotone" width={40} sx={placeholderStyles.icon} />
      <Typography variant="subtitle2" sx={placeholderStyles.label}>
        {label}
      </Typography>
    </Box>
  );
}
