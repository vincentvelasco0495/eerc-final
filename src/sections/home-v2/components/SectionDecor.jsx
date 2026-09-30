import { varAlpha } from 'minimal-shared/utils';

import Box from '@mui/material/Box';

import { sectionStyles } from '../styles/section-styles';

export function SectionDecor({ variant = 'default' }) {
  if (variant === 'grid') {
    return <Box aria-hidden sx={sectionStyles.decorGrid} />;
  }

  return (
    <>
      <Box
        aria-hidden
        sx={[
          sectionStyles.decorBlob,
          {
            width: { xs: 220, md: 360 },
            height: { xs: 220, md: 360 },
            top: { xs: -80, md: -120 },
            right: { xs: -60, md: -40 },
            bgcolor: (theme) => varAlpha(theme.vars.palette.primary.mainChannel, 0.14),
          },
        ]}
      />
      <Box
        aria-hidden
        sx={[
          sectionStyles.decorBlob,
          {
            width: { xs: 180, md: 280 },
            height: { xs: 180, md: 280 },
            bottom: { xs: -40, md: -80 },
            left: { xs: -40, md: 0 },
            bgcolor: (theme) => varAlpha(theme.vars.palette.secondary.mainChannel, 0.12),
          },
        ]}
      />
      {variant === 'rings' ? (
        <Box
          aria-hidden
          sx={{
            position: 'absolute',
            right: { xs: -120, md: 40 },
            bottom: { xs: 40, md: 80 },
            width: { xs: 200, md: 320 },
            height: { xs: 200, md: 320 },
            borderRadius: '50%',
            border: (theme) => `1px solid ${varAlpha(theme.vars.palette.primary.mainChannel, 0.2)}`,
            opacity: 0.5,
            pointerEvents: 'none',
            '&::before': {
              content: '""',
              position: 'absolute',
              inset: 24,
              borderRadius: '50%',
              border: (theme) => `1px solid ${varAlpha(theme.vars.palette.secondary.mainChannel, 0.18)}`,
            },
          }}
        />
      ) : null}
    </>
  );
}
