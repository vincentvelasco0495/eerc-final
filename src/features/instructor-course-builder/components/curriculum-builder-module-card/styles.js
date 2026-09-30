import { varAlpha } from 'minimal-shared/utils';

import { brandVars } from 'src/theme';

export const styles = {
  card: (theme) => ({
    p: 0,
    borderRadius: 2,
    border: '1px solid',
    borderColor: 'divider',
    boxShadow: `0 4px 24px ${varAlpha(theme.vars.palette.common.blackChannel, 0.16)}`,
    bgcolor: 'background.paper',
    overflow: 'hidden',
    transition: 'box-shadow 0.15s ease, opacity 0.15s ease, transform 0.15s ease',
  }),
  cardDragging: (theme) => ({
    opacity: 0.5,
    transform: 'scale(0.995)',
    boxShadow: `0 2px 12px ${varAlpha(theme.vars.palette.common.blackChannel, 0.45)}`,
  }),
  cardDropTop: (theme) => ({
    boxShadow: `inset 0 3px 0 ${theme.vars.palette.primary.main}`,
  }),
  cardDropBottom: (theme) => ({
    boxShadow: `inset 0 -3px 0 ${theme.vars.palette.primary.main}`,
  }),
  header: (theme) => ({
    px: 1.75,
    py: 1.25,
    cursor: 'pointer',
    userSelect: 'none',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 1.25,
    '&:hover': {
      bgcolor: theme.vars.palette.action.hover,
    },
    '& .module-header-actions': {
      opacity: 0,
      visibility: 'hidden',
      transition: 'opacity 0.2s ease, visibility 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      flexShrink: 0,
    },
    '&:hover .module-header-actions, &:focus-within .module-header-actions': {
      opacity: 1,
      visibility: 'visible',
    },
  }),
  headerLeft: {
    flex: 1,
    minWidth: 0,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 1.25,
  },
  headerRight: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 1,
    flexShrink: 0,
  },
  title: { fontWeight: 700, flex: 1, minWidth: 0 },
  expandButton: {
    width: 32,
    height: 32,
    bgcolor: brandVars.elevated,
    color: 'text.secondary',
    '&:hover': { bgcolor: brandVars.hover },
  },
  deleteButton: (theme) => ({
    flexShrink: 0,
    opacity: 1,
    color: 'text.secondary',
    '&:hover': {
      color: 'error.main',
      bgcolor: varAlpha(theme.vars.palette.error.mainChannel, 0.08),
    },
  }),
  editTitleButton: (theme) => ({
    flexShrink: 0,
    opacity: 1,
    color: 'text.secondary',
    '&:hover': {
      color: theme.vars.palette.brand.accentText,
      bgcolor: varAlpha(theme.vars.palette.primary.mainChannel, 0.08),
    },
  }),
  lessons: { px: 1, pb: 1.5, pt: 0.5 },
};
