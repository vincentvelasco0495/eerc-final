import { m } from 'framer-motion';
import { varAlpha } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { CONFIG } from 'src/global-config';

import { varFade, AnimateText, MotionContainer, animateTextClasses } from 'src/components/animate';

// ----------------------------------------------------------------------

export function ContactHero({ sx, ...other }) {
  return (
    <Box
      component="section"
      sx={[
        (theme) => ({
          ...theme.mixins.bgGradient({
            images: [
              `linear-gradient(0deg, ${varAlpha(theme.vars.palette.grey['900Channel'], 0.8)}, ${varAlpha(theme.vars.palette.grey['900Channel'], 0.8)})`,
              `url(${CONFIG.assetsDir}/assets/images/contact/hero.webp)`,
            ],
          }),
          overflow: 'hidden',
          height: { md: 560 },
          position: 'relative',
          py: { xs: 10, md: 0 },
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <Container component={MotionContainer}>
        <Box
          sx={{
            bottom: { md: 80 },
            position: { md: 'absolute' },
            textAlign: { xs: 'center', md: 'unset' },
          }}
        >
          <AnimateText
            component="h1"
            variant="h1"
            textContent={['Where', 'to find us?']}
            variants={varFade('inUp', { distance: 24 })}
            sx={{
              color: 'common.white',
              [`& .${animateTextClasses.line}[data-index="0"]`]: {
                [`& .${animateTextClasses.word}[data-index="0"]`]: { color: 'primary.main' },
              },
            }}
          />

          <Box
            component="ul"
            sx={{
              mt: 5,
              display: 'grid',
              color: 'common.white',
              rowGap: { xs: 5, md: 0 },
              columnGap: { xs: 2, md: 5 },
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
            }}
          >
            {CONTACTS.map((contact) => (
              <li key={contact.title}>
                <m.div variants={varFade('inUp', { distance: 24 })}>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    {contact.title}
                  </Typography>
                </m.div>

                <m.div variants={varFade('inUp', { distance: 24 })}>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    {contact.address}
                  </Typography>
                </m.div>
              </li>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

// ----------------------------------------------------------------------

const CONTACTS = [
  {
    title: 'Manila branch',
    address:
      'Room 202, 2nd Floor, Espana Place Bldg., 1139 Adelina St., Sampaloc, Manila',
  },
  {
    title: 'Baguio branch',
    address: 'BSUCMPC Building, 95 Lower Bonifacio St., Baguio, 2600 Benguet',
  },
  {
    title: 'Legazpi branch',
    address: '3rd Floor, CCJ Bldg., Tahao Road, Legazpi City (near BDO and SM Legazpi)',
  },
];
