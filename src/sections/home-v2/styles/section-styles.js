import { varAlpha } from 'minimal-shared/utils';

import { pageBackground, subtleBackground, surfaceBackground } from 'src/sections/home/view/sections/shared/theme';

export const SECTION_PY = { xs: 8, md: 12, lg: 14 };

export const sectionStyles = {
  pageRoot: {
    bgcolor: (theme) => pageBackground(theme),
    overflow: 'hidden',
  },
  section: {
    position: 'relative',
    py: SECTION_PY,
  },
  surfaceSection: {
    position: 'relative',
    py: SECTION_PY,
    bgcolor: (theme) => surfaceBackground(theme),
  },
  subtleSection: {
    position: 'relative',
    py: SECTION_PY,
    bgcolor: (theme) => subtleBackground(theme),
  },
  container: {
    position: 'relative',
    zIndex: 1,
  },
  eyebrow: {
    width: 'fit-content',
    fontWeight: 700,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    fontSize: { xs: '0.7rem', md: '0.75rem' },
  },
  displayHeading: {
    fontWeight: 800,
    letterSpacing: -1.5,
    lineHeight: { xs: 1.08, md: 1.02 },
    fontSize: { xs: '2.25rem', sm: '2.75rem', md: '3.25rem', lg: '3.75rem' },
  },
  sectionHeading: {
    fontWeight: 800,
    letterSpacing: -1,
    lineHeight: 1.1,
    fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
  },
  bodyLead: {
    color: 'text.secondary',
    fontSize: { xs: '1rem', md: '1.125rem' },
    lineHeight: 1.75,
    maxWidth: 560,
  },
  card: {
    height: 1,
    p: { xs: 2.5, md: 3 },
    borderRadius: 4,
    backgroundImage: (theme) => theme.vars.palette.brand.gradientSurface,
    border: (theme) => `1px solid ${theme.vars.palette.brand.borderDefault}`,
    boxShadow: (theme) => theme.vars.customShadows.card,
    transition: (theme) =>
      theme.transitions.create(['transform', 'border-color', 'box-shadow'], {
        duration: theme.transitions.duration.shorter,
      }),
    '&:hover': {
      transform: 'translateY(-4px)',
      borderColor: (theme) => theme.vars.palette.brand.borderStrong,
      boxShadow: (theme) =>
        `0 20px 48px ${varAlpha(theme.vars.palette.primary.mainChannel, 0.16)}`,
    },
  },
  decorBlob: {
    position: 'absolute',
    borderRadius: '50%',
    filter: 'blur(80px)',
    pointerEvents: 'none',
    zIndex: 0,
  },
  decorGrid: {
    position: 'absolute',
    inset: 0,
    opacity: 0.35,
    pointerEvents: 'none',
    zIndex: 0,
    backgroundImage: (theme) =>
      `linear-gradient(${varAlpha(theme.vars.palette.common.whiteChannel, 0.06)} 1px, transparent 1px),
       linear-gradient(90deg, ${varAlpha(theme.vars.palette.common.whiteChannel, 0.06)} 1px, transparent 1px)`,
    backgroundSize: '48px 48px',
    maskImage: 'linear-gradient(to bottom, black, transparent 85%)',
  },
};
