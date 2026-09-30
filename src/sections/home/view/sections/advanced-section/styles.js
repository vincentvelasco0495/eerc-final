import {
  subtleBackground,
  adaptiveSectionText,
  adaptiveSectionMutedText,
  primarySectionBackground,
  adaptiveSectionBackground,
} from '../shared/theme';

export const styles = {
  lessonQuiz: {
    root: {
      bgcolor: (theme) => adaptiveSectionBackground(theme, 'subtle'),
      color: (theme) => adaptiveSectionText(theme),
    },
    container: { py: { xs: 8, md: 11 } },
    header: { textAlign: 'center' },
    heading: { fontSize: { xs: '2.15rem', md: '3.8rem' }, lineHeight: 1.04, letterSpacing: '-0.04em' },
    copy: { maxWidth: 760, color: (theme) => adaptiveSectionMutedText(theme), lineHeight: 1.9 },
    grid: { mt: { xs: 5, md: 6 } },
    card: (active) => ({
      p: { xs: 2.5, md: 3 },
      borderRadius: 2,
      bgcolor: (theme) =>
        active ? primarySectionBackground(theme) : theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.04)' : theme.palette.background.paper,
      border: (theme) =>
        active
          ? '1px solid rgba(108, 174, 255, 0.28)'
          : `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.04)' : theme.palette.divider}`,
      boxShadow: active ? '0 18px 36px rgba(47, 102, 212, 0.24)' : 'none',
      transition:
        'transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.35s cubic-bezier(0.22, 1, 0.36, 1), border-color 0.35s ease',
      '&:hover': {
        transform: 'translateY(-8px)',
        boxShadow: active ? '0 26px 52px rgba(47, 102, 212, 0.32)' : '0 18px 36px rgba(15, 23, 42, 0.12)',
      },
    }),
    cardIcon: (active) => ({
      width: 42,
      height: 42,
      flexShrink: 0,
      display: 'grid',
      placeItems: 'center',
      borderRadius: 1.5,
      color: active ? 'common.white' : 'primary.main',
      bgcolor: (theme) =>
        active
          ? 'rgba(255,255,255,0.12)'
          : theme.palette.mode === 'dark'
            ? 'rgba(255,255,255,0.04)'
            : subtleBackground(theme),
    }),
    cardTitle: (active) => ({ color: active ? 'common.white' : 'text.primary', lineHeight: 1.25 }),
    cardDescription: (active) => ({
      color: active ? 'rgba(255,255,255,0.74)' : 'text.secondary',
      lineHeight: 1.8,
    }),
  },
  collaboration: {
    root: { bgcolor: (theme) => subtleBackground(theme) },
    container: { py: { xs: 8, md: 11 } },
    card: (active) => ({
      p: { xs: 2.5, md: 2.75 },
      borderRadius: 1.75,
      bgcolor: (theme) => (active ? primarySectionBackground(theme) : theme.palette.background.paper),
      color: active ? 'common.white' : 'text.primary',
      border: '1px solid rgba(131, 149, 196, 0.12)',
      boxShadow: active ? '0 18px 34px rgba(47, 102, 212, 0.22)' : '0 12px 28px rgba(15, 23, 42, 0.06)',
      transition:
        'transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.35s cubic-bezier(0.22, 1, 0.36, 1)',
      '&:hover': {
        transform: 'translateY(-8px)',
        boxShadow: active ? '0 24px 44px rgba(47, 102, 212, 0.28)' : '0 18px 38px rgba(15, 23, 42, 0.12)',
      },
    }),
    cardIcon: (active) => ({ width: 42, height: 42, flexShrink: 0, display: 'grid', placeItems: 'center', borderRadius: 1.4, color: active ? 'common.white' : '#2f66d4', bgcolor: active ? 'rgba(255,255,255,0.12)' : '#f4f7ff' }),
    cardTitle: (active) => ({ color: active ? 'common.white' : 'text.primary', lineHeight: 1.2 }),
    cardDescription: (active) => ({ color: active ? 'rgba(255,255,255,0.82)' : 'text.secondary', lineHeight: 1.75 }),
  },
  integrations: {
    root: {
      bgcolor: (theme) => adaptiveSectionBackground(theme, 'subtle'),
      color: (theme) => adaptiveSectionText(theme),
    },
    container: { py: { xs: 8, md: 11 } },
    header: { textAlign: 'center' },
    heading: { fontSize: { xs: '2.4rem', md: '4.8rem' }, lineHeight: 1.02, letterSpacing: '-0.04em' },
    copy: { maxWidth: 760, color: (theme) => adaptiveSectionMutedText(theme), lineHeight: 1.9 },
    grid: { mt: { xs: 5, md: 5.5 } },
  },
  translation: {
    root: { bgcolor: (theme) => primarySectionBackground(theme), color: 'common.white' },
    container: { py: { xs: 8, md: 11 } },
    content: { maxWidth: 560 },
    heading: { fontSize: { xs: '2.3rem', md: '3.9rem' }, lineHeight: 1.04, letterSpacing: '-0.04em' },
    copyPrimary: { color: 'rgba(255,255,255,0.9)', lineHeight: 1.9 },
    copySecondary: { color: 'rgba(255,255,255,0.86)', lineHeight: 1.9 },
  },
};
