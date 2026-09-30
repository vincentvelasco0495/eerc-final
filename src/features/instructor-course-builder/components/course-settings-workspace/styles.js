/** Instructor course Settings tab (Course info + continuation sections). */

import { varAlpha } from 'minimal-shared/utils';

import { brandVars } from 'src/theme';

const border = brandVars.borderSubtle;
const muted = brandVars.textMuted;
const accentHeading = brandVars.accentText;

export const css = {
  /** Scroll area under top bar */
  workspaceRoot: {
    flex: 1,
    minHeight: 0,
    overflow: 'auto',
    px: { xs: 2, sm: 2.5 },
    pb: 4,
    pt: { xs: 2, md: 2.5 },
  },

  /** Centered raised card like MasterStudy Main */
  pageCard: {
    maxWidth: 920,
    width: '100%',
    mx: 'auto',
    bgcolor: 'background.paper',
    border: `1px solid ${border}`,
    borderRadius: '10px',
    boxShadow: (theme) => `0 1px 3px ${varAlpha(theme.vars.palette.common.blackChannel, 0.2)}`,
    p: { xs: 2.5, sm: 3, md: 3.5 },
    boxSizing: 'border-box',
  },

  pageTitle: {
    fontSize: { xs: 22, sm: 26 },
    fontWeight: 700,
    color: 'text.primary',
    letterSpacing: '-0.02em',
    mb: 2,
  },

  sectionHeadingCourseInfo: {
    fontSize: 15,
    fontWeight: 700,
    color: accentHeading,
    mb: 2.5,
    mt: 0,
  },

  sectionHeadingMuted: {
    fontSize: 15,
    fontWeight: 700,
    color: accentHeading,
    mb: 1.75,
    mt: 0,
  },

  fieldLabel: {
    fontSize: 13,
    fontWeight: 700,
    color: 'text.primary',
    display: 'block',
    mb: 0.75,
  },

  urlHelper: {
    fontSize: 12,
    color: muted,
    wordBreak: 'break-all',
    mb: 0.5,
  },

  dividerSection: {
    border: 'none',
    borderTop: `1px solid ${border}`,
    my: { xs: 3, md: 3.5 },
  },

  avatarWithName: {
    display: 'flex',
    alignItems: 'center',
    gap: 1.5,
    minHeight: 40,
    mt: 0.5,
  },

  imageDropzone: {
    mt: 0.75,
    border: `2px dashed ${brandVars.borderDefault}`,
    borderRadius: '10px',
    overflow: 'hidden',
    bgcolor: brandVars.sunken,
    position: 'relative',
    '& img': {
      display: 'block',
      width: '100%',
      height: 'auto',
      maxHeight: 320,
      objectFit: 'cover',
    },
  },

  imageDropzoneEmpty: {
    minHeight: 180,
  },

  quotaAlert: {
    mt: 1.25,
    alignItems: 'flex-start',
    '& .MuiAlert-message': {
      py: 0,
    },
  },

  footerRow: {
    display: 'flex',
    justifyContent: 'flex-end',
    mt: 3,
    pt: 2,
    borderTop: `1px solid ${border}`,
  },

  saveBtn: {
    textTransform: 'none',
    fontWeight: 600,
    fontSize: 15,
    px: 4,
    py: 1.125,
    borderRadius: '8px',
  },
};
