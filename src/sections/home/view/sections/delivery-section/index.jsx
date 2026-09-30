import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { styles } from './styles';
import { Reveal } from '../shared/reveal';
import { BackendManagementPreview, CourseDeliveryVideoPreview } from '../shared/visuals';

export function DeliverySection() {
  return (
    <>
      <Box sx={styles.delivery.root}>
        <Container maxWidth="xl" sx={styles.delivery.container}>
          <Grid container spacing={{ xs: 5, md: 8 }} alignItems="center">
            <Grid size={{ xs: 12, md: 4 }}>
              <Reveal direction="inLeft">
                <Stack spacing={2.5} sx={styles.delivery.content}>
                  <Typography variant="h2" sx={styles.delivery.heading}>
                    ENGINEERING COURSE DELIVERY
                  </Typography>
                  <Typography variant="body1" sx={styles.delivery.copy}>
                    Deliver engineering review sessions with a clean learning interface that combines
                    lecture video, module notes, study references, and lesson progression in one
                    place. Built for technical coaching, board preparation, and structured module
                    rollout.
                  </Typography>
                  <Button component={RouterLink} href={paths.dashboard.modules.details('module-hydraulics-review')} variant="contained" sx={styles.delivery.button}>
                    Live Preview
                  </Button>
                </Stack>
              </Reveal>
            </Grid>
            <Grid size={{ xs: 12, md: 8 }}>
              <Reveal direction="inRight">
                <CourseDeliveryVideoPreview />
              </Reveal>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Box sx={styles.backend.root}>
        <Container maxWidth="xl" sx={styles.backend.container}>
          <Grid container spacing={{ xs: 5, md: 8 }} alignItems="center">
            <Grid size={{ xs: 12, md: 8 }}>
              <Reveal direction="inLeft">
                <BackendManagementPreview />
              </Reveal>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Reveal direction="inRight">
                <Stack spacing={2.5} sx={styles.backend.content}>
                  <Typography variant="h2" sx={styles.backend.heading}>
                    LMS BACKEND MANAGEMENT
                  </Typography>
                  <Typography variant="body1" sx={styles.backend.copy}>
                    Build and manage engineering programs through a clear backend workspace designed
                    for course setup, lesson publishing, mentor coordination, and learner operations.
                    The admin side keeps technical review content organized while remaining simple for
                    staff to maintain every review cycle.
                  </Typography>
                  <Typography variant="body1" sx={styles.backend.copy}>
                    From module visibility and quiz scheduling to enrollment approvals and reference
                    uploads, the platform gives review-center teams a practical control panel for
                    running a modern engineering LMS.
                  </Typography>
                </Stack>
              </Reveal>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
}
