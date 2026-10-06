import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Tabs from '@mui/material/Tabs';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Skeleton from '@mui/material/Skeleton';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import LinearProgress from '@mui/material/LinearProgress';

import { useLmsUser } from 'src/hooks/use-lms';

import { CONFIG } from 'src/global-config';
import { downloadLmsExcelExport } from 'src/lib/lms-excel-export';
import { getLmsAxiosErrorMessage } from 'src/lib/lms-instructor-api';
import { StudentWorkspaceShell } from 'src/features/student-profile/components/student-workspace-shell';
import { InstructorWorkspaceShell } from 'src/features/instructor-profile/components/instructor-workspace-shell';
import {
  createBankPaymentMethod,
  deleteBankPaymentMethod,
  fetchBankPaymentMethods,
  updateBankPaymentMethod,
  createEwalletPaymentMethod,
  deleteEwalletPaymentMethod,
  fetchEwalletPaymentMethods,
  updateEwalletPaymentMethod,
} from 'src/features/payment-methods/api/payment-methods-admin-api';

import { toast } from 'src/components/snackbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { ExportExcelButton } from 'src/components/export-excel-button';

const EMPTY_BANK = {
  accountName: '',
  bankName: '',
  accountNumber: '',
};

const EMPTY_WALLET = {
  mobileNumber: '',
  accountName: '',
};

const SKELETON_ROWS = 5;

function PaymentMethodsTable({
  rows = [],
  loading = false,
  columns,
  onEdit,
  onDelete,
  busyId = null,
  emptyMessage = 'No entries found',
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
      <Table
        size="small"
        sx={{
          opacity: loading && rows.length > 0 ? 0.72 : 1,
          transition: (theme) => theme.transitions.create('opacity', { duration: 160 }),
        }}
      >
        <TableHead>
          <TableRow>
            {columns.map((c) => (
              <TableCell key={c.key}>{c.label}</TableCell>
            ))}
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {showSkeleton
            ? Array.from({ length: SKELETON_ROWS }).map((_, i) => (
                <TableRow key={`sk-${i}`}>
                  <TableCell colSpan={columns.length + 1} sx={{ py: 1.5 }}>
                    <Skeleton variant="rounded" height={40} animation="wave" />
                  </TableCell>
                </TableRow>
              ))
            : null}

          {!showSkeleton && !loading && rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length + 1} align="center" sx={{ py: 6 }}>
                <Typography variant="body2" color="text.secondary">
                  {emptyMessage}
                </Typography>
              </TableCell>
            </TableRow>
          ) : null}

          {!showSkeleton && rows.length > 0
            ? rows.map((row) => (
                <TableRow key={row.id} hover>
                  {columns.map((c) => (
                    <TableCell key={c.key}>{row[c.key] ?? '—'}</TableCell>
                  ))}
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <Button size="small" variant="text" onClick={() => onEdit(row)}>
                        Edit
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        variant="text"
                        disabled={busyId === row.id}
                        onClick={() => onDelete(row)}
                      >
                        Delete
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            : null}
        </TableBody>
      </Table>
    </Box>
  );
}

export default function PaymentMethodsPage() {
  const { user } = useLmsUser();
  const role = typeof user?.role === 'string' ? user.role.trim().toLowerCase() : '';
  const isInstructorLike = role === 'instructor' || role === 'admin';
  const WorkspaceShell = isInstructorLike ? InstructorWorkspaceShell : StudentWorkspaceShell;

  const apiEnabled = Boolean(CONFIG.serverUrl?.trim());

  const [tab, setTab] = useState(0);
  const [banks, setBanks] = useState([]);
  const [ewallets, setEwallets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState(null);

  const [editingId, setEditingId] = useState(null);
  const [bankForm, setBankForm] = useState(EMPTY_BANK);
  const [walletForm, setWalletForm] = useState(EMPTY_WALLET);
  const [saving, setSaving] = useState(false);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDeleteRow, setPendingDeleteRow] = useState(null);
  const [busyId, setBusyId] = useState(null);

  const loadAll = useCallback(async () => {
    if (!apiEnabled) {
      setBanks([]);
      setEwallets([]);
      setListError(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setListError(null);
    try {
      const [b, e] = await Promise.all([fetchBankPaymentMethods(), fetchEwalletPaymentMethods()]);
      setBanks(Array.isArray(b) ? b : []);
      setEwallets(Array.isArray(e) ? e : []);
    } catch (err) {
      const msg = getLmsAxiosErrorMessage(err, 'Could not load payment methods.');
      setListError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [apiEnabled]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const resetForm = useCallback(() => {
    setBankForm(EMPTY_BANK);
    setWalletForm(EMPTY_WALLET);
    setEditingId(null);
  }, []);

  const handleTabChange = (_, v) => {
    setTab(v);
    resetForm();
  };

  const canSubmitBank =
    apiEnabled &&
    Boolean(bankForm.accountName.trim()) &&
    Boolean(bankForm.bankName.trim()) &&
    Boolean(bankForm.accountNumber.trim());

  const canSubmitWallet =
    apiEnabled && Boolean(walletForm.mobileNumber.trim()) && Boolean(walletForm.accountName.trim());

  const canSubmit = tab === 0 ? canSubmitBank : canSubmitWallet;

  const handleEditBank = (row) => {
    setTab(0);
    setEditingId(row.id);
    setBankForm({
      accountName: row.accountName ?? '',
      bankName: row.bankName ?? '',
      accountNumber: row.accountNumber ?? '',
    });
  };

  const handleEditWallet = (row) => {
    setTab(1);
    setEditingId(row.id);
    setWalletForm({
      mobileNumber: row.mobileNumber ?? '',
      accountName: row.accountName ?? '',
    });
  };

  const handleSubmit = async () => {
    if (tab === 0) {
      if (!canSubmitBank) {
        toast.error('Account name, bank name, and account number are required.');
        return;
      }
      setSaving(true);
      try {
        const payload = {
          accountName: bankForm.accountName.trim(),
          bankName: bankForm.bankName.trim(),
          accountNumber: bankForm.accountNumber.trim(),
        };
        if (editingId) {
          await updateBankPaymentMethod(editingId, payload);
          toast.success('Bank details updated.');
        } else {
          await createBankPaymentMethod(payload);
          toast.success('Bank method created.');
        }
        resetForm();
        await loadAll();
      } catch (err) {
        toast.error(getLmsAxiosErrorMessage(err, 'Could not save bank method.'));
      } finally {
        setSaving(false);
      }
      return;
    }

    if (!canSubmitWallet) {
      toast.error('Mobile number and account name are required.');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        mobileNumber: walletForm.mobileNumber.trim(),
        accountName: walletForm.accountName.trim(),
      };
      if (editingId) {
        await updateEwalletPaymentMethod(editingId, payload);
        toast.success('E-wallet details updated.');
      } else {
        await createEwalletPaymentMethod(payload);
        toast.success('E-wallet method created.');
      }
      resetForm();
      await loadAll();
    } catch (err) {
      toast.error(getLmsAxiosErrorMessage(err, 'Could not save e-wallet method.'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    const row = pendingDeleteRow;
    if (!row?.id || !row?.kind) {
      return;
    }
    setBusyId(row.id);
    try {
      if (row.kind === 'bank') {
        await deleteBankPaymentMethod(row.id);
        toast.success('Bank method removed.');
      } else {
        await deleteEwalletPaymentMethod(row.id);
        toast.success('E-wallet method removed.');
      }
      setConfirmOpen(false);
      setPendingDeleteRow(null);
      if (editingId === row.id) {
        resetForm();
      }
      await loadAll();
    } catch (err) {
      toast.error(getLmsAxiosErrorMessage(err, 'Could not delete payment method.'));
    } finally {
      setBusyId(null);
    }
  };

  const formTitle =
    tab === 0
      ? editingId
        ? 'Edit bank transfer'
        : 'Create bank transfer'
      : editingId
        ? 'Edit e-wallet'
        : 'Create e-wallet';

  const listTitle = tab === 0 ? 'Bank transfer methods' : 'E-wallet methods (GCash / Maya)';

  return (
    <>
      <title>{`Payment | Dashboard - ${CONFIG.appName}`}</title>
      <WorkspaceShell>
        <Stack spacing={3}>
          <Box>
            <Typography variant="h4">Payment</Typography>
            <Typography variant="body2" color="text.secondary">
              Bank and e-wallet details are shown to learners on enrollment. Stored in the database when the API is
              connected.
            </Typography>
          </Box>

          {!apiEnabled ? (
            <Alert severity="info">
              Connect the app to the Laravel API (server URL) to manage payment instructions stored in the database.
            </Alert>
          ) : null}

          {listError ? <Alert severity="error">{listError}</Alert> : null}

          <Card>
            <CardContent>
              <Stack spacing={2}>
                <Tabs value={tab} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tab label="Bank" />
                  <Tab label="E-wallet" />
                </Tabs>

                <Typography variant="h6">{formTitle}</Typography>

                {tab === 0 ? (
                  <Grid container spacing={2} alignItems="stretch" columns={{ xs: 12, md: 12 }}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField
                        label="Account name"
                        value={bankForm.accountName}
                        onChange={(e) => setBankForm((p) => ({ ...p, accountName: e.target.value }))}
                        fullWidth
                        required
                        disabled={!apiEnabled}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField
                        label="Bank name"
                        value={bankForm.bankName}
                        onChange={(e) => setBankForm((p) => ({ ...p, bankName: e.target.value }))}
                        fullWidth
                        required
                        disabled={!apiEnabled}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField
                        label="Account number"
                        value={bankForm.accountNumber}
                        onChange={(e) => setBankForm((p) => ({ ...p, accountNumber: e.target.value }))}
                        fullWidth
                        required
                        disabled={!apiEnabled}
                      />
                    </Grid>
                  </Grid>
                ) : (
                  <Grid container spacing={2} alignItems="stretch" columns={{ xs: 12, md: 12 }}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField
                        label="Mobile number"
                        value={walletForm.mobileNumber}
                        onChange={(e) => setWalletForm((p) => ({ ...p, mobileNumber: e.target.value }))}
                        fullWidth
                        required
                        disabled={!apiEnabled}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField
                        label="Account name"
                        value={walletForm.accountName}
                        onChange={(e) => setWalletForm((p) => ({ ...p, accountName: e.target.value }))}
                        fullWidth
                        required
                        disabled={!apiEnabled}
                      />
                    </Grid>
                  </Grid>
                )}

                <Stack direction="row" spacing={1}>
                  <Button variant="contained" onClick={handleSubmit} disabled={saving || !canSubmit}>
                    {editingId ? 'Update' : 'Create'}
                  </Button>
                  {editingId ? (
                    <Button variant="outlined" onClick={resetForm} disabled={saving}>
                      Cancel edit
                    </Button>
                  ) : null}
                </Stack>
              </Stack>
            </CardContent>
          </Card>

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
                    {listTitle}
                  </Typography>
                  <ExportExcelButton
                    disabled={loading}
                    onExport={({ from, to }) =>
                      downloadLmsExcelExport(
                        tab === 0
                          ? '/api/admin/bank-payment-methods/export'
                          : '/api/admin/ewallet-payment-methods/export',
                        { from, to },
                        tab === 0 ? 'bank-payment-methods.xlsx' : 'ewallet-payment-methods.xlsx'
                      )
                    }
                    successMessage="Payment methods exported to Excel."
                  />
                </Stack>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                  Row id is the method&apos;s public id (used for update/delete in the API).
                </Typography>
                <Typography component="div" variant="body2" color="text.secondary" sx={{ maxWidth: 560 }}>
                  {tab === 0
                    ? 'Shown under “Bank transfer” on the enrollment payment step.'
                    : 'Shown under “GCash / Maya” on the enrollment payment step.'}
                </Typography>

                {tab === 0 ? (
                  <PaymentMethodsTable
                    rows={banks}
                    loading={loading}
                    columns={[
                      { key: 'accountName', label: 'Account name' },
                      { key: 'bankName', label: 'Bank' },
                      { key: 'accountNumber', label: 'Account number' },
                    ]}
                    onEdit={handleEditBank}
                    onDelete={(row) => {
                      setPendingDeleteRow({ kind: 'bank', id: row.id, label: row.bankName || row.accountName });
                      setConfirmOpen(true);
                    }}
                    busyId={busyId}
                    emptyMessage={apiEnabled ? 'No bank transfer methods yet.' : 'Connect the API to manage bank methods.'}
                  />
                ) : (
                  <PaymentMethodsTable
                    rows={ewallets}
                    loading={loading}
                    columns={[
                      { key: 'mobileNumber', label: 'Mobile number' },
                      { key: 'accountName', label: 'Account name' },
                    ]}
                    onEdit={handleEditWallet}
                    onDelete={(row) => {
                      setPendingDeleteRow({
                        kind: 'ewallet',
                        id: row.id,
                        label: row.accountName || row.mobileNumber,
                      });
                      setConfirmOpen(true);
                    }}
                    busyId={busyId}
                    emptyMessage={apiEnabled ? 'No e-wallet methods yet.' : 'Connect the API to manage e-wallet methods.'}
                  />
                )}
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      </WorkspaceShell>

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => {
          setConfirmOpen(false);
          setPendingDeleteRow(null);
        }}
        title="Delete payment method"
        content={
          <>
            Remove <strong>{pendingDeleteRow?.label ?? ''}</strong>? Learners will no longer see this option (defaults
            may still apply if nothing is configured).
          </>
        }
        action={
          <Button variant="contained" color="error" onClick={handleDelete} disabled={!!busyId}>
            Delete
          </Button>
        }
      />
    </>
  );
}
