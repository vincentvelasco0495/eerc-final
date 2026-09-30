import { useRef, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';

import { CONFIG } from 'src/global-config';
import { submitEnrollmentPartialPayment } from 'src/redux/api/lmsApi';
import { ENROLLMENT_PAYMENT_CONFIG } from 'src/config/enrollment-payment';
import { buildPartialPaymentSummary } from 'src/features/enrollment/utils/enrollment-payments';
import { fetchPublicPaymentMethods } from 'src/features/payment-methods/api/payment-methods-admin-api';
import { buildEnrollmentMethodsFromPaymentApi } from 'src/features/payment-methods/utils/build-enrollment-methods-from-api';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';

const ACCEPTED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp', 'application/pdf']);
const MAX_BYTES = 10 * 1024 * 1024;

function PaymentMethodBlock({ method }) {
  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 1.5,
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.neutral',
      }}
    >
      <Typography variant="subtitle2" sx={{ mb: 0.75 }}>
        {method.title}
      </Typography>
      <Stack component="ul" spacing={0.5} sx={{ m: 0, pl: 2.25 }}>
        {method.details.map((line) => (
          <Typography key={line} component="li" variant="body2" color="text.secondary">
            {line}
          </Typography>
        ))}
      </Stack>
    </Box>
  );
}

export function EnrollmentPartialPaymentDialog({
  open,
  program,
  enrollment,
  submitting = false,
  onClose,
  onSuccess,
}) {
  const summary = buildPartialPaymentSummary(program, enrollment);
  const inputRef = useRef(null);
  const [amount, setAmount] = useState('');
  const [amountError, setAmountError] = useState('');
  const [proofFile, setProofFile] = useState(null);
  const [proofError, setProofError] = useState('');
  const [busy, setBusy] = useState(false);
  const [apiMethodBlocks, setApiMethodBlocks] = useState(null);

  const resetForm = useCallback(() => {
    setAmount('');
    setAmountError('');
    setProofFile(null);
    setProofError('');
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  }, []);

  useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open, resetForm]);

  useEffect(() => {
    if (!open) {
      return () => {};
    }
    if (!CONFIG.serverUrl?.trim()) {
      setApiMethodBlocks(null);
      return () => {};
    }
    let cancelled = false;
    void (async () => {
      try {
        const raw = await fetchPublicPaymentMethods();
        const built = buildEnrollmentMethodsFromPaymentApi(raw);
        if (!cancelled) {
          setApiMethodBlocks(built.length ? built : null);
        }
      } catch {
        if (!cancelled) {
          setApiMethodBlocks(null);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [open]);

  const methodsToRender = apiMethodBlocks ?? ENROLLMENT_PAYMENT_CONFIG.methods;
  const isSubmitting = submitting || busy;
  const maxAllowedAmount =
    summary.remaining != null && Number.isFinite(summary.remaining) ? Math.max(0, summary.remaining) : null;

  const handleFileChange = (event) => {
    const file = event.target.files?.[0] ?? null;
    setProofError('');

    if (!file) {
      setProofFile(null);
      return;
    }

    if (!ACCEPTED_MIME.has(file.type)) {
      setProofFile(null);
      setProofError('Upload a JPG, PNG, WEBP, or PDF file.');
      return;
    }

    if (file.size > MAX_BYTES) {
      setProofFile(null);
      setProofError('File must be 10 MB or smaller.');
      return;
    }

    setProofFile(file);
  };

  const handleSubmit = async () => {
    const parsedAmount = Number(String(amount).replace(/,/g, '').trim());
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setAmountError('Enter a valid payment amount greater than zero.');
      return;
    }

    if (summary.remaining != null && parsedAmount > summary.remaining + 0.009) {
      setAmountError(`Amount cannot exceed the remaining balance (${summary.remainingLabel}).`);
      return;
    }

    if (!proofFile) {
      setProofError('Upload proof of payment before submitting.');
      return;
    }

    if (!enrollment?.id) {
      toast.error('Enrollment record not found.');
      return;
    }

    setBusy(true);
    try {
      const payload = await submitEnrollmentPartialPayment({
        enrollmentId: enrollment.id,
        amount: parsedAmount,
        paymentProofFile: proofFile,
      });
      toast.success('Partial payment submitted. An administrator will verify your receipt.');
      onSuccess?.(payload);
      onClose?.();
    } catch (error) {
      const message =
        typeof error === 'string' ? error : error?.message ?? 'Could not submit partial payment.';
      toast.error(message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={isSubmitting ? undefined : onClose}>
      <DialogTitle sx={{ pb: 1 }}>Pay partial amount</DialogTitle>

      <DialogContent sx={{ typography: 'body2' }}>
        <Stack spacing={2.5}>
          <Typography variant="body2" color="text.secondary">
            Submit a partial payment for <strong>{program?.title ?? enrollment?.programTitle}</strong>.
            Upload your receipt so administrators can track your balance.
          </Typography>

          <Alert severity="info" icon={<Iconify icon="solar:wallet-money-bold-duotone" width={22} />}>
            <Stack spacing={0.5}>
              {summary.totalFeeLabel ? (
                <Typography variant="body2">
                  Total fee: <strong>{summary.totalFeeLabel}</strong>
                </Typography>
              ) : null}
              <Typography variant="body2">
                Paid so far: <strong>{summary.totalPaidLabel}</strong>
                {summary.paymentCount > 0 ? ` (${summary.paymentCount} payment${summary.paymentCount === 1 ? '' : 's'})` : ''}
              </Typography>
              {summary.remainingLabel ? (
                <Typography variant="body2">
                  Remaining: <strong>{summary.remainingLabel}</strong>
                </Typography>
              ) : null}
            </Stack>
          </Alert>

          <Stack spacing={1.25}>
            <Typography variant="subtitle2">Where to pay</Typography>
            {methodsToRender.map((method, idx) => (
              <PaymentMethodBlock key={`${method.title}-${idx}`} method={method} />
            ))}
          </Stack>

          <TextField
            label="Amount paid"
            value={amount}
            onChange={(event) => {
              setAmount(event.target.value);
              setAmountError('');
            }}
            error={Boolean(amountError)}
            helperText={
              amountError ||
              (maxAllowedAmount != null
                ? `Enter up to ${summary.remainingLabel} for this installment.`
                : 'Enter the amount you transferred for this installment.')
            }
            disabled={isSubmitting}
            slotProps={{
              input: {
                startAdornment: <InputAdornment position="start">₱</InputAdornment>,
              },
              htmlInput: {
                min: 0,
                step: '0.01',
                ...(maxAllowedAmount != null ? { max: maxAllowedAmount } : {}),
              },
            }}
          />

          <Stack spacing={1}>
            <Typography variant="subtitle2">Proof of payment</Typography>
            <Typography variant="caption" color="text.secondary">
              {ENROLLMENT_PAYMENT_CONFIG.acceptedProofHint}
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
              <Button
                variant="outlined"
                component="label"
                disabled={isSubmitting}
                startIcon={<Iconify icon="solar:upload-bold" width={18} />}
              >
                Choose file
                <input
                  ref={inputRef}
                  hidden
                  type="file"
                  accept="image/jpeg,image/png,image/webp,application/pdf"
                  onChange={handleFileChange}
                />
              </Button>
              <Typography variant="body2" color="text.secondary" sx={{ flex: 1, minWidth: 160 }}>
                {proofFile?.name ?? 'No file chosen'}
              </Typography>
            </Stack>
            {proofError ? (
              <Typography variant="caption" color="error.main">
                {proofError}
              </Typography>
            ) : null}
          </Stack>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button variant="outlined" color="inherit" onClick={onClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={isSubmitting}
          startIcon={isSubmitting ? <CircularProgress size={18} color="inherit" /> : null}
        >
          {isSubmitting ? 'Submitting…' : 'Submit payment'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
