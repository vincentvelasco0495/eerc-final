import { m } from 'framer-motion';
import { useState, useEffect } from 'react';
import { varAlpha } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';

import { CmsImage } from '../components/CmsImage';
import { sectionStyles } from '../styles/section-styles';
import { SectionDecor } from '../components/SectionDecor';
import { ScrollReveal } from '../components/ScrollReveal';
import { useHomepageV2SectionContent } from '../context/homepage-v2-content-context';

const DESCRIPTION_COLLAPSE_AT = 90;

function text(value) {
  return String(value ?? '').trim();
}

function toAbsoluteUrl(value) {
  const raw = text(value);
  if (!raw) {
    return '';
  }
  if (/^https?:\/\//i.test(raw)) {
    return raw;
  }
  if (raw.startsWith('//')) {
    return `https:${raw}`;
  }
  return `https://${raw}`;
}

function FeaturedAnnouncementCard({ item, isCenter, absOffset, offset, xStep, onActivate }) {
  const title = text(item.title);
  const description = text(item.description);
  const href = toAbsoluteUrl(item.videoUrl);
  const photoLabel = (item.thumbnail?.label ?? title) || 'Announcement';
  const canCollapse = description.length > DESCRIPTION_COLLAPSE_AT;
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (!isCenter) {
      setExpanded(false);
    }
  }, [isCenter]);

  const shownDescription =
    canCollapse && !expanded ? `${description.slice(0, DESCRIPTION_COLLAPSE_AT).trimEnd()}…` : description;

  return (
    <Box
      component={m.div}
      onMouseEnter={onActivate}
      onFocus={onActivate}
      tabIndex={href ? undefined : 0}
      role={href ? undefined : 'button'}
      aria-label={title || photoLabel}
      animate={{
        x: offset * xStep,
        scale: isCenter ? 1 : 0.82 - absOffset * 0.04,
        opacity: isCenter ? 1 : 0.55 - absOffset * 0.12,
        zIndex: 10 - absOffset,
        rotateY: offset * -6,
      }}
      transition={{ type: 'spring', stiffness: 280, damping: 26 }}
      sx={{
        position: 'absolute',
        width: { xs: '72%', sm: '48%', md: '36%' },
        maxWidth: 420,
        outline: 'none',
        '&:focus-visible': {
          boxShadow: (t) => `0 0 0 3px ${varAlpha(t.vars.palette.primary.mainChannel, 0.4)}`,
          borderRadius: 4,
        },
      }}
    >
      <Box sx={{ position: 'relative', overflow: 'hidden', borderRadius: 4 }}>
        <Box
          component={href ? 'a' : 'div'}
          href={href || undefined}
          target={href ? '_blank' : undefined}
          rel={href ? 'noopener noreferrer' : undefined}
          aria-label={href ? `${title || photoLabel} (opens link)` : undefined}
          sx={{
            display: 'block',
            cursor: href ? 'pointer' : 'default',
            color: 'inherit',
            textDecoration: 'none',
          }}
        >
          <CmsImage
            media={item.thumbnail}
            label={photoLabel}
            aspectRatio="16 / 10"
            imgSx={{
              objectFit: 'cover',
              transform: 'scale(1.32)',
              transformOrigin: 'center bottom',
            }}
            sx={{
              borderRadius: 4,
              overflow: 'hidden',
              boxShadow: (t) =>
                isCenter
                  ? `0 28px 60px ${varAlpha(t.vars.palette.common.blackChannel, 0.48)}`
                  : `0 12px 32px ${varAlpha(t.vars.palette.common.blackChannel, 0.32)}`,
              border: (t) => `1px solid ${t.vars.palette.brand.borderSubtle}`,
            }}
          />
        </Box>

        {title || description ? (
          <Box
            sx={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 2,
              px: 2,
              pt: 5,
              pb: 1.5,
              pointerEvents: 'none',
              background: (t) => {
                const dark = t.vars.palette.common.blackChannel;
                return `linear-gradient(to top, ${varAlpha(dark, 0.86)} 12%, ${varAlpha(dark, 0.28)} 68%, transparent 100%)`;
              },
            }}
          >
            {title ? (
              <Typography
                sx={{
                  color: 'common.white',
                  fontWeight: 800,
                  fontSize: { xs: 16, md: 18 },
                  lineHeight: 1.25,
                  textShadow: '0 1px 8px rgba(0,0,0,0.45)',
                }}
              >
                {title}
              </Typography>
            ) : null}
            {description ? (
              <Box sx={{ mt: 0.5 }}>
                <Typography
                  component="p"
                  sx={{
                    color: 'common.white',
                    opacity: 0.92,
                    fontSize: 13,
                    lineHeight: 1.45,
                    textShadow: '0 1px 8px rgba(0,0,0,0.45)',
                    display: 'inline',
                  }}
                >
                  {shownDescription}
                </Typography>
                {canCollapse ? (
                  <Box
                    component="button"
                    type="button"
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      setExpanded((current) => !current);
                    }}
                    sx={{
                      pointerEvents: 'auto',
                      ml: 0.75,
                      p: 0,
                      border: 0,
                      background: 'none',
                      color: 'primary.light',
                      cursor: 'pointer',
                      fontSize: 13,
                      fontWeight: 700,
                      lineHeight: 1.45,
                      textDecoration: 'underline',
                    }}
                  >
                    {expanded ? 'See less' : 'See more'}
                  </Box>
                ) : null}
              </Box>
            ) : null}
          </Box>
        ) : null}
      </Box>
    </Box>
  );
}

export function FeaturedCarousel() {
  const content = useHomepageV2SectionContent('featured_content');
  const theme = useTheme();
  const smDown = useMediaQuery(theme.breakpoints.down('sm'));
  const items = Array.isArray(content?.items) ? content.items : [];
  const centerIndex = Math.min(2, Math.max(0, Math.floor(items.length / 2)));
  const [activeIndex, setActiveIndex] = useState(centerIndex);
  const xStep = smDown ? 56 : 120;

  if (!content?.visible) {
    return null;
  }

  return (
    <Box component="section" sx={[sectionStyles.surfaceSection, { pb: { xs: 10, md: 14 } }]}>
      <SectionDecor variant="rings" />
      <Container maxWidth="xl" sx={sectionStyles.container}>
        <ScrollReveal>
          <Stack spacing={2} alignItems="center" textAlign="center" sx={{ mb: { xs: 5, md: 8 } }}>
            {content.eyebrow ? (
              <Typography variant="overline" sx={{ fontWeight: 700, color: 'brand.accentText' }}>
                {content.eyebrow}
              </Typography>
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

        <Box
          sx={{
            position: 'relative',
            minHeight: { xs: 280, sm: 340, md: 400 },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            px: { xs: 1, md: 4 },
          }}
        >
          {items.map((item, index) => {
            const offset = index - activeIndex;
            return (
              <FeaturedAnnouncementCard
                key={item.id ?? item.title ?? index}
                item={item}
                offset={offset}
                xStep={xStep}
                isCenter={offset === 0}
                absOffset={Math.abs(offset)}
                onActivate={() => setActiveIndex(index)}
              />
            );
          })}
        </Box>
      </Container>
    </Box>
  );
}
