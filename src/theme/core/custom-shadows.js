import { varAlpha } from 'minimal-shared/utils';

import { grey, info, error, common, primary, success, warning, secondary } from './palette';

// ----------------------------------------------------------------------

export function createShadowColor(colorChannel) {
  return `0 8px 16px 0 ${varAlpha(colorChannel, 0.24)}`;
}

function createCustomShadows(colorChannel, intensity = 1) {
  const a = (alpha) => varAlpha(colorChannel, alpha * intensity);

  return {
    z1: `0 1px 2px 0 ${a(0.16)}`,
    z4: `0 4px 8px 0 ${a(0.16)}`,
    z8: `0 8px 16px 0 ${a(0.16)}`,
    z12: `0 12px 24px -4px ${a(0.16)}`,
    z16: `0 16px 32px -4px ${a(0.16)}`,
    z20: `0 20px 40px -4px ${a(0.16)}`,
    z24: `0 24px 48px 0 ${a(0.16)}`,
    /********/
    dialog: `0 25px 80px 0 ${varAlpha(common.blackChannel, 0.5 * intensity)}`,
    card: `0 10px 30px 0 ${a(0.35)}`,
    dropdown: `0 0 2px 0 ${a(0.24)}, -20px 20px 40px -4px ${a(0.24)}`,
    /********/
    primary: createShadowColor(primary.mainChannel),
    secondary: createShadowColor(secondary.mainChannel),
    info: createShadowColor(info.mainChannel),
    success: createShadowColor(success.mainChannel),
    warning: createShadowColor(warning.mainChannel),
    error: createShadowColor(error.mainChannel),
  };
}

/* **********************************************************************
 * 📦 Final
 * **********************************************************************/
/**
 * Elevation is cast in deep navy in both schemes so it matches the brand.
 * The light scheme dials the opacity down — heavy shadows read as dirt on white.
 */
export const customShadows = {
  light: createCustomShadows(grey['900Channel'], 0.5),
  dark: createCustomShadows(grey['900Channel']),
};
