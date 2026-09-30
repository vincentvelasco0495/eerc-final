import { alpha } from '@mui/material/styles';

export const styles = {
  root: {
    px: { xs: 2, sm: 3 },
    py: 2,
    borderBottom: '1px solid',
    borderColor: 'divider',
    bgcolor: 'background.paper',
  },
  mainStack: {
    flexDirection: { xs: 'column', md: 'row' },
    alignItems: { xs: 'stretch', md: 'center' },
    justifyContent: 'space-between',
  },
  left: { minWidth: 0 },
  backButton: (theme) => ({
    color: 'text.secondary',
    fontWeight: 600,
    flexShrink: 0,
    '&:hover': { bgcolor: alpha(theme.palette.grey[500], 0.08) },
  }),
  divider: { display: { xs: 'none', sm: 'block' } },
  title: {
    fontWeight: 700,
    color: 'text.primary',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  tabsWrap: {
    display: 'flex',
    justifyContent: { xs: 'flex-start', md: 'center' },
    flex: { md: 1 },
    overflowX: 'auto',
  },
  tabs: {
    minHeight: 44,
    '& .MuiTabs-indicator': { height: 3, borderRadius: '3px 3px 0 0' },
    '& .MuiTab-root': {
      minHeight: 44,
      textTransform: 'none',
      fontWeight: 600,
      fontSize: '0.875rem',
      color: 'text.secondary',
      '&.Mui-selected': { color: 'brand.accentText' },
    },
  },
  right: { flexShrink: 0, width: { xs: '100%', md: 'auto' } },
  publishButton: {
    fontWeight: 700,
    boxShadow: 'none',
    flex: { xs: 1, md: 'unset' },
    minWidth: 0,
  },
  viewButton: { fontWeight: 600, flex: { xs: 1, md: 'unset' }, minWidth: 0 },
};
