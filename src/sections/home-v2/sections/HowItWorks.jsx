import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { CmsImage } from '../components/CmsImage';
import { sectionStyles } from '../styles/section-styles';
import { SectionDecor } from '../components/SectionDecor';
import { ScrollReveal } from '../components/ScrollReveal';
import { useHomepageV2SectionContent } from '../context/homepage-v2-content-context';

function StepBlock({ step }) {
  const textColumn = (
    <Stack spacing={2} sx={{ maxWidth: 440 }}>
      <Typography
        component="span"
        sx={{
          fontSize: { xs: '4.5rem', md: '6.5rem' },
          fontWeight: 900,
          lineHeight: 0.85,
          letterSpacing: -3,
          color: 'brand.accentText',
          opacity: 0.92,
        }}
      >
        {step.number}
      </Typography>
      <Typography component="h3" variant="h3" sx={{ fontWeight: 800 }}>
        {step.title}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
        {step.description}
      </Typography>
    </Stack>
  );

  const imageColumn = (
    <ScrollReveal direction={step.imageFirst ? 'inLeft' : 'inRight'}>
      <CmsImage
        media={step.image}
        label={step.image?.label ?? 'Step preview'}
        aspectRatio="16 / 10"
        sx={{ borderRadius: 4 }}
      />
    </ScrollReveal>
  );

  return (
    <Grid container spacing={{ xs: 4, md: 6 }} alignItems="center" sx={{ py: { xs: 4, md: 6 } }}>
      {step.imageFirst ? (
        <>
          <Grid size={{ xs: 12, md: 6 }}>{imageColumn}</Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <ScrollReveal direction="inRight">{textColumn}</ScrollReveal>
          </Grid>
        </>
      ) : (
        <>
          <Grid size={{ xs: 12, md: 6 }}>
            <ScrollReveal direction="inLeft">{textColumn}</ScrollReveal>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>{imageColumn}</Grid>
        </>
      )}
    </Grid>
  );
}

export function HowItWorks() {
  const content = useHomepageV2SectionContent('how_it_works');

  if (!content?.visible) {
    return null;
  }

  const steps = Array.isArray(content.steps) ? content.steps : [];

  return (
    <Box component="section" sx={sectionStyles.subtleSection}>
      <SectionDecor variant="grid" />
      <Container maxWidth="xl" sx={sectionStyles.container}>
        <ScrollReveal>
          <Stack spacing={2} alignItems="center" textAlign="center" sx={{ mb: { xs: 2, md: 4 } }}>
            {content.eyebrow ? (
              <Typography variant="overline" sx={{ fontWeight: 700, color: 'brand.accentText' }}>
                {content.eyebrow}
              </Typography>
            ) : null}
            <Typography component="h2" variant="inherit" sx={sectionStyles.sectionHeading}>
              {content.title}
            </Typography>
          </Stack>
        </ScrollReveal>

        {steps.map((step) => (
          <StepBlock key={step.id ?? step.number} step={step} />
        ))}
      </Container>
    </Box>
  );
}
