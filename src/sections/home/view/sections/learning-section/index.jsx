import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { Iconify } from 'src/components/iconify';

import { styles } from './styles';
import { LESSON_TYPE_ITEMS } from '../shared/data';
import { Reveal, RevealGroup } from '../shared/reveal';
import { LessonTypesPreview, InstructorProfileShowcase } from '../shared/visuals';

export function LearningSection() {
  return (
    <>
      <Box sx={styles.lessonTypes.root}>
        <Container maxWidth="xl" sx={styles.lessonTypes.container}>
          <Reveal>
            <Stack spacing={2} alignItems="center" sx={styles.lessonTypes.header}>
              <Typography variant="h2" sx={styles.lessonTypes.heading}>
                LESSON TYPES
              </Typography>
              <Typography variant="body1" sx={styles.lessonTypes.copy}>
                EERC LMS supports the three lesson formats used across your engineering review
                workflow. Deliver recorded video explanations, attach PDF references, and provide
                e-book study materials in one structured lesson experience.
              </Typography>
            </Stack>
          </Reveal>

          <RevealGroup>
            <Grid container spacing={{ xs: 2.5, md: 4 }} justifyContent="center" sx={styles.lessonTypes.badges}>
              {LESSON_TYPE_ITEMS.map((item) => (
                <Grid key={item.title} size={{ xs: 6, sm: 4, md: 2.25 }}>
                  <Reveal>
                    <Stack spacing={1} alignItems="center" sx={styles.lessonTypes.badgeItem}>
                      <Box sx={styles.lessonTypes.badgeCircle(item.color)}>
                        <Iconify icon={item.icon} width={28} />
                      </Box>
                      <Typography variant="subtitle2" sx={styles.lessonTypes.badgeText}>
                        {item.title}
                      </Typography>
                    </Stack>
                  </Reveal>
                </Grid>
              ))}
            </Grid>
          </RevealGroup>

          <Reveal sx={styles.lessonTypes.preview}>
            <LessonTypesPreview />
          </Reveal>
        </Container>
      </Box>

      <Box sx={styles.profile.root}>
        <Container maxWidth="xl" sx={styles.profile.container}>
          <Stack spacing={3} alignItems="center" sx={styles.profile.stack}>
            <Reveal>
              <Box sx={styles.profile.toggleWrap}>
                <Grid container spacing={0.75}>
                  <Grid size={{ xs: 6 }}>
                    <Box sx={styles.profile.activeToggle}>Instructor Profile</Box>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Box sx={styles.profile.inactiveToggle}>Learner Profile</Box>
                  </Grid>
                </Grid>
              </Box>
            </Reveal>

            <Reveal>
              <Stack spacing={1.5} sx={styles.profile.header}>
                <Typography variant="h2" sx={styles.profile.heading}>
                  INSTRUCTOR PROFILE
                </Typography>
                <Typography variant="body1" sx={styles.profile.copy}>
                  Engineering mentors can manage classes, monitor learner activity, review quiz
                  performance, and publish new modules from one profile workspace. The same interface
                  also keeps learner-facing progress and course access clearly organized.
                </Typography>
              </Stack>
            </Reveal>

            <Reveal direction="inUp" distance={32}>
              <InstructorProfileShowcase />
            </Reveal>

            <Reveal>
              <Button component={RouterLink} href={paths.dashboard.admin} variant="contained" sx={styles.profile.button}>
                View Demo
              </Button>
            </Reveal>
          </Stack>
        </Container>
      </Box>
    </>
  );
}
