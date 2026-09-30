import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import { toast } from 'src/components/snackbar';

import { styles } from './styles';
import { FaqItemRow } from './faq-item-row';

function faqId() {
  return globalThis.crypto?.randomUUID?.() ?? `faq-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

const SAMPLE_ANSWER = `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.`;

const INITIAL_ITEMS = [
  {
    id: 'faq-demo-1',
    question: 'What is Lorem Ipsum?',
    answer: SAMPLE_ANSWER,
    expanded: true,
  },
  {
    id: 'faq-demo-2',
    question: 'Why do we use it?',
    answer:
      'It is a long established fact that a reader will be distracted by readable content of a page when looking at its layout.',
    expanded: false,
  },
];

/**
 * FAQ tab — demo mode uses local state; live LMS passes `items` + `onItemsChange` + `onPersist`.
 */
export function CourseFaqWorkspace({ items: controlledItems, onItemsChange, onPersist } = {}) {
  const [internalItems, setInternalItems] = useState(() => INITIAL_ITEMS.map((item) => ({ ...item })));

  const isControlled = Array.isArray(controlledItems) && typeof onItemsChange === 'function';
  const items = isControlled ? controlledItems : internalItems;

  const setItems = useCallback(
    (updater) => {
      if (isControlled) {
        onItemsChange((prev) => updater(Array.isArray(prev) ? prev : []));
      } else {
        setInternalItems((prev) => updater(prev));
      }
    },
    [isControlled, onItemsChange]
  );

  const toggleExpanded = useCallback(
    (id) => {
      setItems((prev) =>
        prev.map((row) => (row.id === id ? { ...row, expanded: !row.expanded } : row))
      );
    },
    [setItems]
  );

  const patchRow = useCallback(
    (id, partial) => {
      setItems((prev) => prev.map((row) => (row.id === id ? { ...row, ...partial } : row)));
    },
    [setItems]
  );

  const handleDelete = useCallback(
    (id) => {
      setItems((prev) => prev.filter((row) => row.id !== id));
    },
    [setItems]
  );

  const addQuestion = useCallback(() => {
    setItems((prev) => [
      ...prev.map((row) => ({ ...row, expanded: false })),
      {
        id: faqId(),
        question: '',
        answer: '',
        expanded: true,
      },
    ]);
  }, [setItems]);

  const handleSave = useCallback(async () => {
    if (onPersist) {
      try {
        await onPersist();
      } catch (e) {
        toast.error(e?.message ?? 'Save failed.');
      }
    } else {
      toast.success('FAQ saved (demo).');
    }
  }, [onPersist]);

  return (
    <Box sx={styles.workspaceRoot}>
      <Box sx={styles.pageCard}>
        <Typography sx={styles.cardTitle} component="h2">
          Frequently Asked Questions
        </Typography>
        <Divider sx={styles.dividerUnderTitle} />

        <Box sx={{ pb: 0 }}>
          {items.map((row, index) => (
            <FaqItemRow
              key={row.id}
              itemId={row.id}
              index={index}
              question={row.question}
              answer={row.answer}
              expanded={row.expanded}
              onToggleExpanded={() => toggleExpanded(row.id)}
              onQuestionChange={(v) => patchRow(row.id, { question: v })}
              onAnswerChange={(v) => patchRow(row.id, { answer: v })}
              onDelete={() => handleDelete(row.id)}
              disableDelete={items.length <= 1}
            />
          ))}
        </Box>

        <Box sx={styles.footerRow}>
          <Button variant="outlined" color="primary" sx={styles.addBtn} onClick={addQuestion}>
            Add new question
          </Button>
          <Button variant="contained" color="primary" sx={styles.saveBtn} onClick={handleSave}>
            Save
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
