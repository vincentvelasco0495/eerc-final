import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';

import { sectionStyles } from '../styles/section-styles';
import { SectionDecor } from '../components/SectionDecor';
import { useHomepageV2SectionContent } from '../context/homepage-v2-content-context';
import { ScrollReveal, ScrollRevealItem, ScrollRevealStagger } from '../components/ScrollReveal';

export function FeatureCards() {
  const content = useHomepageV2SectionContent('feature_cards');

  if (!content?.visible) {
    return null;
  }

  const cards = Array.isArray(content.cards) ? content.cards : [];

  return (
    <Box component="section" sx={sectionStyles.surfaceSection}>
      <SectionDecor variant="grid" />
      <Container maxWidth="xl" sx={sectionStyles.container}>
        {content.eyebrow ? (
          <ScrollReveal>
            <Typography
              variant="overline"
              sx={{ display: 'block', textAlign: 'center', mb: 1, fontWeight: 700, color: 'brand.accentText' }}
            >
              {content.eyebrow}
            </Typography>
          </ScrollReveal>
        ) : null}

        <ScrollRevealStagger>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                lg: 'repeat(5, 1fr)',
              },
              gap: { xs: 2, md: 2.5 },
              mt: { xs: 2, md: 3 },
            }}
          >
            {cards.map((card) => (
              <ScrollRevealItem key={card.id ?? card.title}>
                <Box
                  component="article"
                  sx={[
                    sectionStyles.card,
                    {
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                    },
                  ]}
                >
                  <Stack
                    alignItems="center"
                    justifyContent="center"
                    sx={{
                      width: 52,
                      height: 52,
                      mb: 2,
                      borderRadius: 2,
                      bgcolor: (theme) => theme.vars.palette.brand.accentSoft,
                      border: (theme) => `1px solid ${theme.vars.palette.brand.borderDefault}`,
                      color: 'brand.accentText',
                    }}
                  >
                    <Iconify icon={card.icon} width={28} />
                  </Stack>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                    {card.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                    {card.description}
                  </Typography>
                </Box>
              </ScrollRevealItem>
            ))}
          </Box>
        </ScrollRevealStagger>
      </Container>
    </Box>
  );
}
