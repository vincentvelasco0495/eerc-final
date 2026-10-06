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
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';

import {
  useLmsUser,
  useLmsActions,
  useLmsProgramsPaginated,
  useRefreshLmsProgramsCatalog,
} from 'src/hooks/use-lms';

import { resolveApiAssetUrl } from 'src/utils/resolve-api-asset-url';

import { CONFIG } from 'src/global-config';
import { downloadLmsExcelExport } from 'src/lib/lms-excel-export';
import {
  getLmsAxiosErrorMessage,
} from 'src/lib/lms-instructor-api';
import { normalizeProgramsPage, normalizeProgramsPerPage } from 'src/services/programService';
import { StudentWorkspaceShell } from 'src/features/student-profile/components/student-workspace-shell';
import { InstructorWorkspaceShell } from 'src/features/instructor-profile/components/instructor-workspace-shell';

import { Editor } from 'src/components/editor';
import { toast } from 'src/components/snackbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { ProgramTable } from 'src/components/programs/ProgramTable';
import { ExportExcelButton } from 'src/components/export-excel-button';
import { ServerListPagination, ServerListPerPageControl } from 'src/components/server-pagination';

const DEFAULT_FORM = {
  code: '',
  slug: '',
  title: '',
  description: '',
  enrollmentFee: '',
  status: 'active',
  bannerPath: '',
  bannerImageFile: null,
  bannerPreviewUrl: '',
};

function normalizeFeeInput(value) {
  const raw = String(value ?? '').trim();
  if (!raw) return '';
  return raw.replace(/[^0-9.]/g, '');
}

export default function ProgramsPage() {
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
    programs,
    meta,
    isLoading: listLoading,
    error: listError,
    mutate: mutateProgramsPage,
  } = useLmsProgramsPaginated(page, perPage, debouncedSearch);
  const refreshProgramsCatalog = useRefreshLmsProgramsCatalog();
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

  const refetchProgramLists = useCallback(async () => {
    await Promise.all([mutateProgramsPage(), refreshProgramsCatalog()]);
  }, [mutateProgramsPage, refreshProgramsCatalog]);

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

  const canSubmit = form.code.trim() !== '' && form.title.trim() !== '';
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

  const resolveBannerSrc = (value) => resolveApiAssetUrl(value);

  const handleSubmit = async () => {
    if (!canSubmit) {
      toast.error('Code and title are required.');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        code: form.code.trim(),
        slug: form.slug.trim(),
        title: form.title.trim(),
        description: form.description.trim() || null,
        status: form.status,
      };
      const formData = new FormData();
      formData.append('code', payload.code);
      formData.append('slug', payload.slug);
      formData.append('title', payload.title);
      formData.append('description', payload.description ?? '');
      formData.append('status', payload.status);
      if (form.enrollmentFee !== '') {
        const fee = Number(normalizeFeeInput(form.enrollmentFee));
        if (Number.isFinite(fee) && fee >= 0) {
          formData.append('enrollmentFee', String(fee));
        }
      } else if (editingId) {
        formData.append('enrollmentFee', '');
      }
      if (form.bannerImageFile) {
        formData.append('bannerImage', form.bannerImageFile);
      } else if (form.bannerPath.trim()) {
        formData.append('bannerPath', form.bannerPath.trim());
      }

      if (editingId) {
        await runCommand('program.update', { publicId: editingId, body: formData });
        toast.success('Program updated.');
      } else {
        await runCommand('program.create', formData);
        toast.success('Program created.');
      }

      await refetchProgramLists();
      resetForm();
    } catch (err) {
      toast.error(getLmsAxiosErrorMessage(err, 'Could not save program.'));
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (row) => {
    setEditingId(row.id);
    setForm({
      code: row.code ?? '',
      slug: row.slug ?? '',
      title: row.title ?? '',
      description: row.description ?? '',
      enrollmentFee: normalizeFeeInput(row.enrollmentFee ?? row.enrollment_fee ?? ''),
      status: row.status === 'inactive' ? 'inactive' : 'active',
      bannerPath: row.bannerPath ?? '',
      bannerImageFile: null,
      bannerPreviewUrl: resolveBannerSrc(row.bannerUrl ?? row.bannerPath ?? ''),
    });
  };

  const handleDelete = async () => {
    const programId = pendingDeleteRow?.id;
    if (!programId) {
      return;
    }
    setBusyId(programId);
    try {
      await runCommand('program.delete', { publicId: programId });
      toast.success('Program deleted.');
      setConfirmOpen(false);
      setPendingDeleteRow(null);
      await refetchProgramLists();
    } catch (err) {
      toast.error(getLmsAxiosErrorMessage(err, 'Could not delete program.'));
    } finally {
      setBusyId(null);
    }
  };

  return (
    <>
      <title>{`Programs | Dashboard - ${CONFIG.appName}`}</title>
      <WorkspaceShell>
        <Stack spacing={3}>
          <Box>
            <Typography variant="h4">Programs</Typography>
            <Typography variant="body2" color="text.secondary">
              Manage program catalog entries (CRUD), enrollment fee, status, and banner path.
            </Typography>
          </Box>

          <Card>
            <CardContent>
              <Stack spacing={2}>
                <Typography variant="h6">{editingId ? 'Edit program' : 'Create new program'}</Typography>
                <Grid container spacing={2} alignItems="stretch" columns={{ xs: 12, md: 15 }}>
                  <Grid size={{ xs: 12, md: 3 }}>
                    <TextField label="Code" value={form.code} onChange={handleChange('code')} fullWidth />
                  </Grid>
                  <Grid size={{ xs: 12, md: 3 }}>
                    <TextField label="Slug" value={form.slug} onChange={handleChange('slug')} fullWidth />
                  </Grid>
                  <Grid size={{ xs: 12, md: 3 }}>
                    <TextField label="Title" value={form.title} onChange={handleChange('title')} fullWidth />
                  </Grid>
                  <Grid size={{ xs: 12, md: 3 }}>
                    <TextField
                      label="Enrollment fee (PHP)"
                      type="number"
                      value={form.enrollmentFee}
                      onChange={handleChange('enrollmentFee')}
                      fullWidth
                      placeholder="e.g. 8500"
                      inputProps={{ min: 0, step: '0.01' }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 3 }}>
                    <Select value={form.status} onChange={handleChange('status')} fullWidth>
                      <MenuItem value="active">active</MenuItem>
                      <MenuItem value="inactive">inactive</MenuItem>
                    </Select>
                  </Grid>
                  <Grid size={{ xs: 12, md: 3 }}>
                    <Stack spacing={1} sx={{ width: '100%', height: '100%' }}>
                      <Button
                        variant="outlined"
                        component="label"
                        fullWidth
                        sx={{ height: 56, borderRadius: 1 }}
                      >
                        Upload banner image
                        <input
                          type="file"
                          hidden
                          accept="image/*"
                          onClick={(event) => {
                            // Allow re-selecting the same file name in consecutive edits.
                            event.currentTarget.value = '';
                          }}
                          onChange={(event) => {
                            const file = event.target.files?.[0] ?? null;
                            if (!file) return;
                            const preview = URL.createObjectURL(file);
                            setForm((prev) => ({
                              ...prev,
                              bannerPath: '',
                              bannerImageFile: file,
                              bannerPreviewUrl: preview,
                            }));
                          }}
                        />
                      </Button>
                    </Stack>
                  </Grid>
                  <Grid size={{ xs: 12, md: 15 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                      Description
                    </Typography>
                    <Editor
                      key={editingId ? `program-description-${editingId}` : 'program-description-create'}
                      value={form.description}
                      contentRevision={editingId ?? 'program-description-create'}
                      revisionApplyHtml={form.description}
                      debounceMs={0}
                      onChange={(html) =>
                        setForm((prev) => ({
                          ...prev,
                          description: html,
                        }))
                      }
                      chrome="tinymce"
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
                {form.bannerPreviewUrl || form.bannerPath ? (
                  <Box
                    component="img"
                    src={form.bannerPreviewUrl || resolveBannerSrc(form.bannerPath)}
                    alt="Program banner preview"
                    sx={{
                      width: '100%',
                      maxWidth: 420,
                      height: 180,
                      objectFit: 'cover',
                      borderRadius: 1.5,
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
                    Program list
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap" useFlexGap>
                    <ExportExcelButton
                      disabled={listLoading}
                      onExport={({ from, to }) =>
                        downloadLmsExcelExport(
                          '/api/programs/export',
                          { search: debouncedSearch, from, to },
                          'programs.xlsx'
                        )
                      }
                      successMessage="Program list exported to Excel."
                    />
                    <ServerListPerPageControl
                      perPage={perPage}
                      onPerPageChange={changePerPage}
                      disabled={listLoading}
                    />
                  </Stack>
                </Stack>
                <TextField
                  size="small"
                  label="Search"
                  placeholder="Filter by title, code, or slug…"
                  value={searchDraft}
                  onChange={(e) => setSearchDraft(e.target.value)}
                  sx={{ maxWidth: { xs: '100%', sm: 360 } }}
                />
                <ProgramTable
                  programs={programs}
                  loading={listLoading}
                  resolveBannerSrc={resolveBannerSrc}
                  onEdit={handleEdit}
                  onDelete={(row) => {
                    setPendingDeleteRow(row);
                    setConfirmOpen(true);
                  }}
                  busyId={busyId}
                  emptyMessage={
                    debouncedSearch ? 'No programs match your search.' : 'No programs found'
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
        title="Delete program"
        content={
          <>
            Delete program <strong>{pendingDeleteRow?.title ?? ''}</strong>? This action performs a
            soft delete only.
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

