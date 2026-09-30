import Box from '@mui/material/Box';

import { styles } from './styles';

const TAB_IDS = ['assignment', 'qa'];

const LABELS = {
  assignment: 'Assignment',
  qa: 'Questions',
};

export function AssignmentTabs({ activeTab, onTabChange, questionCount = 0 }) {
  return (
    <Box sx={styles.tabsWrap} role="tablist" aria-label="Assignment sections">
      {TAB_IDS.map((id) => {
        const active = activeTab === id;
        return (
          <Box
            key={id}
            component="button"
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onTabChange(id)}
            sx={[styles.tabBtn, active ? styles.tabBtnActive : styles.tabBtnIdle]}
          >
            {id === 'qa' ? (
              <Box component="span" sx={styles.tabLabelRow}>
                {LABELS[id]}
                <Box
                  component="span"
                  sx={[
                    styles.tabCountBadge,
                    active ? styles.tabCountBadgeActive : styles.tabCountBadgeIdle,
                  ]}
                >
                  {questionCount}
                </Box>
              </Box>
            ) : (
              LABELS[id]
            )}
          </Box>
        );
      })}
    </Box>
  );
}
