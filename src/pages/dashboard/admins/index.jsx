import { useBoolean } from 'minimal-shared/hooks';
import { useMemo, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import CardContent from '@mui/material/CardContent';
import InputAdornment from '@mui/material/InputAdornment';
import TableContainer from '@mui/material/TableContainer';

import { useLmsUser } from 'src/hooks/use-lms';

import { CONFIG } from 'src/global-config';
import { getLmsAxiosErrorMessage } from 'src/lib/lms-instructor-api';
import { InstructorWorkspaceShell } from 'src/features/instructor-profile/components/instructor-workspace-shell';
import {
  postLmsAdmin,
  patchLmsAdmin,
  fetchLmsAdmins,
  deleteLmsAdmin,
  resetLmsAdminPassword,
} from 'src/redux/api/lmsApi';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';

const DEFAULT_FORM = {
  name: '',
  email: '',
  password: '',
  passwordConfirm: '',
  status: 'active',
};

export default function AdminsPage() {
  const { user } = useLmsUser();
  const [rows, setRows] = useState([]);
  const [listLoading, setListLoading] = useState(true);
  const [listErrorMessage, setListErrorMessage] = useState(null);
  const [searchDraft, setSearchDraft] = useState('');
  const [form, setForm] = useState(DEFAULT_FORM);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [busyId, setBusyId] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDeleteRow, setPendingDeleteRow] = useState(null);
  const [pendingResetRow, setPendingResetRow] = useState(null);
  const [resetPassword, setResetPassword] = useState('');
  const [resetPasswordConfirm, setResetPasswordConfirm] = useState('');
  const showPassword = useBoolean();
  const showResetPassword = useBoolean();

  const currentUserId = user?.id ?? '';

  const loadAdmins = useCallback(async () => {
    setListLoading(true);
    try {
      const payload = await fetchLmsAdmins({ search: searchDraft.trim() || undefined });
      setRows(Array.isArray(payload?.data) ? payload.data : []);
      setListErrorMessage(null);
    } catch (error) {
      const message = getLmsAxiosErrorMessage(error, 'Could not load admin users.');
      setListErrorMessage(message);
      toast.error(message);
    } finally {
      setListLoading(false);
    }
  }, [searchDraft]);

  useEffect(() => {
    const t = setTimeout(() => {
      loadAdmins();
    }, 300);
    return () => clearTimeout(t);
  }, [loadAdmins]);

  const canSubmit = useMemo(() => {
    if (!form.name.trim() || !form.email.trim()) {
      return false;
    }
    if (editingId) {
      return true;
    }
    return form.password.length >= 8 && form.password === form.passwordConfirm;
  }, [editingId, form]);

  const handleChange = (key) => (event) =>
    setForm((prev) => ({
      ...prev,
      [key]: event.target.value,
    }));

  const resetForm = () => {
    setForm(DEFAULT_FORM);
    setEditingId(null);
  };

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.email.trim()) {
      toast.error('Name and email are required.');
      return;
    }
    if (!editingId && form.password !== form.passwordConfirm) {
      toast.error('Passwords must match.');
      return;
    }
    setSaving(true);
    try {
      if (editingId) {
        const body = {
          name: form.name.trim(),
          email: form.email.trim(),
          status: form.status,
        };
        if (form.password) {
          if (form.password !== form.passwordConfirm) {
            toast.error('Passwords must match.');
            setSaving(false);
            return;
          }
          body.password = form.password;
          body.password_confirmation = form.passwordConfirm;
        }
        await patchLmsAdmin(editingId, body);
        toast.success('Admin updated.');
      } else {
        await postLmsAdmin({
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password,
          password_confirmation: form.passwordConfirm,
          status: form.status,
        });
        toast.success('Admin account created.');
      }
      await loadAdmins();
      resetForm();
    } catch (error) {
      toast.error(getLmsAxiosErrorMessage(error, 'Could not save admin account.'));
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (row) => {
    setEditingId(row.id);
    setForm({
      name: row.name ?? '',
      email: row.email ?? '',
      password: '',
      passwordConfirm: '',
      status: row.status === 'inactive' ? 'inactive' : 'active',
    });
  };

  const handleDelete = async () => {
    const adminId = pendingDeleteRow?.id;
    if (!adminId) {
      return;
    }
    setBusyId(adminId);
    try {
      await deleteLmsAdmin(adminId);
      toast.success('Admin account deleted.');
      setConfirmOpen(false);
      setPendingDeleteRow(null);
      if (editingId === adminId) {
        resetForm();
      }
      await loadAdmins();
    } catch (error) {
      toast.error(getLmsAxiosErrorMessage(error, 'Could not delete admin account.'));
    } finally {
      setBusyId(null);
    }
  };

  const handleResetPassword = async () => {
    const adminId = pendingResetRow?.id;
    if (!adminId) {
      return;
    }
    if (resetPassword.length < 8) {
      toast.error('Password must be at least 8 characters.');
      return;
    }
    if (resetPassword !== resetPasswordConfirm) {
      toast.error('Passwords must match.');
      return;
    }
    setBusyId(adminId);
    try {
      await resetLmsAdminPassword(adminId, {
        password: resetPassword,
        password_confirmation: resetPasswordConfirm,
      });
      toast.success('Password reset.');
      setPendingResetRow(null);
      setResetPassword('');
      setResetPasswordConfirm('');
    } catch (error) {
      toast.error(getLmsAxiosErrorMessage(error, 'Could not reset password.'));
    } finally {
      setBusyId(null);
    }
  };

  return (
    <>
      <title>{`Admins | Dashboard - ${CONFIG.appName}`}</title>
      <InstructorWorkspaceShell>
        <Stack spacing={3}>
          <Box>
            <Typography variant="h4">Admins</Typography>
            <Typography variant="body2" color="text.secondary">
              Register administrator accounts. The first admin can also be created at /register-admin
              before anyone is signed in.
            </Typography>
          </Box>

          <Card>
            <CardContent>
              <Stack spacing={2}>
                <Typography variant="h6">{editingId ? 'Edit admin' : 'Register admin'}</Typography>
                <Grid container spacing={2} columns={{ xs: 12, md: 12 }}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      label="Full name"
                      value={form.name}
                      onChange={handleChange('name')}
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      label="Email"
                      type="email"
                      value={form.email}
                      onChange={handleChange('email')}
                      fullWidth
                      required
                      autoComplete="off"
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      label={editingId ? 'New password (optional)' : 'Password'}
                      type={showPassword.value ? 'text' : 'password'}
                      value={form.password}
                      onChange={handleChange('password')}
                      fullWidth
                      required={!editingId}
                      autoComplete="new-password"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={showPassword.onToggle} edge="end">
                              <Iconify
                                icon={
                                  showPassword.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'
                                }
                              />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      label="Confirm password"
                      type={showPassword.value ? 'text' : 'password'}
                      value={form.passwordConfirm}
                      onChange={handleChange('passwordConfirm')}
                      fullWidth
                      required={!editingId}
                      autoComplete="new-password"
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <FormControl fullWidth size="small">
                      <InputLabel id="admin-status-label">Account status</InputLabel>
                      <Select
                        labelId="admin-status-label"
                        label="Account status"
                        value={form.status}
                        onChange={handleChange('status')}
                      >
                        <MenuItem value="active">active</MenuItem>
                        <MenuItem value="inactive">inactive</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
                <Stack direction="row" spacing={1}>
                  <Button variant="contained" onClick={handleSubmit} disabled={saving || !canSubmit}>
                    {editingId ? 'Update' : 'Register'}
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
                  <Typography variant="h6">Admin list</Typography>
                  <TextField
                    size="small"
                    label="Search"
                    placeholder="Name or email…"
                    value={searchDraft}
                    onChange={(event) => setSearchDraft(event.target.value)}
                    sx={{ maxWidth: { xs: '100%', sm: 280 } }}
                  />
                </Stack>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {listLoading ? (
                        <TableRow>
                          <TableCell colSpan={4}>Loading…</TableCell>
                        </TableRow>
                      ) : null}
                      {!listLoading && rows.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4}>No admin accounts found.</TableCell>
                        </TableRow>
                      ) : null}
                      {rows.map((row) => (
                        <TableRow key={row.id} hover>
                          <TableCell>{row.name}</TableCell>
                          <TableCell>{row.email}</TableCell>
                          <TableCell>{row.status}</TableCell>
                          <TableCell align="right">
                            <Stack direction="row" spacing={1} justifyContent="flex-end" flexWrap="wrap">
                              <Button size="small" onClick={() => handleEdit(row)}>
                                Edit
                              </Button>
                              <Button
                                size="small"
                                disabled={busyId === row.id}
                                onClick={() => {
                                  setPendingResetRow(row);
                                  setResetPassword('');
                                  setResetPasswordConfirm('');
                                  showResetPassword.onFalse();
                                }}
                              >
                                Reset password
                              </Button>
                              <Button
                                size="small"
                                color="error"
                                disabled={busyId === row.id || row.id === currentUserId}
                                onClick={() => {
                                  setPendingDeleteRow(row);
                                  setConfirmOpen(true);
                                }}
                              >
                                Delete
                              </Button>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      </InstructorWorkspaceShell>

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => {
          setConfirmOpen(false);
          setPendingDeleteRow(null);
        }}
        title="Delete admin"
        content={`Delete ${pendingDeleteRow?.name ?? 'this admin'}? They will no longer be able to sign in.`}
        action={
          <Button color="error" variant="contained" onClick={handleDelete} disabled={Boolean(busyId)}>
            Delete
          </Button>
        }
      />

      <ConfirmDialog
        open={Boolean(pendingResetRow)}
        onClose={() => {
          setPendingResetRow(null);
          setResetPassword('');
          setResetPasswordConfirm('');
        }}
        title="Reset password"
        content={
          <Stack spacing={2} sx={{ pt: 1 }}>
            <Typography variant="body2">
              Set a new password for {pendingResetRow?.name ?? 'this admin'}.
            </Typography>
            <TextField
              label="New password"
              type={showResetPassword.value ? 'text' : 'password'}
              value={resetPassword}
              onChange={(event) => setResetPassword(event.target.value)}
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={showResetPassword.onToggle} edge="end">
                      <Iconify
                        icon={showResetPassword.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                      />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Confirm password"
              type={showResetPassword.value ? 'text' : 'password'}
              value={resetPasswordConfirm}
              onChange={(event) => setResetPasswordConfirm(event.target.value)}
              fullWidth
            />
          </Stack>
        }
        action={
          <Button variant="contained" onClick={handleResetPassword} disabled={Boolean(busyId)}>
            Save password
          </Button>
        }
      />
    </>
  );
}
