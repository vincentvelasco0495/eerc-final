import {
  primaryShadow,
  subtleBackground,
  surfaceBackground,
  accentSectionBackground,
} from '../shared/theme';

export const styles = {
  manage: {
    root: {
      position: 'relative',
      overflow: 'hidden',
      bgcolor: (theme) => accentSectionBackground(theme),
      color: 'common.white',
    },
    container: { position: 'relative', zIndex: 1, py: { xs: 8, md: 11 }, textAlign: 'center' },
    heading: { fontSize: { xs: '2.2rem', md: '3.6rem' }, lineHeight: 1.04, letterSpacing: '-0.04em' },
    copy: { maxWidth: 660, color: 'rgba(255,255,255,0.76)', lineHeight: 1.9 },
  },
  addons: {
    root: { bgcolor: (theme) => surfaceBackground(theme) },
    container: { py: { xs: 8, md: 12 } },
    tabsWrap: { p: 0.75, width: 1, maxWidth: 760, borderRadius: 1.5, bgcolor: (theme) => subtleBackground(theme) },
    tab: (active) => ({ py: 1.4, borderRadius: 1, bgcolor: active ? 'primary.main' : 'transparent', color: active ? 'common.white' : 'text.secondary', typography: 'subtitle2', textAlign: 'center' }),
    content: { maxWidth: 420 },
    heading: { fontSize: { xs: '2rem', md: '3rem' }, lineHeight: 1.06, letterSpacing: '-0.03em' },
    copy: { color: 'text.secondary', lineHeight: 1.9 },
    button: { alignSelf: 'flex-start', px: 3.5, py: 1.5, borderRadius: 999, boxShadow: (theme) => primaryShadow(theme, 0.26) },
    subheading: { pt: { xs: 1, md: 2 }, textAlign: 'center', fontSize: { xs: '1.8rem', md: '3rem' }, lineHeight: 1.08, letterSpacing: '-0.03em' },
    grid: { width: 1, pt: { xs: 1, md: 2 } },
    cardStack: {
      height: 1,
      textAlign: 'center',
      transition: 'transform 0.35s cubic-bezier(0.22, 1, 0.36, 1)',
      '&:hover': {
        transform: 'translateY(-8px)',
      },
      '&:hover .addon-preview-wrap': {
        boxShadow: '0 24px 48px rgba(15, 23, 42, 0.12)',
      },
    },
    previewWrap: {
      p: { xs: 2, md: 2.5 },
      borderRadius: 2.5,
      bgcolor: (theme) => subtleBackground(theme),
      border: '1px solid rgba(123, 140, 182, 0.14)',
      boxShadow: '0 18px 40px rgba(15, 23, 42, 0.05)',
      transition: 'box-shadow 0.35s cubic-bezier(0.22, 1, 0.36, 1)',
    },
    cardCopy: { px: { xs: 0.5, md: 1 } },
    cardTitle: { fontSize: '1.1rem', lineHeight: 1.35 },
    cardDescription: { color: 'text.secondary', lineHeight: 1.75 },
  },
};
