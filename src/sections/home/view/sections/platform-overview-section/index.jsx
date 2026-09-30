import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';

import { styles } from './styles';
import { Reveal, RevealGroup } from '../shared/reveal';
import { EngineeringIllustration } from '../shared/visuals';
import {
  FEATURE_ITEMS,
  VALUE_PILLARS,
  LMS_CARD_FEATURES,
  ENGINEERING_FEATURES,
} from '../shared/data';

export function PlatformOverviewSection() {
  return (
    <>
      <Box sx={styles.featureStrip.root}>
        <Container maxWidth="xl">
          <RevealGroup>
            <Grid container spacing={0}>
              {FEATURE_ITEMS.map((item, index) => (
                <Grid key={item.title} size={{ xs: 12, sm: 6, lg: 3 }}>
                  <Reveal>
                    <Stack direction="row" spacing={2} sx={styles.featureStrip.item(index === FEATURE_ITEMS.length - 1)}>
                      <Box sx={styles.featureStrip.iconWrap}>
                        <Iconify icon={item.icon} width={24} />
                      </Box>

                      <Stack spacing={0.75}>
                        <Typography variant="subtitle2" sx={styles.featureStrip.title}>
                          {item.title}
                        </Typography>
                        <Typography variant="body2" sx={styles.featureStrip.description}>
                          {item.description}
                        </Typography>
                      </Stack>
                    </Stack>
                  </Reveal>
                </Grid>
              ))}
            </Grid>
          </RevealGroup>
        </Container>
      </Box>

      <Box sx={styles.value.root}>
        <Container maxWidth="lg" sx={styles.value.container}>
          <Grid container spacing={{ xs: 4, md: 6 }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Reveal direction="inLeft">
                <Typography variant="h2" sx={styles.value.heading}>
                  EERC LMS is the smart choice for modern technical learning.
                </Typography>
              </Reveal>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Reveal direction="inRight">
                <Typography variant="body1" sx={styles.value.copy}>
                  A fully guided education workflow for review sessions, secure module delivery,
                  assessment management, analytics, and learner motivation. It gives organizations
                  and instructors a polished platform built for consistent outcomes.
                </Typography>
              </Reveal>
            </Grid>

            {VALUE_PILLARS.map((item) => (
              <Grid key={item.title} size={{ xs: 12, md: 4 }}>
                <Reveal>
                  <Stack spacing={1.5} sx={styles.value.pillar}>
                    <Typography variant="subtitle1" sx={styles.value.pillarTitle(item.color)}>
                      {item.title}
                    </Typography>
                    <Typography variant="body2" sx={styles.value.pillarDescription}>
                      {item.description}
                    </Typography>
                  </Stack>
                </Reveal>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Box sx={styles.engineering.root}>
        <Container maxWidth="xl" sx={styles.engineering.container}>
          <Grid container spacing={{ xs: 5, md: 8 }} alignItems="center">
            <Grid size={{ xs: 12, md: 5 }}>
              <Reveal direction="inLeft">
                <EngineeringIllustration />
              </Reveal>
            </Grid>

            <Grid size={{ xs: 12, md: 7 }}>
              <Reveal direction="inRight">
                <Stack spacing={3}>
                  <Stack spacing={1.5}>
                    <Typography variant="h2" sx={styles.engineering.heading}>
                      Why Engineers Choose EERC LMS
                    </Typography>
                    <Typography variant="body1" sx={styles.engineering.copy}>
                      EERC LMS is built for technical review programs that need structure, secure
                      delivery, and measurable outcomes. From hydraulics refreshers and plumbing code
                      discussions to timed board-style quizzes, the platform supports the full
                      engineering learning cycle.
                    </Typography>
                  </Stack>

                  <Stack spacing={1.5}>
                    <Typography variant="h3" sx={styles.engineering.subheading}>
                      Core Engineering LMS Features
                    </Typography>
                    <Typography variant="body1" sx={styles.engineering.copySecondary}>
                      The platform combines program management, secure module playback, engineering
                      topic analytics, and learner operations in one production-ready dashboard.
                    </Typography>
                  </Stack>

                  <Grid container spacing={{ xs: 1.25, md: 1.75 }}>
                    {ENGINEERING_FEATURES.map((feature) => (
                      <Grid key={feature} size={{ xs: 12, sm: 6, lg: 4 }}>
                        <Stack direction="row" spacing={1.25} alignItems="flex-start">
                          <Iconify icon="solar:alt-arrow-right-bold" width={16} sx={styles.engineering.arrow} />
                          <Typography variant="body2" sx={styles.engineering.featureText}>
                            {feature}
                          </Typography>
                        </Stack>
                      </Grid>
                    ))}
                  </Grid>
                </Stack>
              </Reveal>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Box sx={styles.capabilities.root}>
        <Container maxWidth="xl" sx={styles.capabilities.container}>
          <Reveal>
            <Stack spacing={2} sx={styles.capabilities.header}>
              <Typography variant="h2" sx={styles.capabilities.heading}>
                Engineering LMS Capabilities
              </Typography>
              <Typography variant="body1" sx={styles.capabilities.copy}>
                Built for technical review institutions, EERC LMS combines board-exam workflows,
                engineering content delivery, learner analytics, and operational controls in one modern
                learning environment.
              </Typography>
            </Stack>
          </Reveal>

          <Grid container spacing={{ xs: 2, md: 3 }} component={RevealGroup}>
            {LMS_CARD_FEATURES.map((item) => (
              <Grid key={item.title} size={{ xs: 12, sm: 6, lg: 4 }}>
                <Reveal>
                  <Box sx={styles.capabilities.card}>
                    <Stack spacing={2.5}>
                      <Box sx={styles.capabilities.cardIcon}>
                        <Iconify icon={item.icon} width={28} />
                      </Box>
                      <Stack spacing={1.25}>
                        <Typography variant="h6" sx={styles.capabilities.cardTitle}>
                          {item.title}
                        </Typography>
                        <Typography variant="body2" sx={styles.capabilities.cardDescription}>
                          {item.description}
                        </Typography>
                      </Stack>
                    </Stack>
                  </Box>
                </Reveal>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </>
  );
}
