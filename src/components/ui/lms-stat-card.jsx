import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';

const TONES = {
  primary: {
    background: 'primary.lighter',
    color: 'brand.accentText',
  },
  success: {
    background: 'success.lighter',
    color: 'success.main',
  },
  warning: {
    background: 'warning.lighter',
    color: 'warning.main',
  },
  info: {
    background: 'info.lighter',
    color: 'info.main',
  },
};

export function LmsStatCard({ title, value, caption, icon, tone = 'primary' }) {
  const palette = TONES[tone] ?? TONES.primary;

  return (
    <Card
      sx={{
        width: 1,
        height: '100%',
        border: (theme) => `1px solid ${theme.vars.palette.divider}`,
        boxShadow: 'none',
      }}
    >
      <Stack spacing={2} sx={{ p: 2.5 }}>
        <Box
          sx={{
            width: 44,
            height: 44,
            display: 'grid',
            borderRadius: 1.5,
            placeItems: 'center',
            bgcolor: palette.background,
            color: palette.color,
          }}
        >
          <Iconify icon={icon} width={22} />
        </Box>

        <Stack spacing={0.75}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {title}
          </Typography>
          <Typography variant="h4">{value}</Typography>
          {caption ? (
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {caption}
            </Typography>
          ) : null}
        </Stack>
      </Stack>
    </Card>
  );
}
