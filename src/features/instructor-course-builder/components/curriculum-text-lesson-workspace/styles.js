import { varAlpha } from 'minimal-shared/utils';

import { brandVars } from 'src/theme';

export const styles = {
  root: (theme) => ({
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
    bgcolor: 'background.paper',
    border: '1px solid',
    borderColor: 'divider',
    borderRadius: 2,
    px: { xs: 2, sm: 2.5 },
    pt: 2.5,
    pb: 2,
    overflow: 'auto',
    boxShadow: `0 1px 2px ${varAlpha(theme.vars.palette.common.blackChannel, 0.2)}`,
  }),
  tabsBar: {
    mt: 2,
    mb: 0,
    width: 1,
  },
  /** Sunken rounded shell; active tab = elevated “pill”; inactive = same surface as shell. */
  tabs: (theme) => {
    const trackBg = brandVars.sunken;

    return {
      minHeight: 48,
      bgcolor: trackBg,
      borderRadius: '8px',
      p: '4px',
      boxSizing: 'border-box',
      '& .MuiTabs-flexContainer': {
        gap: '4px',
      },
      '& .MuiTabs-indicator': { display: 'none' },
      '& .MuiTab-root': {
        flex: 1,
        maxWidth: 'none',
        minHeight: 40,
        py: 1,
        px: 2,
        borderRadius: '6px',
        textTransform: 'none',
        fontWeight: 600,
        fontSize: 14,
        letterSpacing: 0,
        color: theme.vars.palette.text.primary,
        bgcolor: 'transparent',
        opacity: 0.72,
        transition: theme.transitions.create(['background-color', 'box-shadow', 'opacity', 'color'], {
          duration: theme.transitions.duration.shorter,
        }),
        '&:hover': {
          opacity: 0.9,
          bgcolor: 'transparent',
        },
      },
      '& .MuiTab-root.Mui-selected': {
        color: theme.vars.palette.text.primary,
        opacity: 1,
        bgcolor: brandVars.elevated,
        boxShadow: `inset 0 0 0 1px ${brandVars.borderDefault}, 0 1px 3px ${varAlpha(theme.vars.palette.common.blackChannel, 0.24)}`,
        '&:hover': {
          bgcolor: brandVars.elevated,
          opacity: 1,
        },
      },
    };
  },
  lessonPanel: {
    mt: 3,
    gap: 3,
    pb: 2,
  },
  qaPanel: {
    mt: 3,
    py: 4,
    px: 1,
  },
  qaText: {
    color: 'text.secondary',
    fontSize: 14,
    lineHeight: 1.6,
  },
  footer: {
    pt: 2,
    mt: 'auto',
    borderTop: '1px solid',
    borderColor: 'divider',
    flexShrink: 0,
  },
  footerButton: {
    px: 2.5,
    py: 1,
    fontWeight: 600,
    textTransform: 'none',
    borderRadius: 1.5,
  },
};
