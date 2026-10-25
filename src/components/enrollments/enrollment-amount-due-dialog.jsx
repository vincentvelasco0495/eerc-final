import { useState, useEffect } from 'react';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';

import { lmsApi } from 'src/redux/api/lmsApi';
import { getLmsAxiosErrorMessage } from 'src/lib/lms-instructor-api';
import { programAmountTargets } from 'src/features/enrollment/utils/enrollment-payments';

import { toast } from 'src/components/snackbar';

import { useFullScreenDialog, stackedDialogActionsSx } from './use-full-screen-dialog';

function parseAmount(raw) {
  const trimmed = String(raw ?? '').replace(/,/g, '').trim();
  if (!trimmed) {
    return { amount: null };
  }
  const value = Number(trimmed);
  if (!Number.isFinite(value) || value < 0) {
    return { error: 'Enter a valid amount.' };
  }
  if (value > 99999999) {
    return { error: 'Amount is too large.' };
  }
  return { amount: Math.round(value * 100) / 100 };
}

export function EnrollmentAmountDueDialog({ open, row, onClose, onSaved }) {
  const fullScreen = useFullScreenDialog();
  const targets = programAmountTargets(row);
  const [drafts, setDrafts] = useState({});
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }
    const next = {};
    programAmountTargets(row).forEach((item) => {
      next[item.key] = item.amountDue != null ? item.amountDue.toFixed(2) : '';
    });
    setDrafts(next);
    setErrors({});
  }, [open, row]);

  const handleClose = () => {
    if (busy) {
      return;
    }
    onClose?.();
  };

  const handleSave = async () => {
    const nextErrors = {};
    const parsed = targets.map((item) => {
      const result = parseAmount(drafts[item.key]);
      if (result.error) {
        nextErrors[item.key] = result.error;
      }
      return { ...item, amount: result.amount };
    });

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setBusy(true);
    try {
      for (const item of parsed) {
        await lmsApi.updateEnrollmentAmountDue({
          enrollmentId: item.enrollmentId,
          amount: item.amount,
        });
      }
      toast.success('Amount due saved.');
      await onSaved?.();
      onClose?.();
    } catch (error) {
      toast.error(getLmsAxiosErrorMessage(error, 'Could not save the amount due.'));
    } finally {
      setBusy(false);
    }
  };

  const learnerName = row?.userName || 'this student';

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth fullScreen={fullScreen}>
      <DialogTitle>Amount due</DialogTitle>
      <DialogContent dividers>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Enter the total {learnerName} must pay for each program. This amount is for the program
          application, not for each course. Payments already recorded count toward it. Leave a field
          blank to clear it.
        </Typography>
        <Stack spacing={2}>
          {targets.map((item) => (
            <TextField
              key={item.key}
              label={item.programTitle}
              value={drafts[item.key] ?? ''}
              onChange={(event) => {
                const { value } = event.target;
                setDrafts((prev) => ({ ...prev, [item.key]: value }));
                setErrors((prev) => ({ ...prev, [item.key]: '' }));
              }}
              error={Boolean(errors[item.key])}
              helperText={errors[item.key] || 'Total amount for this program'}
              disabled={busy}
              slotProps={{
                input: {
                  startAdornment: <InputAdornment position="start">₱</InputAdornment>,
                },
                htmlInput: { inputMode: 'decimal', min: 0, step: '0.01' },
              }}
            />
          ))}
        </Stack>
      </DialogContent>
      <DialogActions sx={stackedDialogActionsSx}>
        <Button onClick={handleClose} disabled={busy}>
          Cancel
        </Button>
        <Button
          variant="contained"
          disabled={busy || targets.length === 0}
          onClick={handleSave}
          startIcon={busy ? <CircularProgress size={16} color="inherit" /> : null}
        >
          {busy ? 'Saving…' : 'Save amount'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
