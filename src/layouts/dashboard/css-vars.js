import { varAlpha } from 'minimal-shared/utils';

import { bulletColor } from 'src/components/nav-section';

// ----------------------------------------------------------------------

export function dashboardLayoutVars(theme) {
  return {
    '--layout-transition-easing': 'linear',
    '--layout-transition-duration': '120ms',
    '--layout-nav-mini-width': '88px',
    '--layout-nav-vertical-width': '300px',
    '--layout-nav-horizontal-height': '64px',
    /** Gap below the in-flow sticky navbar — 16px mobile, 24px desktop. */
    '--layout-dashboard-content-pt': theme.spacing(2),
    '--layout-dashboard-content-pt-desktop': theme.spacing(3),
    '--layout-dashboard-content-pb': theme.spacing(8),
    '--layout-dashboard-content-px': theme.spacing(5),
  };
}

// ----------------------------------------------------------------------

export function dashboardNavColorVars(theme, navColor = 'integrate', navLayout = 'vertical') {
  const {
    vars: { palette },
  } = theme;

  switch (navColor) {
    case 'integrate':
      return {
        layout: {
          '--layout-nav-bg': palette.brand.page,
          '--layout-nav-horizontal-bg': varAlpha(palette.background.defaultChannel, 0.96),
          '--layout-nav-border-color': palette.brand.borderSubtle,
          '--layout-nav-text-primary-color': palette.text.primary,
          '--layout-nav-text-secondary-color': palette.text.secondary,
          '--layout-nav-text-disabled-color': palette.text.disabled,
        },
        section: undefined,
      };
    case 'apparent':
      return {
        layout: {
          '--layout-nav-bg': palette.brand.sunken,
          '--layout-nav-horizontal-bg': varAlpha(palette.background.neutralChannel, 0.96),
          '--layout-nav-border-color': palette.brand.borderSubtle,
          '--layout-nav-text-primary-color': palette.text.primary,
          '--layout-nav-text-secondary-color': palette.text.secondary,
          '--layout-nav-text-disabled-color': palette.text.disabled,
        },
        section: {
          // caption
          '--nav-item-caption-color': palette.text.disabled,
          // subheader
          '--nav-subheader-color': palette.text.disabled,
          '--nav-subheader-hover-color': palette.text.primary,
          // item
          '--nav-item-color': palette.text.secondary,
          '--nav-item-root-active-color': palette.brand.accentText,
          '--nav-item-root-open-color': palette.text.primary,
          // bullet
          '--nav-bullet-light-color': bulletColor.dark,
          // sub
          ...(navLayout === 'vertical' && {
            '--nav-item-sub-active-color': palette.brand.accentText,
            '--nav-item-sub-open-color': palette.text.primary,
          }),
        },
      };
    default:
      throw new Error(`Invalid color: ${navColor}`);
  }
}
