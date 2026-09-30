import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { sectionStyles } from '../styles/section-styles';
import { SectionDecor } from '../components/SectionDecor';
import { ScrollReveal } from '../components/ScrollReveal';
import { useHomepageV2SectionContent } from '../context/homepage-v2-content-context';

export function StatisticsBanner() {
  const content = useHomepageV2SectionContent('stats');

  if (!content?.visible) {
    return null;
  }

  const watermark = content.watermarkText ?? 'ACHIEVER';
  const extraItems = Array.isArray(content.items) ? content.items : [];

  return (
    <Box
      component="section"
      sx={{
        position: 'relative',
        py: { xs: 10, md: 14 },
        overflow: 'hidden',
        bgcolor: (theme) => theme.vars.palette.brand.sunken,
        borderTop: (theme) => `1px solid ${theme.vars.palette.brand.borderDefault}`,
        borderBottom: (theme) => `1px solid ${theme.vars.palette.brand.borderDefault}`,
      }}
    >
      <SectionDecor />
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          inset: 0,
          opacity: 0.06,
          fontSize: { xs: '3rem', md: '5rem' },
          fontWeight: 900,
          lineHeight: 1.1,
          color: 'brand.accentText',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          userSelect: 'none',
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
          p: 4,
        }}
      >
        {Array.from({ length: 24 }).map((_, i) => (
          <span key={i}>{watermark} </span>
        ))}
      </Box>

      <Container maxWidth="xl" sx={[sectionStyles.container, { position: 'relative', zIndex: 1 }]}>
        <ScrollReveal>
          <Stack spacing={1} sx={{ mb: { xs: 4, md: 6 } }}>
            {content.eyebrow ? (
              <Typography
                variant="overline"
                sx={{ color: 'brand.accentText', fontWeight: 800, letterSpacing: 2 }}
              >
                {content.eyebrow}
              </Typography>
            ) : null}
            {content.title ? (
              <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary', maxWidth: 480 }}>
                {content.title}
              </Typography>
            ) : null}
          </Stack>
        </ScrollReveal>

        <Box sx={{ position: 'relative', minHeight: { xs: 220, md: 280 } }}>
          {content.year ? (
            <Box
              component={m.span}
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 0.12, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              sx={{
                position: 'absolute',
                top: { xs: -16, md: -32 },
                left: { xs: -8, md: 0 },
                fontSize: { xs: '5rem', sm: '7rem', md: '10rem' },
                fontWeight: 900,
                lineHeight: 0.9,
                letterSpacing: -4,
                color: 'brand.accentText',
                pointerEvents: 'none',
              }}
            >
              {content.year}
            </Box>
          ) : null}

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            alignItems={{ xs: 'flex-start', sm: 'flex-end' }}
            spacing={{ xs: 2, sm: 4 }}
            sx={{ position: 'relative', zIndex: 2, pt: { xs: 6, md: 8 } }}
          >
            {content.primaryValue ? (
              <Box>
                <Typography
                  component={m.p}
                  initial={{ opacity: 0, y: 32 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.1 }}
                  sx={{
                    fontSize: { xs: '4rem', sm: '5.5rem', md: '7rem' },
                    fontWeight: 900,
                    lineHeight: 0.95,
                    letterSpacing: -3,
                    color: 'text.primary',
                    m: 0,
                  }}
                >
                  {content.primaryValue}
                </Typography>
                {content.primaryLabel ? (
                  <Typography variant="subtitle2" sx={{ mt: 1, fontWeight: 700, color: 'text.secondary' }}>
                    {content.primaryLabel}
                  </Typography>
                ) : null}
              </Box>
            ) : null}

            {content.secondaryValue ? (
              <Box
                sx={{
                  position: 'relative',
                  pl: { sm: 4 },
                  borderLeft: { sm: (theme) => `3px solid ${theme.vars.palette.brand.borderDefault}` },
                }}
              >
                <Typography
                  component={m.p}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.25 }}
                  sx={{
                    fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
                    fontWeight: 800,
                    lineHeight: 1,
                    letterSpacing: -2,
                    color: 'brand.accentText',
                    m: 0,
                  }}
                >
                  {content.secondaryValue}
                </Typography>
                {content.secondaryLabel ? (
                  <Typography variant="subtitle2" sx={{ mt: 1, fontWeight: 600, color: 'text.secondary' }}>
                    {content.secondaryLabel}
                  </Typography>
                ) : null}
              </Box>
            ) : null}
          </Stack>

          {extraItems.length > 0 ? (
            <Stack direction="row" flexWrap="wrap" spacing={3} sx={{ mt: 4 }}>
              {extraItems.map((item) => (
                <Box key={item.id ?? item.label}>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: 'brand.accentText' }}>
                    {item.value}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {item.label}
                  </Typography>
                </Box>
              ))}
            </Stack>
          ) : null}
        </Box>
      </Container>
    </Box>
  );
}
