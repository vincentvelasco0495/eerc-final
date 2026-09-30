import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { styles } from './styles';
import { QuestionCardChrome } from './question-card-chrome';

function stemPreviewPlainText(html) {
  const raw = typeof html === 'string' ? html : '';
  if (!raw.trim()) return '';
  if (typeof document !== 'undefined') {
    try {
      const div = document.createElement('div');
      div.innerHTML = raw;
      const text = div.textContent?.replace(/\u00a0/g, ' ').trim() ?? '';
      if (text) return text;
    } catch {
      /* fallback below */
    }
  }
  return raw.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

export function QuestionCollapsedBar({
  questionText,
  imageName,
  collapsed,
  onToggleCollapse,
  onDelete,
  dragHandleRef,
}) {
  const preview = stemPreviewPlainText(questionText ?? '');
  const displayText = preview || imageName?.trim() || 'Image question';

  return (
    <Box sx={styles.questionCollapsedBar}>
      <Box sx={styles.collapsedBarLeft}>
        <Typography sx={styles.collapsedQuestionText} title={displayText}>
          {displayText}
        </Typography>
      </Box>
      <QuestionCardChrome
        variant="inline"
        collapsed={collapsed}
        onToggleCollapse={onToggleCollapse}
        onDelete={onDelete}
        dragHandleRef={dragHandleRef}
      />
    </Box>
  );
}
