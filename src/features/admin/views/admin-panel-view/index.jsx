import { useMemo, useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Button from '@mui/material/Button';
import { DataGrid } from '@mui/x-data-grid';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import FormControlLabel from '@mui/material/FormControlLabel';

import { useAdminData, useEnrollment, useLmsActions, useLmsCourses, useLmsModulesByCourse } from 'src/hooks/use-lms';

import { downloadLmsExcelExport } from 'src/lib/lms-excel-export';

import { LmsStatCard } from 'src/components/ui/lms-stat-card';
import { LmsPageShell } from 'src/components/layout/lms-page-shell';
import { ExportExcelButton } from 'src/components/export-excel-button';

import { styles } from './styles';

export function AdminPanelView() {
  const [formValues, setFormValues] = useState({
    title: 'New coaching module',
    assetType: 'Video',
  });
  const { admin } = useAdminData();
  const enrollment = useEnrollment();
  const { courses } = useLmsCourses(1, 200);
  const { modules } = useLmsModulesByCourse(courses[0]?.id ?? '');
  const { toggleModuleVisibility, updateEnrollmentStatus, uploadModule } = useLmsActions();

  const userColumns = useMemo(
    () => [
      { field: 'name', headerName: 'User', flex: 1.2 },
      { field: 'role', headerName: 'Role', flex: 1 },
      { field: 'activeProgram', headerName: 'Program', flex: 1.2 },
      { field: 'status', headerName: 'Status', flex: 1 },
    ],
    []
  );

  const enrollmentColumns = useMemo(
    () => [
      { field: 'programTitle', headerName: 'Program', flex: 1.2 },
      { field: 'submittedAt', headerName: 'Submitted', flex: 1 },
      { field: 'status', headerName: 'Status', flex: 1 },
    ],
    []
  );
  const enrollmentRows = useMemo(
    () =>
      enrollment.map((item) => ({
        ...item,
        programTitle:
          courses.find((course) => course.programId === item.programId)?.programTitle ??
          item.programId,
      })),
    [courses, enrollment]
  );

  return (
    <LmsPageShell
      heading="Admin panel"
      links={[{ name: 'Admin' }]}
      eyebrow="Content operations"
      description="A more structured admin workspace for module publishing, visibility control, learner management, and enrollment review."
    >
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <LmsStatCard
            title="Managed users"
            value={admin.users.length}
            caption="Learners and instructors"
            icon="solar:users-group-rounded-bold-duotone"
            tone="primary"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <LmsStatCard
            title="Upload queue"
            value={admin.uploads.length}
            caption="Published and queued assets"
            icon="solar:upload-bold-duotone"
            tone="info"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <LmsStatCard
            title="Enrollment reviews"
            value={enrollment.length}
            caption="Requests visible to admins"
            icon="solar:shield-user-bold-duotone"
            tone="warning"
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={styles.cardBorderVars}>
            <CardContent>
              <Stack spacing={2}>
                <Typography variant="h6">Upload module UI</Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  <Chip label="Video" size="small" />
                  <Chip label="PDF" size="small" />
                  <Chip label="eBook" size="small" />
                </Stack>
                <TextField
                  label="Module title"
                  value={formValues.title}
                  onChange={(event) =>
                    setFormValues((current) => ({ ...current, title: event.target.value }))
                  }
                />
                <TextField
                  select
                  label="Asset type"
                  value={formValues.assetType}
                  onChange={(event) =>
                    setFormValues((current) => ({ ...current, assetType: event.target.value }))
                  }
                >
                  <MenuItem value="Video">Video</MenuItem>
                  <MenuItem value="PDF">PDF</MenuItem>
                  <MenuItem value="eBook">eBook</MenuItem>
                </TextField>
                <Button onClick={() => uploadModule(formValues)} variant="contained">
                  Queue upload
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={styles.cardBorderVars}>
            <CardContent>
              <Stack spacing={2}>
                <Typography variant="h6">Visibility toggles</Typography>
                {modules.map((moduleItem) => (
                  <FormControlLabel
                    key={moduleItem.id}
                    control={
                      <Switch
                        checked={moduleItem.visible}
                        onChange={() => toggleModuleVisibility(moduleItem.id)}
                      />
                    }
                    label={`${moduleItem.title} (${moduleItem.visible ? 'Visible' : 'Hidden'})`}
                  />
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={styles.cardBorderVars}>
            <CardContent>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                spacing={1}
                flexWrap="wrap"
                useFlexGap
                sx={styles.sectionHeading}
              >
                <Typography variant="h6">Manage users</Typography>
                <ExportExcelButton
                  onExport={({ from, to }) =>
                    downloadLmsExcelExport('/api/admin/users/export', { from, to }, 'admin-users.xlsx')
                  }
                  successMessage="Users exported to Excel."
                />
              </Stack>
              <Box sx={styles.dataGridBox}>
                <DataGrid columns={userColumns} rows={admin.users} disableRowSelectionOnClick hideFooter />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={styles.cardBorderVars}>
            <CardContent>
              <Stack spacing={2}>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  spacing={1}
                  flexWrap="wrap"
                  useFlexGap
                >
                  <Typography variant="h6">Manage enrollments</Typography>
                  <ExportExcelButton
                    onExport={({ from, to }) =>
                      downloadLmsExcelExport(
                        '/api/admin/enrollments/export',
                        { from, to },
                        'admin-enrollments.xlsx'
                      )
                    }
                    successMessage="Enrollments exported to Excel."
                  />
                </Stack>
                <Box sx={styles.enrollmentGridBox}>
                  <DataGrid
                    columns={enrollmentColumns}
                    rows={enrollmentRows}
                    disableRowSelectionOnClick
                    hideFooter
                  />
                </Box>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {enrollment.map((item) => (
                    <Button
                      key={item.id}
                      onClick={() =>
                        updateEnrollmentStatus(
                          item.id,
                          item.status === 'approved' ? 'rejected' : 'approved'
                        )
                      }
                      variant="outlined"
                    >
                      Toggle {item.id}
                    </Button>
                  ))}
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </LmsPageShell>
  );
}
