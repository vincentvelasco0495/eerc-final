import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { styles } from './styles';
import { LMS_FAQ_ITEMS } from '../shared/data';
import { Reveal, RevealGroup } from '../shared/reveal';
import { FaqRow, SupportInfoCard, CommunityInfoCard } from '../shared/visuals';

export function FaqSection() {
  return (
    <Box sx={styles.root}>
      <Container maxWidth="xl" sx={styles.container}>
        <Stack spacing={3.5}>
          <Reveal>
            <Stack spacing={3} alignItems="center" sx={styles.header}>
              <Typography variant="h2" sx={styles.heading}>
                EDUCATION AND LMS WORDPRESS THEMES:
                <br />
                WHAT DOES IT ALL MEAN?
              </Typography>

              <Stack spacing={2.5} sx={styles.copyWrap}>
                <Typography variant="body1" sx={styles.copy}>
                  Engineering education and online review programs continue to grow as learners look
                  for more flexible ways to study beyond the classroom. New digital tools are making
                  it easier for instructors, review centers, and institutions to organize technical
                  lessons, assessments, and guided learning journeys in one platform.
                </Typography>

                <Typography variant="body1" sx={styles.copy}>
                  With the rising demand for remote preparation, there is also a greater need for
                  reliable LMS systems that support structured modules, engineering content delivery,
                  learner engagement, and measurable training outcomes.
                </Typography>
              </Stack>
            </Stack>
          </Reveal>

          <Grid container spacing={{ xs: 4, md: 5 }} alignItems="start" sx={styles.contentGrid}>
            <Grid size={{ xs: 12, md: 8 }}>
              <RevealGroup>
                <Stack spacing={0}>
                  {LMS_FAQ_ITEMS.map((item, index) => (
                    <Reveal key={item.label}>
                      <FaqRow
                        label={item.label}
                        content={item.content}
                        last={index === LMS_FAQ_ITEMS.length - 1}
                        defaultExpanded={index === 0}
                      />
                    </Reveal>
                  ))}
                </Stack>
              </RevealGroup>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <RevealGroup>
                <Stack spacing={2.5}>
                  <Reveal>
                    <SupportInfoCard />
                  </Reveal>
                  <Reveal>
                    <CommunityInfoCard />
                  </Reveal>
                </Stack>
              </RevealGroup>
            </Grid>
          </Grid>
        </Stack>
      </Container>
    </Box>
  );
}
