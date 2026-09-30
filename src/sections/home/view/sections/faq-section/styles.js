import {
  adaptiveSectionText,
  adaptiveSectionMutedText,
  adaptiveSectionBackground,
} from '../shared/theme';

export const styles = {
  root: {
    bgcolor: (theme) => adaptiveSectionBackground(theme, 'subtle'),
    color: (theme) => adaptiveSectionText(theme),
  },
  container: { py: { xs: 8, md: 11 } },
  header: { textAlign: 'center' },
  heading: { maxWidth: 980, fontSize: { xs: '2rem', md: '3.7rem' }, lineHeight: 1.08, letterSpacing: '-0.04em' },
  copyWrap: { maxWidth: 1080, textAlign: 'left' },
  copy: { color: (theme) => adaptiveSectionMutedText(theme, 'rgba(255,255,255,0.82)'), lineHeight: 1.85 },
  contentGrid: { width: 1, maxWidth: 1080, mx: 'auto' },
};
