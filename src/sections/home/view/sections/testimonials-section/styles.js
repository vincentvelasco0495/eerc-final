import {
  adaptiveActiveDot,
  adaptiveInactiveDot,
  adaptiveSectionText,
  adaptiveSectionMutedText,
  adaptiveSectionBackground,
} from '../shared/theme';

export const styles = {
  root: {
    position: 'relative',
    overflow: 'hidden',
    bgcolor: (theme) => adaptiveSectionBackground(theme, 'subtle'),
    color: (theme) => adaptiveSectionText(theme),
  },
  container: {
    position: 'relative',
    zIndex: 1,
    py: { xs: 8, md: 10 },
  },
  header: { textAlign: 'center' },
  heading: { fontSize: { xs: '2.2rem', md: '3.8rem' }, lineHeight: 1.04, letterSpacing: '-0.04em' },
  overline: { color: (theme) => adaptiveSectionMutedText(theme), letterSpacing: 1.8 },
  grid: { mt: { xs: 4, md: 5 } },
  dots: { mt: 3 },
  activeDot: { width: 6, height: 6, borderRadius: '50%', bgcolor: (theme) => adaptiveActiveDot(theme) },
  inactiveDot: { width: 6, height: 6, borderRadius: '50%', bgcolor: (theme) => adaptiveInactiveDot(theme) },
};
