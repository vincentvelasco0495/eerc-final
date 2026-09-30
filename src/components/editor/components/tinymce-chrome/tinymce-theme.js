/**
 * TinyMCE-like chrome tokens — navy/gold editor chrome (content colors live below).
 *
 * The chrome is plain MUI markup in the host document (not a TinyMCE iframe), so
 * these can be CSS variables that resolve per color scheme.
 */

import { navyAlpha, brandVars } from 'src/theme';

export const TINYMCE = {
  /** Gold wash marking an active tool */
  activeBg: brandVars.accentSoft,
  border: brandVars.borderSubtle,
  chromeSurface: brandVars.surface,
  /** Main frame behind toolbar + editor panels */
  frameBg: brandVars.sunken,
  hairline: brandVars.borderSubtle,
  rowDivider: brandVars.borderSubtle,
  menuColor: 'text.secondary',
  controlHeight: 26,
  iconBtnSize: 24,
  buttonRadius: '6px',
  /** Space between toolbar control groups (px) */
  groupGapPx: 16,
  /** Navy in both schemes: reads as a hairline on light, disappears on navy. */
  toolbarShadow: `0 1px 3px ${navyAlpha(0.18)}`,
};

/** User-selectable CONTENT colors — deliberately left as-is, they are not chrome. */
export const TEXT_COLORS = [
  '#000000',
  '#4d4d4d',
  '#808080',
  '#b3b3b3',
  '#e06666',
  '#f6b26b',
  '#ffd966',
  '#93c47d',
  '#76a5af',
  '#6d9eeb',
  '#8e7cc3',
  '#ffffff',
];

export const HIGHLIGHT_COLORS = [
  '#fef08a',
  '#fde047',
  '#fdba74',
  '#fca5a5',
  '#86efac',
  '#7dd3fc',
  '#c4b5fd',
  '#fbcfe8',
  '#e5e5e5',
  '#ffffff',
];

export const FONT_FAMILIES = [
  { label: 'System Font', value: '', cssFamily: 'inherit' },
  { label: 'Arial', value: 'Arial, Helvetica, sans-serif', cssFamily: 'Arial, Helvetica, sans-serif' },
  { label: 'Georgia', value: 'Georgia, serif', cssFamily: 'Georgia, serif' },
  {
    label: 'Times New Roman',
    value: '"Times New Roman", Times, serif',
    cssFamily: '"Times New Roman", Times, serif',
  },
  { label: 'Verdana', value: 'Verdana, Geneva, sans-serif', cssFamily: 'Verdana, Geneva, sans-serif' },
  {
    label: 'Courier New',
    value: '"Courier New", Courier, monospace',
    cssFamily: '"Courier New", Courier, monospace',
  },
];

export const FONT_SIZE_STEPS = ['12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px', '36px'];

export const LINE_HEIGHT_OPTIONS = [
  { label: '1', value: '1' },
  { label: '1.15', value: '1.15' },
  { label: '1.5', value: '1.5' },
  { label: '2', value: '2' },
];
