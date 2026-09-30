import { varAlpha, createPaletteChannel } from 'minimal-shared/utils';

import { opacity } from './opacity';
import { themeConfig } from '../theme-config';
import {
  goldAlpha,
  navyAlpha,
  brandText,
  whiteAlpha,
  brandScheme,
  brandTokensDark,
  brandTokensLight,
} from '../brand-tokens';

// ----------------------------------------------------------------------

/**
 * ➤
 * ➤ ➤ Core palette (primary, secondary, info, success, warning, error, common, grey)
 * ➤
 *
 * Brand colors are scheme-independent: gold stays gold and navy stays navy in
 * both schemes. Only surfaces, text and borders flip.
 */
export const primary = createPaletteChannel(themeConfig.palette.primary);
export const secondary = createPaletteChannel(themeConfig.palette.secondary);
export const info = createPaletteChannel(themeConfig.palette.info);
export const success = createPaletteChannel(themeConfig.palette.success);
export const warning = createPaletteChannel(themeConfig.palette.warning);
export const error = createPaletteChannel(themeConfig.palette.error);
export const common = createPaletteChannel(themeConfig.palette.common);
export const grey = createPaletteChannel(themeConfig.palette.grey);

/**
 * ➤
 * ➤ ➤ Text, background, action
 * ➤
 *
 * Dark scheme = navy platform with white text.
 * Light scheme = off-white surfaces with navy text.
 */
const buildText = (scheme) =>
  createPaletteChannel({
    primary: brandText[scheme].primary,
    secondary: brandText[scheme].secondary,
    disabled: brandText[scheme].disabled,
  });

const buildBackground = (scheme) => {
  const brand = brandScheme[scheme];
  return createPaletteChannel({
    paper: brand.surface,
    default: brand.page,
    neutral: brand.sunken,
  });
};

export const text = { light: buildText('light'), dark: buildText('dark') };
export const background = { light: buildBackground('light'), dark: buildBackground('dark') };

/**
 * Action states. Hover/overlay washes are white-on-navy in the dark scheme and
 * navy-on-white in the light scheme; selection always uses the gold accent.
 */
export const action = (scheme) => ({
  active: scheme === 'light' ? grey[700] : grey[300],
  hover: scheme === 'light' ? navyAlpha(0.06) : whiteAlpha(0.08),
  selected: goldAlpha(scheme === 'light' ? 0.18 : 0.14),
  focus: goldAlpha(scheme === 'light' ? 0.24 : 0.2),
  disabled: varAlpha(grey['500Channel'], 0.8),
  disabledBackground: varAlpha(grey['500Channel'], 0.24),
  hoverOpacity: 0.08,
  selectedOpacity: 0.08,
  focusOpacity: 0.12,
  activatedOpacity: 0.12,
  disabledOpacity: 0.48,
});

/**
 * ➤
 * ➤ ➤ Extended palette
 * ➤
 */
const buildShared = (scheme) => ({
  inputUnderline: varAlpha(grey['500Channel'], opacity.inputUnderline),
  inputOutlined: scheme === 'light' ? navyAlpha(0.2) : whiteAlpha(0.15),
  paperOutlined: goldAlpha(scheme === 'light' ? 0.4 : 0.25),
  buttonOutlined: goldAlpha(scheme === 'light' ? 0.7 : 0.45),
});

/**
 * Brand surfaces exposed as CSS vars (`theme.vars.palette.brand.*`) so components
 * can consume them without importing raw hex values or branching on the mode.
 */
const buildBrand = (scheme) => {
  const tokens = scheme === 'light' ? brandTokensLight : brandTokensDark;
  const brand = brandScheme[scheme];
  return {
    page: tokens.background.page,
    section: tokens.background.section,
    surface: tokens.background.surface,
    elevated: tokens.background.elevated,
    sunken: tokens.background.sunken,
    input: tokens.background.input,
    overlay: tokens.background.overlay,
    hover: tokens.interactive.hover,
    hoverWash: tokens.interactive.hoverWash,
    accentSoft: tokens.accent.soft,
    borderDefault: tokens.border.default,
    borderStrong: tokens.border.strong,
    borderSubtle: tokens.border.subtle,
    textMuted: tokens.text.muted,
    /** Legible accent text/icon color for the scheme (deep gold on light). */
    accentText: tokens.accent.text,
    /** Neutral secondary-action fill — navy in both schemes. */
    neutralFill: brand.neutralFill,
    neutralFillHover: brand.neutralFillHover,
    onNeutralFill: brand.onNeutralFill,
    skeleton: brand.skeleton,
    skeletonHighlight: brand.skeletonHighlight,
    gradientSurface: tokens.gradient.surface,
    gradientPage: tokens.gradient.page,
  };
};

export const extendPalette = {
  light: { shared: buildShared('light'), brand: buildBrand('light') },
  dark: { shared: buildShared('dark'), brand: buildBrand('dark') },
};

/**
 * ➤
 * ➤ ➤ Base configuration
 * ➤
 */
const coreColors = { primary, secondary, info, success, warning, error, common, grey };

const buildScheme = (scheme) => {
  const divider = scheme === 'light' ? navyAlpha(0.12) : whiteAlpha(0.08);
  return {
    ...coreColors,
    text: text[scheme],
    background: background[scheme],
    action: action(scheme),
    divider,
    TableCell: { border: divider },
    ...extendPalette[scheme],
  };
};

/* **********************************************************************
 * 📦 Final
 * **********************************************************************/
export const palette = {
  light: buildScheme('light'),
  dark: buildScheme('dark'),
};

export const colorKeys = {
  palette: ['primary', 'secondary', 'info', 'success', 'warning', 'error'],
  common: ['black', 'white'],
};
