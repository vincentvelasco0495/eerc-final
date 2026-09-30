import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';

import { styles } from './styles';

const VARIANTS = {
  passed: {
    icon: 'solar:check-circle-bold',
    iconSx: { width: 14, height: 14, color: 'common.white' },
    wrapSx: { bgcolor: 'success.main' },
    prefix: 'Passed',
  },
  nonPassed: {
    icon: 'solar:close-circle-bold',
    iconSx: { width: 14, height: 14, color: 'common.white' },
    wrapSx: { bgcolor: 'error.main' },
    prefix: 'Non passed',
  },
  pending: {
    icon: 'solar:clock-circle-bold',
    iconSx: { width: 14, height: 14, color: 'brand.accentText' },
    wrapSx: { bgcolor: 'action.hover' },
    prefix: 'Pending',
  },
};

export function InstructorAssignmentMetricCell({ variant, value }) {
  const cfg = VARIANTS[variant];

  return (
    <Box sx={styles.root}>
      <Box sx={[styles.iconWrap, cfg.wrapSx]}>
        <Iconify icon={cfg.icon} sx={cfg.iconSx} />
      </Box>
      <Typography component="span" sx={styles.label}>
        {cfg.prefix}: {value}
      </Typography>
    </Box>
  );
}
