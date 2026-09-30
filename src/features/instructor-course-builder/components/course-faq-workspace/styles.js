/** Course builder → FAQ tab */

import { varAlpha } from 'minimal-shared/utils';

import { brandVars } from 'src/theme';

export const BORDER = brandVars.borderSubtle;

export const styles = {
  workspaceRoot: {
    flex: 1,
    minHeight: 0,
    overflow: 'auto',
    px: { xs: 2, sm: 2.5 },
    pb: 4,
    pt: { xs: 2, md: 2.5 },
  },

  pageCard: {
    maxWidth: 880,
    width: '100%',
    mx: 'auto',
    bgcolor: 'background.paper',
    border: `1px solid ${BORDER}`,
    borderRadius: '10px',
    boxShadow: (theme) => `0 1px 3px ${varAlpha(theme.vars.palette.common.blackChannel, 0.2)}`,
    p: { xs: 2.5, sm: 3 },
    boxSizing: 'border-box',
  },

  cardTitle: {
    fontSize: { xs: 20, sm: 22 },
    fontWeight: 700,
    color: brandVars.accentText,
    letterSpacing: '-0.015em',
  },

  dividerUnderTitle: {
    borderColor: BORDER,
    my: 2.5,
  },

  metaLabel: {
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    color: 'text.secondary',
    mb: 0.75,
  },

  headlineRow: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 1,
    mb: 1.5,
  },

  headlineRowCollapsed: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 1,
    mb: 0,
  },

  headlineText: {
    fontSize: 16,
    fontWeight: 600,
    color: 'text.primary',
    lineHeight: 1.35,
    pr: 1,
    cursor: 'default',
    userSelect: 'none',
  },

  faqToolbar: {
    display: 'flex',
    alignItems: 'center',
    gap: 0.25,
    flexShrink: 0,
  },

  toolbarBtn: {
    color: 'text.secondary',
    '&:hover': { bgcolor: 'action.hover' },
  },

  block: {
    borderBottom: `1px solid ${BORDER}`,
    pb: 2.5,
    mb: 2.5,
    '&:last-of-type': {
      borderBottom: 'none',
      pb: 0,
      mb: 2,
    },
  },

  fieldLabel: {
    fontSize: 13,
    fontWeight: 700,
    color: 'text.primary',
    mb: 0.5,
    display: 'block',
    mt: 1.75,
    '&:first-of-type': { mt: 0 },
  },

  footerRow: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 2,
    pt: 1,
    mt: 1,
    borderTop: `1px solid ${BORDER}`,
  },

  addBtn: {
    textTransform: 'none',
    fontWeight: 600,
    px: 2.5,
    py: 1,
    borderRadius: '8px',
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
