import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import { styled } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { CONFIG } from 'src/global-config';
import { goldAlpha, whiteAlpha, brandPalette } from 'src/theme/brand-tokens';
import { CONTACT_PAGE_DEFAULTS } from 'src/features/contact-page/data/contact-page-defaults';

import { Logo } from 'src/components/logo';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

const NAVY = brandPalette.deepNavy;

const FOOTER_LINKS = [
  { name: 'About us', href: paths.about },
  { name: 'Contact us', href: paths.contact },
];

const contactEmail = CONTACT_PAGE_DEFAULTS.sections.details.email;
const contactPhone = CONTACT_PAGE_DEFAULTS.sections.details.phone;

// ----------------------------------------------------------------------

const FooterRoot = styled('footer')(() => ({
  position: 'relative',
  color: brandPalette.white,
  backgroundColor: NAVY,
  borderTop: `1px solid ${goldAlpha(0.28)}`,
  boxShadow: 'none',
}));

function FooterLink({ href, children }) {
  return (
    <Link
      component={RouterLink}
      href={href}
      color="inherit"
      variant="body2"
      underline="none"
      sx={{
        color: whiteAlpha(0.72),
        fontWeight: 500,
        width: 'fit-content',
        transition: (theme) => theme.transitions.create('color'),
        '&:hover': { color: brandPalette.gold },
      }}
    >
      {children}
    </Link>
  );
}

function ContactItem({ icon, href, children }) {
  const content = (
    <Stack direction="row" spacing={1.25} alignItems="center">
      <Iconify icon={icon} width={18} sx={{ color: brandPalette.gold, flexShrink: 0 }} />
      <Typography
        variant="body2"
        sx={{
          color: whiteAlpha(0.78),
          fontWeight: 500,
        }}
      >
        {children}
      </Typography>
    </Stack>
  );

  if (href) {
    return (
      <Link
        href={href}
        color="inherit"
        underline="none"
        sx={{
          display: 'block',
          width: 'fit-content',
          transition: (theme) => theme.transitions.create('opacity'),
          '&:hover': { opacity: 0.82 },
        }}
      >
        {content}
      </Link>
    );
  }

  return content;
}

function ColumnTitle({ children }) {
  return (
    <Typography
      variant="overline"
      sx={{
        color: brandPalette.gold,
        fontWeight: 700,
        letterSpacing: 1.4,
      }}
    >
      {children}
    </Typography>
  );
}

export function Footer({ sx, layoutQuery = 'md', ...other }) {
  const year = new Date().getFullYear();

  return (
    <FooterRoot sx={[...(Array.isArray(sx) ? sx : [sx])]} {...other}>
      <Container
        sx={(theme) => ({
          py: { xs: 5, md: 6 },
          [theme.breakpoints.up(layoutQuery)]: { py: 7 },
        })}
      >
        <Grid container spacing={{ xs: 4, md: 6 }} alignItems="flex-start">
          <Grid size={{ xs: 12, md: 5 }}>
            <Stack
              spacing={2}
              alignItems={{ xs: 'center', md: 'flex-start' }}
              textAlign={{ xs: 'center', md: 'left' }}
            >
              <Logo sx={{ width: 52, height: 52 }} />
              <Typography
                variant="body2"
                sx={{
                  color: whiteAlpha(0.72),
                  maxWidth: 360,
                  lineHeight: 1.7,
                }}
              >
                {CONFIG.appName} helps review centers deliver structured engineering programs,
                assessments, and learner progress in one platform.
              </Typography>
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, sm: 4, md: 2 }}>
            <Stack spacing={1.5} alignItems={{ xs: 'center', sm: 'flex-start' }} sx={{ pl: { sm: 0 } }}>
              <ColumnTitle>Platform</ColumnTitle>
              {FOOTER_LINKS.map((link) => (
                <FooterLink key={link.name} href={link.href}>
                  {link.name}
                </FooterLink>
              ))}
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, sm: 8, md: 5 }}>
            <Stack spacing={1.75} alignItems={{ xs: 'center', md: 'flex-start' }}>
              <ColumnTitle>Contact</ColumnTitle>
              <ContactItem icon="solar:letter-bold-duotone" href={`mailto:${contactEmail}`}>
                {contactEmail}
              </ContactItem>
              <ContactItem icon="solar:phone-bold-duotone" href={`tel:${contactPhone}`}>
                {contactPhone}
              </ContactItem>
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ my: { xs: 4, md: 5 }, borderColor: goldAlpha(0.18) }} />

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={1}
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography variant="caption" sx={{ color: whiteAlpha(0.48) }}>
            © {year} {CONFIG.appName}. All rights reserved.
          </Typography>
          <Typography variant="caption" sx={{ color: whiteAlpha(0.48) }}>
            Exam preparation, course delivery, and learner progress.
          </Typography>
        </Stack>
      </Container>
    </FooterRoot>
  );
}

/** @deprecated Use `<Footer />` — kept for existing imports. */
export function HomeFooter(props) {
  return <Footer {...props} />;
}
