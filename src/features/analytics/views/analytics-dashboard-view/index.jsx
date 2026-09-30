import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';

import { useLmsAnalytics, useSuggestedModules } from 'src/hooks/use-lms';

import { LmsStatCard } from 'src/components/ui/lms-stat-card';
import { LmsPageShell } from 'src/components/layout/lms-page-shell';

import { styles } from './styles';

export function AnalyticsDashboardView() {
  const { analytics } = useLmsAnalytics();
  const suggestedModules = useSuggestedModules();

  return (
    <LmsPageShell
      heading="Analytics dashboard"
      links={[{ name: 'Analytics' }]}
      eyebrow="Learner insights"
      description="A clearer analytics surface showing completion, weak areas, strong topics, and the next modules to prioritize."
    >
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <LmsStatCard
            title="Completion rate"
            value={`${analytics?.completionRate ?? 0}%`}
            caption={`${analytics?.completedModules ?? 0} modules completed`}
            icon="solar:chart-2-bold-duotone"
            tone="primary"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <LmsStatCard
            title="Weak areas"
            value={(analytics?.weaknesses ?? []).length}
            caption="Topics requiring extra review"
            icon="solar:danger-triangle-bold-duotone"
            tone="warning"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <LmsStatCard
            title="Suggested modules"
            value={suggestedModules.length}
            caption="Recommended next study items"
            icon="solar:stars-bold-duotone"
            tone="success"
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={styles.cardFullHeight}>
            <CardContent sx={styles.cardContentFull}>
              <Stack spacing={2} sx={styles.innerStackFull}>
                <Typography variant="h6">Progress tracking</Typography>
                <Stack spacing={2}>
                  <Typography variant="body2" sx={styles.progressCaption}>
                    {analytics?.completedModules ?? 0} completed vs {analytics?.pendingModules ?? 0}{' '}
                    pending modules across your active learning roadmap.
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    <Chip label={`${analytics?.completedModules ?? 0} completed`} color="success" />
                    <Chip label={`${analytics?.pendingModules ?? 0} pending`} color="warning" />
                  </Stack>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={styles.cardBorderVars}>
            <CardContent>
              <Stack spacing={2}>
                <Typography variant="h6">Suggested modules</Typography>
                <List disablePadding>
                  {suggestedModules.map((moduleItem) => (
                    <ListItem key={moduleItem.id} sx={styles.suggestedListItem}>
                      <Stack spacing={0.5}>
                        <Typography variant="subtitle2">{moduleItem.title}</Typography>
                        <Typography variant="caption" sx={styles.listItemCaption}>
                          {moduleItem.subject} / {moduleItem.topic}
                        </Typography>
                      </Stack>
                    </ListItem>
                  ))}
                </List>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={styles.cardFullHeight}>
            <CardContent>
              <Typography variant="h6" sx={styles.sectionHeadingMargin}>
                Strengths
              </Typography>
              <Stack spacing={1.5}>
                {(analytics?.strengths ?? []).map((item) => (
                  <Chip key={item} label={item} color="success" variant="outlined" />
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={styles.cardFullHeight}>
            <CardContent>
              <Typography variant="h6" sx={styles.sectionHeadingMargin}>
                Weaknesses
              </Typography>
              <Stack spacing={1.5}>
                {(analytics?.weaknesses ?? []).map((item) => (
                  <Chip key={item} label={item} color="warning" variant="outlined" />
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </LmsPageShell>
  );
}
