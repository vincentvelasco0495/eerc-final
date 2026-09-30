import { varAlpha } from 'minimal-shared/utils';

// ----------------------------------------------------------------------

/**
 * Shared surface helpers for public marketing sections.
 *
 * Surfaces and text follow the active color scheme (`brand.*` / `text.*`).
 * Do not assume navy backgrounds or white type.
 */

export function getPalette(theme) {
  return theme.vars?.palette || theme.palette;
}

export function pageBackground(theme) {
  return getPalette(theme).brand.page;
}

export function surfaceBackground(theme) {
  return getPalette(theme).brand.surface;
}

export function subtleBackground(theme) {
  return getPalette(theme).brand.section;
}

export function alternateBackground(theme) {
  return getPalette(theme).brand.elevated;
}

export function darkSectionBackground(theme) {
  return getPalette(theme).brand.sunken;
}

export function adaptiveSectionBackground(theme, lightVariant = 'surface') {
  return lightVariant === 'subtle' ? subtleBackground(theme) : surfaceBackground(theme);
}

export function adaptiveSectionText(theme) {
  return getPalette(theme).text.primary;
}

export function adaptiveSectionMutedText(theme, _mutedColor) {
  return getPalette(theme).text.secondary;
}

export function adaptiveInactiveDot(theme) {
  return varAlpha(getPalette(theme).text.primaryChannel, 0.32);
}

export function adaptiveActiveDot(theme) {
  return getPalette(theme).primary.main;
}

export function primarySectionBackground(theme) {
  return getPalette(theme).brand.elevated;
}

export function accentSectionBackground(theme) {
  return getPalette(theme).secondary.dark;
}

export function primaryShadow(theme, opacity = 0.28) {
  return `0 12px 24px ${varAlpha(getPalette(theme).primary.mainChannel, opacity)}`;
}
