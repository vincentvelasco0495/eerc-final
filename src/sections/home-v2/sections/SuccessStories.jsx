import { varAlpha } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { CmsImage } from '../components/CmsImage';
import { sectionStyles } from '../styles/section-styles';
import { SectionDecor } from '../components/SectionDecor';
import { ScrollReveal } from '../components/ScrollReveal';
import { useHomepageV2SectionContent } from '../context/homepage-v2-content-context';

export function SuccessStories() {
  const content = useHomepageV2SectionContent('success_stories');

  if (!content?.visible) {
    return null;
  }

  const badges = Array.isArray(content.badges) ? content.badges : [];
  const groupImage = content.groupImage ?? {};

  return (
    <Box component="section" sx={sectionStyles.surfaceSection}>
      <SectionDecor />
      <Container maxWidth="lg" sx={sectionStyles.container}>
        <ScrollReveal>
          <Stack spacing={2} alignItems="center" textAlign="center" sx={{ mb: { xs: 5, md: 7 } }}>
            {content.label ? (
              <Chip label={content.label} color="primary" variant="soft" sx={sectionStyles.eyebrow} />
            ) : null}
            <Typography component="h2" variant="inherit" sx={sectionStyles.sectionHeading}>
              {content.title}
            </Typography>
            {content.description ? (
              <Typography sx={{ ...sectionStyles.bodyLead, mx: 'auto', textAlign: 'center' }}>
                {content.description}
              </Typography>
            ) : null}
          </Stack>
        </ScrollReveal>

        <ScrollReveal distance={48}>
          <Box
            sx={{
              position: 'relative',
              maxWidth: 880,
              mx: 'auto',
              px: { xs: 2, md: 6 },
              py: { xs: 4, md: 6 },
            }}
          >
            <CmsImage
              media={groupImage}
              label={groupImage.label ?? 'Top Achievers Group Photo'}
              aspectRatio={{ xs: '4 / 3', md: '16 / 9' }}
              sx={{ borderRadius: 4 }}
            />

            {badges.map((badge) => (
              <Box
                key={badge.id ?? badge.label}
                sx={{
                  position: 'absolute',
                  ...(badge.position ?? {}),
                  minWidth: { xs: 88, md: 108 },
                  px: { xs: 1.5, md: 2 },
                  py: { xs: 1, md: 1.25 },
                  borderRadius: 2,
                  bgcolor: (theme) => theme.vars.palette.brand.elevated,
                  border: (theme) => `1px solid ${theme.vars.palette.brand.borderDefault}`,
                  boxShadow: (theme) =>
                    `0 12px 28px ${varAlpha(theme.vars.palette.common.blackChannel, 0.45)}`,
                  textAlign: 'center',
                }}
              >
                <Typography variant="caption" sx={{ fontWeight: 800, color: 'brand.accentText', display: 'block' }}>
                  {badge.label}
                </Typography>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                  {badge.detail}
                </Typography>
              </Box>
            ))}
          </Box>
        </ScrollReveal>
      </Container>
    </Box>
  );
}
