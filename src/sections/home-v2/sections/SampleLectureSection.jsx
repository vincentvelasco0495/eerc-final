import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { RouterLink } from 'src/routes/components';

import { Iconify } from 'src/components/iconify';

import { CmsVideo } from '../components/CmsVideo';
import { sectionStyles } from '../styles/section-styles';
import { SectionDecor } from '../components/SectionDecor';
import { ScrollReveal } from '../components/ScrollReveal';
import { useHomepageV2SectionContent } from '../context/homepage-v2-content-context';

export function SampleLectureSection() {
  const content = useHomepageV2SectionContent('sample_lecture');

  if (!content?.visible) {
    return null;
  }

  const button = content.button ?? {};
  const video = content.video ?? {};
  const poster = content.poster ?? {};

  return (
    <Box component="section" sx={sectionStyles.subtleSection}>
      <SectionDecor variant="rings" />
      <Container maxWidth="xl" sx={sectionStyles.container}>
        <Grid container spacing={{ xs: 5, md: 8 }} alignItems="center">
          <Grid size={{ xs: 12, md: 7 }}>
            <ScrollReveal direction="inLeft">
              <CmsVideo
                media={video}
                posterMedia={poster}
                label={video.label ?? 'Sample lecture video'}
                aspectRatio="16 / 9"
                watermarkText={content.watermarkText}
                sx={{ boxShadow: (theme) => theme.customShadows?.z24 ?? theme.shadows[16] }}
              />
            </ScrollReveal>
          </Grid>

          <Grid size={{ xs: 12, md: 5 }}>
            <ScrollReveal direction="inRight">
              <Stack spacing={{ xs: 2.5, md: 3 }} sx={{ maxWidth: 480 }}>
                {content.label ? (
                  <Chip label={content.label} color="primary" variant="soft" sx={sectionStyles.eyebrow} />
                ) : null}

                <Typography component="h2" variant="inherit" sx={sectionStyles.sectionHeading}>
                  {content.title}
                </Typography>

                <Typography sx={sectionStyles.bodyLead}>{content.description}</Typography>

                {button.text ? (
                  <Button
                    component={RouterLink}
                    href={button.link || '/available-programs'}
                    size="large"
                    variant="contained"
                    startIcon={<Iconify icon="solar:play-circle-bold" />}
                    sx={{ alignSelf: { xs: 'stretch', sm: 'flex-start' }, mt: 1 }}
                  >
                    {button.text}
                  </Button>
                ) : null}
              </Stack>
            </ScrollReveal>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
