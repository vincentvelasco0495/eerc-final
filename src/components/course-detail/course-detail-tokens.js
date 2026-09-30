/** Design tokens — course detail reference (8px spacing grid). */

import { brandVars } from 'src/theme';

/**
 * Values are CSS variable references, so they resolve to the active color scheme
 * at render time. Safe in `sx`, `styled` and template strings.
 */
export const colors = {
  primary: brandVars.accent,
  /** Course title & key headings */
  headingNavy: brandVars.textPrimary,
  text: brandVars.textPrimary,
  muted: brandVars.textSecondary,
  border: brandVars.borderSubtle,
  /** Recessed panel behind cards and rows */
  bg: brandVars.sunken,
  /** Card surface — navy on dark, white on light; key name kept for API stability */
  white: brandVars.surface,
  star: brandVars.accentText,
  starEmpty: brandVars.borderSubtle,
  /** Legible accent for text/icons (deep gold on light, bright gold on dark) */
  accentText: brandVars.accentText,
};

export const radii = {
  card: '12px',
  pill: '999px',
};

export const shadow = {
  card: brandVars.shadowCard,
  cardHover: brandVars.shadowCardHover,
};

/** n = number of 8px units */
export const space = (n) => `${n * 8}px`;
