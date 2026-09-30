import { useSearchParams } from 'react-router';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { CONFIG } from 'src/global-config';
import { useAboutContent } from 'src/features/about-us/hooks/use-about-content';
import { ABOUT_US_DEFAULTS } from 'src/features/about-us/data/about-us-defaults';
import { resolveCmsMediaUrl } from 'src/features/homepage-v2/utils/resolve-cms-media-url';

import { Image } from 'src/components/image';

import { useAuthContext } from 'src/auth/hooks';

import { styles } from './about-view.styles';

const LOGO_SRC = `${CONFIG.assetsDir}/assets/images/about/company-logo.png`;
const LOGO_FALLBACK = `${CONFIG.assetsDir}/assets/images/about/what-large.webp`;

export function AboutView() {
  const { user } = useAuthContext();
  const [searchParams] = useSearchParams();
  const preview = searchParams.get('preview') === '1' && Boolean(user);
  const { data, isPending } = useAboutContent({ preview });

  const hasApi = Boolean(CONFIG.serverUrl?.trim());
  const showImageSkeleton = hasApi && isPending;

  const sections = data?.sections ?? ABOUT_US_DEFAULTS.sections;
  const overview = sections.company_overview ?? ABOUT_US_DEFAULTS.sections.company_overview;
  const mission = sections.mission ?? ABOUT_US_DEFAULTS.sections.mission;

  const cmsLogoUrl = resolveCmsMediaUrl(overview.logo?.url, overview.logo?.mediaId ?? null);
  const logoSrc = cmsLogoUrl || LOGO_SRC;
  const logoAlt = overview.logo?.alt ?? 'Esplana Engineering Review Center banner image';

  if (overview.visible === false && mission.visible === false) {
    return null;
  }

  return (
    <Box component="main" sx={styles.root}>
      <Container maxWidth="lg" sx={styles.container}>
        {overview.visible !== false ? (
          <Box component="section" sx={styles.section}>
            <Typography component="h1" variant="inherit" sx={styles.sectionTitle}>
              {overview.title}
            </Typography>

            <Grid container spacing={{ xs: 4, md: 5 }} sx={styles.overviewGrid}>
              <Grid size={{ xs: 12, md: 5 }}>
                <Typography variant="body1" sx={styles.bodyCopy}>
                  {overview.leadParagraph}
                </Typography>
              </Grid>

              <Grid size={{ xs: 12, md: 7 }}>
                <Box sx={styles.photoCard}>
                  <Box sx={styles.photoFrame}>
                    {showImageSkeleton ? (
                      <Skeleton
                        variant="rounded"
                        animation="wave"
                        aria-hidden
                        sx={{
                          width: 1,
                          height: { xs: 280, md: 340 },
                          maxWidth: '100%',
                          transform: 'none',
                          borderRadius: 2,
                        }}
                      />
                    ) : (
                      <Image
                        alt={logoAlt}
                        src={logoSrc}
                        sx={styles.logoImage}
                        slotProps={{
                          img: {
                            onError: (event) => {
                              const img = event.currentTarget;
                              if (img.dataset.fallbackApplied === 'true') {
                                return;
                              }
                              img.dataset.fallbackApplied = 'true';
                              img.src = LOGO_FALLBACK;
                            },
                          },
                        }}
                      />
                    )}
                  </Box>
                </Box>
              </Grid>
            </Grid>

            <Stack spacing={{ xs: 2, md: 2.5 }} sx={{ mt: { xs: 3, md: 4 } }}>
              {(overview.paragraphs ?? []).map((paragraph) => (
                <Typography key={paragraph.slice(0, 48)} variant="body1" sx={styles.bodyCopy}>
                  {paragraph}
                </Typography>
              ))}
            </Stack>
          </Box>
        ) : null}

        {mission.visible !== false ? (
          <Box component="section" sx={styles.section}>
            <Typography component="h2" variant="inherit" sx={styles.sectionTitle}>
              {mission.title}
            </Typography>

            <Stack sx={styles.bodyStack}>
              {(mission.paragraphs ?? []).map((paragraph) => (
                <Typography key={paragraph.slice(0, 48)} variant="body1" sx={styles.bodyCopy}>
                  {paragraph}
                </Typography>
              ))}
            </Stack>
          </Box>
        ) : null}
      </Container>
    </Box>
  );
}
