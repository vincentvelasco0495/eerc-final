import { brandVars } from 'src/theme';

export const styles = {
  shell: {
    mx: { xs: -2, sm: -2.5 },
    mt: -2.5,
    px: { xs: 2, sm: 2.5 },
    pt: 2,
    pb: 2,
    mb: 0,
    bgcolor: brandVars.section,
    borderBottom: '1px solid',
    borderColor: 'divider',
  },
  inner: {
    flexDirection: { xs: 'column', md: 'row' },
    alignItems: { xs: 'stretch', md: 'center' },
    gap: { xs: 1.5, md: 2 },
  },
  typeBlock: {
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    gap: 1.25,
    minWidth: { md: 168 },
  },
  typeIconWrap: {
    width: 36,
    height: 36,
    borderRadius: '50%',
    bgcolor: 'warning.main',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  typeTitle: {
    fontWeight: 700,
    fontSize: 15,
    color: 'text.primary',
  },
  nameField: {
    flex: 1,
    '& .MuiOutlinedInput-root': { bgcolor: 'background.paper' },
  },
  createButton: {
    flexShrink: 0,
    px: 2.5,
    py: 1,
    fontWeight: 600,
    textTransform: 'none',
    borderRadius: 1.5,
  },
};
