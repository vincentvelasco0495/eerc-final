/** Course builder → Notice tab */

import { varAlpha } from 'minimal-shared/utils';

import { brandVars } from 'src/theme';

const border = brandVars.borderSubtle;

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

  cardTitle: {
    fontSize: { xs: 22, sm: 26 },
    fontWeight: 700,
    color: brandVars.accentText,
    letterSpacing: '-0.02em',
    mb: 0,
  },

  dividerUnderTitle: {
    borderColor: border,
    my: 2.5,
  },

  footerRow: {
    display: 'flex',
    justifyContent: 'flex-end',
    pt: 2.5,
    mt: 1,
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
