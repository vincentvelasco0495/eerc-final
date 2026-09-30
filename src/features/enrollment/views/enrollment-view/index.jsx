import { useMemo, useState, useEffect, useCallback } from 'react';

import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';

import { useEnrollment, useLmsActions, useLmsCourses, useLmsPrograms } from 'src/hooks/use-lms';

import { LMS_PROGRAM_SELECT_OPTIONS } from 'src/constants/lms';
import { isPublishedCatalogCourse } from 'src/features/student-profile/student-profile-data';

import { toast } from 'src/components/snackbar';
import { LmsStatCard } from 'src/components/ui/lms-stat-card';
import { LmsPageShell } from 'src/components/layout/lms-page-shell';
import { EnrollmentPaymentDialog } from 'src/components/enrollments/enrollment-payment-dialog';

import { styles } from './styles';

const programLabelById = Object.fromEntries(
  LMS_PROGRAM_SELECT_OPTIONS.map((option) => [option.id, option.label])
);

export function EnrollmentView() {
  const { programs } = useLmsPrograms();
  const enrollment = useEnrollment();
  const { submitEnrollment } = useLmsActions();
  const [selectedProgramId, setSelectedProgramId] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [applyDialogOpen, setApplyDialogOpen] = useState(false);
  const [applySubmitting, setApplySubmitting] = useState(false);

  const { courses: programCourses } = useLmsCourses(1, 200, selectedProgramId || '');

  const publishedProgramCourses = useMemo(
    () => (programCourses ?? []).filter(isPublishedCatalogCourse),
    [programCourses]
  );

  const defaultProgramId = useMemo(() => {
    for (const option of LMS_PROGRAM_SELECT_OPTIONS) {
      const hasBlockingEnrollment = enrollment.some(
        (item) =>
          item.programId === option.id &&
          !item.courseId &&
          ['pending', 'approved', 'hold'].includes(item.status)
      );
      if (!hasBlockingEnrollment) {
        return option.id;
      }
    }
    return LMS_PROGRAM_SELECT_OPTIONS[0]?.id ?? '';
  }, [enrollment]);

  useEffect(() => {
    const first = publishedProgramCourses.find((c) => c?.id)?.id ?? '';
    if (!selectedProgramId) {
      setSelectedCourseId('');
      return;
    }
    setSelectedCourseId((prev) => {
      if (prev && publishedProgramCourses.some((c) => c.id === prev)) {
        return prev;
      }
      return first;
    });
  }, [publishedProgramCourses, selectedProgramId]);

  const canSubmitCourse = useMemo(() => {
    if (!selectedCourseId) {
      return false;
    }
    const selected = publishedProgramCourses.find((c) => c.id === selectedCourseId);
    if (!selected || !isPublishedCatalogCourse(selected)) {
      return false;
    }
    return !enrollment.some(
      (item) =>
        item.courseId === selectedCourseId && ['pending', 'approved', 'hold'].includes(item.status)
    );
  }, [enrollment, publishedProgramCourses, selectedCourseId]);

  useEffect(() => {
    if (!selectedProgramId && defaultProgramId) {
      setSelectedProgramId(defaultProgramId);
    }
  }, [defaultProgramId, selectedProgramId]);

  const resolveProgramTitle = (programId) => {
    const fromApi = programs.find((program) => program.id === programId)?.title;
    return fromApi ?? programLabelById[programId] ?? programId;
  };

  const resolveCourseTitle = (courseId) => {
    const fromApi = publishedProgramCourses.find((course) => course.id === courseId)?.title;
    return fromApi ?? programCourses.find((course) => course.id === courseId)?.title ?? courseId;
  };

  const selectedProgramTitle = resolveProgramTitle(selectedProgramId);
  const selectedProgram = programs.find((program) => program.id === selectedProgramId);
  const selectedCourseTitle = resolveCourseTitle(selectedCourseId);

  const handleApplySubmit = useCallback(
    async (paymentProofFile) => {
      if (!selectedCourseId) {
        return;
      }

      const selected = publishedProgramCourses.find((c) => c.id === selectedCourseId);
      if (!selected || !isPublishedCatalogCourse(selected)) {
        toast.error('This course is not open for enrollment yet.');
        return;
      }

      setApplySubmitting(true);
      try {
        await submitEnrollment({ courseId: selectedCourseId, paymentProofFile });
        setApplyDialogOpen(false);
      } catch (error) {
        const message =
          typeof error === 'string' ? error : error?.message ?? 'Could not submit enrollment.';
        toast.error(message);
      } finally {
        setApplySubmitting(false);
      }
    },
    [selectedCourseId, submitEnrollment, publishedProgramCourses]
  );

  return (
    <LmsPageShell
      heading="Enrollment"
      links={[{ name: 'Enrollment' }]}
      eyebrow="Course access"
      description="A cleaner enrollment experience for learners to apply, track status, and review approval outcomes."
    >
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <LmsStatCard
            title="Applications"
            value={enrollment.length}
            caption="Enrollment requests recorded"
            icon="solar:clipboard-list-bold-duotone"
            tone="primary"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <LmsStatCard
            title="Approved"
            value={enrollment.filter((item) => item.status === 'approved').length}
            caption="Approved learning tracks"
            icon="solar:check-circle-bold-duotone"
            tone="success"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <LmsStatCard
            title="Pending"
            value={enrollment.filter((item) => item.status === 'pending').length}
            caption="Awaiting admin review"
            icon="solar:alarm-bold-duotone"
            tone="warning"
          />
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <Card sx={styles.cardBorderVars}>
            <CardContent>
              <Stack spacing={2.5}>
                <Typography variant="h6">Apply for a course</Typography>
                <Typography variant="body2" sx={styles.applyDescription}>
                  Choose a program, pick a course inside it, then submit your learner application with payment
                  proof.
                </Typography>
                <TextField
                  select
                  value={selectedProgramId}
                  label="Programs"
                  helperText="Select a program to load its courses."
                  onChange={(event) => setSelectedProgramId(event.target.value)}
                >
                  {LMS_PROGRAM_SELECT_OPTIONS.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  select
                  value={selectedCourseId}
                  label="Course"
                  disabled={!selectedProgramId || !publishedProgramCourses.length}
                  helperText={
                    selectedProgramId && !publishedProgramCourses.length
                      ? 'No published courses found for this program.'
                      : 'One application per course.'
                  }
                  onChange={(event) => setSelectedCourseId(event.target.value)}
                >
                  {publishedProgramCourses.map((course) => (
                    <MenuItem key={course.id} value={course.id}>
                      {course.title ?? course.id}
                    </MenuItem>
                  ))}
                </TextField>
                <Button
                  disabled={!canSubmitCourse}
                  onClick={() => setApplyDialogOpen(true)}
                  variant="contained"
                >
                  Submit application
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 7 }}>
          <Card sx={styles.cardBorderVars}>
            <CardContent>
              <Stack spacing={2.5}>
                <Typography variant="h6">Approval status</Typography>
                {enrollment.map((item) => (
                  <Stack key={item.id} spacing={1.5}>
                    <Stack
                      direction={{ xs: 'column', sm: 'row' }}
                      spacing={1}
                      justifyContent="space-between"
                      alignItems={{ sm: 'center' }}
                    >
                      <Stack spacing={0.5}>
                        <Typography variant="subtitle2">
                          {item.courseTitle
                            ? `${item.courseTitle} · ${resolveProgramTitle(item.programId)}`
                            : resolveProgramTitle(item.programId)}
                        </Typography>
                        <Typography variant="caption" sx={styles.submittedCaption}>
                          Submitted on {item.submittedAt}
                        </Typography>
                      </Stack>
                      <Chip
                        label={item.status}
                        color={
                          item.status === 'approved'
                            ? 'success'
                            : item.status === 'rejected'
                              ? 'error'
                              : 'warning'
                        }
                      />
                    </Stack>
                    <Divider />
                  </Stack>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <EnrollmentPaymentDialog
        open={applyDialogOpen}
        onClose={() => setApplyDialogOpen(false)}
        title="Enroll in course"
        programId={selectedProgramId}
        programCode={selectedProgram?.code}
        programTitle={selectedProgramTitle}
        courseTitle={selectedCourseTitle}
        submitting={applySubmitting}
        onSubmit={handleApplySubmit}
      />
    </LmsPageShell>
  );
}
