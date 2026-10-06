import { useSearchParams } from 'react-router';
import { useRef, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import CardContent from '@mui/material/CardContent';

import {
  useLmsUser,
  useLmsActions,
  useLmsInstructorsPaginated,
  useRefreshInstructorsCatalog,
} from 'src/hooks/use-lms';

import { resolveApiAssetUrl } from 'src/utils/resolve-api-asset-url';

import { CONFIG } from 'src/global-config';
import { downloadLmsExcelExport } from 'src/lib/lms-excel-export';
import { getLmsAxiosErrorMessage } from 'src/lib/lms-instructor-api';
import { normalizeProgramsPage, normalizeProgramsPerPage } from 'src/services/programService';
import { StudentWorkspaceShell } from 'src/features/student-profile/components/student-workspace-shell';
import { InstructorWorkspaceShell } from 'src/features/instructor-profile/components/instructor-workspace-shell';

import { Editor } from 'src/components/editor';
import { toast } from 'src/components/snackbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { ExportExcelButton } from 'src/components/export-excel-button';
import { InstructorTable } from 'src/components/instructors/InstructorTable';
import { ServerListPagination, ServerListPerPageControl } from 'src/components/server-pagination';

const DEFAULT_FORM = {
  name: '',
  email: '',
  status: 'active',
  achievements: '',
  profilePath: '',
  profileImageFile: null,
  profilePreviewUrl: '',
};

export default function InstructorsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = normalizeProgramsPage(searchParams.get('page'));
  const perPage = normalizeProgramsPerPage(searchParams.get('per_page'));

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
    instructors,
    meta,
    isLoading: listLoading,
    error: listError,
    mutate: mutateInstructorsPage,
  } = useLmsInstructorsPaginated(page, perPage, debouncedSearch);
  const refreshInstructorsCatalog = useRefreshInstructorsCatalog();
  const { runCommand } = useLmsActions();
  const { user } = useLmsUser();
  const [form, setForm] = useState(DEFAULT_FORM);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [busyId, setBusyId] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDeleteRow, setPendingDeleteRow] = useState(null);

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

  const refetchInstructorLists = useCallback(async () => {
    await Promise.all([mutateInstructorsPage(), refreshInstructorsCatalog()]);
  }, [mutateInstructorsPage, refreshInstructorsCatalog]);

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
      const normalized = normalizeProgramsPerPage(nextPer);
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

  const canSubmit = Boolean(form.name.trim()) && Boolean(form.email.trim());
  const role = typeof user?.role === 'string' ? user.role.trim().toLowerCase() : '';
  const isInstructorLike = role === 'instructor' || role === 'admin';
  const WorkspaceShell = isInstructorLike ? InstructorWorkspaceShell : StudentWorkspaceShell;

  const handleChange = (key) => (event) =>
    setForm((prev) => ({
      ...prev,
      [key]: event.target.value,
    }));

  const resetForm = () => {
    setForm(DEFAULT_FORM);
    setEditingId(null);
  };

  const resolveProfileSrc = (value) => resolveApiAssetUrl(value);

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.email.trim()) {
      toast.error('Name and email are required.');
      return;
    }
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('name', form.name.trim());
      formData.append('email', form.email.trim());
      formData.append('status', form.status);
      formData.append('achievements', form.achievements.trim() || '');
      if (form.profileImageFile) {
        formData.append('profileImage', form.profileImageFile);
      } else if (form.profilePath.trim()) {
        formData.append('profilePath', form.profilePath.trim());
      }

      if (editingId) {
        await runCommand('instructor.update', { publicId: editingId, body: formData });
        toast.success('Instructor updated.');
      } else {
        await runCommand('instructor.create', formData);
        toast.success('Instructor created.');
      }

      await refetchInstructorLists();
      resetForm();
    } catch (err) {
      toast.error(getLmsAxiosErrorMessage(err, 'Could not save instructor.'));
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (row) => {
    setEditingId(row.id);
    setForm({
      name: row.name ?? '',
      email: row.email ?? '',
      status: row.status === 'inactive' ? 'inactive' : 'active',
      achievements: row.achievements ?? '',
      profilePath: row.profilePath ?? '',
      profileImageFile: null,
      profilePreviewUrl: resolveProfileSrc(row.profileUrl ?? row.profilePath ?? ''),
    });
  };

  const handleDelete = async () => {
    const instructorId = pendingDeleteRow?.id;
    if (!instructorId) {
      return;
    }
    setBusyId(instructorId);
    try {
      await runCommand('instructor.delete', { publicId: instructorId });
      toast.success('Instructor deleted.');
      setConfirmOpen(false);
      setPendingDeleteRow(null);
      await refetchInstructorLists();
    } catch (err) {
      toast.error(getLmsAxiosErrorMessage(err, 'Could not delete instructor.'));
    } finally {
      setBusyId(null);
    }
  };

  return (
    <>
      <title>{`Instructors | Dashboard - ${CONFIG.appName}`}</title>
      <WorkspaceShell>
        <Stack spacing={3}>
          <Box>
            <Typography variant="h4">Instructors</Typography>
            <Typography variant="body2" color="text.secondary">
              Name and email are stored on the user account (editable here). Achievements and profile photo are saved on
              the instructor profile.
            </Typography>
          </Box>

          <Card>
            <CardContent>
              <Stack spacing={2}>
                <Typography variant="h6">{editingId ? 'Edit instructor' : 'Create new instructor'}</Typography>
                <Grid container spacing={2} alignItems="stretch" columns={{ xs: 12, md: 12 }}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      label="Name"
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
                    <FormControl fullWidth size="small">
                      <InputLabel id="instructor-status-label">Account status</InputLabel>
                      <Select
                        labelId="instructor-status-label"
                        label="Account status"
                        value={form.status}
                        onChange={handleChange('status')}
                      >
                        <MenuItem value="active">active</MenuItem>
                        <MenuItem value="inactive">inactive</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Stack spacing={1} sx={{ width: '100%', height: '100%' }}>
                      <Button
                        variant="outlined"
                        component="label"
                        fullWidth
                        sx={{ height: 56, borderRadius: 1 }}
                      >
                        Upload profile photo
                        <input
                          type="file"
                          hidden
                          accept="image/*"
                          onClick={(event) => {
                            event.currentTarget.value = '';
                          }}
                          onChange={(event) => {
                            const file = event.target.files?.[0] ?? null;
                            if (!file) return;
                            const preview = URL.createObjectURL(file);
                            setForm((prev) => ({
                              ...prev,
                              profilePath: '',
                              profileImageFile: file,
                              profilePreviewUrl: preview,
                            }));
                          }}
                        />
                      </Button>
                    </Stack>
                  </Grid>
                  <Grid size={{ xs: 12, md: 12 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                      Achievements
                    </Typography>
                    <Editor
                      key={`instructor-achievements-${editingId ?? 'new'}`}
                      value={form.achievements}
                      debounceMs={0}
                      onChange={(html) =>
                        setForm((prev) => ({
                          ...prev,
                          achievements: html,
                        }))
                      }
                      chrome="tinymce"
                      placeholder="Highlight certifications, publications, awards…"
                      sx={{
                        minHeight: 260,
                        maxHeight: 520,
                      }}
                      tinymceResizeBounds={{
                        min: 140,
                        max: 420,
                      }}
                    />
                  </Grid>
                </Grid>
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
                {form.profilePreviewUrl || form.profilePath ? (
                  <Box
                    component="img"
                    src={form.profilePreviewUrl || resolveProfileSrc(form.profilePath)}
                    alt="Profile preview"
                    sx={{
                      width: 120,
                      height: 120,
                      objectFit: 'cover',
                      borderRadius: '50%',
                      border: (theme) => `1px solid ${theme.vars.palette.divider}`,
                    }}
                  />
                ) : null}
              </Stack>
            </CardContent>
          </Card>

          {listErrorMessage ? (
            <Alert severity="error">{listErrorMessage}</Alert>
          ) : null}

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
                    Instructor list
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap" useFlexGap>
                    <ExportExcelButton
                      disabled={listLoading}
                      onExport={({ from, to }) =>
                        downloadLmsExcelExport(
                          '/api/instructors/export',
                          { search: debouncedSearch, from, to },
                          'instructors.xlsx'
                        )
                      }
                      successMessage="Instructor list exported to Excel."
                    />
                    <ServerListPerPageControl
                      perPage={perPage}
                      onPerPageChange={changePerPage}
                      disabled={listLoading}
                    />
                  </Stack>
                </Stack>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                  Row id is the user&apos;s public UID (used for update/delete in the API).
                </Typography>
                <Typography component="div" variant="body2" color="text.secondary" sx={{ maxWidth: 560 }}>
                  Search matches user name, email, account status, and achievements.
                </Typography>
                <TextField
                  size="small"
                  label="Search"
                  placeholder="Name, email, status, or achievements…"
                  value={searchDraft}
                  onChange={(e) => setSearchDraft(e.target.value)}
                  sx={{ maxWidth: { xs: '100%', sm: 360 } }}
                />
                <InstructorTable
                  rows={instructors}
                  loading={listLoading}
                  resolveProfileSrc={resolveProfileSrc}
                  onEdit={handleEdit}
                  onDelete={(row) => {
                    setPendingDeleteRow(row);
                    setConfirmOpen(true);
                  }}
                  busyId={busyId}
                  emptyMessage={
                    debouncedSearch ? 'No instructors match your search.' : 'No instructors found'
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
      </WorkspaceShell>
      <ConfirmDialog
        open={confirmOpen}
        onClose={() => {
          setConfirmOpen(false);
          setPendingDeleteRow(null);
        }}
        title="Delete instructor"
        content={
          <>
            Delete instructor <strong>{pendingDeleteRow?.name ?? ''}</strong>? This action performs a soft
            delete only.
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
