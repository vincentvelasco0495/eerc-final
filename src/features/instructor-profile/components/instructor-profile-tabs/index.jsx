import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

import { tabSx, styles } from './styles';

export function InstructorProfileTabs({ value, tabs, onChange }) {
  return (
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
          label={tab.label}
          sx={tabSx(value === tab.value)}
        />
      ))}
    </Tabs>
  );
}
