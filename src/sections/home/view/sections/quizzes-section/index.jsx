import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';

import { styles } from './styles';
import { Reveal, RevealGroup } from '../shared/reveal';
import { QUIZ_FEATURES, QUIZ_TYPE_CARDS } from '../shared/data';
import {
  MiniQuizCard,
  QuizTypeCard,
  QuizFeaturePanel,
  QuizReviewPreview,
} from '../shared/visuals';

export function QuizzesSection() {
  return (
    <>
      <Box sx={styles.overview.root}>
        <Container maxWidth="xl" sx={styles.overview.container}>
          <Reveal>
            <Stack spacing={2} alignItems="center" sx={styles.overview.header}>
              <Typography variant="overline" sx={styles.overview.overline}>
                Advanced
              </Typography>
              <Typography variant="h2" sx={styles.overview.heading}>
                QUIZZES
              </Typography>
              <Typography variant="body1" sx={styles.overview.copy}>
                With advanced quizzes, EERC LMS can create engaging engineering assessments for
                interactive learner training. Support review retention and deliver different question
                formats for every module.
              </Typography>
            </Stack>
          </Reveal>

          <RevealGroup>
            <Grid container spacing={{ xs: 2, md: 3 }} sx={styles.overview.cards}>
              {QUIZ_TYPE_CARDS.map((item) => (
                <Grid key={item.title} size={{ xs: 12, sm: 6, lg: 3 }}>
                  <Reveal>
                    <QuizTypeCard item={item} />
                  </Reveal>
                </Grid>
              ))}
            </Grid>
          </RevealGroup>

          <RevealGroup>
            <Grid container spacing={{ xs: 2, md: 3 }} sx={styles.overview.features}>
              {QUIZ_FEATURES.map((feature) => (
                <Grid key={feature} size={{ xs: 12, md: 4 }}>
                  <Reveal>
                    <Stack direction="row" spacing={1.25} alignItems="flex-start">
                      <Box sx={styles.overview.featureIconWrap}>
                        <Iconify icon="solar:check-read-bold" width={14} sx={{ color: 'common.white' }} />
                      </Box>
                      <Typography variant="body2" sx={styles.overview.featureText}>
                        {feature}
                      </Typography>
                    </Stack>
                  </Reveal>
                </Grid>
              ))}
            </Grid>
          </RevealGroup>
        </Container>
      </Box>

      <Box sx={styles.panels.root}>
        <Container maxWidth="lg" sx={styles.panels.container}>
          <Grid container spacing={{ xs: 3, md: 4 }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Reveal direction="inLeft">
                <QuizFeaturePanel
                  title="MULTIPLE TYPES OF QUESTIONS"
                  description="Build engaging engineering quizzes across different difficulty levels. Mix question styles to create more interactive board-review assessments and topic drills."
                  buttonLabel="Live Preview"
                  buttonColor="#ef2f7a"
                >
                  <Grid container spacing={1.5}>
                    <Grid size={{ xs: 6 }}>
                      <MiniQuizCard kind="single" />
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <MiniQuizCard kind="match" />
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <MiniQuizCard kind="image" />
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <MiniQuizCard kind="gap" />
                    </Grid>
                  </Grid>
                </QuizFeaturePanel>
              </Reveal>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Reveal direction="inRight">
                <QuizFeaturePanel
                  title="QUIZ REVIEW"
                  description="Review learner quiz results, inspect submitted answers, and spot repeated engineering mistakes. This helps instructors identify weak areas and assign the right remediation modules."
                  buttonLabel="Learn More"
                  buttonColor="primary.main"
                >
                  <QuizReviewPreview />
                </QuizFeaturePanel>
              </Reveal>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
}
