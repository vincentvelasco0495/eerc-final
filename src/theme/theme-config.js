// ----------------------------------------------------------------------

/**
 * EERC brand theme configuration.
 *
 * Visual identity: deep navy foundation + bright gold accent.
 * This file is the SINGLE SOURCE OF TRUTH for raw brand colors.
 * Consume them through the MUI theme palette or `src/theme/brand-tokens.js`.
 */
export const themeConfig = {
  /** **************************************
   * Base
   *************************************** */
  defaultMode: 'light',
  modeStorageKey: 'theme-mode',
  direction: 'ltr',
  classesPrefix: 'minimal',
  /** **************************************
   * Css variables
   *************************************** */
  cssVariables: {
    cssVarPrefix: '',
    colorSchemeSelector: 'data-color-scheme',
  },
  /** **************************************
   * Typography
   *************************************** */
  fontFamily: {
    primary: 'Public Sans Variable',
    secondary: 'Barlow',
  },
  /** **************************************
   * Palette
   *************************************** */
  palette: {
    /**
     * Gold / yellow accent — used for primary CTAs, active states,
     * key metrics, highlights and links. Kept as an ACCENT, not a surface.
     */
    primary: {
      lighter: '#FFF3B8',
      light: '#FFE45C',
      main: '#FFD400',
      dark: '#E5A900',
      /** Deep gold — the only gold legible as TEXT on a light surface (5.3:1 on white). */
      darker: '#8A6500',
      contrastText: '#001632',
    },
    /**
     * Navy blue — used for secondary actions and elevated blue surfaces.
     */
    secondary: {
      lighter: '#CFE0F5',
      /**
       * Must stay genuinely lighter than `main`: the ramp is consumed as
       * soft-chip text and chart series on navy, where a dark blue disappears.
       */
      light: '#7FA9DB',
      main: '#063B73',
      dark: '#002B5C',
      darker: '#00224D',
      contrastText: '#FFFFFF',
    },
    info: {
      lighter: '#D6F1FE',
      light: '#7DD8FB',
      main: '#38BDF8',
      dark: '#0C6E9E',
      darker: '#053D5C',
      contrastText: '#001632',
    },
    success: {
      lighter: '#D5F8E3',
      light: '#71E3A1',
      main: '#22C55E',
      dark: '#12864A',
      darker: '#085236',
      contrastText: '#001632',
    },
    warning: {
      lighter: '#FFF3CD',
      light: '#FFD95C',
      main: '#FFC107',
      dark: '#B07C00',
      darker: '#6E4A00',
      contrastText: '#001632',
    },
    error: {
      lighter: '#FDE0E0',
      light: '#F89A9A',
      main: '#EF4444',
      dark: '#A81E1E',
      darker: '#6B0F14',
      contrastText: '#FFFFFF',
    },
    /**
     * Navy-tinted neutral scale.
     * 800 = card surface, 900 = page background (see `core/palette.js`).
     */
    grey: {
      50: '#F5F7FA',
      100: '#EDF1F7',
      200: '#DCE3ED',
      300: '#C7D2E0',
      400: '#A8B8CC',
      500: '#8FA3BA',
      600: '#5E7B9C',
      700: '#0B4F8A',
      800: '#06244A',
      900: '#001632',
    },
    common: {
      black: '#000000',
      white: '#FFFFFF',
    },
  },
};
