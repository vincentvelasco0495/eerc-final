import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';

import { useLmsCourses, useLmsPrograms } from 'src/hooks/use-lms';

import { CourseCard } from 'src/components/ui/course-card';
import { LmsStatCard } from 'src/components/ui/lms-stat-card';
import { LmsPageShell } from 'src/components/layout/lms-page-shell';

import { styles } from './styles';

export function CourseCatalogView() {
  const { programs } = useLmsPrograms();
  const { courses } = useLmsCourses(1, 200);
  const totalLearners = courses.reduce((sum, course) => sum + course.learners, 0);

  return (
    <LmsPageShell
      heading="Programs and courses"
      links={[{ name: 'Courses' }]}
      eyebrow="LMS catalog"
      description="Professional review tracks organized by program, with clean access to course details, progress, and next learning steps."
    >
      <Stack spacing={3}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 4 }} sx={styles.statGrid}>
            <LmsStatCard
              title="Programs"
              value={programs.length}
              caption="CE, Master Plumbing, and Materials Engineering"
              icon="solar:layers-bold-duotone"
              tone="primary"
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }} sx={styles.statGrid}>
            <LmsStatCard
              title="Active courses"
              value={courses.length}
              caption="Structured learning tracks ready to enroll"
              icon="solar:book-2-bold-duotone"
              tone="info"
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }} sx={styles.statGrid}>
            <LmsStatCard
              title="Learners reached"
              value={totalLearners.toLocaleString()}
              caption="Across all current programs"
              icon="solar:users-group-rounded-bold-duotone"
              tone="success"
            />
          </Grid>
        </Grid>

        <Card sx={styles.cardBorderVars}>
          <CardContent>
            <Grid container spacing={2}>
              {programs.map((program, index) => (
                <Grid key={program.id} size={{ xs: 12, md: 4 }}>
                  <Stack spacing={1.5} sx={{ height: '100%' }}>
                    <Typography variant="h6">{program.title}</Typography>
                    <Typography variant="body2" sx={styles.programDescription}>
                      {program.description}
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                      <Chip label={program.code} color="primary" />
                      <Chip label="Streaming ready" variant="outlined" />
                    </Stack>
                    {index < programs.length - 1 && <Divider sx={styles.programsDivider} />}
                  </Stack>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>

        <Grid container spacing={3}>
          {courses.map((course) => (
            <Grid key={course.id} size={{ xs: 12, md: 6, xl: 4 }} sx={styles.courseGrid}>
              <CourseCard course={course} />
            </Grid>
          ))}
        </Grid>
      </Stack>
    </LmsPageShell>
  );
}
