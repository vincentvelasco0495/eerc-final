import {
  primaryShadow,
  surfaceBackground,
  adaptiveSectionText,
  adaptiveSectionMutedText,
  adaptiveSectionBackground,
} from '../shared/theme';

export const styles = {
  community: {
    root: {
      bgcolor: (theme) => adaptiveSectionBackground(theme, 'subtle'),
      color: (theme) => adaptiveSectionText(theme),
    },
    container: { py: { xs: 8, md: 11 } },
    header: { textAlign: 'center' },
    heading: { fontSize: { xs: '2.4rem', md: '4.5rem' }, fontWeight: 800, lineHeight: 1.02, letterSpacing: '-0.04em' },
    copy: { maxWidth: 680, color: (theme) => adaptiveSectionMutedText(theme), lineHeight: 1.9 },
    preview: { mt: { xs: 5, md: 7 } },
  },
  interface: {
    root: { bgcolor: (theme) => surfaceBackground(theme) },
    container: { py: { xs: 8, md: 11 } },
    content: { maxWidth: 520, mx: { md: 'auto' }, textAlign: { xs: 'center', md: 'left' } },
    overline: { color: 'text.secondary', fontWeight: 800, letterSpacing: 1.8 },
    heading: { fontSize: { xs: '2.5rem', md: '4rem' }, lineHeight: 1.02, letterSpacing: '-0.04em' },
    copy: { color: 'text.secondary', lineHeight: 1.9 },
  },
  courseStyles: {
    root: {
      bgcolor: (theme) => adaptiveSectionBackground(theme, 'subtle'),
      color: (theme) => adaptiveSectionText(theme),
    },
    container: { py: { xs: 8, md: 11 } },
    header: { textAlign: 'center' },
    heading: { fontSize: { xs: '2.25rem', md: '4rem' }, lineHeight: 1.04, letterSpacing: '-0.04em' },
    copy: { maxWidth: 760, color: (theme) => adaptiveSectionMutedText(theme), lineHeight: 1.9 },
    copySecondary: { maxWidth: 700, color: (theme) => adaptiveSectionMutedText(theme, 'rgba(255,255,255,0.7)'), lineHeight: 1.9 },
    grid: { mt: { xs: 5, md: 6 } },
  },
  contentInteraction: {
    root: { bgcolor: (theme) => surfaceBackground(theme) },
    container: { py: { xs: 8, md: 11 } },
    content: { maxWidth: 520 },
    heading: { fontSize: { xs: '2.3rem', md: '3.8rem' }, lineHeight: 1.02, letterSpacing: '-0.04em' },
    iconWrap: (color) => ({ width: 48, height: 48, flexShrink: 0, display: 'grid', placeItems: 'center', borderRadius: 1.5, bgcolor: color, color: color === '#ffd166' ? '#8b5f00' : 'common.white', boxShadow: `0 12px 24px ${color}33` }),
    itemTitle: { lineHeight: 1.25 },
    itemDescription: { color: 'text.secondary', lineHeight: 1.8 },
    button: { alignSelf: 'flex-start', px: 3.5, py: 1.5, borderRadius: 999, boxShadow: (theme) => primaryShadow(theme) },
  },
};
