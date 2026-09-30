import { useSearchParams } from 'react-router';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { resolveCmsMediaUrl } from 'src/features/homepage-v2/utils/resolve-cms-media-url';
import { useContactPageContent } from 'src/features/contact-page/hooks/use-contact-page-content';
import {
  mergeContactPageContent,
  telHrefFromPhilippineMobile,
} from 'src/features/contact-page/data/contact-page-defaults';

import { Image } from 'src/components/image';
import { Iconify } from 'src/components/iconify';

import { useAuthContext } from 'src/auth/hooks';

import { styles } from './contact-view.styles';
import { ContactFeedbackForm } from '../components/contact-feedback-form';

function buildInfoRows(details) {
  const phoneHref = telHrefFromPhilippineMobile(details.phone);
  const email = String(details.email ?? '').trim();

  return [
    {
      label: 'Address',
      value: details.address ?? '',
      icon: 'solar:map-point-bold-duotone',
      multiline: true,
    },
    {
      label: 'Phone',
      value: details.phone ?? '',
      href: phoneHref || undefined,
      icon: 'solar:phone-calling-rounded-bold-duotone',
    },
    {
      label: 'Email',
      value: email,
      href: email ? `mailto:${email}` : undefined,
      icon: 'solar:letter-bold-duotone',
    },
    {
      label: 'Facebook',
      value: details.facebookDisplay ?? '',
      href: details.facebookUrl || undefined,
      icon: 'solar:global-bold-duotone',
    },
  ];
}

export function ContactView({ pageComponent = 'main' } = {}) {
  const { user } = useAuthContext();
  const [searchParams] = useSearchParams();
  const preview = searchParams.get('preview') === '1' && Boolean(user);
  const { data } = useContactPageContent({ preview });

  const merged = mergeContactPageContent(data);
  const { details, feedback, representative } = merged;

  const showContactInfo = details.visible !== false;
  const mapUrl = String(details.mapEmbedUrl ?? '').trim();
  const showMap = Boolean(mapUrl);
  const showTopRow = showContactInfo || showMap;

  const showFeedback = feedback.visible !== false;
  const showRepresentative = representative.visible !== false;
  const showBottomSection = showFeedback || showRepresentative;

  const infoRows = buildInfoRows(details);
  const avatarUrl = resolveCmsMediaUrl(
    representative.avatar?.url,
    representative.avatar?.mediaId ?? null
  );
  const avatarAlt = representative.avatar?.alt || representative.name || 'Contact';

  return (
    <Box component={pageComponent} sx={styles.root}>
      <Container maxWidth="xl" sx={styles.container}>
        {showTopRow ? (
          <Grid container spacing={{ xs: 4, md: 6 }} sx={styles.topGrid}>
            {showContactInfo ? (
              <Grid size={{ xs: 12, md: showMap ? 6 : 12 }}>
                <Typography variant="h2" sx={styles.sectionTitle}>
                  {details.contactInfoTitle ?? 'Contact Info:'}
                </Typography>

                <Box sx={styles.infoPanel}>
                  {infoRows.map((item) => (
                    <Box key={item.label} sx={styles.infoRow}>
                      <Iconify icon={item.icon} width={28} sx={styles.infoIcon} />
                      <Stack spacing={0.5}>
                        <Typography variant="subtitle1">{item.label}:</Typography>
                        {item.href ? (
                          <Link href={item.href} underline="hover" color="inherit" sx={styles.infoMeta}>
                            {item.value}
                          </Link>
                        ) : (
                          <Typography
                            variant="body2"
                            component="div"
                            sx={[styles.infoMeta, item.multiline ? { whiteSpace: 'pre-line' } : null]}
                          >
                            {item.value}
                          </Typography>
                        )}
                      </Stack>
                    </Box>
                  ))}
                </Box>
              </Grid>
            ) : null}

            {showMap ? (
              <Grid size={{ xs: 12, md: showContactInfo ? 6 : 12 }}>
                <Typography variant="h2" sx={styles.sectionTitle}>
                  {details.locationTitle ?? 'Location Info:'}
                </Typography>

                <Box sx={styles.locationCard}>
                  <Box sx={styles.mapWrap}>
                    <Box
                      component="iframe"
                      title={details.mapIframeTitle || 'Office location'}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      src={mapUrl}
                      sx={styles.mapFrame}
                    />
                  </Box>
                </Box>
              </Grid>
            ) : null}
          </Grid>
        ) : null}

        {showBottomSection ? (
          <>
            {showTopRow ? <Divider sx={styles.divider} /> : null}

            <Grid container spacing={{ xs: 4, md: 6 }} sx={styles.bottomGrid}>
              {showFeedback ? (
                <Grid size={{ xs: 12, md: showRepresentative ? 7 : 12 }}>
                  <Typography variant="h2" sx={styles.sectionTitle}>
                    {feedback.feedbackTitle ?? 'Feedback:'}
                  </Typography>

                  <ContactFeedbackForm feedback={feedback} />
                </Grid>
              ) : null}

              {showRepresentative ? (
                <Grid size={{ xs: 12, md: showFeedback ? 5 : 12 }}>
                  <Typography variant="h2" sx={styles.sectionTitle}>
                    {representative.sidebarTitle ?? 'Your Contact'}
                  </Typography>

                  <Box sx={styles.contactList}>
                    <Box key={representative.email} sx={styles.personCard}>
                      {avatarUrl ? (
                        <Box sx={{ ...styles.personImage, overflow: 'hidden', borderRadius: 0 }}>
                          <Image
                            alt={avatarAlt}
                            src={avatarUrl}
                            sx={{ width: 1, height: 1, objectFit: 'cover' }}
                          />
                        </Box>
                      ) : (
                        <Avatar
                          alt={representative.name}
                          src={undefined}
                          variant="rounded"
                          sx={styles.personImage}
                        >
                          {representative.name?.charAt(0)}
                        </Avatar>
                      )}

                      <Box sx={styles.personMeta}>
                        <Typography variant="h6" color="text.primary">
                          {representative.name}
                        </Typography>
                        <Typography variant="body2">{representative.role}</Typography>
                        <Typography variant="body2">
                          <Box component="span" sx={{ color: 'text.primary', fontWeight: 600 }}>
                            Phone:
                          </Box>{' '}
                          <Link
                            href={telHrefFromPhilippineMobile(representative.phone)}
                            color="inherit"
                            underline="hover"
                          >
                            {representative.phone}
                          </Link>
                        </Typography>
                        <Typography variant="body2">
                          <Box component="span" sx={{ color: 'text.primary', fontWeight: 600 }}>
                            Email:
                          </Box>{' '}
                          <Link href={`mailto:${representative.email}`} color="inherit" underline="hover">
                            {representative.email}
                          </Link>
                        </Typography>
                        <Typography variant="body2">{representative.extra}</Typography>
                      </Box>
                    </Box>
                  </Box>
                </Grid>
              ) : null}
            </Grid>
          </>
        ) : null}
      </Container>
    </Box>
  );
}
