import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { styles, tabCountBadgeSx } from './styles';

export function StudentProfileCourseTabs({ value, tabs, onChange, heading = 'Enrolled courses' }) {
  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      spacing={{ xs: 1.5, sm: 2 }}
      justifyContent="space-between"
      alignItems={{ xs: 'stretch', sm: 'center' }}
    >
      <Typography variant="h4" sx={styles.heading}>
        {heading}
      </Typography>

      <Tabs
        value={value}
        onChange={(_, nextValue) => onChange(nextValue)}
        variant="scrollable"
        scrollButtons="auto"
        allowScrollButtonsMobile
        sx={styles.tabs}
      >
        {tabs.map((tab) => (
          <Tab
            key={tab.value}
            disableRipple
            value={tab.value}
            label={
              <Stack direction="row" spacing={0.85} alignItems="center">
                <Typography variant="body2" sx={styles.tabLabelTypography}>
                  {tab.label}
                </Typography>
                <Box sx={tabCountBadgeSx(value === tab.value)}>{tab.count}</Box>
              </Stack>
            }
            sx={styles.tabRoot}
          />
        ))}
      </Tabs>
    </Stack>
  );
}
