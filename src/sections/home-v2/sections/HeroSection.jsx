import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { RouterLink } from 'src/routes/components';

import { Iconify } from 'src/components/iconify';

import { CmsImage } from '../components/CmsImage';
import { sectionStyles } from '../styles/section-styles';
import { SectionDecor } from '../components/SectionDecor';
import { ScrollReveal } from '../components/ScrollReveal';
import { useHomepageV2SectionContent } from '../context/homepage-v2-content-context';

const HERO_MEDIA_LAYOUTS = [
  {
    sx: {
      width: { xs: '72%', md: '58%' },
      top: { xs: 0, md: 8 },
      left: { xs: 0, md: 0 },
      zIndex: 1,
      transform: 'rotate(-7deg)',
    },
    aspectRatio: '16 / 10',
  },
  {
    sx: {
      width: { xs: '78%', md: '62%' },
      top: { xs: '28%', md: '22%' },
      left: { xs: '14%', md: '18%' },
      zIndex: 3,
      transform: 'rotate(2deg)',
    },
    aspectRatio: '4 / 3',
  },
  {
    sx: {
      width: { xs: '64%', md: '48%' },
      bottom: { xs: 0, md: 12 },
      right: { xs: 0, md: 8 },
      zIndex: 2,
      transform: 'rotate(6deg)',
    },
    aspectRatio: '3 / 4',
  },
  {
    sx: {
      width: { xs: '58%', md: '46%' },
      top: { xs: '4%', md: 0 },
      right: { xs: 0, md: 0 },
      zIndex: 4,
      transform: 'rotate(-5deg)',
    },
    aspectRatio: '16 / 10',
  },
  {
    sx: {
      width: { xs: '56%', md: '44%' },
      bottom: { xs: '10%', md: 16 },
      left: { xs: '6%', md: 8 },
      zIndex: 5,
      transform: 'rotate(8deg)',
    },
    aspectRatio: '4 / 3',
  },
  {
    sx: {
      width: { xs: '50%', md: '40%' },
      top: { xs: '46%', md: '40%' },
      right: { xs: '8%', md: '10%' },
      zIndex: 6,
      transform: 'rotate(-9deg)',
    },
    aspectRatio: '3 / 4',
  },
];

const LAYOUT_BY_KEY = {
  lecture: HERO_MEDIA_LAYOUTS[0],
  instructor: HERO_MEDIA_LAYOUTS[1],
  testimonial: HERO_MEDIA_LAYOUTS[2],
};

function layoutForHeroImage(image, index) {
  const preset = LAYOUT_BY_KEY[image?.key] ?? HERO_MEDIA_LAYOUTS[index % HERO_MEDIA_LAYOUTS.length];
  const cycle = LAYOUT_BY_KEY[image?.key] ? 0 : Math.floor(index / HERO_MEDIA_LAYOUTS.length);
  if (!cycle) {
    return preset;
  }
  return {
    ...preset,
    sx: {
      ...preset.sx,
      zIndex: (preset.sx.zIndex ?? index + 1) + cycle * 3,
    },
  };
}

export function HeroSection() {
  const content = useHomepageV2SectionContent('hero');

  if (!content?.visible) {
    return null;
  }

  const primary = content.primaryButton ?? {};
  const secondary = content.secondaryButton ?? {};
  const images = Array.isArray(content.images) ? content.images : [];

  return (
    <Box component="section" sx={sectionStyles.section}>
      <SectionDecor />
      <Container maxWidth="xl" sx={sectionStyles.container}>
        <Grid container spacing={{ xs: 6, md: 8 }} alignItems="center">
          <Grid size={{ xs: 12, lg: 6 }}>
            <ScrollReveal direction="inLeft">
              <Stack spacing={{ xs: 2.5, md: 3.5 }}>
                {content.label ? (
                  <Chip label={content.label} color="primary" variant="soft" sx={sectionStyles.eyebrow} />
                ) : null}

                <Typography component="h1" variant="inherit" sx={sectionStyles.displayHeading}>
                  {content.headline}
                </Typography>

                <Typography sx={sectionStyles.bodyLead}>{content.description}</Typography>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ pt: 1 }}>
                  {primary.text ? (
                    <Button
                      component={RouterLink}
                      href={primary.link || '/'}
                      size="large"
                      variant="contained"
                      startIcon={<Iconify icon="solar:play-circle-bold" />}
                    >
                      {primary.text}
                    </Button>
                  ) : null}
                  {secondary.text ? (
                    <Button
                      component={RouterLink}
                      href={secondary.link || '/'}
                      size="large"
                      variant="outlined"
                      endIcon={<Iconify icon="solar:alt-arrow-right-linear" />}
                    >
                      {secondary.text}
                    </Button>
                  ) : null}
                </Stack>
              </Stack>
            </ScrollReveal>
          </Grid>

          <Grid size={{ xs: 12, lg: 6 }}>
            <ScrollReveal direction="inRight" distance={40}>
              <Box
                component={m.div}
                whileHover={{ y: -6 }}
                transition={{ type: 'spring', stiffness: 260, damping: 22 }}
                sx={{
                  position: 'relative',
                  minHeight: { xs: 360, sm: 420, md: images.length > 3 ? 540 : 480 },
                  mx: 'auto',
                  maxWidth: 560,
                }}
              >
                {images.map((image, index) => {
                  const layout = layoutForHeroImage(image, index);
                  return (
                    <Box
                      key={image.key ?? image.label ?? index}
                      component={m.div}
                      whileHover={{ scale: 1.03, zIndex: 10 }}
                      transition={{ type: 'spring', stiffness: 320, damping: 24 }}
                      sx={{
                        position: 'absolute',
                        boxShadow: (theme) => theme.customShadows?.z16 ?? theme.shadows[16],
                        ...layout.sx,
                      }}
                    >
                      <CmsImage
                        media={image}
                        label={image.label ?? 'Preview'}
                        aspectRatio={layout.aspectRatio}
                      />
                    </Box>
                  );
                })}
              </Box>
            </ScrollReveal>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
