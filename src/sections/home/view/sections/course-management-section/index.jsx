import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { styles } from './styles';
import { LMS_ADDON_ITEMS } from '../shared/data';
import { Reveal, RevealGroup } from '../shared/reveal';
import {
  AddonPreview,
  ManageCoursesDecor,
  InteractiveAddonsIllustration,
} from '../shared/visuals';

export function CourseManagementSection() {
  return (
    <>
      <Box sx={styles.manage.root}>
        <ManageCoursesDecor side="left" />
        <ManageCoursesDecor side="right" />
        <Container maxWidth="lg" sx={styles.manage.container}>
          <Reveal>
            <Stack spacing={1.5} alignItems="center">
              <Typography variant="h2" sx={styles.manage.heading}>
                MANAGE COURSES
              </Typography>
              <Typography variant="body1" sx={styles.manage.copy}>
                Take full control of engineering programs, modules, quizzes, and learner delivery.
                Here are the tools your review center actually needs to publish and manage courses at
                scale.
              </Typography>
            </Stack>
          </Reveal>
        </Container>
      </Box>

      <Box sx={styles.addons.root}>
        <Container maxWidth="lg" sx={styles.addons.container}>
          <Stack spacing={4} alignItems="center">
            <Reveal>
              <Box sx={styles.addons.tabsWrap}>
                <Grid container spacing={0.75}>
                  {[
                    ['Interactive Content', true],
                    ['Course Attachments', false],
                    ['Course Summary', false],
                    ['Gradebook', false],
                  ].map(([label, active]) => (
                    <Grid key={label} size={{ xs: 12, sm: 6, md: 3 }}>
                      <Box sx={styles.addons.tab(Boolean(active))}>{label}</Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Reveal>

            <Grid container spacing={{ xs: 5, md: 7 }} alignItems="center">
              <Grid size={{ xs: 12, md: 5 }}>
                <Reveal direction="inLeft">
                  <Stack spacing={2.5} sx={styles.addons.content}>
                    <Typography variant="h2" sx={styles.addons.heading}>
                      ENGAGING COURSES WITH INTERACTIVE TOOLS
                    </Typography>
                    <Typography variant="body1" sx={styles.addons.copy}>
                      Create and use interactive learning content inside your engineering LMS.
                      Strengthen lessons with embedded activities, attached resources, structured
                      summaries, and gradebook-ready performance tracking.
                    </Typography>
                    <Typography variant="body1" sx={styles.addons.copy}>
                      Guide learners through module explanations, interactive checkpoints, and review
                      material in a way that keeps technical concepts clear and engaging.
                    </Typography>
                    <Button component={RouterLink} href={paths.dashboard.courses.root} variant="contained" sx={styles.addons.button}>
                      Live Preview
                    </Button>
                  </Stack>
                </Reveal>
              </Grid>

              <Grid size={{ xs: 12, md: 7 }}>
                <Reveal direction="inRight">
                  <InteractiveAddonsIllustration />
                </Reveal>
              </Grid>
            </Grid>

            <Reveal>
              <Typography variant="h3" sx={styles.addons.subheading}>
                EERC LMS ADD-ONS INCLUDED
              </Typography>
            </Reveal>

            <RevealGroup sx={{ width: 1 }}>
              <Grid container spacing={{ xs: 3, md: 4 }} sx={styles.addons.grid}>
                {LMS_ADDON_ITEMS.map((item) => (
                  <Grid key={item.title} size={{ xs: 12, sm: 6, lg: 3 }}>
                    <Reveal>
                      <Stack spacing={2} sx={styles.addons.cardStack}>
                        <Box sx={styles.addons.previewWrap} className="addon-preview-wrap">
                          <AddonPreview kind={item.preview} />
                        </Box>
                        <Stack spacing={0.75} sx={styles.addons.cardCopy}>
                          <Typography variant="h6" sx={styles.addons.cardTitle}>
                            {item.title}
                          </Typography>
                          <Typography variant="body2" sx={styles.addons.cardDescription}>
                            {item.description}
                          </Typography>
                        </Stack>
                      </Stack>
                    </Reveal>
                  </Grid>
                ))}
              </Grid>
            </RevealGroup>
          </Stack>
        </Container>
      </Box>
    </>
  );
}
