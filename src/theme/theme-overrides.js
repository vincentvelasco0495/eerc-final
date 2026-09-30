import { createPaletteChannel } from 'minimal-shared/utils';

import { themeConfig } from './theme-config';

// ----------------------------------------------------------------------

/**
 * Optional last-wins overrides passed to `<ThemeProvider themeOverrides={...}>`.
 * Kept aligned with the EERC gold accent so it never fights `theme-config.js`.
 */
export const themeOverrides = {
  colorSchemes: {
    light: {
      palette: { primary: createPaletteChannel(themeConfig.palette.primary) },
    },
    dark: {
      palette: { primary: createPaletteChannel(themeConfig.palette.primary) },
    },
  },
};
