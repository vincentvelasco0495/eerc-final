import { varAlpha } from 'minimal-shared/utils';

import { createTheme } from '@mui/material/styles';

import { grey } from './palette';

// ----------------------------------------------------------------------

function updateShadowColor(shadow, colorChannel, intensity = 1) {
  return shadow.replace(/rgba\(\d+,\d+,\d+,(.*?)\)/g, (_, alpha) =>
    varAlpha(colorChannel, parseFloat(alpha) * intensity)
  );
}

function createShadows(colorChannel, intensity = 1) {
  // Get default MUI shadows
  const { shadows: defaultShadows } = createTheme();

  return defaultShadows.map((shadow) =>
    updateShadowColor(shadow, colorChannel, intensity)
  );
}

/* **********************************************************************
 * 📦 Final
 * **********************************************************************/
/**
 * Elevation is cast in deep navy in both schemes so it matches the brand.
 * The light scheme dials the opacity down — heavy shadows read as dirt on white.
 */
export const shadows = {
  light: createShadows(grey['900Channel'], 0.55),
  dark: createShadows(grey['900Channel']),
};
