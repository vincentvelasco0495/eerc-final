import {
  surfaceBackground,
  adaptiveSectionText,
  adaptiveSectionMutedText,
  adaptiveSectionBackground,
} from '../shared/theme';

export const styles = {
  overview: {
    root: {
      bgcolor: (theme) => adaptiveSectionBackground(theme, 'subtle'),
      color: (theme) => adaptiveSectionText(theme),
    },
    container: { py: { xs: 8, md: 12 } },
    header: { textAlign: 'center' },
    overline: { color: (theme) => adaptiveSectionMutedText(theme, 'rgba(255,255,255,0.72)'), letterSpacing: 2.4 },
    heading: { fontSize: { xs: '2.5rem', md: '4rem' }, lineHeight: 1.02, letterSpacing: '-0.04em' },
    copy: { maxWidth: 760, color: (theme) => adaptiveSectionMutedText(theme), lineHeight: 1.9 },
    cards: { mt: { xs: 4, md: 5 } },
    features: { mt: { xs: 4, md: 5 } },
    featureIconWrap: { width: 22, height: 22, flexShrink: 0, borderRadius: '50%', bgcolor: '#2fd17d', display: 'grid', placeItems: 'center', mt: 0.25 },
    featureText: { color: (theme) => adaptiveSectionMutedText(theme, 'rgba(255,255,255,0.8)'), lineHeight: 1.8 },
  },
  panels: {
    root: { bgcolor: (theme) => surfaceBackground(theme) },
    container: { py: { xs: 8, md: 12 } },
  },
};
