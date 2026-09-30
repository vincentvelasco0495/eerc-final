import Box from '@mui/material/Box';

import { styles } from './styles';

const TAB_IDS = ['questions', 'settings'];

const LABELS = {
  questions: 'Questions',
  settings: 'Settings',
};

export function QuizTabs({ activeTab, onTabChange, questionCount }) {
  return (
    <Box sx={styles.tabsWrap} role="tablist" aria-label="Quiz sections">
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
            {id === 'questions' ? (
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
