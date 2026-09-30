/**
 * Verifies the light and dark color schemes resolve to distinct, accessible values.
 * Run: node scripts/check-schemes.mjs
 */
import { createServer } from 'vite';

const KEY_PAIRS = [
  ['background.default', 'text.primary'],
  ['background.paper', 'text.primary'],
  ['background.paper', 'text.secondary'],
  ['brand.surface', 'brand.accentText'],
  ['brand.sunken', 'text.primary'],
  ['brand.neutralFill', 'brand.onNeutralFill'],
  ['primary.main', 'primary.contrastText'],
];

/** Severity/accent keys rendered as soft chips and standard alerts. */
const TINT_KEYS = ['primary', 'secondary', 'info', 'success', 'warning', 'error'];
/** `opacity.soft.bg` — the tint strength behind soft chips/labels. */
const SOFT_BG_ALPHA = 0.16;

function get(obj, path) {
  return path.split('.').reduce((acc, k) => acc?.[k], obj);
}

/** Parses '#RRGGBB' or 'rgb(r g b / a)' into [r,g,b] (alpha composited later). */
function parseColor(value) {
  if (typeof value !== 'string') return null;
  const hex = value.trim().match(/^#([0-9a-f]{6})$/i);
  if (hex) {
    const n = parseInt(hex[1], 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255, 1];
  }
  const rgb = value
    .trim()
    .match(/^rgba?\(\s*(\d+)[\s,]+(\d+)[\s,]+(\d+)\s*(?:[/,]\s*([\d.]+)\s*)?\)$/i);
  if (rgb) {
    return [+rgb[1], +rgb[2], +rgb[3], rgb[4] === undefined ? 1 : +rgb[4]];
  }
  return null;
}

function composite(fg, bg) {
  const a = fg[3];
  return [0, 1, 2].map((i) => fg[i] * a + bg[i] * (1 - a));
}

function luminance([r, g, b]) {
  const f = (c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}

function contrast(fgRaw, bgRaw) {
  const fg = parseColor(fgRaw);
  const bg = parseColor(bgRaw);
  if (!fg || !bg) return null;
  const l1 = luminance(composite(fg, bg));
  const l2 = luminance(bg);
  const [hi, lo] = l1 > l2 ? [l1, l2] : [l2, l1];
  return (hi + 0.05) / (lo + 0.05);
}

const server = await createServer({ server: { middlewareMode: true }, logLevel: 'error' });
try {
  const { palette } = await server.ssrLoadModule('/src/theme/core/palette.js');

  let failures = 0;
  const identical = [];

  for (const scheme of ['light', 'dark']) {
    console.log(`\n=== ${scheme.toUpperCase()} ===`);
    console.log(`  page      ${get(palette[scheme], 'background.default')}`);
    console.log(`  paper     ${get(palette[scheme], 'background.paper')}`);
    console.log(`  text      ${get(palette[scheme], 'text.primary')}`);
    console.log(`  accentTxt ${get(palette[scheme], 'brand.accentText')}`);
    console.log(`  divider   ${get(palette[scheme], 'divider')}`);

    for (const [bgKey, fgKey] of KEY_PAIRS) {
      const bg = get(palette[scheme], bgKey);
      const fg = get(palette[scheme], fgKey);
      const ratio = contrast(fg, bg);
      if (ratio === null) {
        console.log(`  ?  ${fgKey} on ${bgKey} — unparseable (${fg} / ${bg})`);
        continue;
      }
      const ok = ratio >= 4.5;
      const large = ratio >= 3;
      if (!ok) failures += 1;
      console.log(
        `  ${ok ? 'PASS' : large ? 'WARN' : 'FAIL'} ${ratio.toFixed(2)}:1  ${fgKey} on ${bgKey}`
      );
    }
  }

  // Soft chips: tinted background over the paper surface, colored text on top.
  for (const scheme of ['light', 'dark']) {
    console.log(`\n=== ${scheme.toUpperCase()}: soft chips + standard alerts ===`);
    const paper = parseColor(get(palette[scheme], 'background.paper'));

    for (const key of TINT_KEYS) {
      const main = parseColor(get(palette[scheme], `${key}.main`));
      const softBg = composite([...main.slice(0, 3), SOFT_BG_ALPHA], paper);
      const softFg = get(palette[scheme], `${key}.${scheme === 'light' ? 'darker' : 'light'}`);
      const softRatio = contrast(softFg, `rgb(${softBg.map(Math.round).join(' ')})`);

      const alertBg = get(palette[scheme], `${key}.${scheme === 'light' ? 'lighter' : 'darker'}`);
      const alertFg = get(palette[scheme], `${key}.${scheme === 'light' ? 'darker' : 'lighter'}`);
      const alertRatio = contrast(alertFg, alertBg);

      for (const [label, ratio] of [
        [`soft ${key}`, softRatio],
        [`alert ${key}`, alertRatio],
      ]) {
        const ok = ratio >= 4.5;
        if (!ok && ratio < 3) failures += 1;
        console.log(
          `  ${ok ? 'PASS' : ratio >= 3 ? 'WARN' : 'FAIL'} ${ratio.toFixed(2)}:1  ${label}`
        );
      }
    }
  }

  // The whole point of this change: the two schemes must actually differ.
  for (const key of ['background.default', 'background.paper', 'text.primary', 'brand.surface']) {
    if (get(palette.light, key) === get(palette.dark, key)) identical.push(key);
  }

  console.log('\n=== SCHEME DIVERGENCE ===');
  if (identical.length) {
    console.log(`  FAIL identical across schemes: ${identical.join(', ')}`);
    failures += identical.length;
  } else {
    console.log('  PASS light and dark differ on all key surfaces');
  }

  console.log(failures ? `\n${failures} issue(s) found.` : '\nAll checks passed.');
  process.exitCode = failures ? 1 : 0;
} finally {
  await server.close();
}
