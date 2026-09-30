import { useMemo, useState, useEffect } from 'react';

import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Pagination from '@mui/material/Pagination';

import { useLmsCourses, useLmsPrograms, useLmsEnrollments } from 'src/hooks/use-lms';

import { getProgramEnrollmentForPayment } from 'src/features/enrollment/utils/enrollment-payments';
import { InstructorProgramCard } from 'src/features/instructor-profile/components/instructor-program-card';
import { mapLmsProgramToInstructorCard } from 'src/features/instructor-profile/map-lms-program-to-instructor-card';

import { styles } from '../student-profile-view/styles';
import { getProgramEnrollmentKind } from '../../student-profile-data';
import { StudentWorkspaceShell } from '../../components/student-workspace-shell';

const ITEMS_PER_PAGE = 6;

export function StudentAvailableProgramsView() {
  const { enrollments, mutate: mutateEnrollments } = useLmsEnrollments();
  const { courses } = useLmsCourses(1, 200);
  const { programs } = useLmsPrograms();
  const [page, setPage] = useState(1);

  const programItems = useMemo(
    () =>
      (programs ?? [])
        .filter((program) => String(program?.status ?? 'active').toLowerCase() === 'active')
        .map((program) => ({
          ...mapLmsProgramToInstructorCard(program, courses),
          enrollmentKind: getProgramEnrollmentKind(program.id, enrollments, courses),
        })),
    [courses, enrollments, programs]
  );

  const totalPages = Math.max(1, Math.ceil(programItems.length / ITEMS_PER_PAGE));
  const visiblePrograms = programItems.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  return (
    <StudentWorkspaceShell>
      <Stack spacing={3}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Programs
        </Typography>

        <Grid container spacing={{ xs: 2, sm: 2, md: 2.5 }}>
          {visiblePrograms.map((program) => (
            <Grid key={program.id} size={{ xs: 12, sm: 6, lg: 4 }} sx={styles.courseGrid}>
              <InstructorProgramCard
                program={program}
                readOnly
                enrollmentRecord={getProgramEnrollmentForPayment(program.id, enrollments, courses)}
                onEnrollmentRefresh={mutateEnrollments}
              />
            </Grid>
          ))}
        </Grid>

        {visiblePrograms.length === 0 ? (
          <Stack spacing={0.5} sx={{ py: 2, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              No programs are available right now.
            </Typography>
          </Stack>
        ) : null}

        <Pagination
          page={page}
          count={totalPages}
          shape="rounded"
          color="primary"
          size="small"
          onChange={(_, value) => setPage(value)}
          sx={styles.pagination}
        />
      </Stack>
    </StudentWorkspaceShell>
  );
}
