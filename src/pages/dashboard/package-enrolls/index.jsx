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

import { useLmsActions, useLmsPackageEnrollsPaginated } from 'src/hooks/use-lms';

import { htmlToPlainText } from 'src/utils/html-content';

import { CONFIG } from 'src/global-config';
import { getLmsAxiosErrorMessage } from 'src/lib/lms-instructor-api';
import { InstructorWorkspaceShell } from 'src/features/instructor-profile/components/instructor-workspace-shell';
import {

  normalizePackageEnrollPage,

  normalizePackageEnrollPerPage,

} from 'src/services/packageEnrollService';

import { toast } from 'src/components/snackbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { ExportExcelButton } from 'src/components/export-excel-button';
import { PackageEnrollTable } from 'src/components/package-enrolls/PackageEnrollTable';
import { ServerListPagination, ServerListPerPageControl } from 'src/components/server-pagination';



const DEFAULT_FORM = {

  name: '',

  description: '',

  status: 'active',

  sortOrder: '1',

};



export default function PackageEnrollsPage() {

  const [searchParams, setSearchParams] = useSearchParams();

  const page = normalizePackageEnrollPage(searchParams.get('page'));

  const perPage = normalizePackageEnrollPerPage(searchParams.get('per_page'));



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

    packageEnrolls,

    meta,

    isLoading: listLoading,

    error: listError,

    mutate: mutatePackageEnrollsPage,

  } = useLmsPackageEnrollsPaginated(page, perPage, debouncedSearch);

  const { runCommand } = useLmsActions();

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

      const normalized = normalizePackageEnrollPerPage(nextPer);

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



  const canSubmit = form.name.trim() !== '';



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

      toast.error('Name is required.');

      return;

    }



    setSaving(true);

    try {

      const payload = {

        name: form.name.trim(),

        description: form.description.trim() || null,

        status: form.status,

        sortOrder: Number.parseInt(String(form.sortOrder ?? '1'), 10) || 1,

      };



      if (editingId) {

        await runCommand('packageEnroll.update', { publicId: editingId, body: payload });

        toast.success('Package enroll option updated.');

      } else {

        await runCommand('packageEnroll.create', payload);

        toast.success('Package enroll option created.');

      }



      await mutatePackageEnrollsPage();

      resetForm();

    } catch (err) {

      toast.error(getLmsAxiosErrorMessage(err, 'Could not save package enroll option.'));

    } finally {

      setSaving(false);

    }

  };



  const handleEdit = (row) => {

    setEditingId(row.id);

    setForm({

      name: row.name ?? '',

      description: row.description ?? '',

      status: row.status === 'inactive' ? 'inactive' : 'active',

      sortOrder: String(row.sortOrder ?? 1),

    });

  };



  const handleDelete = async () => {

    const itemId = pendingDeleteRow?.id;

    if (!itemId) {

      return;

    }



    setBusyId(itemId);

    try {

      await runCommand('packageEnroll.delete', { publicId: itemId });

      toast.success('Package enroll option deleted.');

      setConfirmOpen(false);

      setPendingDeleteRow(null);

      await mutatePackageEnrollsPage();

    } catch (err) {

      toast.error(getLmsAxiosErrorMessage(err, 'Could not delete package enroll option.'));

    } finally {

      setBusyId(null);

    }

  };



  return (

    <>

      <title>{`Package enroll | Dashboard - ${CONFIG.appName}`}</title>

      <InstructorWorkspaceShell>

        <Stack spacing={3}>

          <Box>

            <Typography variant="h4">Package enroll</Typography>

            <Typography variant="body2" color="text.secondary">

              Manage package enroll options shown to students during enrollment.

            </Typography>

          </Box>



          <Card>

            <CardContent>

              <Stack spacing={2}>

                <Typography variant="h6">

                  {editingId ? 'Edit option' : 'Create new option'}

                </Typography>

                <Grid container spacing={2} alignItems="stretch" columns={{ xs: 12, md: 12 }}>

                  <Grid size={{ xs: 12 }}>

                    <TextField

                      label="Option name"

                      value={form.name}

                      onChange={handleChange('name')}

                      placeholder="PACKAGE REVIEW AND REFRESHER"

                      fullWidth

                    />

                  </Grid>

                  <Grid size={{ xs: 12, md: 4 }}>

                    <Select value={form.status} onChange={handleChange('status')} fullWidth>

                      <MenuItem value="active">active</MenuItem>

                      <MenuItem value="inactive">inactive</MenuItem>

                    </Select>

                  </Grid>

                  <Grid size={{ xs: 12, md: 4 }}>

                    <TextField

                      label="Sort order"

                      type="number"

                      value={form.sortOrder}

                      onChange={handleChange('sortOrder')}

                      fullWidth

                      inputProps={{ min: 1 }}

                    />

                  </Grid>

                  <Grid size={{ xs: 12 }}>

                    <TextField

                      label="Description / notes"

                      value={form.description}

                      onChange={handleChange('description')}

                      fullWidth

                      multiline

                      minRows={3}

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

                    Package enroll list

                  </Typography>

                  <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap" useFlexGap>

                    <ExportExcelButton

                      fileName="package-enrolls"

                      sheetName="Packages"

                      headers={['Name', 'Status', 'Sort order', 'Description']}

                      rows={packageEnrolls}

                      mapRow={(row) => [

                        row.name ?? '',

                        row.status ?? '',

                        row.sortOrder ?? '',

                        htmlToPlainText(row.description),

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

                <TextField

                  size="small"

                  label="Search"

                  placeholder="Filter by option name or description…"

                  value={searchDraft}

                  onChange={(e) => setSearchDraft(e.target.value)}

                  sx={{ maxWidth: { xs: '100%', sm: 360 } }}

                />

                <PackageEnrollTable

                  rows={packageEnrolls}

                  loading={listLoading}

                  onEdit={handleEdit}

                  onDelete={(row) => {

                    setPendingDeleteRow(row);

                    setConfirmOpen(true);

                  }}

                  busyId={busyId}

                  emptyMessage={

                    debouncedSearch

                      ? 'No options match your search.'

                      : 'No package enroll options found'

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

      <ConfirmDialog

        open={confirmOpen}

        onClose={() => {

          setConfirmOpen(false);

          setPendingDeleteRow(null);

        }}

        title="Delete option"

        content={

          <>

            Delete option <strong>{pendingDeleteRow?.name ?? ''}</strong>? This action cannot be

            undone.

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

