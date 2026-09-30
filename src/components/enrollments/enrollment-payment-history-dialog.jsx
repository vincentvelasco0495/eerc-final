import { useMemo, useState } from 'react';

import Chip from '@mui/material/Chip';
import List from '@mui/material/List';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import CircularProgress from '@mui/material/CircularProgress';

import { formatPesoAmount } from 'src/config/enrollment-payment';
import { getLmsAxiosErrorMessage } from 'src/lib/lms-instructor-api';
import {
  verifyEnrollmentPayment,
  fetchEnrollmentDocumentBlob,
  fetchEnrollmentPaymentProofBlob,
} from 'src/redux/api/lmsApi';
import {
  PAYMENT_VERIFICATION,
  paymentVerificationLabel,
  buildEnrollmentPaymentHistory,
} from 'src/features/enrollment/utils/enrollment-payments';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';

function verificationChipColor(status) {
  if (status === PAYMENT_VERIFICATION.CORRECT) {
    return 'success';
  }
  if (status === PAYMENT_VERIFICATION.INVALID) {
    return 'error';
  }
  return 'warning';
}

export function EnrollmentPaymentHistoryDialog({
  open,
  enrollment,
  programTitle = '',
  adminMode = false,
  onClose,
  onVerified,
}) {
  const [downloadingId, setDownloadingId] = useState(null);
  const [verifyingId, setVerifyingId] = useState(null);

  const paymentHistory = useMemo(
    () => (open && enrollment ? buildEnrollmentPaymentHistory(enrollment) : []),
    [enrollment, open]
  );

  const titleLabel =
    programTitle ||
    enrollment?.programTitle ||
    enrollment?.programId ||
    'Enrollment';

  const handleClose = () => {
    if (downloadingId || verifyingId) {
      return;
    }
    onClose?.();
  };

  const handleDownloadProof = async (entry) => {
    if (!entry?.hasProof || !enrollment?.id || downloadingId) {
      return;
    }

    setDownloadingId(entry.id);
    try {
      const blob =
        entry.proofKind === 'initial'
          ? await fetchEnrollmentPaymentProofBlob(enrollment.id)
          : await fetchEnrollmentDocumentBlob(enrollment.id, entry.documentKey);
      const filename =
        entry.originalName ||
        (entry.proofKind === 'initial'
          ? 'payment-proof.pdf'
          : `${entry.documentKey || entry.id}.pdf`);
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = objectUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(objectUrl);
    } catch (error) {
      toast.error(getLmsAxiosErrorMessage(error, 'Could not download payment proof.'));
    } finally {
      setDownloadingId(null);
    }
  };

  const handleVerify = async (entry, status) => {
    if (!adminMode || !enrollment?.id || verifyingId) {
      return;
    }

    setVerifyingId(entry.id);
    try {
      await verifyEnrollmentPayment({
        enrollmentId: enrollment.id,
        paymentId: entry.id,
        status,
      });
      toast.success(
        status === PAYMENT_VERIFICATION.CORRECT
          ? 'Payment marked as correct.'
          : 'Payment marked as invalid and excluded from balance.'
      );
      await onVerified?.();
    } catch (error) {
      toast.error(getLmsAxiosErrorMessage(error, 'Could not update payment verification.'));
    } finally {
      setVerifyingId(null);
    }
  };

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={handleClose}>
      <DialogTitle>Payment history</DialogTitle>
      <DialogContent dividers>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Payments submitted for <strong>{titleLabel}</strong>
          {enrollment?.userName ? ` · ${enrollment.userName}` : ''}.
        </Typography>
        {adminMode ? (
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
            Mark each payment as correct to count it toward the student balance. Invalid payments are
            excluded and the enrollment row highlight is removed once all payments are reviewed.
          </Typography>
        ) : null}
        {paymentHistory.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No payment history yet for this enrollment.
          </Typography>
        ) : (
          <List disablePadding>
            {paymentHistory.map((entry, idx) => {
              const isPending = entry.verificationStatus === PAYMENT_VERIFICATION.PENDING;
              const isVerifying = verifyingId === entry.id;

              return (
                <ListItem
                  key={entry.id}
                  disableGutters
                  divider={idx < paymentHistory.length - 1}
                  sx={{
                    py: 1.25,
                    alignItems: 'flex-start',
                    bgcolor: (theme) =>
                      isPending && adminMode
                        ? `rgb(${theme.vars.palette.warning.mainChannel} / 0.16)`
                        : undefined,
                    borderRadius: 1,
                    px: isPending && adminMode ? 1 : 0,
                  }}
                >
                  <Stack spacing={0.75} sx={{ flex: 1, minWidth: 0, pr: 1 }}>
                    <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {entry.label}: {formatPesoAmount(entry.amount)}
                      </Typography>
                      <Chip
                        size="small"
                        label={paymentVerificationLabel(entry.verificationStatus)}
                        color={verificationChipColor(entry.verificationStatus)}
                        variant={isPending ? 'filled' : 'outlined'}
                      />
                    </Stack>
                    <Typography variant="caption" color="text.secondary">
                      {entry.paidAt ? `Paid on ${entry.paidAt}` : 'Payment date unavailable'}
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                      {entry.hasProof ? (
                        <Button
                          size="small"
                          variant="text"
                          onClick={() => handleDownloadProof(entry)}
                          disabled={downloadingId === entry.id || Boolean(verifyingId)}
                          startIcon={
                            downloadingId === entry.id ? (
                              <CircularProgress size={14} color="inherit" />
                            ) : (
                              <Iconify icon="solar:download-minimalistic-bold-duotone" width={16} />
                            )
                          }
                        >
                          Proof
                        </Button>
                      ) : null}
                      {adminMode && isPending ? (
                        <>
                          <Button
                            size="small"
                            variant="contained"
                            color="success"
                            disabled={Boolean(verifyingId)}
                            onClick={() => handleVerify(entry, PAYMENT_VERIFICATION.CORRECT)}
                            startIcon={
                              isVerifying ? <CircularProgress size={14} color="inherit" /> : null
                            }
                          >
                            Correct
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            color="error"
                            disabled={Boolean(verifyingId)}
                            onClick={() => handleVerify(entry, PAYMENT_VERIFICATION.INVALID)}
                          >
                            Invalid
                          </Button>
                        </>
                      ) : null}
                    </Stack>
                  </Stack>
                </ListItem>
              );
            })}
          </List>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={Boolean(downloadingId || verifyingId)}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
