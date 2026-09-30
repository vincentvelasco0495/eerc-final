import { varAlpha } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';

import { CmsImage } from './CmsImage';

function text(value) {
  return String(value ?? '').trim();
}

function scoreLabel(score) {
  const s = text(score);
  if (!s) {
    return '';
  }
  return /^score\s*:/i.test(s) ? s : `Score: ${s}`;
}

function hoverScoreLine(image) {
  const custom = text(image?.hoverDetail);
  if (custom) {
    return custom;
  }
  const score = text(image?.score).replace(/^score\s*:\s*/i, '');
  const rank = text(image?.rank);
  if (score && rank) {
    return `Board Score: ${score} | ${rank}`;
  }
  if (score) {
    return `Board Score: ${score}`;
  }
  return rank;
}

export function InstructorPortrait({ image, index = 0 }) {
  const name = text(image?.name);
  const role = text(image?.role);
  const rank = text(image?.rank);
  const program = text(image?.program);
  const year = text(image?.year);
  const score = scoreLabel(image?.score);
  const achievement = text(image?.achievements);
  const hoverLine = hoverScoreLine(image);
  const photoLabel = name || text(image?.label) || `Instructor ${index + 1}`;
  const showHoverPanel = Boolean(achievement || hoverLine);
  const showFooter = Boolean(name || role || program || year || score);

  return (
    <Box
      tabIndex={showHoverPanel ? 0 : undefined}
      aria-label={photoLabel}
      sx={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 2.5,
        outline: 'none',
        width: 1,
        aspectRatio: '3 / 4',
        cursor: showHoverPanel ? 'pointer' : 'default',
        '&:hover .instructor-hover-panel, &:focus-within .instructor-hover-panel': {
          opacity: 1,
        },
        '&:hover .instructor-resting-footer, &:focus-within .instructor-resting-footer': {
          opacity: showHoverPanel ? 0 : 1,
        },
      }}
    >
      <CmsImage
        fill
        media={image}
        label={photoLabel}
        aspectRatio="3 / 4"
        imgSx={{ borderRadius: 0, objectPosition: 'center 18%' }}
        sx={{ borderRadius: 0 }}
      />

      {rank ? (
        <Box
          sx={{
            position: 'absolute',
            top: 10,
            left: 10,
            zIndex: 3,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.4,
            px: 0.9,
            py: 0.25,
            borderRadius: 999,
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            boxShadow: (theme) =>
              `0 6px 14px ${varAlpha(theme.vars.palette.primary.mainChannel, 0.35)}`,
          }}
        >
          <Iconify icon="solar:cup-star-bold" width={12} />
          <Typography variant="caption" sx={{ fontWeight: 700, fontSize: 11, lineHeight: 1.2 }}>
            {rank}
          </Typography>
        </Box>
      ) : null}

      {showFooter ? (
        <Box
          className="instructor-resting-footer"
          sx={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1,
            px: 1.5,
            pt: 5,
            pb: 1.25,
            background: (theme) => {
              const dark = theme.vars.palette.common.blackChannel;
              const start = varAlpha(dark, 0.82);
              const mid = varAlpha(dark, 0.28);
              return `linear-gradient(to top, ${start} 8%, ${mid} 70%, transparent 100%)`;
            },
            transition: (theme) => theme.transitions.create('opacity', { duration: 200 }),
          }}
        >
          {name ? (
            <Typography
              sx={{
                color: 'common.white',
                fontWeight: 800,
                fontSize: { xs: 15, md: 16 },
                lineHeight: 1.25,
              }}
            >
              {name}
            </Typography>
          ) : null}
          {role ? (
            <Typography
              sx={{
                color: 'common.white',
                opacity: 0.8,
                mt: 0.15,
                fontSize: 12,
                lineHeight: 1.35,
              }}
            >
              {role}
            </Typography>
          ) : null}
          {program || year ? (
            <Stack
              direction="row"
              spacing={0.75}
              alignItems="center"
              sx={{ mt: 0.75, flexWrap: 'wrap' }}
            >
              {program ? (
                <Stack direction="row" spacing={0.4} alignItems="center">
                  <Iconify
                    icon="solar:square-academic-cap-bold"
                    width={13}
                    sx={{ color: 'common.white', opacity: 0.85 }}
                  />
                  <Typography sx={{ color: 'common.white', opacity: 0.88, fontSize: 11 }}>
                    {program}
                  </Typography>
                </Stack>
              ) : null}
              {year ? (
                <Typography sx={{ color: 'common.white', opacity: 0.7, fontSize: 11 }}>
                  {year}
                </Typography>
              ) : null}
            </Stack>
          ) : null}
          {score ? (
            <Box
              sx={{
                mt: 0.75,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.4,
                px: 0.85,
                py: 0.2,
                borderRadius: 999,
                bgcolor: (theme) => varAlpha(theme.vars.palette.success.mainChannel, 0.22),
                color: 'success.light',
                border: (theme) =>
                  `1px solid ${varAlpha(theme.vars.palette.success.mainChannel, 0.4)}`,
              }}
            >
              <Iconify icon="solar:check-circle-bold" width={12} />
              <Typography sx={{ fontWeight: 700, fontSize: 11 }}>
                {score}
              </Typography>
            </Box>
          ) : null}
        </Box>
      ) : null}

      {showHoverPanel ? (
        <Box
          className="instructor-hover-panel"
          sx={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            top: '42%',
            zIndex: 2,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            gap: 1,
            px: 1.5,
            pt: 4,
            pb: 1.75,
            opacity: 0,
            bgcolor: (theme) => varAlpha(theme.vars.palette.common.blackChannel, 0.86),
            transition: (theme) => theme.transitions.create('opacity', { duration: 200 }),
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: '50%',
              width: 44,
              height: 44,
              display: 'grid',
              placeItems: 'center',
              borderRadius: '50%',
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              transform: 'translate(-50%, -50%)',
              boxShadow: (theme) =>
                `0 8px 18px ${varAlpha(theme.vars.palette.primary.mainChannel, 0.4)}`,
            }}
          >
            <Iconify icon="solar:check-circle-bold" width={22} />
          </Box>
          {achievement ? (
            <Typography
              sx={{
                color: 'common.white',
                fontStyle: 'italic',
                fontWeight: 500,
                fontSize: 14,
              }}
            >
              {achievement}
            </Typography>
          ) : null}
          {hoverLine ? (
            <Box
              sx={{
                px: 1.25,
                py: 0.75,
                borderRadius: 999,
                bgcolor: (theme) => varAlpha(theme.vars.palette.common.whiteChannel, 0.08),
              }}
            >
              <Typography sx={{ color: 'common.white', opacity: 0.88, fontSize: 11 }}>
                {hoverLine}
              </Typography>
            </Box>
          ) : null}
        </Box>
      ) : null}
    </Box>
  );
}
