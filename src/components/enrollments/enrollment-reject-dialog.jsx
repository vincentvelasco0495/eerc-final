import { useState, useEffect } from 'react';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

export function EnrollmentRejectDialog({
  open,
  learnerName = '',
  submitting = false,
  onClose,
  onConfirm,
}) {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) {
      setReason('');
      setError('');
    }
  }, [open]);

  const handleConfirm = () => {
    const trimmed = reason.trim();
    if (!trimmed) {
      setError('Please provide a reason for rejection.');
      return;
    }
    onConfirm?.(trimmed);
  };

  return (
    <Dialog open={open} onClose={submitting ? undefined : onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Reject enrollment</DialogTitle>
      <DialogContent dividers>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {learnerName
            ? `Explain why ${learnerName}'s enrollment application is being rejected. The student will see this in their notification.`
            : 'Explain why this enrollment application is being rejected. The student will see this in their notification.'}
        </Typography>
        <TextField
          fullWidth
          required
          multiline
          minRows={4}
          label="Rejection reason"
          placeholder="e.g. Incomplete payment proof, missing documents, etc."
          value={reason}
          disabled={submitting}
          error={Boolean(error)}
          helperText={error || 'Required'}
          onChange={(event) => {
            setReason(event.target.value);
            if (error) {
              setError('');
            }
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={submitting}>
          Cancel
        </Button>
        <Button color="error" variant="contained" disabled={submitting} onClick={handleConfirm}>
          {submitting ? 'Rejecting…' : 'Reject enrollment'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
