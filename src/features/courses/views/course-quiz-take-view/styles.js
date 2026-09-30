import { alpha } from '@mui/material/styles';

export const rootSx = {
  flex: 1,
  minHeight: 0,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  py: { xs: 2, sm: 3 },
  px: { xs: 2, sm: 3 },
};

export const columnSx = {
  width: '100%',
  maxWidth: 720,
};

export function headerRowSx(theme) {
  return {
    display: 'flex',
    flexDirection: { xs: 'column', sm: 'row' },
    alignItems: { xs: 'stretch', sm: 'flex-end' },
    justifyContent: 'space-between',
    gap: 2,
    mb: 3,
  };
}

export function timerBoxSx(theme) {
  return {
    alignSelf: { xs: 'flex-end', sm: 'center' },
    flexShrink: 0,
    px: 2,
    py: 1,
    borderRadius: 2,
    border: '1px solid',
    borderColor: 'divider',
    bgcolor: alpha(theme.palette.common.white, 0.06),
    minWidth: 88,
    textAlign: 'center',
  };
}

export const postResultActionsSx = {
  mb: 2,
  width: '100%',
  maxWidth: '100%',
};

export const resultActionBtnSx = {
  px: 2.5,
  py: 1,
  minHeight: 40,
  textTransform: 'none',
  fontWeight: 600,
  borderRadius: 1,
  alignSelf: { xs: 'stretch', sm: 'center' },
  whiteSpace: 'nowrap',
  flexShrink: 0,
};

export function resultBannerSx(theme, tone) {
  if (tone === 'success') {
    return {
      borderRadius: 2,
      p: 2.5,
      mb: 3,
      display: 'flex',
      flexDirection: { xs: 'column', sm: 'row' },
      alignItems: { sm: 'center' },
      justifyContent: 'space-between',
      gap: 2,
      bgcolor: alpha(theme.palette.success.main, 0.16),
      border: '1px solid',
      borderColor: alpha(theme.palette.success.main, 0.35),
    };
  }
  if (tone === 'error') {
    return {
      borderRadius: 2,
      p: 2.5,
      mb: 3,
      display: 'flex',
      flexDirection: { xs: 'column', sm: 'row' },
      alignItems: { sm: 'center' },
      justifyContent: 'space-between',
      gap: 2,
      bgcolor: alpha(theme.palette.error.main, 0.16),
      border: '1px solid',
      borderColor: alpha(theme.palette.error.main, 0.4),
    };
  }
  return {};
}

export function optionRowSx(theme, { feedbackActive, isSelected, isCorrect, highlightCorrect }) {
  if (!feedbackActive) {
    return {
      justifyContent: 'flex-start',
      textAlign: 'left',
      py: 1.25,
      px: 2,
      borderRadius: 1.5,
      borderColor: isSelected ? 'primary.main' : 'divider',
      bgcolor: isSelected ? alpha(theme.palette.primary.main, 0.12) : 'background.paper',
    };
  }
  if (isCorrect && highlightCorrect) {
    return {
      justifyContent: 'flex-start',
      textAlign: 'left',
      py: 1.25,
      px: 2,
      borderRadius: 1.5,
      borderColor: alpha(theme.palette.info.main, 0.55),
      bgcolor: alpha(theme.palette.info.main, 0.12),
    };
  }
  if (isSelected && !isCorrect) {
    return {
      justifyContent: 'flex-start',
      textAlign: 'left',
      py: 1.25,
      px: 2,
      borderRadius: 1.5,
      borderColor: alpha(theme.palette.error.main, 0.55),
      bgcolor: alpha(theme.palette.error.main, 0.14),
    };
  }
  return {
    justifyContent: 'flex-start',
    textAlign: 'left',
    py: 1.25,
    px: 2,
    borderRadius: 1.5,
    borderColor: 'divider',
    opacity: 0.72,
  };
}

export const bottomBarSx = (theme) => ({
  position: 'sticky',
  bottom: 0,
  left: 0,
  right: 0,
  mt: 'auto',
  py: 2,
  px: { xs: 2, sm: 0 },
  mx: { xs: -2, sm: 0 },
  borderTop: '1px solid',
  borderColor: 'divider',
  bgcolor: alpha(theme.palette.background.default, 0.92),
  backdropFilter: 'blur(8px)',
});
