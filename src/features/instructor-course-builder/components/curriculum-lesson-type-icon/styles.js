import { alpha } from '@mui/material/styles';

/** Outlined look: light tint + border; Solar linear glyphs use `spec.bg` as stroke/fill color. */
export const styles = {
  tile: (spec, borderRadius) => () => ({
    width: 30,
    height: 30,
    borderRadius,
    bgcolor: alpha(spec.bg, 0.16),
    border: `1px solid ${alpha(spec.bg, 0.55)}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  }),
  glyph: (spec, video) => () => ({
    color: spec.bg,
    ...(video ? { ml: 0.25 } : {}),
  }),
};
