import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { Iconify } from 'src/components/iconify';

import { styles } from './styles';
import { Reveal } from '../shared/reveal';
import { HeroIllustration } from '../shared/visuals';

export function HeroSection() {
  return (
    <Container maxWidth="xl" sx={styles.container}>
      <Grid container spacing={{ xs: 6, md: 8 }} alignItems="center" sx={styles.grid}>
        <Grid size={{ xs: 12, md: 5 }}>
          <Reveal direction="inLeft">
            <Stack spacing={3} sx={styles.content}>
              <Chip label="Engineering Excellence Training" color="primary" variant="outlined" sx={styles.eyebrow} />

              <Typography variant="h1" sx={styles.heading}>
                The best
                <Box component="span" sx={styles.primaryAccent}>
                  {' '}LMS for
                </Box>
                <br />
                professional exam
                <Box component="span" sx={styles.secondaryAccent}>
                  {' '}mastery
                </Box>
              </Typography>

              <Typography variant="h6" sx={styles.description}>
                Build learner confidence with guided modules, secure video delivery, timed quizzes,
                analytics, and leaderboard momentum in one polished learning platform.
              </Typography>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button component={RouterLink} href={paths.dashboard.root} size="large" variant="contained" startIcon={<Iconify icon="solar:play-circle-bold" />} sx={styles.primaryButton}>
                  Explore LMS
                </Button>

                <Button component={RouterLink} href={paths.dashboard.courses.root} size="large" variant="contained" endIcon={<Iconify icon="solar:alt-arrow-right-linear" />} sx={styles.secondaryButton}>
                  View Programs
                </Button>
              </Stack>
            </Stack>
          </Reveal>
        </Grid>

        <Grid size={{ xs: 12, md: 7 }}>
          <Reveal direction="inRight">
            <HeroIllustration />
          </Reveal>
        </Grid>
      </Grid>
    </Container>
  );
}
