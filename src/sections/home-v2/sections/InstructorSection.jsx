import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { RouterLink } from 'src/routes/components';

import { Iconify } from 'src/components/iconify';

import { sectionStyles } from '../styles/section-styles';
import { SectionDecor } from '../components/SectionDecor';
import { ScrollReveal } from '../components/ScrollReveal';
import { InstructorPortrait } from '../components/InstructorPortrait';
import { useHomepageV2SectionContent } from '../context/homepage-v2-content-context';

export function InstructorSection() {
  const content = useHomepageV2SectionContent('instructors');

  if (!content?.visible) {
    return null;
  }

  const images = Array.isArray(content.images) ? content.images : [];
  const button = content.button ?? {};

  return (
    <Box component="section" sx={sectionStyles.subtleSection}>
      <SectionDecor variant="rings" />
      <Container maxWidth="xl" sx={sectionStyles.container}>
        <Stack spacing={{ xs: 4, md: 5 }}>
          <Grid container spacing={{ xs: 3, md: 4 }} alignItems="flex-end">
            <Grid size={{ xs: 12, md: 7 }}>
              <ScrollReveal>
                <Stack spacing={2} sx={{ maxWidth: 640 }}>
                  {content.label ? (
                    <Chip
                      label={content.label}
                      color="primary"
                      variant="soft"
                      sx={sectionStyles.eyebrow}
                    />
                  ) : null}
                  <Typography component="h2" variant="inherit" sx={sectionStyles.sectionHeading}>
                    {content.title}
                  </Typography>
                  <Typography sx={sectionStyles.bodyLead}>{content.description}</Typography>
                </Stack>
              </ScrollReveal>
            </Grid>
            {button.text ? (
              <Grid size={{ xs: 12, md: 5 }}>
                <ScrollReveal>
                  <Box sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
                    <Button
                      component={RouterLink}
                      href={button.link || '/'}
                      size="large"
                      variant="contained"
                      startIcon={<Iconify icon="solar:user-plus-bold" />}
                    >
                      {button.text}
                    </Button>
                  </Box>
                </ScrollReveal>
              </Grid>
            ) : null}
          </Grid>

          <ScrollReveal>
            <Box
              sx={{
                display: 'grid',
                alignItems: 'start',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, minmax(0, 1fr))',
                  md: 'repeat(4, minmax(0, 1fr))',
                },
                gap: { xs: 2, md: 2.5 },
                width: 1,
              }}
            >
              {images.map((image, index) => (
                <InstructorPortrait
                  key={image.id ?? image.label ?? index}
                  image={image}
                  index={index}
                />
              ))}
            </Box>
          </ScrollReveal>
        </Stack>
      </Container>
    </Box>
  );
}
