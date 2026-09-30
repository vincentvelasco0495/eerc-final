import { useState } from 'react';

import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Step from '@mui/material/Step';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Stepper from '@mui/material/Stepper';
import StepLabel from '@mui/material/StepLabel';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';

import { paths } from 'src/routes/paths';

import { useLmsUser, useLmsMeta, useLmsCourse, useLmsModule } from 'src/hooks/use-lms';

import { LEARNING_FLOW_STEPS } from 'src/constants/lms';

import { LmsStatCard } from 'src/components/ui/lms-stat-card';
import { LmsPageShell } from 'src/components/layout/lms-page-shell';
import { VideoPlayerWrapper } from 'src/components/ui/video-player-wrapper';

import { styles } from './styles';

export function ModulePlayerView({ moduleId }) {
  const [activeTab, setActiveTab] = useState('video');
  const { module: moduleItem } = useLmsModule(moduleId);
  const { user } = useLmsUser();
  const meta = useLmsMeta();
  const course = useLmsCourse(moduleItem?.courseId);

  if (!moduleItem) {
    return (
      <LmsPageShell heading="Module not found" links={[{ name: 'Courses', href: paths.dashboard.courses.root }]}>
        <Typography variant="body2">This module could not be located.</Typography>
      </LmsPageShell>
    );
  }

  return (
    <LmsPageShell
      heading={moduleItem.title}
      eyebrow="Secure module player"
      description="Protected content view with resume state, streaming-only placeholder controls, and clean lesson metadata."
      links={[
        { name: 'Courses', href: paths.dashboard.courses.root },
        {
          name: course?.title ?? 'Course',
          href: course
            ? course.slug
              ? paths.dashboard.courseDetails(course.slug)
              : paths.dashboard.courses.details(course.id)
            : paths.dashboard.courses.root,
        },
        { name: 'Module player' },
      ]}
    >
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <LmsStatCard
            title="Module progress"
            value={`${moduleItem.progress}%`}
            caption={`Resume at ${moduleItem.lastPosition}`}
            icon="solar:playback-speed-bold-duotone"
            tone="primary"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <LmsStatCard
            title="Resources"
            value={moduleItem.resources.length}
            caption={moduleItem.resources.join(', ')}
            icon="solar:documents-bold-duotone"
            tone="info"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <LmsStatCard
            title="Duration"
            value={moduleItem.duration}
            caption={moduleItem.streamingOnly ? 'Streaming only enabled' : 'Downloads available'}
            icon="solar:clock-circle-bold-duotone"
            tone="warning"
          />
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <VideoPlayerWrapper
            activeTab={activeTab}
            moduleItem={moduleItem}
            username={user?.watermarkName ?? 'Learner'}
            dateLabel={meta.todayLabel}
            sessionWarning={user?.sessionWarning}
            onTabChange={(_, value) => setActiveTab(value)}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={styles.cardBorderVars}>
            <CardContent>
              <Stack spacing={3}>
                <Stack spacing={1}>
                  <Typography variant="h6">Module details</Typography>
                  <Typography variant="body2" sx={styles.moduleSummary}>
                    {moduleItem.summary}
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {moduleItem.resources.map((resource) => (
                      <Chip key={resource} label={resource} size="small" variant="outlined" />
                    ))}
                  </Stack>
                </Stack>

                <Stepper activeStep={LEARNING_FLOW_STEPS.indexOf(moduleItem.type)} orientation="vertical">
                  {LEARNING_FLOW_STEPS.map((step) => (
                    <Step key={step}>
                      <StepLabel>{step}</StepLabel>
                    </Step>
                  ))}
                </Stepper>

                <Stack spacing={1}>
                  <Typography variant="subtitle2">Structure</Typography>
                  <Typography variant="body2">{moduleItem.subject}</Typography>
                  <Typography variant="body2">{moduleItem.topic}</Typography>
                  <Typography variant="body2">{moduleItem.subtopic}</Typography>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </LmsPageShell>
  );
}
