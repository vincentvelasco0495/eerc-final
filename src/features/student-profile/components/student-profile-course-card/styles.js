import { goldAlpha, whiteAlpha, brandPalette } from 'src/theme';

/**
 * Decorative course-card ramps: [base, mid, accent].
 * All variants stay inside the navy -> blue -> gold brand family so a grid of
 * cards reads as one set; only the accent differentiates them.
 */
const ART_VARIANTS = {
  stage: [brandPalette.deepNavy, brandPalette.mediumBlue, brandPalette.gold],
  linen: [brandPalette.primaryNavy, brandPalette.brightBlue, brandPalette.goldLight],
  slate: [brandPalette.cardBgDark, brandPalette.darkBlue, '#38BDF8'],
  studio: [brandPalette.deepNavy, brandPalette.brightBlue, brandPalette.goldDark],
  graphite: [brandPalette.cardBgDark, brandPalette.mediumBlue, brandPalette.goldLighter],
  ember: [brandPalette.deepNavy, brandPalette.darkBlue, brandPalette.gold],
  cobalt: [brandPalette.primaryNavy, brandPalette.mediumBlue, '#7DD8FB'],
};

export function cardArtSx(variant) {
  const [base, mid, accent] = ART_VARIANTS[variant] ?? ART_VARIANTS.cobalt;

  return {
    position: 'relative',
    minHeight: 180,
    borderRadius: 2,
    overflow: 'hidden',
    backgroundImage: `linear-gradient(135deg, ${base} 0%, ${mid} 58%, ${accent} 100%)`,
    '&::before': {
      content: '""',
      position: 'absolute',
      inset: 'auto -10% -30% auto',
      width: 150,
      height: 150,
      borderRadius: '50%',
      bgcolor: goldAlpha(0.16),
    },
    '&::after': {
      content: '""',
      position: 'absolute',
      left: '-12%',
      top: '-18%',
      width: 190,
      height: 130,
      borderRadius: '45%',
      bgcolor: whiteAlpha(0.08),
      transform: 'rotate(-10deg)',
    },
  };
}

export const cardBannerFrameSx = {
  position: 'relative',
  minHeight: 180,
  height: 180,
  borderRadius: 2,
  overflow: 'hidden',
  bgcolor: 'background.neutral',
};

export const styles = {
  bannerSkeleton: {
    width: 1,
    minHeight: 180,
    height: 180,
    borderRadius: 2,
  },
  card: {
    width: 1,
    height: '100%',
    borderRadius: 2.5,
    border: '1px solid',
    borderColor: 'divider',
    boxShadow: 'none',
  },
  cardContent: { p: 2 },
  categoryCaption: { color: 'text.secondary' },
  title: { minHeight: 58, lineHeight: 1.35 },
  description: {
    color: 'text.secondary',
    lineHeight: 1.55,
    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  courseMetaPill: {
    px: 1,
    py: 0.6,
    borderRadius: 1,
    bgcolor: 'background.neutral',
    color: 'text.secondary',
  },
  ratingCaption: { color: 'text.secondary' },
  startCourseBtn: { py: 1.2 },
  startedCaption: { color: 'text.secondary', textAlign: 'center' },
};
