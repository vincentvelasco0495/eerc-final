import { useRef, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import CircularProgress from '@mui/material/CircularProgress';

import { CONFIG } from 'src/global-config';
import { fetchPublicPaymentMethods } from 'src/features/payment-methods/api/payment-methods-admin-api';
import {
  ENROLLMENT_PAYMENT_CONFIG,
  getProgramEnrollmentFeeLabel,
} from 'src/config/enrollment-payment';
import { buildEnrollmentMethodsFromPaymentApi } from 'src/features/payment-methods/utils/build-enrollment-methods-from-api';

import { Iconify } from 'src/components/iconify';

const ACCEPTED_MIME = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf',
]);
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

export function EnrollmentPaymentDialog({
  open,
  title,
  programId,
  programCode,
  programTitle,
  courseTitle,
  submitting = false,
  onClose,
  onSubmit,
}) {
  const feeLabel = getProgramEnrollmentFeeLabel({ programId, programCode, programTitle });
  const inputRef = useRef(null);
  const [proofFile, setProofFile] = useState(null);
  const [proofError, setProofError] = useState('');
  /** When non-null, replaces static `ENROLLMENT_PAYMENT_CONFIG.methods` for “Where to pay”. */
  const [apiMethodBlocks, setApiMethodBlocks] = useState(null);

  const resetProof = useCallback(() => {
    setProofFile(null);
    setProofError('');
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  }, []);

  useEffect(() => {
    if (!open) {
      resetProof();
    }
  }, [open, resetProof]);

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

  const handleSubmit = () => {
    if (!proofFile) {
      setProofError('Upload proof of payment before submitting.');
      return;
    }

    onSubmit?.(proofFile);
  };

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={submitting ? undefined : onClose}>
      <DialogTitle sx={{ pb: 1 }}>{title}</DialogTitle>

      <DialogContent sx={{ typography: 'body2' }}>
        <Stack spacing={2.5}>
          <Typography variant="body2" color="text.secondary">
            Complete payment for{' '}
            {courseTitle ? (
              <>
                <strong>{courseTitle}</strong>
                {programTitle ? (
                  <>
                    {' '}
                    (under <strong>{programTitle}</strong>)
                  </>
                ) : null}
              </>
            ) : (
              <strong>{programTitle}</strong>
            )}
            , then upload your receipt. An administrator will verify your proof before approving enrollment.
          </Typography>

          <Alert severity="info" icon={<Iconify icon="solar:wallet-money-bold-duotone" width={22} />}>
            <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
              Enrollment fee
            </Typography>
            <Typography variant="body2">{feeLabel}</Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.75 }}>
              {ENROLLMENT_PAYMENT_CONFIG.feeNote}
            </Typography>
          </Alert>

          <Stack spacing={1.25}>
            <Typography variant="subtitle2">Where to pay</Typography>
            {methodsToRender.map((method, idx) => (
              <PaymentMethodBlock key={`${method.title}-${idx}`} method={method} />
            ))}
          </Stack>

          <Stack spacing={1}>
            <Typography variant="subtitle2">Proof of payment</Typography>
            <Typography variant="caption" color="text.secondary">
              {ENROLLMENT_PAYMENT_CONFIG.acceptedProofHint}
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
              <Button
                variant="outlined"
                component="label"
                disabled={submitting}
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
        <Button variant="outlined" color="inherit" onClick={onClose} disabled={submitting}>
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={submitting}
          startIcon={
            submitting ? <CircularProgress size={18} color="inherit" /> : null
          }
        >
          {submitting ? 'Submitting…' : 'Submit enrollment'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
