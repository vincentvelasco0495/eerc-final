import {
  primaryShadow,
  subtleBackground,
  surfaceBackground,
  adaptiveSectionText,
  adaptiveSectionMutedText,
  adaptiveSectionBackground,
} from '../shared/theme';

export const styles = {
  lessonTypes: {
    root: {
      bgcolor: (theme) => adaptiveSectionBackground(theme, 'subtle'),
      color: (theme) => adaptiveSectionText(theme),
    },
    container: { py: { xs: 8, md: 12 } },
    header: { textAlign: 'center' },
    heading: { fontSize: { xs: '2.25rem', md: '4rem' }, lineHeight: 1.02, letterSpacing: '-0.04em' },
    copy: { maxWidth: 760, color: (theme) => adaptiveSectionMutedText(theme), lineHeight: 1.9 },
    badges: { mt: { xs: 4, md: 5 } },
    badgeItem: { textAlign: 'center' },
    badgeCircle: (color) => ({ width: 58, height: 58, display: 'grid', placeItems: 'center', borderRadius: '50%', border: `2px solid ${color}`, color }),
    badgeText: { color: (theme) => adaptiveSectionText(theme), letterSpacing: 0.5 },
    preview: { mt: { xs: 5, md: 6 } },
  },
  profile: {
    root: { bgcolor: (theme) => subtleBackground(theme) },
    container: { py: { xs: 8, md: 12 } },
    stack: { textAlign: 'center' },
    toggleWrap: { p: 0.75, width: '100%', maxWidth: 520, borderRadius: 1.5, bgcolor: (theme) => surfaceBackground(theme), boxShadow: '0 10px 26px rgba(15, 23, 42, 0.08)' },
    activeToggle: { py: 1.5, borderRadius: 1, bgcolor: 'primary.main', color: 'common.white', typography: 'subtitle2' },
    inactiveToggle: { py: 1.5, borderRadius: 1, color: 'text.secondary', typography: 'subtitle2' },
    header: { maxWidth: 760 },
    heading: { fontSize: { xs: '2rem', md: '3.2rem' }, lineHeight: 1.06, letterSpacing: '-0.03em' },
    copy: { color: 'text.secondary', lineHeight: 1.9 },
    button: { px: 3.5, py: 1.5, borderRadius: 999, boxShadow: (theme) => primaryShadow(theme) },
  },
};
