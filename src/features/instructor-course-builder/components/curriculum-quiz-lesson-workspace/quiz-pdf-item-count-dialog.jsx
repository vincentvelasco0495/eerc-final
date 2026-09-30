import { useState, useEffect } from 'react';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';

import { QUIZ_PDF_MAX_ITEMS, parseQuizPdfItemCount } from '../../utils/quiz-pdf-constants';

export function QuizPdfItemCountDialog({
  open,
  fileName = '',
  pageCount = null,
  defaultCount = '',
  onCancel,
  onConfirm,
}) {
  const [value, setValue] = useState(String(defaultCount ?? ''));

  useEffect(() => {
    if (open) {
      setValue(String(defaultCount ?? ''));
    }
  }, [defaultCount, open]);

  const parsed = parseQuizPdfItemCount(value);
  const pageHint =
    Number.isInteger(pageCount) && pageCount > 0
      ? `This PDF has ${pageCount} page${pageCount === 1 ? '' : 's'}. `
      : '';

  const submit = () => {
    if (parsed == null) {
      return;
    }
    onConfirm?.(parsed);
  };

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            bgcolor: 'background.paper',
            backgroundImage: 'none',
            border: '1px solid',
            borderColor: 'divider',
          },
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: 700 }}>How many items are in this PDF?</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ mb: 2, color: 'text.primary' }}>
          {pageHint}
          {fileName ? `File: ${fileName}. ` : ''}
          We will create that many questions, each with A, B, C, and D. The full PDF is shown on every
          item (nothing is cropped). Mark the correct letter on each item after import, then Save.
        </DialogContentText>
        <TextField
          autoFocus
          fullWidth
          type="number"
          label="Total items"
          placeholder="e.g. 50"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              submit();
            }
          }}
          error={value !== '' && parsed == null}
          helperText={`Enter a number from 1 to ${QUIZ_PDF_MAX_ITEMS}.`}
          slotProps={{
            htmlInput: { min: 1, max: QUIZ_PDF_MAX_ITEMS, step: 1 },
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button color="inherit" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="contained" disabled={parsed == null} onClick={submit}>
          Create items
        </Button>
      </DialogActions>
    </Dialog>
  );
}
