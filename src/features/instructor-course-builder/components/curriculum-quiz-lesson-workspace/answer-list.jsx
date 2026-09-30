import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';

import { styles } from './styles';
import { AnswerItem } from './answer-item';

export function AnswerList({
  answers,
  correctAnswerId,
  onAnswerTextChange,
  onCorrectChange,
  newAnswerDraft,
  onNewAnswerDraftChange,
  onAddAnswer,
  embedded = false,
  letterMode = false,
}) {
  const wrapSx = embedded ? styles.answersInCard : styles.answersSection;

  return (
    <Box sx={wrapSx}>
      <Box sx={styles.answersHead}>
        <Typography sx={styles.answersTitle}>Answers</Typography>
        {letterMode ? null : (
          <Box sx={styles.answersTools}>
            <IconButton size="small" sx={styles.answerToolBtn} aria-label="List view">
              <Iconify icon="solar:list-linear" width={20} />
            </IconButton>
            <IconButton size="small" sx={styles.answerToolBtn} aria-label="Grid view">
              <Iconify icon="solar:widget-4-linear" width={20} />
            </IconButton>
          </Box>
        )}
      </Box>
      <Box sx={styles.answerList}>
        {answers.map((a) => (
          <AnswerItem
            key={a.id}
            answer={a}
            selectedCorrectId={correctAnswerId}
            onTextChange={onAnswerTextChange}
            onSelectCorrect={onCorrectChange}
            letterMode={letterMode}
          />
        ))}
      </Box>
      {letterMode ? null : (
        <Box sx={styles.addAnswerRow}>
          <TextField
            variant="standard"
            placeholder="Add new answer"
            value={newAnswerDraft}
            onChange={(e) => onNewAnswerDraftChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                onAddAnswer();
              }
            }}
            InputProps={{ disableUnderline: true }}
            sx={{ flex: 1, '& input': { fontSize: 14 } }}
            aria-label="New answer"
          />
          <IconButton sx={styles.addAnswerPlusBtn} onClick={onAddAnswer} aria-label="Add answer">
            <Iconify icon="mingcute:add-line" width={22} sx={{ color: 'primary.contrastText' }} />
          </IconButton>
        </Box>
      )}
    </Box>
  );
}
