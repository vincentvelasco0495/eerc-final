import { primaryShadow, subtleBackground, surfaceBackground } from '../shared/theme';

export const styles = {
  delivery: {
    root: { bgcolor: (theme) => subtleBackground(theme) },
    container: { py: { xs: 8, md: 12 } },
    content: { maxWidth: 430 },
    heading: { fontSize: { xs: '2rem', md: '3rem' }, lineHeight: 1.06, letterSpacing: '-0.03em' },
    copy: { color: 'text.secondary', lineHeight: 1.9 },
    button: {
      alignSelf: 'flex-start',
      px: 3,
      py: 1.5,
      borderRadius: 999,
      bgcolor: 'primary.main',
      boxShadow: (theme) => primaryShadow(theme),
    },
  },
  backend: {
    root: { bgcolor: (theme) => surfaceBackground(theme) },
    container: { py: { xs: 8, md: 12 } },
    content: { maxWidth: 430 },
    heading: { fontSize: { xs: '2rem', md: '3rem' }, lineHeight: 1.06, letterSpacing: '-0.03em' },
    copy: { color: 'text.secondary', lineHeight: 1.9 },
  },
};
