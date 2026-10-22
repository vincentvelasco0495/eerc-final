import { useState, useEffect } from 'react';

import Radio from '@mui/material/Radio';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import RadioGroup from '@mui/material/RadioGroup';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import FormControlLabel from '@mui/material/FormControlLabel';

import {
  learningModeFamilyLabel,
  LEARNING_MODE_SWITCH_OPTIONS,
  learningModeSwitchEffectCopy,
  enrollmentLearningModeFamily,
} from 'src/features/enrollment/utils/enrollment-learning-mode';

import { useFullScreenDialog, stackedDialogActionsSx } from './use-full-screen-dialog';

export function EnrollmentSwitchLearningModeDialog({
  open,
  row,
  submitting = false,
  onClose,
  onConfirm,
}) {
  const fullScreen = useFullScreenDialog();
  const currentFamily = enrollmentLearningModeFamily(row);
  const [selected, setSelected] = useState('');

  useEffect(() => {
    if (open) {
      setSelected(currentFamily ?? '');
    }
  }, [open, currentFamily]);

  const programTitle = row?.programTitle || row?.programId || 'this program';
  const canSubmit = Boolean(selected) && selected !== currentFamily;

  return (
    <Dialog
      open={open}
      onClose={submitting ? undefined : onClose}
      maxWidth="sm"
      fullWidth
      fullScreen={fullScreen}
    >
      <DialogTitle>Switch mode of learning</DialogTitle>
      <DialogContent dividers>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Choose a mode of learning for {programTitle}. Related enrollments for the same program
          will be updated too.
        </Typography>
        <FormControl>
          <RadioGroup
            name="learning-mode"
            value={selected}
            onChange={(event) => setSelected(event.target.value)}
          >
            {LEARNING_MODE_SWITCH_OPTIONS.map((option) => (
              <FormControlLabel
                key={option.id}
                value={option.id}
                control={<Radio />}
                label={
                  option.id === currentFamily ? `${option.label} (current)` : option.label
                }
              />
            ))}
          </RadioGroup>
        </FormControl>
        {selected ? (
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1.5 }}>
            {learningModeSwitchEffectCopy(selected)}
          </Typography>
        ) : null}
      </DialogContent>
      <DialogActions sx={stackedDialogActionsSx}>
        <Button onClick={onClose} disabled={submitting}>
          Cancel
        </Button>
        <Button
          variant="contained"
          disabled={submitting || !canSubmit}
          onClick={() => onConfirm?.(selected)}
        >
          {submitting ? 'Switching…' : `Switch to ${learningModeFamilyLabel(selected)}`}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
