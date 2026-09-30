import { pageContentStyles } from 'src/components/layout/lms-page-shell.styles';

import { pageBackground } from './sections/shared/theme';

export const styles = {
  root: {
    bgcolor: (theme) => pageBackground(theme),
    ...pageContentStyles.homeContainers,
  },
};
