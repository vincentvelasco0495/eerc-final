import { varAlpha } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

function resolveTileColor(color) {
  return typeof color === 'string' && /^#[0-9A-Fa-f]{6}$/.test(color) ? color : '#FFFFFF';
}

function resolveTileOpacity(opacity) {
  const amount = Number(opacity);
  if (!Number.isFinite(amount)) {
    return 0.42;
  }
  return Math.max(0, Math.min(100, amount)) / 100;
}

function tileTextShadow(color) {
  const hex = color.slice(1);
  const red = parseInt(hex.slice(0, 2), 16);
  const green = parseInt(hex.slice(2, 4), 16);
  const blue = parseInt(hex.slice(4, 6), 16);
  const luminance = (0.299 * red + 0.587 * green + 0.114 * blue) / 255;
  return luminance > 0.62 ? '0 1px 3px rgba(0,0,0,0.65)' : '0 1px 2px rgba(255,255,255,0.7)';
}

function WatermarkTiles({ username, dateLabel, color, opacity }) {
  const label = [username, dateLabel].filter(Boolean).join('  ·  ');
  const tiles = Array.from({ length: 40 }, (_, index) => index);
  const textColor = resolveTileColor(color);

  return (
    <Box
      sx={{
        inset: 0,
        zIndex: 2,
        overflow: 'hidden',
        position: 'absolute',
        pointerEvents: 'none',
      }}
    >
      <Box
        sx={{
          gap: 5,
          inset: '-35%',
          display: 'grid',
          position: 'absolute',
          opacity: resolveTileOpacity(opacity),
          transform: 'rotate(-22deg)',
          gridTemplateColumns: 'repeat(5, minmax(0, 1fr))',
        }}
      >
        {tiles.map((index) => (
          <Typography
            key={index}
            variant="caption"
            sx={{
              color: textColor,
              fontWeight: 700,
              letterSpacing: 0.04,
              whiteSpace: 'nowrap',
              textShadow: tileTextShadow(textColor),
            }}
          >
            {label}
          </Typography>
        ))}
      </Box>
    </Box>
  );
}

export function WatermarkOverlay({ username, dateLabel, variant = 'badge', color, opacity }) {
  if (variant === 'video') {
    return <WatermarkTiles username={username} dateLabel={dateLabel} color={color} opacity={opacity} />;
  }

  return (
    <Box
      sx={{
        inset: 0,
        zIndex: 1,
        display: 'flex',
        position: 'absolute',
        pointerEvents: 'none',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        /** Striped wash keyed to the text color so it stays visible in both schemes. */
        background: (theme) => {
          const faint = varAlpha(theme.vars.palette.text.primaryChannel, 0.02);
          const stronger = varAlpha(theme.vars.palette.text.primaryChannel, 0.04);
          return `repeating-linear-gradient(135deg, ${faint}, ${faint} 18px, ${stronger} 18px, ${stronger} 36px)`;
        },
      }}
    >
      <Stack
        spacing={0.5}
        sx={{
          m: 2,
          px: 1.5,
          py: 1,
          borderRadius: 1.5,
          /** Always a dark scrim: the label text is white in both schemes. */
          bgcolor: (theme) => varAlpha(theme.vars.palette.common.blackChannel, 0.72),
          border: (theme) => `solid 1px ${varAlpha(theme.vars.palette.common.whiteChannel, 0.16)}`,
        }}
      >
        <Typography variant="caption" sx={{ color: 'common.white' }}>
          Streaming Only
        </Typography>
        <Typography variant="caption" sx={{ color: 'common.white' }}>
          {username}
        </Typography>
        <Typography variant="caption" sx={{ color: 'grey.400' }}>
          {dateLabel}
        </Typography>
      </Stack>
    </Box>
  );
}
