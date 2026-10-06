import { useSearchParams } from 'react-router';
import { useRef, useMemo, useState, useEffect, useCallback } from 'react';

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
  useLmsPrograms,
  useLmsBatchEnrollsPaginated,
} from 'src/hooks/use-lms';

import { CONFIG } from 'src/global-config';
import { downloadLmsExcelExport } from 'src/lib/lms-excel-export';
import { getLmsAxiosErrorMessage } from 'src/lib/lms-instructor-api';
import { StudentWorkspaceShell } from 'src/features/student-profile/components/student-workspace-shell';
import {
  normalizeBatchEnrollPage,
  normalizeBatchEnrollPerPage,
} from 'src/services/batchEnrollService';
import { InstructorWorkspaceShell } from 'src/features/instructor-profile/components/instructor-workspace-shell';

import { Editor } from 'src/components/editor';
import { toast } from 'src/components/snackbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { ExportExcelButton } from 'src/components/export-excel-button';
import { BatchEnrollTable } from 'src/components/batch-enrolls/BatchEnrollTable';
import { ServerListPagination, ServerListPerPageControl } from 'src/components/server-pagination';

const DEFAULT_FORM = {
  programId: '',
  name: '',
  tentativeStart: '',
  description: '',
  status: 'active',
  sortOrder: '1',
};

export default function BatchEnrollsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = normalizeBatchEnrollPage(searchParams.get('page'));
  const perPage = normalizeBatchEnrollPerPage(searchParams.get('per_page'));

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
    batchEnrolls,
    meta,
    isLoading: listLoading,
    error: listError,
    mutate: mutateBatchEnrollsPage,
  } = useLmsBatchEnrollsPaginated(page, perPage, debouncedSearch);
  const { programs } = useLmsPrograms();
  const { runCommand } = useLmsActions();
  const { user } = useLmsUser();
  const [form, setForm] = useState(DEFAULT_FORM);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [busyId, setBusyId] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDeleteRow, setPendingDeleteRow] = useState(null);

  const programTitleById = useMemo(
    () => new Map((programs ?? []).map((program) => [program.id, program.title])),
    [programs]
  );

  const resolveProgramTitle = useCallback(
    (programId) => programTitleById.get(programId) ?? programId ?? '—',
    [programTitleById]
  );

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
      const normalized = normalizeBatchEnrollPerPage(nextPer);
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

  const canSubmit = form.programId.trim() !== '' && form.name.trim() !== '';
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

  const handleSubmit = async () => {
    if (!canSubmit) {
      toast.error('Program and name are required.');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        programId: form.programId.trim(),
        name: form.name.trim(),
        tentativeStart: form.tentativeStart.trim() || null,
        description: form.description.trim() || null,
        status: form.status,
        sortOrder: Number.parseInt(String(form.sortOrder ?? '1'), 10) || 1,
      };

      if (editingId) {
        await runCommand('batchEnroll.update', { publicId: editingId, body: payload });
        toast.success('Batch enroll updated.');
      } else {
        await runCommand('batchEnroll.create', payload);
        toast.success('Batch enroll created.');
      }

      await mutateBatchEnrollsPage();
      resetForm();
    } catch (err) {
      toast.error(getLmsAxiosErrorMessage(err, 'Could not save batch enroll entry.'));
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (row) => {
    setEditingId(row.id);
    setForm({
      programId: row.programId ?? '',
      name: row.name ?? '',
      tentativeStart: row.tentativeStart ?? '',
      description: row.description ?? '',
      status: row.status === 'inactive' ? 'inactive' : 'active',
      sortOrder: String(row.sortOrder ?? 1),
    });
  };

  const handleDelete = async () => {
    const batchId = pendingDeleteRow?.id;
    if (!batchId) {
      return;
    }

    setBusyId(batchId);
    try {
      await runCommand('batchEnroll.delete', { publicId: batchId });
      toast.success('Batch enroll deleted.');
      setConfirmOpen(false);
      setPendingDeleteRow(null);
      await mutateBatchEnrollsPage();
    } catch (err) {
      toast.error(getLmsAxiosErrorMessage(err, 'Could not delete batch enroll entry.'));
    } finally {
      setBusyId(null);
    }
  };

  return (
    <>
      <title>{`Batch enroll | Dashboard - ${CONFIG.appName}`}</title>
      <WorkspaceShell>
        <Stack spacing={3}>
          <Box>
            <Typography variant="h4">Batch enroll</Typography>
            <Typography variant="body2" color="text.secondary">
              Manage enrollment batches shown to students during program enrollment.
            </Typography>
          </Box>

          <Card>
            <CardContent>
              <Stack spacing={2}>
                <Typography variant="h6">
                  {editingId ? 'Edit batch enroll' : 'Create new batch enroll'}
                </Typography>
                <Grid container spacing={2} alignItems="stretch" columns={{ xs: 12, md: 15 }}>
                  <Grid size={{ xs: 12, md: 3 }}>
                    <Select
                      value={form.programId}
                      onChange={handleChange('programId')}
                      displayEmpty
                      fullWidth
                    >
                      <MenuItem value="" disabled>
                        Select program
                      </MenuItem>
                      {(programs ?? []).map((program) => (
                        <MenuItem key={program.id} value={program.id}>
                          {program.title}
                        </MenuItem>
                      ))}
                    </Select>
                  </Grid>
                  <Grid size={{ xs: 12, md: 3 }}>
                    <TextField
                      label="Batch name"
                      value={form.name}
                      onChange={handleChange('name')}
                      fullWidth
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 3 }}>
                    <TextField
                      label="Tentative start"
                      value={form.tentativeStart}
                      onChange={handleChange('tentativeStart')}
                      placeholder="April 3rd week"
                      fullWidth
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 3 }}>
                    <Select value={form.status} onChange={handleChange('status')} fullWidth>
                      <MenuItem value="active">active</MenuItem>
                      <MenuItem value="inactive">inactive</MenuItem>
                    </Select>
                  </Grid>
                  <Grid size={{ xs: 12, md: 3 }}>
                    <TextField
                      label="Sort order"
                      type="number"
                      value={form.sortOrder}
                      onChange={handleChange('sortOrder')}
                      fullWidth
                      inputProps={{ min: 1 }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 15 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                      Description / notes
                    </Typography>
                    <Editor
                      key={editingId ? `batch-enroll-description-${editingId}` : 'batch-enroll-description-create'}
                      value={form.description}
                      contentRevision={editingId ?? 'batch-enroll-description-create'}
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
                        minHeight: 220,
                        maxHeight: 420,
                      }}
                      tinymceResizeBounds={{
                        min: 120,
                        max: 360,
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
                  <Typography variant="h6" sx={{ minWidth: 0 }}>
                    Batch enroll list
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap" useFlexGap>
                    <ExportExcelButton
                      disabled={listLoading}
                      onExport={({ from, to }) =>
                        downloadLmsExcelExport(
                          '/api/batch-enrolls/export',
                          { search: debouncedSearch, from, to },
                          'batch-enrolls.xlsx'
                        )
                      }
                      successMessage="Batch enroll list exported to Excel."
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
                  placeholder="Filter by batch name, program, or start schedule…"
                  value={searchDraft}
                  onChange={(e) => setSearchDraft(e.target.value)}
                  sx={{ maxWidth: { xs: '100%', sm: 360 } }}
                />
                <BatchEnrollTable
                  rows={batchEnrolls}
                  loading={listLoading}
                  resolveProgramTitle={resolveProgramTitle}
                  onEdit={handleEdit}
                  onDelete={(row) => {
                    setPendingDeleteRow(row);
                    setConfirmOpen(true);
                  }}
                  busyId={busyId}
                  emptyMessage={
                    debouncedSearch ? 'No batch enroll entries match your search.' : 'No batch enroll entries found'
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
        title="Delete batch enroll"
        content={
          <>
            Delete batch <strong>{pendingDeleteRow?.name ?? ''}</strong>? This action cannot be undone.
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
