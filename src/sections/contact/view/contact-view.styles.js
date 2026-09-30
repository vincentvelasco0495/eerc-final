import { varAlpha } from 'minimal-shared/utils';

import { pageContentStyles } from 'src/components/layout/lms-page-shell.styles';

export const styles = {
  root: {
    bgcolor: 'background.default',
  },
  container: {
    py: { xs: 6, md: 10 },
    ...pageContentStyles.maxWidthContent,
  },
  topGrid: {
    alignItems: 'start',
  },
  bottomGrid: {
    alignItems: 'start',
  },
  sectionTitle: {
    mb: 3,
    fontSize: { xs: '1.7rem', md: '2rem' },
    lineHeight: 1.2,
    letterSpacing: '-0.02em',
  },
  infoPanel: {
    borderTop: '1px solid',
    borderColor: 'divider',
  },
  infoRow: {
    py: 3,
    display: 'flex',
    gap: 2,
    alignItems: 'flex-start',
    borderBottom: '1px solid',
    borderColor: 'divider',
  },
  infoIcon: {
    color: (theme) => theme.vars.palette.brand.accentText,
    mt: 0.35,
    flexShrink: 0,
  },
  infoMeta: {
    color: 'text.secondary',
    lineHeight: 1.8,
  },
  locationCard: {
    borderTop: '1px solid',
    borderColor: 'divider',
    pt: 3,
  },
  mapWrap: {
    overflow: 'hidden',
    borderRadius: 0,
    border: '1px solid',
    borderColor: 'divider',
    bgcolor: 'background.paper',
  },
  mapFrame: {
    display: 'block',
    width: 1,
    border: 0,
    height: { xs: 280, md: 325 },
  },
  divider: {
    my: { xs: 5, md: 7 },
    borderColor: 'divider',
  },
  formCard: {
    display: 'grid',
    gap: 3,
  },
  formRow: {
    display: 'grid',
    gap: 2.5,
    gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
  },
  input: {
    '& .MuiOutlinedInput-root': {
      borderRadius: 0,
      bgcolor: (theme) => theme.vars.palette.brand.input,
    },
  },
  textArea: {
    '& .MuiOutlinedInput-root': {
      borderRadius: 0,
      alignItems: 'flex-start',
      bgcolor: (theme) => theme.vars.palette.brand.input,
    },
  },
  submitButton: {
    width: 'fit-content',
    px: 4,
    py: 1.2,
    borderRadius: 999,
    textTransform: 'uppercase',
    boxShadow: 'none',
  },
  formActionsRow: {
    pt: 0,
  },
  contactList: {
    display: 'grid',
    gap: 3,
  },
  personCard: {
    display: 'grid',
    gap: 2,
    gridTemplateColumns: '112px minmax(0, 1fr)',
    alignItems: 'start',
  },
  personImage: {
    width: 112,
    height: 112,
    borderRadius: 0,
    objectFit: 'cover',
    border: '1px solid',
    borderColor: 'divider',
    boxShadow: (theme) => `0 14px 28px ${varAlpha(theme.vars.palette.common.blackChannel, 0.18)}`,
  },
  personMeta: {
    color: 'text.secondary',
    display: 'grid',
    gap: 0.6,
  },
};
