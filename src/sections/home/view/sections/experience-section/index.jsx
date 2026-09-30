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
import { Reveal, RevealGroup } from '../shared/reveal';
import { CourseStylePreview, CommunityIllustration, InterfaceIllustration, ContentInteractionPreview } from '../shared/visuals';

const CONTENT_ITEMS = [
  {
    color: '#52d273',
    icon: 'mdi:tune-variant',
    title: 'FILTER THE MODULES',
    description:
      'Enable learners to filter engineering content by program, subject, topic cluster, access status, and difficulty level.',
  },
  {
    color: '#ef2f7a',
    icon: 'mdi:bookmark-outline',
    title: 'SAVE REVIEW PATHS',
    description:
      'Let users bookmark priority engineering modules, reviewer references, and lessons they want to revisit later.',
  },
  {
    color: '#ffd166',
    icon: 'mdi:star-outline',
    title: 'TRACK COURSE RATINGS',
    description:
      'Collect feedback on engineering lessons so learners can identify the most helpful modules, coaches, and review materials.',
  },
];

export function ExperienceSection() {
  return (
    <>
      <Box sx={styles.community.root}>
        <Container maxWidth="xl" sx={styles.community.container}>
          <Reveal>
            <Stack spacing={2} alignItems="center" sx={styles.community.header}>
              <Typography variant="h2" sx={styles.community.heading}>COMMUNITY</Typography>
              <Typography variant="body1" sx={styles.community.copy}>
                Revive your website and engage users with tones of integrations.
              </Typography>
            </Stack>
          </Reveal>
          <Reveal sx={styles.community.preview}><CommunityIllustration /></Reveal>
        </Container>
      </Box>

      <Box sx={styles.interface.root}>
        <Container maxWidth="xl" sx={styles.interface.container}>
          <Grid container spacing={{ xs: 5, md: 8 }} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <Reveal direction="inLeft">
                <InterfaceIllustration />
              </Reveal>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Reveal direction="inRight">
                <Stack spacing={1.75} sx={styles.interface.content}>
                  <Typography variant="overline" sx={styles.interface.overline}>USER FRIENDLY</Typography>
                  <Typography variant="h2" sx={styles.interface.heading}>INTERFACE</Typography>
                  <Typography variant="body1" sx={styles.interface.copy}>
                    EERC LMS is designed with a clean engineering-first interface that keeps courses,
                    technical modules, references, and learner actions easy to navigate.
                  </Typography>
                  <Typography variant="body1" sx={styles.interface.copy}>
                    From review-center staff to board-exam learners, every screen is built for
                    clarity, speed, and a smoother learning experience across the full training
                    workflow.
                  </Typography>
                </Stack>
              </Reveal>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Box sx={styles.courseStyles.root}>
        <Container maxWidth="xl" sx={styles.courseStyles.container}>
          <Reveal>
            <Stack spacing={2} alignItems="center" sx={styles.courseStyles.header}>
              <Typography variant="h2" sx={styles.courseStyles.heading}>COURSE STYLES</Typography>
              <Typography variant="body1" sx={styles.courseStyles.copy}>
                Configure how engineering programs are presented with flexible course layouts for
                review sessions, technical references, and learner progress tracking.
              </Typography>
              <Typography variant="body1" sx={styles.courseStyles.copySecondary}>
                Set up each learning experience to match your training style, from content-heavy board
                preparation to guided module delivery and premium cohort-based programs.
              </Typography>
            </Stack>
          </Reveal>

          <RevealGroup>
            <Grid container spacing={{ xs: 3, md: 4 }} sx={styles.courseStyles.grid}>
              {['catalog', 'overview', 'details'].map((style) => (
                <Grid key={style} size={{ xs: 12, md: 4 }}>
                  <Reveal>
                    <CourseStylePreview kind={style} />
                  </Reveal>
                </Grid>
              ))}
            </Grid>
          </RevealGroup>
        </Container>
      </Box>

      <Box sx={styles.contentInteraction.root}>
        <Container maxWidth="xl" sx={styles.contentInteraction.container}>
          <Grid container spacing={{ xs: 6, md: 8 }} alignItems="center">
            <Grid size={{ xs: 12, md: 5 }}>
              <Reveal direction="inLeft">
                <Stack spacing={3} sx={styles.contentInteraction.content}>
                  <Typography variant="h2" sx={styles.contentInteraction.heading}>
                    SIMPLIFY CONTENT
                    <br />
                    INTERACTION
                  </Typography>
                  <RevealGroup>
                    <Stack spacing={2.5}>
                      {CONTENT_ITEMS.map((item) => (
                        <Reveal key={item.title}>
                          <Stack direction="row" spacing={2} alignItems="flex-start">
                            <Box sx={styles.contentInteraction.iconWrap(item.color)}>
                              <Iconify icon={item.icon} width={24} />
                            </Box>
                            <Stack spacing={0.75}>
                              <Typography variant="h6" sx={styles.contentInteraction.itemTitle}>{item.title}</Typography>
                              <Typography variant="body2" sx={styles.contentInteraction.itemDescription}>{item.description}</Typography>
                            </Stack>
                          </Stack>
                        </Reveal>
                      ))}
                    </Stack>
                  </RevealGroup>
                  <Button component={RouterLink} href={paths.dashboard.courses.root} variant="contained" sx={styles.contentInteraction.button}>
                    Live Preview
                  </Button>
                </Stack>
              </Reveal>
            </Grid>
            <Grid size={{ xs: 12, md: 7 }}>
              <Reveal direction="inRight">
                <ContentInteractionPreview />
              </Reveal>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
}
