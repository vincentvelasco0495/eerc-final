import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import Collapse from '@mui/material/Collapse';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';

import { Editor } from 'src/components/editor';
import { Iconify } from 'src/components/iconify';

import { styles } from './styles';
import { CurriculumDragHandle } from '../curriculum-drag-handle';

const QUESTION_TYPES = [{ value: 'multiple_choice', label: 'Multiple choice' }];

export function QuizQuestionCard({ question, onUpdate, onDelete, canDelete }) {
  const [expanded, setExpanded] = useState(true);
  const [newAnswerText, setNewAnswerText] = useState('');

  /** Partial updates only — parent merges into question so debounced editor cannot wipe answers. */
  const patch = useCallback((partial) => onUpdate(partial), [onUpdate]);

  const setStemHtml = useCallback((html) => patch({ stemHtml: html }), [patch]);

  const setCorrectOnly = useCallback(
    (answerId) => {
      patch({
        answers: question.answers.map((a) => ({ ...a, correct: a.id === answerId })),
      });
    },
    [patch, question.answers]
  );

  const updateAnswerText = useCallback(
    (answerId, text) => {
      patch({
        answers: question.answers.map((a) => (a.id === answerId ? { ...a, text } : a)),
      });
    },
    [patch, question.answers]
  );

  const addAnswer = useCallback(() => {
    const t = newAnswerText.trim();
    if (!t) return;
    patch({
      answers: [
        ...question.answers,
        { id: `ans-${Date.now()}`, text: t, correct: false },
      ],
    });
    setNewAnswerText('');
  }, [newAnswerText, patch, question.answers]);

  const removeTag = useCallback(
    (tag) => {
      patch({ tags: question.tags.filter((x) => x !== tag) });
    },
    [patch, question.tags]
  );

  return (
    <Box sx={styles.card}>
      <Box sx={styles.cardHeader}>
        <Box sx={styles.imagePlaceholder}>
          <Iconify icon="solar:gallery-add-bold" width={22} sx={{ color: 'text.disabled' }} />
        </Box>
        <Box sx={styles.headerActions}>
          <IconButton
            size="small"
            sx={styles.deleteBtn}
            disabled={!canDelete}
            onClick={onDelete}
            aria-label="Delete question"
          >
            <Iconify icon="solar:trash-bin-trash-bold" width={20} />
          </IconButton>
          <Box sx={styles.answerDrag} aria-hidden>
            <CurriculumDragHandle />
          </Box>
          <IconButton
            size="small"
            sx={styles.iconBtn}
            onClick={() => setExpanded((v) => !v)}
            aria-label={expanded ? 'Collapse' : 'Expand'}
          >
            <Iconify
              icon={expanded ? 'eva:chevron-up-fill' : 'eva:chevron-down-fill'}
              width={22}
            />
          </IconButton>
        </Box>
      </Box>

      <Collapse in={expanded}>
        <Box sx={styles.editorWrap}>
          <Editor
            key={`${question.id}-editor`}
            value={question.stemHtml}
            onChange={setStemHtml}
            placeholder="Enter your question…"
            chrome="tinymce"
            sx={{ minHeight: 220, maxHeight: 480 }}
            tinymceResizeBounds={{ min: 120, max: 480 }}
          />
        </Box>

        <Stack sx={styles.metaRow}>
          <FormControl size="small" sx={styles.typeSelect}>
            <InputLabel id={`qt-${question.id}`}>Type</InputLabel>
            <Select
              labelId={`qt-${question.id}`}
              value={question.questionType}
              label="Type"
              onChange={(e) => patch({ questionType: e.target.value })}
            >
              {QUESTION_TYPES.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Stack direction="row" flexWrap="wrap" gap={0.75} useFlexGap>
            {question.tags.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                onDelete={() => removeTag(tag)}
                color="primary"
                variant="soft"
                size="small"
                sx={styles.chip}
              />
            ))}
          </Stack>

          <FormControlLabel
            control={
              <Switch
                size="small"
                checked={question.required}
                onChange={(e) => patch({ required: e.target.checked })}
                color="primary"
              />
            }
            label="Required Question"
            sx={{ m: 0, '& .MuiFormControlLabel-label': { fontSize: 14, fontWeight: 500 } }}
          />
        </Stack>

        <Box sx={styles.answersSection}>
          <Box sx={styles.answersHeader}>
            <Typography sx={styles.answersLabel}>Answers</Typography>
            <Stack direction="row" spacing={0.5}>
              <IconButton size="small" sx={styles.iconBtn} aria-label="List view">
                <Iconify icon="solar:list-bold" width={20} />
              </IconButton>
              <IconButton size="small" sx={styles.iconBtn} aria-label="Grid view">
                <Iconify icon="solar:widget-4-bold" width={20} />
              </IconButton>
            </Stack>
          </Box>

          {question.answers.map((a) => (
            <Box key={a.id} sx={styles.answerRow}>
              <Box sx={styles.answerDrag} aria-hidden>
                <CurriculumDragHandle />
              </Box>
              <TextField
                size="small"
                value={a.text}
                onChange={(e) => updateAnswerText(a.id, e.target.value)}
                fullWidth
                sx={styles.answerField}
              />
              <IconButton size="small" sx={styles.iconBtn} aria-label="Edit answer">
                <Iconify icon="solar:pen-bold-duotone" width={18} />
              </IconButton>
              <Box sx={styles.correctBox}>
                <Typography sx={styles.correctLabel}>Correct</Typography>
                <Checkbox
                  size="small"
                  checked={a.correct}
                  onChange={() => setCorrectOnly(a.id)}
                  color="primary"
                />
              </Box>
            </Box>
          ))}

          <Box sx={styles.addAnswerRow}>
            <TextField
              size="small"
              fullWidth
              placeholder="Add new answer"
              value={newAnswerText}
              onChange={(e) => setNewAnswerText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addAnswer();
                }
              }}
            />
            <Button variant="contained" color="primary" onClick={addAnswer} sx={{ flexShrink: 0 }}>
              Add
            </Button>
          </Box>
        </Box>
      </Collapse>
    </Box>
  );
}
