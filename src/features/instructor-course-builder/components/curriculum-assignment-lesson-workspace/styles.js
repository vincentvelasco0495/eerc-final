import { brandVars } from 'src/theme';

import { styles as quizStyles } from '../curriculum-quiz-lesson-workspace/styles';

export const styles = {
  ...quizStyles,
  root: {
    ...quizStyles.root,
    flex: 1,
    width: '100%',
    maxWidth: '100%',
    minWidth: 0,
    alignSelf: 'stretch',
    p: 0,
    bgcolor: brandVars.surface,
  },
  settingsRoot: {
    ...quizStyles.quizSettingsRoot,
    width: '100%',
    px: { xs: 2, sm: 2.5, md: 3 },
    boxSizing: 'border-box',
  },
  settingsCard: {
    ...quizStyles.quizSettingsCard,
    maxWidth: 'none',
    width: '100%',
    mx: 0,
    border: 'none',
    borderRadius: 0,
    boxShadow: 'none',
    p: 0,
  },
  tabsRow: {
    ...quizStyles.tabsRow,
    px: { xs: 2, sm: 2.5, md: 3 },
    boxSizing: 'border-box',
    width: '100%',
  },
  tabsWrap: {
    ...quizStyles.tabsWrap,
    flex: '1 1 100%',
    maxWidth: '100%',
  },
  header: {
    ...quizStyles.header,
    borderRadius: 0,
    width: '100%',
  },
  footer: {
    ...quizStyles.footer,
    px: { xs: 2, sm: 2.5, md: 3 },
    pb: { xs: 2, sm: 2.5 },
    boxSizing: 'border-box',
    width: '100%',
  },
  contentCreateRow: {
    display: 'flex',
    justifyContent: 'flex-end',
    pt: 2,
    mt: 0.5,
  },
  contentCreateBtn: {
    textTransform: 'none',
    fontWeight: 600,
    fontSize: 14,
    px: 2.5,
    py: 1,
    borderRadius: '999px',
  },
  questionsToolbar: {
    display: 'flex',
    justifyContent: 'flex-end',
    px: { xs: 2, sm: 2.5, md: 3 },
    pt: 0,
    pb: 1,
    boxSizing: 'border-box',
  },
  questionsColumn: {
    ...quizStyles.mainColumn,
    flex: 1,
    px: { xs: 2, sm: 2.5, md: 3 },
    boxSizing: 'border-box',
  },
  questionsFooter: {
    ...quizStyles.footer,
    px: { xs: 2, sm: 2.5, md: 3 },
    pb: { xs: 2, sm: 2.5 },
    boxSizing: 'border-box',
    width: '100%',
  },
};
