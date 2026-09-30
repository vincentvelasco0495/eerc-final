import Box from '@mui/material/Box';
import Radio from '@mui/material/Radio';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import { Iconify } from 'src/components/iconify';

import { styles, quizColors } from './styles';

function DragDots() {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 4px)',
        gridTemplateRows: 'repeat(3, 4px)',
        gap: '3px',
        width: 16,
        flexShrink: 0,
      }}
      aria-hidden
    >
      {Array.from({ length: 6 }).map((_, i) => (
        <Box
          key={i}
          sx={{
            width: 4,
            height: 4,
            borderRadius: '50%',
            bgcolor: quizColors.muted,
          }}
        />
      ))}
    </Box>
  );
}

export function AnswerItem({
  answer,
  selectedCorrectId,
  onTextChange,
  onSelectCorrect,
  letterMode = false,
}) {
  const isSelected = selectedCorrectId === answer.id;
  const letter = String(answer.text ?? '').trim() || 'A';

  return (
    <Box sx={styles.answerRow}>
      <Box sx={styles.answerRowMain}>
        {letterMode ? (
          <Box sx={styles.letterBadge} aria-hidden>
            <Typography sx={styles.letterBadgeText}>{letter}</Typography>
          </Box>
        ) : (
          <>
            <Box sx={styles.dragHandle} aria-hidden>
              <DragDots />
            </Box>
            <TextField
              variant="outlined"
              size="small"
              fullWidth
              value={answer.text}
              onChange={(e) => onTextChange(answer.id, e.target.value)}
              sx={styles.answerInput}
              placeholder="Answer"
              aria-label={`Answer ${answer.text || 'empty'}`}
            />
            <IconButton size="small" sx={{ color: 'text.secondary', flexShrink: 0 }} aria-label="Edit answer">
              <Iconify icon="solar:pen-linear" width={18} />
            </IconButton>
          </>
        )}
      </Box>
      <Box sx={styles.answerCorrect}>
        <Box component="span" sx={styles.correctLabel}>
          Correct
        </Box>
        <Radio
          checked={isSelected}
          onChange={() => onSelectCorrect(answer.id)}
          value={answer.id}
          color="primary"
          size="small"
          inputProps={{ 'aria-label': `Mark option ${letter} as correct` }}
        />
      </Box>
    </Box>
  );
}
