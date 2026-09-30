import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import { Iconify } from 'src/components/iconify';

import { styles } from './styles';

export function FaqItemRow({
  itemId,
  index,
  question,
  answer,
  expanded,
  onToggleExpanded,
  onQuestionChange,
  onAnswerChange,
  onDelete,
  disableDelete,
}) {
  const n = index + 1;

  return (
    <Box component="article" sx={styles.block}>
      <Typography sx={styles.metaLabel} component="span">
        Question {n}
      </Typography>

      <Box sx={expanded ? styles.headlineRow : styles.headlineRowCollapsed}>
        <Typography sx={styles.headlineText}>{question.trim() || 'Untitled question'}</Typography>
        <Box sx={styles.faqToolbar}>
          <IconButton
            size="small"
            sx={styles.toolbarBtn}
            aria-label={`Delete question ${n}`}
            disabled={disableDelete}
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            <Iconify icon="solar:trash-bin-trash-bold" width={22} />
          </IconButton>
          <IconButton
            size="small"
            sx={styles.toolbarBtn}
            aria-expanded={expanded}
            aria-label={expanded ? 'Collapse question' : 'Expand question'}
            onClick={onToggleExpanded}
          >
            <Iconify
              icon={expanded ? 'eva:chevron-up-fill' : 'eva:chevron-down-fill'}
              width={24}
              sx={{ color: 'text.secondary' }}
            />
          </IconButton>
        </Box>
      </Box>

      <Collapse in={expanded} timeout={220} unmountOnExit={false}>
        <Box sx={{ mt: 1 }}>
          <Typography sx={styles.fieldLabel} component="label" htmlFor={`faq-q-${itemId}`}>
            Question
          </Typography>
          <TextField
            id={`faq-q-${itemId}`}
            fullWidth
            size="small"
            value={question}
            onChange={(e) => onQuestionChange(e.target.value)}
          />
          <Typography sx={styles.fieldLabel} component="label" htmlFor={`faq-a-${itemId}`}>
            Answer
          </Typography>
          <TextField
            id={`faq-a-${itemId}`}
            multiline
            fullWidth
            minRows={5}
            value={answer}
            onChange={(e) => onAnswerChange(e.target.value)}
          />
        </Box>
      </Collapse>
    </Box>
  );
}
