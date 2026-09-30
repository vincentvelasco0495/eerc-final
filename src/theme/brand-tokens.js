import { themeConfig } from './theme-config';

// ----------------------------------------------------------------------

/**
 * EERC semantic design tokens.
 *
 * Raw brand colors live in `theme-config.js`. This module turns them into
 * SEMANTIC tokens for BOTH color schemes, so components never hardcode a hex
 * value or branch on the active mode.
 *
 * How to consume, in order of preference:
 *
 * 1. Inside MUI `sx` / `styled`: `theme.vars.palette.brand.surface`
 *    → resolves per scheme automatically.
 * 2. Inside plain `styles.js` modules that need a literal string: `brandVars.surface`
 *    → emits `var(--palette-brand-surface)`, which also resolves per scheme.
 * 3. Only use `brandTokens` (raw dark hex values) where a real color value is
 *    required, e.g. inside `alpha()`/`varAlpha()` math or canvas/SVG attributes.
 */

const { primary, secondary, grey, common, success, warning, error, info } = themeConfig.palette;

/** Raw navy/gold ramp — scheme-independent brand colors. */
export const brandPalette = {
  deepNavy: '#001632',
  primaryNavy: '#00224D',
  darkBlue: '#002B5C',
  mediumBlue: '#063B73',
  brightBlue: '#0B4F8A',
  /********/
  gold: '#FFD400',
  goldLight: '#FFE45C',
  goldLighter: '#FFF3B8',
  goldDark: '#E5A900',
  /** Light-scheme accent text: 5.3:1 on white, where bright gold is only 1.4:1. */
  goldDeep: '#8A6500',
  /********/
  white: common.white,
  offWhite: '#F5F7FA',
  paleBlue: '#EDF1F7',
  /********/
  cardBg: '#06244A',
  cardBgDark: '#041D3A',
  inputBg: '#061F3D',
  hoverBg: '#0A315E',
};

/** `rgb` channels for building translucent colors without extra deps. */
export const brandChannels = {
  gold: '255 212 0',
  white: '255 255 255',
  navy: '0 22 50',
  black: '0 0 0',
};

/**
 * Builds `rgb(r g b / alpha)` from a channel string.
 * @param {string} channel - e.g. '255 212 0'
 * @param {number} alpha - 0..1
 */
export function alphaChannel(channel, alpha) {
  return `rgb(${channel} / ${alpha})`;
}

/** Translucent gold — accent borders, glows, hover washes. */
export const goldAlpha = (alpha) => alphaChannel(brandChannels.gold, alpha);
/** Translucent white — subtle borders and dividers on navy. */
export const whiteAlpha = (alpha) => alphaChannel(brandChannels.white, alpha);
/** Translucent navy — shadows, scrims and light-scheme borders. */
export const navyAlpha = (alpha) => alphaChannel(brandChannels.navy, alpha);

/* **********************************************************************
 * 🌙 Dark scheme — deep navy platform
 * **********************************************************************/
const darkBrand = {
  page: brandPalette.deepNavy,
  section: brandPalette.primaryNavy,
  surface: brandPalette.cardBg,
  elevated: brandPalette.darkBlue,
  sunken: brandPalette.cardBgDark,
  input: brandPalette.inputBg,
  overlay: 'rgb(0 10 25 / 0.75)',
  /** Interactive */
  hover: brandPalette.hoverBg,
  hoverWash: goldAlpha(0.06),
  accentSoft: goldAlpha(0.1),
  /** Borders */
  borderDefault: goldAlpha(0.25),
  borderStrong: goldAlpha(0.55),
  borderSubtle: whiteAlpha(0.1),
  /** Text */
  textMuted: grey[500],
  /**
   * Accent text/icon color. Full gold is legible on navy.
   * Use for links, key metrics, active labels and table headers.
   */
  accentText: primary.main,
  /** Neutral (secondary action) fill — navy, so gold stays reserved for CTAs. */
  neutralFill: brandPalette.darkBlue,
  neutralFillHover: brandPalette.hoverBg,
  onNeutralFill: common.white,
  /** Loading */
  skeleton: whiteAlpha(0.08),
  skeletonHighlight: whiteAlpha(0.14),
  /** Selective gradients — do not overuse. */
  gradientSurface: `linear-gradient(145deg, ${brandPalette.cardBg}, ${brandPalette.cardBgDark})`,
  gradientPage: `linear-gradient(135deg, ${brandPalette.deepNavy} 0%, ${brandPalette.primaryNavy} 50%, #001A38 100%)`,
};

/* **********************************************************************
 * ☀️ Light scheme — off-white surfaces, same navy/gold identity
 * **********************************************************************/
const lightBrand = {
  page: brandPalette.offWhite,
  section: common.white,
  surface: common.white,
  elevated: common.white,
  sunken: brandPalette.paleBlue,
  input: common.white,
  overlay: navyAlpha(0.45),
  /** Interactive */
  hover: brandPalette.paleBlue,
  hoverWash: goldAlpha(0.12),
  accentSoft: goldAlpha(0.2),
  /** Borders — gold needs more opacity to register against white. */
  borderDefault: goldAlpha(0.5),
  borderStrong: goldAlpha(0.85),
  borderSubtle: navyAlpha(0.12),
  /** Text */
  textMuted: '#5E7B9C',
  /**
   * Accent text/icon color. Bright gold on white is only ~1.4:1, so the light
   * scheme uses deep gold (~5.3:1). Gold FILLS still use navy text and are fine.
   */
  accentText: brandPalette.goldDeep,
  /** Neutral (secondary action) fill — navy, mirroring the dark scheme. */
  neutralFill: brandPalette.primaryNavy,
  neutralFillHover: brandPalette.darkBlue,
  onNeutralFill: common.white,
  /** Loading */
  skeleton: navyAlpha(0.08),
  skeletonHighlight: navyAlpha(0.04),
  /** Selective gradients — do not overuse. */
  gradientSurface: `linear-gradient(145deg, ${common.white}, #F7F9FC)`,
  gradientPage: `linear-gradient(135deg, ${brandPalette.offWhite} 0%, ${common.white} 50%, ${brandPalette.paleBlue} 100%)`,
};

/* **********************************************************************
 * 📦 Semantic tokens
 * **********************************************************************/
function buildTokens(brand, text) {
  return {
    background: {
      page: brand.page,
      section: brand.section,
      surface: brand.surface,
      elevated: brand.elevated,
      sunken: brand.sunken,
      input: brand.input,
      overlay: brand.overlay,
    },
    primary: {
      main: primary.main,
      dark: primary.dark,
      light: primary.light,
      contrast: primary.contrastText,
    },
    accent: {
      main: primary.main,
      dark: primary.dark,
      light: primary.light,
      text: brand.accentText,
      soft: brand.accentSoft,
    },
    navy: { main: secondary.main, dark: secondary.dark, light: secondary.light },
    text,
    border: {
      default: brand.borderDefault,
      strong: brand.borderStrong,
      subtle: brand.borderSubtle,
    },
    status: {
      success: success.main,
      warning: warning.main,
      error: error.main,
      info: info.main,
    },
    interactive: {
      hover: brand.hover,
      hoverWash: brand.hoverWash,
      active: brand.accentSoft,
      focus: goldAlpha(0.12),
      disabled: grey[600],
    },
    gradient: {
      page: brand.gradientPage,
      surface: brand.gradientSurface,
      accent: `linear-gradient(135deg, ${brandPalette.gold} 0%, ${brandPalette.goldDark} 100%)`,
    },
    radius: { sm: 8, md: 12, lg: 16 },
    /** Chart series — navy/gold identity, no rainbow palettes. */
    chart: {
      series: [primary.main, info.main, success.main, secondary.light, warning.main, error.main],
    },
  };
}

/** Scheme-specific `brand` palette namespace (merged into the MUI palette). */
export const brandScheme = { light: lightBrand, dark: darkBrand };

/** Text ramps per scheme. */
export const brandText = {
  dark: {
    primary: common.white,
    secondary: grey[300],
    muted: grey[500],
    disabled: grey[600],
    inverse: brandPalette.deepNavy,
    accent: darkBrand.accentText,
  },
  light: {
    primary: brandPalette.deepNavy,
    secondary: '#3E5871',
    muted: lightBrand.textMuted,
    disabled: '#8FA3BA',
    inverse: common.white,
    accent: lightBrand.accentText,
  },
};

export const brandTokensDark = {
  ...buildTokens(darkBrand, brandText.dark),
  shadow: {
    card: `0 10px 30px ${navyAlpha(0.35)}`,
    cardHover: `0 12px 35px ${navyAlpha(0.45)}`,
    dialog: `0 25px 80px rgb(0 0 0 / 0.5)`,
    glow: `0 4px 16px ${goldAlpha(0.25)}`,
    focusRing: `0 0 0 3px ${goldAlpha(0.12)}`,
  },
};

export const brandTokensLight = {
  ...buildTokens(lightBrand, brandText.light),
  shadow: {
    card: `0 8px 24px ${navyAlpha(0.1)}`,
    cardHover: `0 12px 32px ${navyAlpha(0.16)}`,
    dialog: `0 25px 80px ${navyAlpha(0.24)}`,
    glow: `0 4px 16px ${goldAlpha(0.35)}`,
    focusRing: `0 0 0 3px ${goldAlpha(0.2)}`,
  },
};

/**
 * Default token set (dark scheme).
 * Kept as the default export shape for back-compat. Prefer `brandVars` in any
 * module that should follow the active color scheme.
 */
export const brandTokens = brandTokensDark;

/**
 * Scheme-aware token references.
 *
 * Each value is a CSS variable emitted by the MUI theme, so it resolves to the
 * light or dark value at render time. Safe in template strings, `sx` values and
 * `styled` blocks — but NOT inside `alpha()`/`varAlpha()`, which need real colors.
 */
export const brandVars = Object.freeze({
  page: 'var(--palette-brand-page)',
  section: 'var(--palette-brand-section)',
  surface: 'var(--palette-brand-surface)',
  elevated: 'var(--palette-brand-elevated)',
  sunken: 'var(--palette-brand-sunken)',
  input: 'var(--palette-brand-input)',
  overlay: 'var(--palette-brand-overlay)',
  hover: 'var(--palette-brand-hover)',
  hoverWash: 'var(--palette-brand-hoverWash)',
  accentSoft: 'var(--palette-brand-accentSoft)',
  borderDefault: 'var(--palette-brand-borderDefault)',
  borderStrong: 'var(--palette-brand-borderStrong)',
  borderSubtle: 'var(--palette-brand-borderSubtle)',
  textMuted: 'var(--palette-brand-textMuted)',
  accentText: 'var(--palette-brand-accentText)',
  neutralFill: 'var(--palette-brand-neutralFill)',
  neutralFillHover: 'var(--palette-brand-neutralFillHover)',
  onNeutralFill: 'var(--palette-brand-onNeutralFill)',
  skeleton: 'var(--palette-brand-skeleton)',
  skeletonHighlight: 'var(--palette-brand-skeletonHighlight)',
  gradientSurface: 'var(--palette-brand-gradientSurface)',
  gradientPage: 'var(--palette-brand-gradientPage)',
  /** Core palette passthroughs, for modules that only import from here. */
  textPrimary: 'var(--palette-text-primary)',
  textSecondary: 'var(--palette-text-secondary)',
  textDisabled: 'var(--palette-text-disabled)',
  divider: 'var(--palette-divider)',
  accent: 'var(--palette-primary-main)',
  accentHover: 'var(--palette-primary-light)',
  onAccent: 'var(--palette-primary-contrastText)',
  /** Elevation — defined per scheme in `src/global.css`. */
  shadowCard: 'var(--shadow-card)',
  shadowCardHover: 'var(--shadow-card-hover)',
  shadowGlow: 'var(--shadow-glow)',
});

export default brandTokens;
