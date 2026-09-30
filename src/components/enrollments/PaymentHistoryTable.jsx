import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Skeleton from '@mui/material/Skeleton';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import TableContainer from '@mui/material/TableContainer';
import LinearProgress from '@mui/material/LinearProgress';
import CircularProgress from '@mui/material/CircularProgress';

import { formatPesoAmount } from 'src/config/enrollment-payment';
import { fetchEnrollmentDocumentBlob, fetchEnrollmentPaymentProofBlob } from 'src/redux/api/lmsApi';
import {
  PAYMENT_VERIFICATION,
  paymentVerificationLabel,
} from 'src/features/enrollment/utils/enrollment-payments';

import { toast } from 'src/components/snackbar';

const SKELETON_ROWS = 5;

function verificationChipColor(status) {
  if (status === PAYMENT_VERIFICATION.CORRECT) {
    return 'success';
  }
  if (status === PAYMENT_VERIFICATION.INVALID) {
    return 'error';
  }
  return 'warning';
}

export function PaymentHistoryTable({
  rows = [],
  loading = false,
  busyId = null,
  proofBusyId = null,
  onVerify,
  onViewProof,
  emptyMessage = 'No payments found',
}) {
  const showSkeleton = loading && (!Array.isArray(rows) || rows.length === 0);

  return (
    <Box sx={{ position: 'relative' }}>
      {loading && rows.length > 0 ? (
        <LinearProgress
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1,
            borderRadius: 1,
          }}
        />
      ) : null}
      <TableContainer sx={{ overflowX: 'auto' }}>
        <Table
          size="small"
          sx={{
            minWidth: 1080,
            tableLayout: 'fixed',
            opacity: loading && rows.length > 0 ? 0.72 : 1,
            transition: (theme) => theme.transitions.create('opacity', { duration: 160 }),
          }}
        >
          <colgroup>
            <col style={{ width: '14%' }} />
            <col style={{ width: '16%' }} />
            <col style={{ width: '14%' }} />
            <col style={{ width: '12%' }} />
            <col style={{ width: '10%' }} />
            <col style={{ width: '10%' }} />
            <col style={{ width: '12%' }} />
            <col style={{ width: '12%' }} />
          </colgroup>
          <TableHead>
            <TableRow>
              <TableCell>Learner</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Program</TableCell>
              <TableCell>Payment</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Paid on</TableCell>
              <TableCell sx={{ minWidth: 132 }}>Status</TableCell>
              <TableCell align="right" sx={{ minWidth: 200 }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {showSkeleton
              ? Array.from({ length: SKELETON_ROWS }).map((_, i) => (
                  <TableRow key={`sk-${i}`}>
                    <TableCell colSpan={8} sx={{ py: 1.5 }}>
                      <Skeleton variant="rounded" height={40} animation="wave" />
                    </TableCell>
                  </TableRow>
                ))
              : null}

            {!showSkeleton && !loading && rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                  <Typography variant="body2" color="text.secondary">
                    {emptyMessage}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : null}

            {!showSkeleton && rows.length > 0
              ? rows.map((row) => {
                  const isPending = row.verificationStatus === PAYMENT_VERIFICATION.PENDING;
                  const isBusy = busyId === row.id;
                  return (
                    <TableRow
                      key={row.id}
                      hover
                      sx={
                        isPending
                          ? {
                              bgcolor: (theme) =>
                                `rgb(${theme.vars.palette.warning.mainChannel} / 0.16)`,
                              boxShadow: (theme) =>
                                `inset 3px 0 0 ${theme.vars.palette.warning.main}`,
                            }
                          : undefined
                      }
                    >
                      <TableCell>{row.userName || '—'}</TableCell>
                      <TableCell sx={{ wordBreak: 'break-word' }}>{row.userEmail || '—'}</TableCell>
                      <TableCell sx={{ wordBreak: 'break-word' }}>{row.programTitle || row.programId || '—'}</TableCell>
                      <TableCell sx={{ wordBreak: 'break-word' }}>{row.label || '—'}</TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>
                        {row.amount != null ? formatPesoAmount(Number(row.amount)) : '—'}
                      </TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.paidAt || '—'}</TableCell>
                      <TableCell sx={{ minWidth: 132 }}>
                        <Chip
                          size="small"
                          label={paymentVerificationLabel(row.verificationStatus)}
                          color={verificationChipColor(row.verificationStatus)}
                          variant={isPending ? 'filled' : 'outlined'}
                          sx={{ maxWidth: '100%' }}
                        />
                      </TableCell>
                      <TableCell align="right" sx={{ minWidth: 200 }}>
                        <Stack
                          direction="row"
                          spacing={0.75}
                          justifyContent="flex-end"
                          flexWrap="wrap"
                          useFlexGap
                          sx={{ rowGap: 0.75 }}
                        >
                          {row.hasProof ? (
                            <Button
                              size="small"
                              variant="text"
                              disabled={proofBusyId === row.id || isBusy}
                              onClick={() => onViewProof?.(row)}
                            >
                              {proofBusyId === row.id ? 'Opening…' : 'Proof'}
                            </Button>
                          ) : null}
                          {isPending ? (
                            <>
                              <Button
                                size="small"
                                variant="contained"
                                color="success"
                                disabled={isBusy}
                                onClick={() => onVerify?.(row, PAYMENT_VERIFICATION.CORRECT)}
                              >
                                Correct
                              </Button>
                              <Button
                                size="small"
                                variant="outlined"
                                color="error"
                                disabled={isBusy}
                                onClick={() => onVerify?.(row, PAYMENT_VERIFICATION.INVALID)}
                              >
                                Invalid
                              </Button>
                            </>
                          ) : null}
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                })
              : null}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export function PaymentHistoryFilters({
  searchDraft,
  onSearchChange,
  verification,
  onVerificationChange,
  disabled = false,
}) {
  return (
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ sm: 'center' }}>
      <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 200 } }}>
        <InputLabel id="payment-verification-filter-label">Status</InputLabel>
        <Select
          labelId="payment-verification-filter-label"
          label="Status"
          value={verification}
          onChange={(event) => onVerificationChange(event.target.value)}
          disabled={disabled}
        >
          <MenuItem value="">All statuses</MenuItem>
          <MenuItem value="pending">Pending review</MenuItem>
          <MenuItem value="correct">Correct</MenuItem>
          <MenuItem value="invalid">Invalid</MenuItem>
        </Select>
      </FormControl>
    </Stack>
  );
}

export async function openPaymentProof(row) {
  if (!row?.enrollmentId || !row?.hasProof) {
    return;
  }

  const blob =
    row.paymentType === 'initial'
      ? await fetchEnrollmentPaymentProofBlob(row.enrollmentId)
      : await fetchEnrollmentDocumentBlob(row.enrollmentId, row.documentKey);
  const blobUrl = URL.createObjectURL(blob);
  window.open(blobUrl, '_blank', 'noopener,noreferrer');
  window.setTimeout(() => URL.revokeObjectURL(blobUrl), 60_000);
}

export function PaymentHistoryBusyIndicator({ busy }) {
  if (!busy) {
    return null;
  }
  return <CircularProgress size={18} />;
}

export function notifyPaymentProofError(error) {
  const message =
    typeof error === 'string' ? error : error?.message ?? 'Could not open payment proof.';
  toast.error(message);
}
