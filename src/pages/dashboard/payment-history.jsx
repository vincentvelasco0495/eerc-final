import { useSearchParams } from 'react-router';
import { useRef, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import CardContent from '@mui/material/CardContent';
import FormControl from '@mui/material/FormControl';

import { useLmsEnrollmentPaymentsPaginated } from 'src/hooks/use-lms';

import { CONFIG } from 'src/global-config';
import { verifyEnrollmentPayment } from 'src/redux/api/lmsApi';
import { getLmsAxiosErrorMessage } from 'src/lib/lms-instructor-api';
import { InstructorWorkspaceShell } from 'src/features/instructor-profile/components/instructor-workspace-shell';
import { PAYMENT_VERIFICATION, paymentVerificationLabel } from 'src/features/enrollment/utils/enrollment-payments';
import {
  normalizePaymentHistoryPage,
  normalizePaymentHistoryPerPage,
} from 'src/services/paymentHistoryService';

import { toast } from 'src/components/snackbar';
import { ExportExcelButton } from 'src/components/export-excel-button';
import { ServerListPagination, ServerListPerPageControl } from 'src/components/server-pagination';
import {
  openPaymentProof,
  PaymentHistoryTable,
  notifyPaymentProofError,
} from 'src/components/enrollments/PaymentHistoryTable';

export default function PaymentHistoryPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = normalizePaymentHistoryPage(searchParams.get('page'));
  const perPage = normalizePaymentHistoryPerPage(searchParams.get('per_page'));
  const verification = String(searchParams.get('verification') ?? '');

  const [searchDraft, setSearchDraft] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const prevDebouncedSearch = useRef(debouncedSearch);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchDraft.trim()), 400);
    return () => clearTimeout(t);
  }, [searchDraft]);

  useEffect(() => {
    if (prevDebouncedSearch.current === debouncedSearch) {
      return;
    }
    prevDebouncedSearch.current = debouncedSearch;
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set('page', '1');
        return next;
      },
      { replace: true }
    );
  }, [debouncedSearch, setSearchParams]);

  const {
    payments,
    meta,
    isLoading: listLoading,
    error: listError,
    mutate: mutatePaymentsPage,
  } = useLmsEnrollmentPaymentsPaginated(page, perPage, debouncedSearch, verification);

  const [busyId, setBusyId] = useState(null);
  const [proofBusyId, setProofBusyId] = useState(null);

  const currentPage = meta?.current_page ?? page;
  const lastPage = meta?.last_page ?? 1;
  const total = meta?.total ?? 0;
  const rangeFrom = meta?.from ?? 0;
  const rangeTo = meta?.to ?? 0;

  const listErrorMessage =
    typeof listError === 'string' ? listError : listError?.message ?? null;

  useEffect(() => {
    if (!listErrorMessage) {
      return;
    }
    toast.error(listErrorMessage);
  }, [listErrorMessage]);

  useEffect(() => {
    if (!meta?.last_page) {
      return;
    }
    const lp = meta.last_page;
    if (page > lp) {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.set('page', String(lp));
          return next;
        },
        { replace: true }
      );
    }
  }, [meta, page, setSearchParams]);

  const goToPage = useCallback(
    (nextPage) => {
      const lp = Math.max(1, lastPage);
      const safe = Math.max(1, Math.min(lp, nextPage));
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.set('page', String(safe));
          return next;
        },
        { replace: true }
      );
    },
    [lastPage, setSearchParams]
  );

  const changePerPage = useCallback(
    (nextPer) => {
      const normalized = normalizePaymentHistoryPerPage(nextPer);
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.set('per_page', String(normalized));
          next.set('page', '1');
          return next;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );

  const changeVerification = useCallback(
    (nextVerification) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (nextVerification) {
            next.set('verification', nextVerification);
          } else {
            next.delete('verification');
          }
          next.set('page', '1');
          return next;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );

  const handleViewProof = useCallback(async (row) => {
    if (!row?.id) {
      return;
    }
    setProofBusyId(row.id);
    try {
      await openPaymentProof(row);
    } catch (error) {
      notifyPaymentProofError(error);
    } finally {
      setProofBusyId(null);
    }
  }, []);

  const handleVerify = useCallback(
    async (row, status) => {
      if (!row?.enrollmentId || !row?.paymentId) {
        return;
      }
      setBusyId(row.id);
      try {
        await verifyEnrollmentPayment({
          enrollmentId: row.enrollmentId,
          paymentId: row.paymentId,
          status,
        });
        toast.success(
          status === PAYMENT_VERIFICATION.CORRECT
            ? 'Payment marked as correct.'
            : 'Payment marked as invalid.'
        );
        await mutatePaymentsPage();
      } catch (error) {
        toast.error(getLmsAxiosErrorMessage(error, 'Could not update payment verification.'));
      } finally {
        setBusyId(null);
      }
    },
    [mutatePaymentsPage]
  );

  return (
    <>
      <title>{`Payment history | Dashboard - ${CONFIG.appName}`}</title>
      <InstructorWorkspaceShell>
        <Stack spacing={3}>
          <Box>
            <Typography variant="h4">Payment history</Typography>
            <Typography variant="body2" color="text.secondary">
              Review student downpayments and partial payments. Filter by status, mark payments as
              correct or invalid, and download proof files.
            </Typography>
          </Box>

          {listErrorMessage ? <Alert severity="error">{listErrorMessage}</Alert> : null}

          <Card>
            <CardContent>
              <Stack spacing={2}>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  flexWrap="wrap"
                  columnGap={2}
                  rowGap={1}
                >
                  <Typography variant="h6" sx={{ minWidth: 0 }}>
                    Payment list
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap" useFlexGap>
                    <ExportExcelButton
                      fileName="payment-history"
                      sheetName="Payments"
                      headers={['Learner', 'Email', 'Program', 'Payment', 'Amount', 'Paid on', 'Status']}
                      rows={payments}
                      mapRow={(row) => [
                        row.userName ?? '',
                        row.userEmail ?? '',
                        row.programTitle ?? '',
                        row.label ?? '',
                        row.amount ?? '',
                        row.paidAt ?? '',
                        paymentVerificationLabel(row.verificationStatus),
                      ]}
                      disabled={listLoading}
                    />
                    <ServerListPerPageControl
                      perPage={perPage}
                      onPerPageChange={changePerPage}
                      disabled={listLoading}
                    />
                  </Stack>
                </Stack>

                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={2}
                  alignItems={{ sm: 'flex-start' }}
                >
                  <TextField
                    size="small"
                    label="Search"
                    placeholder="Learner, email, program, or payment id…"
                    value={searchDraft}
                    onChange={(e) => setSearchDraft(e.target.value)}
                    sx={{ width: { xs: '100%', sm: 360 } }}
                    slotProps={{ inputLabel: { shrink: true } }}
                  />
                  <FormControl size="small" sx={{ width: { xs: '100%', sm: 220 } }}>
                    <InputLabel id="payment-history-status-filter" shrink>
                      Status
                    </InputLabel>
                    <Select
                      labelId="payment-history-status-filter"
                      label="Status"
                      value={verification}
                      onChange={(e) => changeVerification(e.target.value)}
                      disabled={listLoading}
                      displayEmpty
                      renderValue={(selected) => {
                        if (!selected) {
                          return 'All statuses';
                        }
                        if (selected === 'pending') {
                          return 'Pending review';
                        }
                        if (selected === 'correct') {
                          return 'Correct';
                        }
                        if (selected === 'invalid') {
                          return 'Invalid';
                        }
                        return selected;
                      }}
                    >
                      <MenuItem value="">All statuses</MenuItem>
                      <MenuItem value="pending">Pending review</MenuItem>
                      <MenuItem value="correct">Correct</MenuItem>
                      <MenuItem value="invalid">Invalid</MenuItem>
                    </Select>
                  </FormControl>
                </Stack>

                <Typography variant="body2" color="text.secondary">
                  Rows highlighted in yellow have payments waiting for review.
                </Typography>

                <PaymentHistoryTable
                  rows={payments}
                  loading={listLoading}
                  busyId={busyId}
                  proofBusyId={proofBusyId}
                  onVerify={handleVerify}
                  onViewProof={handleViewProof}
                  emptyMessage={
                    debouncedSearch || verification
                      ? 'No payments match your filters.'
                      : 'No payments found'
                  }
                />

                <ServerListPagination
                  page={currentPage}
                  lastPage={lastPage}
                  total={total}
                  from={rangeFrom}
                  to={rangeTo}
                  onPageChange={goToPage}
                  disabled={listLoading}
                />
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      </InstructorWorkspaceShell>
    </>
  );
}
