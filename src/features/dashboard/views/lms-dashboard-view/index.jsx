import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useLmsUser, useLmsCourses, useLmsAnalytics, useLmsModulesByCourse } from 'src/hooks/use-lms';

import { ModuleList } from 'src/components/ui/module-list';
import { LmsStatCard } from 'src/components/ui/lms-stat-card';
import { LmsPageShell } from 'src/components/layout/lms-page-shell';

import { styles } from './styles';

export function LmsDashboardView() {
  const { user } = useLmsUser();
  const { courses } = useLmsCourses(1, 200);
  const { analytics } = useLmsAnalytics();
  const featuredCourse = courses[0];
  const { modules: featuredModules } = useLmsModulesByCourse(featuredCourse?.id ?? '');

  return (
    <LmsPageShell
      heading="LMS dashboard"
      eyebrow="Learner workspace"
      description="Track your progress, resume protected content, and move through the review flow with a cleaner learning workspace."
    >
      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          <Card sx={styles.cardBorderVars}>
            <CardContent sx={styles.welcomeCardContent}>
              <Grid container spacing={3} alignItems="center">
                <Grid size={{ xs: 12, md: 8 }}>
                  <Stack spacing={2.5}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar sx={styles.avatar}>{user?.displayName?.slice(0, 1)}</Avatar>
                      <Stack spacing={0.5}>
                        <Typography variant="overline" sx={styles.welcomeEyebrow}>
                          Welcome back
                        </Typography>
                        <Typography variant="h4">{user?.displayName}</Typography>
                      </Stack>
                    </Stack>

                    <Typography variant="body1" sx={styles.welcomeBody}>
                      Continue your structured learning flow across Review, Practice, Refresher, and
                      Final Coaching with your active {user?.activeProgram} track.
                    </Typography>

                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                      <Chip label={`${user?.streak ?? 0}-day streak`} color="warning" />
                      {(user?.badges ?? []).map((badge) => (
                        <Chip key={badge} label={badge} variant="outlined" />
                      ))}
                    </Stack>

                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                      <Button component={RouterLink} href={paths.dashboard.courses.root} variant="contained">
                        Browse programs
                      </Button>
                      <Button component={RouterLink} href={paths.dashboard.quizzes.root} variant="outlined">
                        Open quizzes
                      </Button>
                    </Stack>
                  </Stack>
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                  <Stack spacing={2}>
                    <LmsStatCard
                      title="Completed modules"
                      value={analytics?.completedModules ?? 0}
                      caption={`${analytics?.pendingModules ?? 0} modules still pending`}
                      icon="solar:check-circle-bold-duotone"
                      tone="success"
                    />
                  </Stack>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <LmsStatCard
            title="Completion rate"
            value={`${analytics?.completionRate ?? 0}%`}
            caption="Across all active LMS tracks"
            icon="solar:pie-chart-2-bold-duotone"
            tone="primary"
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <LmsStatCard
            title="Active programs"
            value={courses.length}
            caption="Available structured programs"
            icon="solar:book-bookmark-bold-duotone"
            tone="info"
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <LmsStatCard
            title="Priority gaps"
            value={(analytics?.weaknesses ?? []).length}
            caption="Topics needing more review"
            icon="solar:target-bold-duotone"
            tone="warning"
          />
        </Grid>

        <Grid size={{ xs: 12, md: 7 }}>
          <Card sx={styles.cardBorderVars}>
            <CardContent>
              <Stack spacing={2.5}>
                <Stack spacing={0.5}>
                  <Typography variant="h6">Suggested next modules</Typography>
                  <Typography variant="body2" sx={styles.moduleListDescription}>
                    Recommended modules based on your current progress and weak areas.
                  </Typography>
                </Stack>
                <ModuleList modules={featuredModules.slice(0, 3)} />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <Card sx={styles.strengthCard}>
            <CardContent>
              <Stack spacing={2.5}>
                <Typography variant="h6">Strength and weakness map</Typography>
                <Divider />
                <Stack spacing={1.25}>
                  <Typography variant="subtitle2">Strengths</Typography>
                  {(analytics?.strengths ?? []).map((item) => (
                    <Chip key={item} label={item} color="success" variant="outlined" />
                  ))}
                </Stack>
                <Stack spacing={1.25}>
                  <Typography variant="subtitle2">Weaknesses</Typography>
                  {(analytics?.weaknesses ?? []).map((item) => (
                    <Chip key={item} label={item} color="warning" variant="outlined" />
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
