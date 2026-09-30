import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';

import { Iconify } from 'src/components/iconify';

import { PROFILE_MENU_ITEMS } from './data';

// ----------------------------------------------------------------------

export function ManageCoursesDecor({ side }) {
  const isLeft = side === 'left';

  return (
    <Box
      sx={{
        position: 'absolute',
        insetY: 0,
        [isLeft ? 'left' : 'right']: 0,
        width: { xs: '34%', md: '28%' },
        pointerEvents: 'none',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          [isLeft ? 'left' : 'right']: { xs: -30, md: 20 },
          top: { xs: 30, md: 10 },
          width: { xs: 120, md: 170 },
          height: { xs: 220, md: 320 },
          opacity: 0.9,
          transform: isLeft ? 'rotate(-6deg)' : 'rotate(6deg)',
        }}
      >
        <PerformerFigure accent={isLeft ? '#4b67cf' : '#f6c54e'} secondary={isLeft ? '#ef2f7a' : '#ef6b7b'} />
      </Box>

      <Box
        sx={{
          position: 'absolute',
          [isLeft ? 'right' : 'left']: { xs: 8, md: 36 },
          bottom: { xs: 14, md: 18 },
          width: { xs: 84, md: 120 },
          height: { xs: 84, md: 120 },
          borderRadius: '50%',
          border: '2px solid rgba(255,255,255,0.08)',
          opacity: 0.45,
        }}
      />

      <Box
        sx={{
          position: 'absolute',
          [isLeft ? 'right' : 'left']: { xs: 24, md: 72 },
          top: { xs: 70, md: 42 },
          width: { xs: 36, md: 46 },
          height: { xs: 36, md: 46 },
          borderRadius: '50%',
          border: '2px solid rgba(255,255,255,0.12)',
          opacity: 0.5,
        }}
      />
    </Box>
  );
}

export function PerformerFigure({ accent, secondary }) {
  return (
    <Box sx={{ position: 'relative', width: 1, height: 1 }}>
      <Box
        sx={{
          position: 'absolute',
          left: '50%',
          top: 0,
          width: 34,
          height: 34,
          borderRadius: '50%',
          bgcolor: '#f4c7a8',
          transform: 'translateX(-50%)',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          left: '50%',
          top: 28,
          width: 70,
          height: 120,
          borderRadius: '28px 28px 18px 18px',
          bgcolor: accent,
          transform: 'translateX(-50%)',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          left: '50%',
          top: 76,
          width: 58,
          height: 12,
          borderRadius: 999,
          bgcolor: secondary,
          transform: 'translateX(-50%) rotate(-12deg)',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          left: '50%',
          top: 146,
          width: 12,
          height: 110,
          borderRadius: 999,
          bgcolor: '#161a3d',
          transform: 'translateX(-18px) rotate(6deg)',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          left: '50%',
          top: 146,
          width: 12,
          height: 110,
          borderRadius: 999,
          bgcolor: '#161a3d',
          transform: 'translateX(6px) rotate(-8deg)',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          left: '50%',
          top: 82,
          width: 100,
          height: 6,
          borderRadius: 999,
          bgcolor: 'rgba(255,255,255,0.22)',
          transform: 'translateX(-50%) rotate(18deg)',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          left: '50%',
          top: 92,
          width: 86,
          height: 6,
          borderRadius: 999,
          bgcolor: 'rgba(255,255,255,0.12)',
          transform: 'translateX(-50%) rotate(-20deg)',
        }}
      />
    </Box>
  );
}

export function InteractiveAddonsIllustration() {
  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: { xs: 300, md: 420 },
        mx: 'auto',
        maxWidth: 520,
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          left: '50%',
          top: '52%',
          width: { xs: 270, md: 360 },
          height: { xs: 190, md: 240 },
          borderRadius: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: '#dce8ff',
        }}
      />

      <Box
        sx={{
          position: 'absolute',
          left: '50%',
          top: '18%',
          transform: 'translateX(-50%)',
          color: '#1290d8',
          fontWeight: 800,
          letterSpacing: '-0.06em',
          fontSize: { xs: '3.2rem', md: '5rem' },
          lineHeight: 1,
        }}
      >
        H5P
      </Box>

      <Box
        sx={{
          position: 'absolute',
          left: '50%',
          top: '48%',
          width: { xs: 180, md: 240 },
          height: { xs: 120, md: 160 },
          transform: 'translate(-50%, -50%)',
          borderRadius: 3,
          bgcolor: '#334e8a',
          boxShadow: '0 24px 40px rgba(26, 48, 104, 0.22)',
          p: { xs: 1.2, md: 1.5 },
        }}
      >
        <Box
          sx={{
            width: 1,
            height: 1,
            borderRadius: 2,
            bgcolor: 'common.white',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              left: '50%',
              top: '46%',
              width: { xs: 38, md: 52 },
              height: { xs: 38, md: 52 },
              transform: 'translate(-50%, -50%)',
              borderRadius: '50%',
              bgcolor: '#f4c7a8',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              left: '50%',
              top: '62%',
              width: { xs: 54, md: 72 },
              height: { xs: 48, md: 62 },
              transform: 'translateX(-50%)',
              borderRadius: '22px 22px 14px 14px',
              bgcolor: '#ff6b57',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              right: { xs: 18, md: 24 },
              top: { xs: 20, md: 28 },
              width: { xs: 44, md: 58 },
              height: { xs: 32, md: 40 },
              borderRadius: 1.5,
              bgcolor: '#7cb7ff',
            }}
          />
        </Box>
      </Box>

      <Box
        sx={{
          position: 'absolute',
          left: '50%',
          top: { xs: '66%', md: '67%' },
          width: { xs: 132, md: 180 },
          height: { xs: 12, md: 14 },
          transform: 'translateX(-50%)',
          borderRadius: 999,
          bgcolor: '#2e4d87',
        }}
      />

      <Box
        sx={{
          position: 'absolute',
          left: '50%',
          top: { xs: '69%', md: '71%' },
          width: { xs: 220, md: 290 },
          height: { xs: 10, md: 12 },
          transform: 'translateX(-50%)',
          borderRadius: 999,
          bgcolor: '#7fb0ff',
        }}
      />

      <Box
        sx={{
          position: 'absolute',
          left: { xs: 12, md: 34 },
          bottom: { xs: 18, md: 24 },
          width: { xs: 56, md: 72 },
          height: { xs: 72, md: 92 },
          borderRadius: '0 0 18px 18px',
          bgcolor: '#cf7644',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            left: '50%',
            top: -26,
            width: { xs: 44, md: 56 },
            height: { xs: 56, md: 72 },
            transform: 'translateX(-50%)',
            borderRadius: '50% 50% 40% 40%',
            bgcolor: '#3cbc58',
          }}
        />
      </Box>

      <Box
        sx={{
          position: 'absolute',
          right: { xs: 10, md: 26 },
          bottom: { xs: 18, md: 24 },
          width: { xs: 64, md: 80 },
          height: { xs: 58, md: 72 },
          borderRadius: '10px 10px 14px 14px',
          bgcolor: '#e06842',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 10,
            left: 12,
            right: 12,
            height: 8,
            borderRadius: 999,
            bgcolor: 'rgba(255,255,255,0.26)',
          }}
        />
      </Box>

      <FloatingCard sx={{ top: { xs: 92, md: 118 }, left: { xs: 8, md: 34 } }} color="#ffd166" />
      <FloatingCard sx={{ top: { xs: 110, md: 136 }, right: { xs: 8, md: 26 } }} color="#7cb7ff" />
      <FloatingCard sx={{ top: { xs: 186, md: 228 }, right: { xs: 20, md: 44 } }} color="#f6c54e" />
    </Box>
  );
}

export function FloatingCard({ sx, color }) {
  return (
    <Box
      sx={{
        position: 'absolute',
        width: { xs: 42, md: 54 },
        height: { xs: 30, md: 38 },
        borderRadius: 1.5,
        bgcolor: color,
        boxShadow: '0 10px 22px rgba(15, 23, 42, 0.12)',
        transform: 'rotate(-12deg)',
        ...sx,
      }}
    />
  );
}

export function AddonPreview({ kind }) {
  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: 156,
        borderRadius: 2,
        bgcolor: '#e8edf9',
        overflow: 'hidden',
      }}
    >
      {kind === 'certificate' && (
        <>
          <Box
            sx={{
              position: 'absolute',
              left: '50%',
              top: '52%',
              width: 118,
              height: 82,
              transform: 'translate(-50%, -50%) rotate(-5deg)',
              borderRadius: 2,
              bgcolor: 'common.white',
              boxShadow: '0 14px 24px rgba(15, 23, 42, 0.08)',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              left: '50%',
              top: '48%',
              width: 126,
              height: 90,
              transform: 'translate(-50%, -50%) rotate(2deg)',
              borderRadius: 2,
              bgcolor: 'common.white',
              boxShadow: '0 18px 30px rgba(15, 23, 42, 0.12)',
            }}
          >
            <Box sx={{ p: 1.5 }}>
              <Box sx={{ width: '40%', height: 8, borderRadius: 999, bgcolor: '#ef2f7a' }} />
              <Box
                sx={{
                  width: '72%',
                  height: 6,
                  mt: 1.5,
                  borderRadius: 999,
                  bgcolor: '#d9e2f6',
                }}
              />
              <Box
                sx={{
                  width: '54%',
                  height: 6,
                  mt: 0.8,
                  borderRadius: 999,
                  bgcolor: '#d9e2f6',
                }}
              />
              <Box
                sx={{
                  width: 42,
                  height: 42,
                  mt: 1.25,
                  borderRadius: '50%',
                  border: '3px solid #ffd166',
                  bgcolor: '#fff9e8',
                }}
              />
            </Box>
          </Box>
          <Stack
            direction="row"
            spacing={0.75}
            sx={{
              position: 'absolute',
              right: 18,
              bottom: 18,
              px: 1,
              py: 0.75,
              borderRadius: 999,
              bgcolor: 'rgba(255,255,255,0.94)',
              boxShadow: '0 10px 24px rgba(15, 23, 42, 0.08)',
            }}
          >
            {['A', 'A', 'A'].map((label, index) => (
              <Box
                key={`${label}-${index}`}
                sx={{
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  display: 'grid',
                  placeItems: 'center',
                  bgcolor: index === 0 ? '#ef2f7a' : '#eef2fb',
                  color: index === 0 ? 'common.white' : 'text.primary',
                  typography: 'caption',
                  fontWeight: 700,
                }}
              >
                {label}
              </Box>
            ))}
          </Stack>
          <Box
            sx={{
              position: 'absolute',
              left: 12,
              top: 22,
              width: 20,
              height: 92,
              borderRadius: 999,
              bgcolor: 'rgba(255,255,255,0.84)',
              boxShadow: '0 8px 18px rgba(15, 23, 42, 0.06)',
            }}
          >
            <Stack alignItems="center" spacing={0.75} sx={{ pt: 1 }}>
              {['#7c8cff', '#ffd166', '#ef2f7a'].map((color) => (
                <Box
                  key={color}
                  sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: color }}
                />
              ))}
            </Stack>
          </Box>
        </>
      )}

      {kind === 'email' && (
        <>
          <Box
            sx={{
              position: 'absolute',
              left: 28,
              top: 28,
              width: 44,
              height: 92,
              borderRadius: 2,
              bgcolor: '#2f406a',
              boxShadow: '0 12px 22px rgba(15, 23, 42, 0.12)',
            }}
          >
            <Stack spacing={1} sx={{ p: 1.1 }}>
              <Box sx={{ width: '72%', height: 6, borderRadius: 999, bgcolor: '#8fb0ff' }} />
              {[0, 1, 2, 3].map((item) => (
                <Box
                  key={item}
                  sx={{ width: '100%', height: 7, borderRadius: 999, bgcolor: 'rgba(255,255,255,0.22)' }}
                />
              ))}
            </Stack>
          </Box>
          <Box
            sx={{
              position: 'absolute',
              left: 64,
              top: 18,
              width: 132,
              height: 100,
              borderRadius: 2,
              bgcolor: 'common.white',
              boxShadow: '0 18px 30px rgba(15, 23, 42, 0.12)',
            }}
          >
            <Box sx={{ p: 1.35 }}>
              <Box sx={{ width: 52, height: 9, borderRadius: 999, bgcolor: '#7c8cff' }} />
              <Grid container spacing={1} sx={{ mt: 1.25 }}>
                {[72, 92, 100, 84].map((width) => (
                  <Grid key={width} size={{ xs: 12 }}>
                    <Box sx={{ width: `${width}%`, height: 7, borderRadius: 999, bgcolor: '#edf1f8' }} />
                  </Grid>
                ))}
              </Grid>
              <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
                <Box sx={{ width: 18, height: 18, borderRadius: '50%', bgcolor: '#ef6b7b' }} />
                <Box sx={{ width: 18, height: 18, borderRadius: '50%', bgcolor: '#ffd166' }} />
                <Box sx={{ width: 46, height: 18, borderRadius: 999, bgcolor: '#52d273' }} />
              </Stack>
            </Box>
          </Box>
          <Box
            sx={{
              position: 'absolute',
              right: 16,
              bottom: 20,
              width: 44,
              height: 22,
              borderRadius: 999,
              bgcolor: '#67d2df',
              color: 'common.white',
              typography: 'caption',
              fontWeight: 700,
              display: 'grid',
              placeItems: 'center',
            }}
          >
            HINT
          </Box>
        </>
      )}

      {kind === 'content-drip' && (
        <>
          <Box
            sx={{
              position: 'absolute',
              left: '50%',
              top: 24,
              width: 126,
              height: 104,
              transform: 'translateX(-50%)',
              borderRadius: 2,
              bgcolor: 'common.white',
              boxShadow: '0 18px 32px rgba(15, 23, 42, 0.1)',
              p: 1.5,
            }}
          >
            <Stack spacing={1}>
              {[
                ['#ffd166', '22%', '76%'],
                ['#ef2f7a', '18%', '66%'],
                ['#7c8cff', '20%', '82%'],
                ['#69a7ff', '16%', '58%'],
              ].map(([color, left, right], index) => (
                <Stack
                  key={index}
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  sx={{
                    p: 0.75,
                    borderRadius: 1.25,
                    bgcolor: index === 2 ? '#eef0ff' : '#f7f9fe',
                  }}
                >
                  <Box sx={{ width: left, height: 8, borderRadius: 999, bgcolor: color }} />
                  <Box sx={{ width: right, height: 8, borderRadius: 999, bgcolor: '#dbe3f3' }} />
                </Stack>
              ))}
            </Stack>
          </Box>
          <Box
            sx={{
              position: 'absolute',
              left: 30,
              bottom: 26,
              width: 28,
              height: 28,
              borderRadius: 1.25,
              bgcolor: '#ef6b4a',
              boxShadow: '0 10px 20px rgba(239, 107, 74, 0.24)',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              right: 26,
              top: 26,
              width: 26,
              height: 26,
              borderRadius: '50%',
              bgcolor: '#52d273',
              boxShadow: '0 10px 20px rgba(82, 210, 115, 0.24)',
            }}
          />
        </>
      )}

      {kind === 'forms' && (
        <>
          <Box
            sx={{
              position: 'absolute',
              left: '50%',
              top: '52%',
              width: 128,
              height: 108,
              transform: 'translate(-50%, -50%)',
              borderRadius: 2,
              bgcolor: 'common.white',
              boxShadow: '0 18px 32px rgba(15, 23, 42, 0.12)',
              p: 1.5,
            }}
          >
            <Stack spacing={1}>
              {[100, 86, 100, 74].map((width, index) => (
                <Box
                  key={index}
                  sx={{
                    width: `${width}%`,
                    height: index === 0 ? 14 : 12,
                    borderRadius: 1,
                    bgcolor: index === 0 ? '#f4f6fb' : '#eef2fb',
                  }}
                />
              ))}
              <Stack direction="row" spacing={1}>
                <Box sx={{ width: 20, height: 20, borderRadius: '50%', bgcolor: '#52d273' }} />
                <Box sx={{ flexGrow: 1, height: 12, borderRadius: 1, bgcolor: '#eef2fb' }} />
              </Stack>
            </Stack>
          </Box>
          {[
            { top: 18, left: 18, color: '#52d273', shape: 'circle' },
            { top: 42, left: 8, color: '#ef6b4a', shape: 'square' },
            { bottom: 24, left: 22, color: '#ffd166', shape: 'square' },
            { top: 18, right: 14, color: '#2746c7', shape: 'badge' },
          ].map((item, index) => (
            <Box
              key={index}
              sx={{
                position: 'absolute',
                ...item,
                width: item.shape === 'badge' ? 36 : 28,
                height: item.shape === 'badge' ? 30 : 28,
                borderRadius: item.shape === 'circle' ? '50%' : 1.5,
                bgcolor: item.color,
                boxShadow: '0 10px 20px rgba(15, 23, 42, 0.12)',
              }}
            />
          ))}
        </>
      )}

      {kind === 'group-courses' && (
        <>
          <Box
            sx={{
              position: 'absolute',
              left: 44,
              top: 42,
              width: 40,
              height: 40,
              borderRadius: '50%',
              bgcolor: '#ffd166',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              right: 42,
              top: 38,
              width: 42,
              height: 42,
              borderRadius: '50%',
              bgcolor: '#ff8c6f',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              left: 38,
              top: 78,
              width: 52,
              height: 54,
              borderRadius: '24px 24px 12px 12px',
              bgcolor: '#ffe7a8',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              right: 34,
              top: 76,
              width: 56,
              height: 58,
              borderRadius: '26px 26px 12px 12px',
              bgcolor: '#ffb29c',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              left: '50%',
              top: 38,
              width: 64,
              height: 52,
              transform: 'translateX(-50%)',
              borderRadius: 2,
              bgcolor: 'rgba(255,255,255,0.82)',
              boxShadow: '0 10px 20px rgba(15, 23, 42, 0.08)',
              p: 1,
            }}
          >
            <Stack direction="row" alignItems="end" spacing={0.75} sx={{ height: 1 }}>
              {[18, 26, 34].map((height, index) => (
                <Box
                  key={index}
                  sx={{
                    width: 10,
                    height,
                    borderRadius: 999,
                    bgcolor: index === 1 ? '#7c8cff' : '#c9d5f0',
                  }}
                />
              ))}
            </Stack>
          </Box>
        </>
      )}

      {kind === 'gradebook' && (
        <>
          <Box
            sx={{
              position: 'absolute',
              left: '50%',
              top: '52%',
              width: 92,
              height: 116,
              transform: 'translate(-50%, -50%)',
              borderRadius: 2,
              bgcolor: 'common.white',
              boxShadow: '0 18px 30px rgba(15, 23, 42, 0.1)',
              p: 1.5,
            }}
          >
            <Stack spacing={1}>
              <Box sx={{ width: '64%', height: 9, borderRadius: 999, bgcolor: '#d7e0f2' }} />
              {[0, 1, 2, 3].map((row) => (
                <Box
                  key={row}
                  sx={{
                    width: '100%',
                    height: 8,
                    borderRadius: 999,
                    bgcolor: row === 2 ? '#e7f7ec' : '#edf1f8',
                  }}
                />
              ))}
            </Stack>
          </Box>
          <Box
            sx={{
              position: 'absolute',
              right: 48,
              bottom: 26,
              width: 34,
              height: 34,
              borderRadius: '50%',
              bgcolor: '#ffd166',
              boxShadow: '0 10px 22px rgba(255, 209, 102, 0.28)',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              right: 26,
              bottom: 18,
              width: 28,
              height: 42,
              borderRadius: '0 0 14px 14px',
              bgcolor: '#f6c54e',
            }}
          />
        </>
      )}

      {kind === 'prerequisites' && (
        <>
          <Stack
            direction="row"
            spacing={2}
            justifyContent="center"
            sx={{ position: 'absolute', top: 26, left: 0, right: 0 }}
          >
            {['1', '2', '3'].map((step, index) => (
              <Typography
                key={step}
                sx={{
                  fontSize: '2rem',
                  fontWeight: 800,
                  lineHeight: 1,
                  color: ['#2f5fff', '#4682ff', '#1f4fd8'][index],
                }}
              >
                {step}
              </Typography>
            ))}
          </Stack>
          <Stack
            direction="row"
            justifyContent="center"
            spacing={1}
            sx={{ position: 'absolute', left: 0, right: 0, bottom: 42 }}
          >
            {['#52d273', '#69a7ff', '#52d273', '#69a7ff', '#52d273'].map((color, index) => (
              <Box
                key={index}
                sx={{
                  width: index % 2 === 0 ? 14 : 26,
                  height: 14,
                  borderRadius: 999,
                  bgcolor: color,
                }}
              />
            ))}
          </Stack>
          <Box
            sx={{
              position: 'absolute',
              left: '50%',
              bottom: 58,
              width: 120,
              height: 8,
              transform: 'translateX(-50%)',
              borderRadius: 999,
              bgcolor: 'rgba(255,255,255,0.7)',
            }}
          />
        </>
      )}

      {kind === 'assignments' && (
        <>
          <Box
            sx={{
              position: 'absolute',
              left: '50%',
              top: '52%',
              width: 88,
              height: 112,
              transform: 'translate(-50%, -50%)',
              borderRadius: 2,
              bgcolor: 'common.white',
              boxShadow: '0 18px 32px rgba(15, 23, 42, 0.1)',
            }}
          >
            <Box
              sx={{
                width: 40,
                height: 14,
                mx: 'auto',
                mt: -1,
                borderRadius: '0 0 10px 10px',
                bgcolor: '#d3ddf1',
              }}
            />
            <Stack spacing={1} sx={{ p: 1.5, pt: 1 }}>
              {[86, 72, 78].map((width, index) => (
                <Box
                  key={index}
                  sx={{
                    width: `${width}%`,
                    height: 8,
                    borderRadius: 999,
                    bgcolor: '#edf1f8',
                  }}
                />
              ))}
            </Stack>
          </Box>
          <Box
            sx={{
              position: 'absolute',
              left: 38,
              bottom: 26,
              width: 12,
              height: 64,
              borderRadius: 999,
              bgcolor: '#f4be4c',
              transform: 'rotate(20deg)',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              right: 46,
              top: 38,
              width: 38,
              height: 38,
              borderRadius: '50%',
              bgcolor: '#dff7e7',
              border: '4px solid #52d273',
            }}
          />
        </>
      )}
    </Box>
  );
}

export function CommunityIllustration() {
  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: { xs: 300, md: 430 },
        mx: 'auto',
        maxWidth: 980,
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          left: { xs: 26, md: 120 },
          top: { xs: 18, md: 36 },
          opacity: 0.72,
          color: '#ffb28b',
        }}
      >
        <Iconify icon="mdi:lightbulb-on-outline" width={34} />
      </Box>

      <Box
        sx={{
          position: 'absolute',
          left: { xs: 0, md: 48 },
          top: { xs: 118, md: 170 },
          opacity: 0.82,
          color: '#d6e7ff',
        }}
      >
        <Iconify icon="mdi:chat-question-outline" width={54} />
      </Box>

      <Box
        sx={{
          position: 'absolute',
          left: { xs: 54, md: 190 },
          top: { xs: 86, md: 126 },
          width: 40,
          height: 18,
          borderRadius: 1.5,
          bgcolor: 'rgba(94, 131, 213, 0.56)',
          boxShadow: '24px 10px 0 rgba(94, 131, 213, 0.32)',
        }}
      />

      <CommunityFloatingIcon
        icon="mdi:message-text-outline"
        color="#15d0d6"
        sx={{ left: { xs: 132, md: 374 }, top: { xs: 12, md: 22 } }}
        bubble
      />
      <CommunityFloatingIcon
        icon="mdi:bullhorn-outline"
        color="#ffd55d"
        sx={{ left: { xs: 224, md: 514 }, top: { xs: 42, md: 58 } }}
      />
      <CommunityFloatingIcon
        icon="mdi:phone-outline"
        color="#e5efff"
        sx={{ right: { xs: 184, md: 310 }, top: { xs: 34, md: 48 } }}
      />
      <CommunityFloatingIcon
        icon="mdi:circle-outline"
        color="#d8e9ff"
        sx={{ right: { xs: 126, md: 196 }, top: { xs: 18, md: 40 } }}
      />
      <CommunityFloatingIcon
        icon="mdi:card-account-details-outline"
        color="#6caeff"
        sx={{ left: { xs: 190, md: 430 }, top: { xs: 134, md: 180 } }}
        badge
      />
      <CommunityFloatingIcon
        icon="mdi:heart-outline"
        color="#d7e3ff"
        sx={{ right: { xs: 212, md: 360 }, top: { xs: 142, md: 190 } }}
      />
      <CommunityFloatingIcon
        icon="mdi:clipboard-text-outline"
        color="#7fc4ff"
        sx={{ right: { xs: 42, md: 118 }, top: { xs: 92, md: 128 } }}
        rotate={12}
      />
      <CommunityFloatingIcon
        icon="mdi:target-variant"
        color="#ffd55d"
        sx={{ right: { xs: 22, md: 76 }, top: { xs: 166, md: 228 } }}
      />
      <CommunityFloatingIcon
        icon="mdi:thumb-up-outline"
        color="#5ca0ff"
        sx={{ right: { xs: 42, md: 126 }, bottom: { xs: 24, md: 32 } }}
      />
      <CommunityFloatingIcon
        icon="mdi:image-outline"
        color="#88b6ff"
        sx={{ left: { xs: 32, md: 136 }, bottom: { xs: 18, md: 24 } }}
      />

      <Box
        sx={{
          position: 'absolute',
          left: '50%',
          bottom: { xs: 24, md: 30 },
          width: { xs: 78, md: 110 },
          height: { xs: 78, md: 110 },
          transform: 'translateX(-50%)',
          borderRadius: '50%',
          border: '6px solid rgba(208, 230, 255, 0.9)',
          opacity: 0.92,
        }}
      />

      <CommunityPerson
        sx={{ left: { xs: 180, md: 294 }, bottom: { xs: 74, md: 94 } }}
        shirt="#5b85d6"
        accent="#23355f"
        scale={1}
        raiseHand
      />

      <CommunityPerson
        sx={{ left: { xs: 436, md: 640 }, bottom: { xs: 84, md: 104 } }}
        shirt="#70b0ff"
        accent="#2865bf"
        scale={0.98}
        laptop
      />

      <CommunityPerson
        sx={{ left: { xs: 124, md: 260 }, bottom: { xs: 10, md: 26 } }}
        shirt="#ffd55d"
        accent="#5d6aa4"
        scale={0.92}
        seated
      />

      <CommunityPerson
        sx={{ right: { xs: 116, md: 236 }, bottom: { xs: 8, md: 24 } }}
        shirt="#ffffff"
        accent="#5ca0ff"
        scale={0.96}
        seated
        tie
      />

      <Box
        sx={{
          position: 'absolute',
          left: '50%',
          bottom: { xs: 72, md: 94 },
          width: { xs: 290, md: 420 },
          height: 10,
          transform: 'translateX(-50%)',
          borderRadius: 999,
          bgcolor: '#7f8899',
          boxShadow: '0 18px 24px rgba(0,0,0,0.16)',
        }}
      />

      <Box
        sx={{
          position: 'absolute',
          left: '50%',
          bottom: { xs: 30, md: 46 },
          width: { xs: 310, md: 440 },
          height: 28,
          transform: 'translateX(-50%)',
          borderRadius: '18px',
          bgcolor: '#1f2740',
        }}
      />

      <Box
        sx={{
          position: 'absolute',
          left: '50%',
          bottom: { xs: 72, md: 94 },
          width: { xs: 54, md: 82 },
          height: { xs: 76, md: 104 },
          transform: 'translateX(-50%)',
          borderRadius: 2,
          bgcolor: '#f6f7fb',
          boxShadow: '0 12px 24px rgba(15, 23, 42, 0.12)',
        }}
      >
        <Box sx={{ width: 1, height: 9, borderRadius: '8px 8px 0 0', bgcolor: '#d7e0f1' }} />
        <Stack spacing={0.75} sx={{ p: 1.25 }}>
          <Box sx={{ width: '88%', height: 6, borderRadius: 999, bgcolor: '#ffb073' }} />
          <Box sx={{ width: '74%', height: 6, borderRadius: 999, bgcolor: '#ffd55d' }} />
          <Box sx={{ width: '94%', height: 6, borderRadius: 999, bgcolor: '#b0c6ea' }} />
        </Stack>
      </Box>

      <Box
        sx={{
          position: 'absolute',
          left: '50%',
          bottom: { xs: 78, md: 100 },
          width: { xs: 56, md: 84 },
          height: { xs: 52, md: 70 },
          transform: 'translateX(-150%)',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            width: 1,
            height: '100%',
            borderRadius: 2,
            bgcolor: '#7bb6ff',
            boxShadow: '0 12px 22px rgba(15, 23, 42, 0.14)',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            left: 8,
            right: 8,
            top: 10,
            height: 7,
            borderRadius: 999,
            bgcolor: 'rgba(255,255,255,0.82)',
          }}
        />
      </Box>

      <Box
        sx={{
          position: 'absolute',
          left: '50%',
          bottom: { xs: 74, md: 96 },
          width: { xs: 64, md: 92 },
          height: { xs: 34, md: 48 },
          transform: 'translateX(-26%)',
        }}
      >
        {[0, 1, 2].map((index) => (
          <Box
            key={index}
            sx={{
              position: 'absolute',
              left: index * 8,
              right: 0,
              bottom: index * 4,
              height: 10,
              borderRadius: 1.5,
              bgcolor: index === 2 ? '#eef2f8' : '#ffffff',
              boxShadow: '0 10px 18px rgba(15, 23, 42, 0.08)',
            }}
          />
        ))}
      </Box>

      <Box
        sx={{
          position: 'absolute',
          left: '50%',
          bottom: { xs: 84, md: 104 },
          width: { xs: 34, md: 48 },
          height: { xs: 44, md: 58 },
          transform: 'translateX(48%)',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            left: '50%',
            bottom: 0,
            width: 16,
            height: 26,
            transform: 'translateX(-50%)',
            borderRadius: '10px 10px 0 0',
            bgcolor: '#ffffff',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            left: 0,
            bottom: 14,
            width: 18,
            height: 22,
            borderRadius: '14px 14px 4px 4px',
            bgcolor: '#f4a66c',
            transform: 'rotate(-28deg)',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            right: 0,
            bottom: 12,
            width: 24,
            height: 28,
            borderRadius: '14px 14px 4px 4px',
            bgcolor: '#3d8b3d',
            transform: 'rotate(18deg)',
          }}
        />
      </Box>
    </Box>
  );
}

export function CommunityFloatingIcon({ icon, color, sx, rotate = 0, bubble = false, badge = false }) {
  return (
    <Box
      sx={{
        position: 'absolute',
        color,
        transform: `rotate(${rotate}deg)`,
        ...sx,
      }}
    >
      {bubble ? (
        <Box
          sx={{
            px: 1.5,
            py: 0.9,
            borderRadius: 3,
            bgcolor: color,
            color: '#0f2747',
            boxShadow: '0 12px 24px rgba(0,0,0,0.16)',
          }}
        >
          <Iconify icon={icon} width={38} />
        </Box>
      ) : badge ? (
        <Box
          sx={{
            width: 52,
            height: 52,
            borderRadius: 2.25,
            display: 'grid',
            placeItems: 'center',
            bgcolor: 'rgba(108, 174, 255, 0.18)',
            border: '2px solid rgba(108, 174, 255, 0.52)',
            boxShadow: '0 12px 24px rgba(0,0,0,0.12)',
          }}
        >
          <Iconify icon={icon} width={28} />
        </Box>
      ) : (
        <Iconify icon={icon} width={38} />
      )}
    </Box>
  );
}

export function CommunityPerson({
  sx,
  shirt,
  accent,
  scale = 1,
  laptop = false,
  seated = false,
  tie = false,
  raiseHand = false,
}) {
  const width = 86 * scale;
  const head = 26 * scale;
  const torsoWidth = 44 * scale;
  const torsoHeight = 86 * scale;
  const armWidth = 12 * scale;
  const legHeight = seated ? 46 * scale : 68 * scale;

  return (
    <Box
      sx={{
        position: 'absolute',
        width,
        height: 180 * scale,
        ...sx,
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          left: '50%',
          top: 0,
          width: head,
          height: head,
          transform: 'translateX(-50%)',
          borderRadius: '50%',
          bgcolor: '#f4c7a8',
          zIndex: 2,
        }}
      />

      <Box
        sx={{
          position: 'absolute',
          left: '50%',
          top: 8 * scale,
          width: 30 * scale,
          height: 18 * scale,
          transform: 'translateX(-50%)',
          borderRadius: '18px 18px 10px 10px',
          bgcolor: accent,
          zIndex: 3,
        }}
      />

      <Box
        sx={{
          position: 'absolute',
          left: '50%',
          top: 22 * scale,
          width: torsoWidth,
          height: torsoHeight,
          transform: 'translateX(-50%)',
          borderRadius: '24px 24px 14px 14px',
          bgcolor: shirt,
          zIndex: 1,
        }}
      />

      <Box
        sx={{
          position: 'absolute',
          left: 8 * scale,
          top: 52 * scale,
          width: raiseHand ? 40 * scale : 36 * scale,
          height: armWidth,
          borderRadius: 999,
          bgcolor: shirt,
          transform: raiseHand ? 'rotate(-68deg)' : 'rotate(28deg)',
          transformOrigin: 'right center',
        }}
      />

      <Box
        sx={{
          position: 'absolute',
          right: 8 * scale,
          top: 54 * scale,
          width: 40 * scale,
          height: armWidth,
          borderRadius: 999,
          bgcolor: shirt,
          transform: laptop ? 'rotate(-16deg)' : 'rotate(-28deg)',
          transformOrigin: 'left center',
        }}
      />

      <Box
        sx={{
          position: 'absolute',
          left: '50%',
          top: 106 * scale,
          width: armWidth,
          height: legHeight,
          transform: `translateX(${seated ? -12 * scale : -16 * scale}px) rotate(${seated ? '18deg' : '7deg'})`,
          borderRadius: 999,
          bgcolor: '#24304b',
        }}
      />

      <Box
        sx={{
          position: 'absolute',
          left: '50%',
          top: 106 * scale,
          width: armWidth,
          height: legHeight,
          transform: `translateX(${seated ? 2 * scale : 8 * scale}px) rotate(${seated ? '-28deg' : '-8deg'})`,
          borderRadius: 999,
          bgcolor: '#24304b',
        }}
      />

      {tie ? (
        <Box
          sx={{
            position: 'absolute',
            left: '50%',
            top: 42 * scale,
            width: 10 * scale,
            height: 52 * scale,
            transform: 'translateX(-50%)',
            borderRadius: 999,
            bgcolor: '#5ca0ff',
            zIndex: 2,
          }}
        />
      ) : null}

      {laptop ? (
        <Box
          sx={{
            position: 'absolute',
            left: '50%',
            top: 84 * scale,
            width: 68 * scale,
            height: 38 * scale,
            transform: 'translateX(-50%)',
            borderRadius: 2,
            bgcolor: '#eef2f8',
            boxShadow: '0 10px 20px rgba(15, 23, 42, 0.14)',
            zIndex: 4,
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: 10 * scale,
              height: 10 * scale,
              transform: 'translate(-50%, -50%)',
              borderRadius: '50%',
              bgcolor: 'rgba(255,255,255,0.62)',
            }}
          />
        </Box>
      ) : null}
    </Box>
  );
}

export function InterfaceIllustration() {
  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: { xs: 320, md: 430 },
        mx: 'auto',
        maxWidth: 560,
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          left: 0,
          top: 24,
          width: 54,
          height: 34,
          borderRadius: 1.5,
          bgcolor: '#edf4ff',
          boxShadow: '0 10px 22px rgba(15, 23, 42, 0.08)',
        }}
      >
        <Stack direction="row" spacing={0.75} justifyContent="center" sx={{ pt: 1.25 }}>
          {['#9bc3ff', '#d2e5ff', '#9bc3ff'].map((color, index) => (
            <Box
              key={index}
              sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: color }}
            />
          ))}
        </Stack>
      </Box>

      <Box
        sx={{
          position: 'absolute',
          left: { xs: 36, md: 70 },
          top: { xs: 74, md: 92 },
          width: { xs: 250, md: 318 },
          height: { xs: 160, md: 208 },
          transform: 'skew(-16deg)',
          borderRadius: 3,
          bgcolor: '#25489f',
          boxShadow: '0 24px 42px rgba(18, 39, 96, 0.18)',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            inset: 12,
            borderRadius: 2,
            bgcolor: 'common.white',
            overflow: 'hidden',
          }}
        >
          <Box sx={{ height: 18, bgcolor: '#eff4ff' }} />
          <Box sx={{ display: 'flex', height: 'calc(100% - 18px)' }}>
            <Box sx={{ width: '18%', bgcolor: '#edf1fb', p: 1 }}>
              <Stack spacing={1}>
                {['#7c8cff', '#ef2f7a', '#ffd166'].map((color) => (
                  <Box
                    key={color}
                    sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: color }}
                  />
                ))}
              </Stack>
            </Box>
            <Box sx={{ flexGrow: 1, p: 1.5 }}>
              <Grid container spacing={1.1}>
                <Grid size={{ xs: 8 }}>
                  <Box sx={{ height: 10, borderRadius: 999, bgcolor: '#d6e2fb' }} />
                </Grid>
                <Grid size={{ xs: 4 }}>
                  <Box sx={{ height: 10, borderRadius: 999, bgcolor: '#f9d9e8' }} />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Box sx={{ height: 44, borderRadius: 1.5, bgcolor: '#eef3fe', mt: 0.5 }} />
                </Grid>
                <Grid size={{ xs: 7 }}>
                  <Box sx={{ height: 38, borderRadius: 1.5, bgcolor: '#eef3fe' }} />
                </Grid>
                <Grid size={{ xs: 5 }}>
                  <Box sx={{ height: 38, borderRadius: 1.5, bgcolor: '#eef3fe' }} />
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          position: 'absolute',
          left: { xs: 130, md: 190 },
          top: { xs: 176, md: 228 },
          width: { xs: 76, md: 96 },
          height: 12,
          borderRadius: 999,
          bgcolor: '#89a0c8',
        }}
      />

      <Box
        sx={{
          position: 'absolute',
          left: { xs: 172, md: 238 },
          top: { xs: 188, md: 240 },
          width: 14,
          height: { xs: 54, md: 70 },
          borderRadius: 999,
          bgcolor: '#8ea0b9',
        }}
      />

      <InterfacePerson
        sx={{ left: { xs: 198, md: 294 }, top: { xs: 18, md: 12 } }}
        shirt="#8e4fd9"
        pants="#f39a76"
        pose="sitTop"
        scale={0.84}
      />

      <InterfaceLadder
        sx={{ left: { xs: 208, md: 300 }, top: { xs: 52, md: 58 } }}
        scale={0.92}
      />

      <InterfacePerson
        sx={{ left: { xs: 240, md: 346 }, top: { xs: 96, md: 108 } }}
        shirt="#35d6c0"
        pants="#f0c46c"
        pose="climb"
        scale={0.9}
      />

      <InterfacePerson
        sx={{ left: { xs: 62, md: 88 }, bottom: { xs: 28, md: 30 } }}
        shirt="#5d6ed6"
        pants="#c6a17b"
        pose="paint"
        scale={0.96}
      />

      <InterfacePerson
        sx={{ left: { xs: 258, md: 380 }, bottom: { xs: 10, md: 18 } }}
        shirt="#ef3e89"
        pants="#223f87"
        pose="phone"
        scale={0.9}
      />

      <Box
        sx={{
          position: 'absolute',
          left: { xs: 288, md: 414 },
          top: { xs: 120, md: 136 },
          width: { xs: 54, md: 68 },
          height: { xs: 40, md: 50 },
          borderRadius: 2,
          bgcolor: '#edf2fb',
          boxShadow: '0 12px 22px rgba(15, 23, 42, 0.08)',
        }}
      >
        <Iconify icon="mdi:image-outline" width={24} sx={{ color: '#ff9f1a', m: 1.5 }} />
      </Box>

      <Box
        sx={{
          position: 'absolute',
          left: { xs: 334, md: 474 },
          top: { xs: 148, md: 168 },
          width: { xs: 44, md: 56 },
          height: { xs: 26, md: 32 },
          borderRadius: 999,
          bgcolor: '#d8f9f3',
          color: '#2cc8a9',
          display: 'grid',
          placeItems: 'center',
          boxShadow: '0 10px 18px rgba(44, 200, 169, 0.16)',
        }}
      >
        <Iconify icon="mdi:check-bold" width={18} />
      </Box>

      <Box
        sx={{
          position: 'absolute',
          left: { xs: 278, md: 390 },
          bottom: { xs: 76, md: 96 },
          width: { xs: 72, md: 90 },
          height: { xs: 56, md: 70 },
          borderRadius: 2,
          bgcolor: '#ffffff',
          boxShadow: '0 16px 28px rgba(15, 23, 42, 0.1)',
          transform: 'rotate(-22deg)',
        }}
      >
        <Grid container spacing={0.6} sx={{ p: 1.2 }}>
          {[0, 1, 2, 3].map((item) => (
            <Grid key={item} size={{ xs: 6 }}>
              <Box sx={{ height: 14, borderRadius: 1, bgcolor: item % 2 ? '#eef2fb' : '#dce7fb' }} />
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box
        sx={{
          position: 'absolute',
          left: { xs: 324, md: 448 },
          top: { xs: 70, md: 86 },
          width: { xs: 44, md: 54 },
          height: { xs: 44, md: 54 },
          borderRadius: '50%',
          border: '4px solid #ffd6e8',
        }}
      />

      <Box
        sx={{
          position: 'absolute',
          left: { xs: 10, md: 26 },
          bottom: { xs: 22, md: 24 },
          width: { xs: 34, md: 42 },
          height: { xs: 34, md: 42 },
          borderRadius: '50%',
          bgcolor: '#ff5ca8',
          boxShadow: '0 14px 20px rgba(255, 92, 168, 0.16)',
        }}
      >
        <Iconify icon="mdi:check-bold" width={18} sx={{ color: 'common.white', m: 1 }} />
      </Box>
    </Box>
  );
}

export function InterfaceLadder({ sx, scale = 1 }) {
  return (
    <Box
      sx={{
        position: 'absolute',
        width: 48 * scale,
        height: 148 * scale,
        transform: 'rotate(22deg)',
        ...sx,
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: 6 * scale,
          height: '100%',
          borderRadius: 999,
          bgcolor: '#243d83',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          right: 0,
          top: 0,
          width: 6 * scale,
          height: '100%',
          borderRadius: 999,
          bgcolor: '#243d83',
        }}
      />
      {[18, 42, 66, 90, 114].map((top) => (
        <Box
          key={top}
          sx={{
            position: 'absolute',
            left: 4 * scale,
            right: 4 * scale,
            top: top * scale,
            height: 5 * scale,
            borderRadius: 999,
            bgcolor: '#3658b3',
          }}
        />
      ))}
    </Box>
  );
}

export function InterfacePerson({ sx, shirt, pants, pose, scale = 1 }) {
  const head = 20 * scale;

  return (
    <Box
      sx={{
        position: 'absolute',
        width: 86 * scale,
        height: 150 * scale,
        ...sx,
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          left: '50%',
          top: 0,
          width: head,
          height: head,
          transform: 'translateX(-50%)',
          borderRadius: '50%',
          bgcolor: '#f4c7a8',
          zIndex: 2,
        }}
      />

      <Box
        sx={{
          position: 'absolute',
          left: '50%',
          top: 10 * scale,
          width: 24 * scale,
          height: 12 * scale,
          transform: 'translateX(-50%)',
          borderRadius: '12px 12px 8px 8px',
          bgcolor: '#5d3e2d',
          zIndex: 3,
        }}
      />

      {pose === 'sitTop' ? (
        <>
          <Box
            sx={{
              position: 'absolute',
              left: '50%',
              top: 18 * scale,
              width: 26 * scale,
              height: 42 * scale,
              transform: 'translateX(-50%)',
              borderRadius: '16px 16px 10px 10px',
              bgcolor: shirt,
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              left: 14 * scale,
              top: 50 * scale,
              width: 30 * scale,
              height: 8 * scale,
              borderRadius: 999,
              bgcolor: pants,
              transform: 'rotate(24deg)',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              left: 36 * scale,
              top: 52 * scale,
              width: 30 * scale,
              height: 8 * scale,
              borderRadius: 999,
              bgcolor: pants,
              transform: 'rotate(96deg)',
            }}
          />
        </>
      ) : null}

      {pose === 'climb' ? (
        <>
          <Box
            sx={{
              position: 'absolute',
              left: '50%',
              top: 18 * scale,
              width: 28 * scale,
              height: 46 * scale,
              transform: 'translateX(-50%)',
              borderRadius: '16px 16px 10px 10px',
              bgcolor: shirt,
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              left: 8 * scale,
              top: 38 * scale,
              width: 28 * scale,
              height: 7 * scale,
              borderRadius: 999,
              bgcolor: shirt,
              transform: 'rotate(-32deg)',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              right: 8 * scale,
              top: 42 * scale,
              width: 28 * scale,
              height: 7 * scale,
              borderRadius: 999,
              bgcolor: shirt,
              transform: 'rotate(36deg)',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              left: 18 * scale,
              top: 66 * scale,
              width: 34 * scale,
              height: 8 * scale,
              borderRadius: 999,
              bgcolor: pants,
              transform: 'rotate(52deg)',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              left: 36 * scale,
              top: 74 * scale,
              width: 28 * scale,
              height: 8 * scale,
              borderRadius: 999,
              bgcolor: pants,
              transform: 'rotate(112deg)',
            }}
          />
        </>
      ) : null}

      {pose === 'paint' ? (
        <>
          <Box
            sx={{
              position: 'absolute',
              left: '50%',
              top: 18 * scale,
              width: 32 * scale,
              height: 52 * scale,
              transform: 'translateX(-50%)',
              borderRadius: '18px 18px 10px 10px',
              bgcolor: shirt,
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              left: 2 * scale,
              top: 48 * scale,
              width: 32 * scale,
              height: 7 * scale,
              borderRadius: 999,
              bgcolor: shirt,
              transform: 'rotate(-28deg)',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              right: 2 * scale,
              top: 56 * scale,
              width: 30 * scale,
              height: 7 * scale,
              borderRadius: 999,
              bgcolor: shirt,
              transform: 'rotate(22deg)',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              left: 22 * scale,
              top: 70 * scale,
              width: 9 * scale,
              height: 46 * scale,
              borderRadius: 999,
              bgcolor: pants,
              transform: 'rotate(10deg)',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              left: 40 * scale,
              top: 70 * scale,
              width: 9 * scale,
              height: 46 * scale,
              borderRadius: 999,
              bgcolor: pants,
              transform: 'rotate(-8deg)',
            }}
          />
        </>
      ) : null}

      {pose === 'phone' ? (
        <>
          <Box
            sx={{
              position: 'absolute',
              left: '50%',
              top: 18 * scale,
              width: 30 * scale,
              height: 54 * scale,
              transform: 'translateX(-50%)',
              borderRadius: '18px 18px 10px 10px',
              bgcolor: shirt,
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              left: 12 * scale,
              top: 48 * scale,
              width: 30 * scale,
              height: 7 * scale,
              borderRadius: 999,
              bgcolor: shirt,
              transform: 'rotate(-48deg)',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              right: 8 * scale,
              top: 58 * scale,
              width: 30 * scale,
              height: 7 * scale,
              borderRadius: 999,
              bgcolor: shirt,
              transform: 'rotate(42deg)',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              left: 24 * scale,
              top: 74 * scale,
              width: 9 * scale,
              height: 44 * scale,
              borderRadius: 999,
              bgcolor: pants,
              transform: 'rotate(8deg)',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              left: 42 * scale,
              top: 74 * scale,
              width: 9 * scale,
              height: 46 * scale,
              borderRadius: 999,
              bgcolor: pants,
              transform: 'rotate(-10deg)',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              left: 0,
              top: 44 * scale,
              width: 16 * scale,
              height: 8 * scale,
              borderRadius: 999,
              bgcolor: '#ff5ca8',
              transform: 'rotate(-30deg)',
            }}
          />
        </>
      ) : null}
    </Box>
  );
}

export function CourseStylePreview({ kind }) {
  return (
    <Box
      sx={{
        p: 1,
        borderRadius: 2,
        bgcolor: '#f6f8fd',
        boxShadow: '0 18px 34px rgba(7, 12, 24, 0.22)',
      }}
    >
      {kind === 'catalog' && (
        <Box
          sx={{
            height: 214,
            borderRadius: 1.5,
            overflow: 'hidden',
            bgcolor: 'common.white',
          }}
        >
          <Box sx={{ height: 16, bgcolor: '#eef2fb' }} />
          <Grid container sx={{ height: 'calc(100% - 16px)' }}>
            <Grid size={{ xs: 4 }}>
              <Box sx={{ height: 1, bgcolor: '#f7f9fd', borderRight: '1px solid #eef2fb', p: 1.2 }}>
                <Stack spacing={1}>
                  <Box sx={{ width: '74%', height: 8, borderRadius: 999, bgcolor: '#2f5fff' }} />
                  {['#e8edf9', '#e8edf9', '#e8edf9', '#e8edf9'].map((color, index) => (
                    <Box
                      key={index}
                      sx={{ width: '100%', height: 12, borderRadius: 1, bgcolor: color }}
                    />
                  ))}
                </Stack>
              </Box>
            </Grid>
            <Grid size={{ xs: 8 }}>
              <Box sx={{ p: 1.25 }}>
                <Box sx={{ width: '58%', height: 10, borderRadius: 999, bgcolor: '#1f2c45' }} />
                <Box sx={{ width: '76%', height: 8, mt: 1, borderRadius: 999, bgcolor: '#dbe5f7' }} />
                <Box
                  sx={{
                    mt: 1.4,
                    height: 82,
                    borderRadius: 1.5,
                    background:
                      'linear-gradient(135deg, rgba(44,96,255,0.18), rgba(239,47,122,0.12)), linear-gradient(180deg, #3a4c82, #1c2233)',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      left: 18,
                      right: 18,
                      bottom: 18,
                      height: 26,
                      borderRadius: 1.5,
                      bgcolor: 'rgba(255,255,255,0.12)',
                    }}
                  />
                </Box>
                <Grid container spacing={1} sx={{ mt: 1.4 }}>
                  {[0, 1].map((item) => (
                    <Grid key={item} size={{ xs: 6 }}>
                      <Box sx={{ p: 0.9, borderRadius: 1.25, bgcolor: '#f6f8fd' }}>
                        <Stack direction="row" spacing={0.8} alignItems="center">
                          <Box sx={{ width: 18, height: 18, borderRadius: '50%', bgcolor: '#dbe5f7' }} />
                          <Stack spacing={0.6} sx={{ flexGrow: 1 }}>
                            <Box sx={{ width: '90%', height: 6, borderRadius: 999, bgcolor: '#dbe5f7' }} />
                            <Box sx={{ width: '70%', height: 6, borderRadius: 999, bgcolor: '#edf1f8' }} />
                          </Stack>
                        </Stack>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </Box>
      )}

      {kind === 'overview' && (
        <Box
          sx={{
            height: 214,
            borderRadius: 1.5,
            overflow: 'hidden',
            bgcolor: 'common.white',
          }}
        >
          <Box sx={{ height: 16, bgcolor: '#eef2fb' }} />
          <Box sx={{ p: 1.1 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Box sx={{ width: '62%', height: 10, borderRadius: 999, bgcolor: '#dbe5f7' }} />
              <Box sx={{ width: 62, height: 18, borderRadius: 999, bgcolor: '#52d273' }} />
            </Stack>

            <Grid container spacing={1.1} sx={{ mt: 1.2 }}>
              <Grid size={{ xs: 8 }}>
                <Box
                  sx={{
                    height: 96,
                    borderRadius: 1.5,
                    background:
                      'linear-gradient(180deg, #dadde9 0%, #c0c8de 20%, #d8b3c7 50%, #f0d5d3 68%, #ffffff 100%)',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      left: 0,
                      right: 0,
                      bottom: 18,
                      height: 24,
                      bgcolor: 'rgba(255,255,255,0.25)',
                    }}
                  />
                </Box>
              </Grid>
              <Grid size={{ xs: 4 }}>
                <Stack spacing={0.8}>
                  {[0, 1, 2, 3].map((item) => (
                    <Box key={item} sx={{ height: 20, borderRadius: 1, bgcolor: '#f4f6fb' }} />
                  ))}
                </Stack>
              </Grid>
            </Grid>

            <Box sx={{ width: '54%', height: 8, mt: 1.3, borderRadius: 999, bgcolor: '#cfdcf4' }} />
            <Box sx={{ width: '84%', height: 7, mt: 1, borderRadius: 999, bgcolor: '#e8edf9' }} />
            <Box sx={{ width: '88%', height: 7, mt: 0.8, borderRadius: 999, bgcolor: '#e8edf9' }} />
            <Box sx={{ width: '78%', height: 7, mt: 0.8, borderRadius: 999, bgcolor: '#e8edf9' }} />
          </Box>
        </Box>
      )}

      {kind === 'details' && (
        <Box
          sx={{
            height: 214,
            borderRadius: 1.5,
            overflow: 'hidden',
            bgcolor: 'common.white',
          }}
        >
          <Box sx={{ height: 16, bgcolor: '#eef2fb' }} />
          <Grid container sx={{ height: 'calc(100% - 16px)' }}>
            <Grid size={{ xs: 8 }}>
              <Box sx={{ height: 1, bgcolor: '#1f2435', color: 'common.white', p: 1.2 }}>
                <Box sx={{ width: '58%', height: 9, borderRadius: 999, bgcolor: 'rgba(255,255,255,0.9)' }} />
                <Box sx={{ width: '82%', height: 6, mt: 0.9, borderRadius: 999, bgcolor: 'rgba(255,255,255,0.22)' }} />
                <Box sx={{ width: '74%', height: 6, mt: 0.7, borderRadius: 999, bgcolor: 'rgba(255,255,255,0.18)' }} />

                <Stack spacing={1} sx={{ mt: 1.5 }}>
                  {[0, 1, 2, 3].map((item) => (
                    <Stack key={item} direction="row" spacing={0.8} alignItems="center">
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          bgcolor: item === 2 ? '#ef6b7b' : '#f6c54e',
                        }}
                      />
                      <Box sx={{ flexGrow: 1, height: 7, borderRadius: 999, bgcolor: 'rgba(255,255,255,0.14)' }} />
                    </Stack>
                  ))}
                </Stack>

                <Box sx={{ mt: 1.6, p: 1.1, borderRadius: 1.25, bgcolor: 'rgba(255,255,255,0.06)' }}>
                  <Stack direction="row" spacing={0.9}>
                    <Box sx={{ width: 56, height: 10, borderRadius: 999, bgcolor: '#6f89bc' }} />
                    <Box sx={{ width: 48, height: 10, borderRadius: 999, bgcolor: '#2f5fff' }} />
                  </Stack>
                </Box>
              </Box>
            </Grid>
            <Grid size={{ xs: 4 }}>
              <Box sx={{ height: 1, bgcolor: '#f7f9fd', borderLeft: '1px solid #eef2fb', p: 1.2 }}>
                <Box
                  sx={{
                    height: 44,
                    borderRadius: 1.2,
                    background: 'linear-gradient(135deg, #77b7ff, #c9e7ff)',
                  }}
                />
                <Box sx={{ width: '54%', height: 10, mt: 1.1, borderRadius: 999, bgcolor: '#1f2c45' }} />
                <Box sx={{ width: '42%', height: 7, mt: 0.8, borderRadius: 999, bgcolor: '#ef6b7b' }} />
                <Box sx={{ width: '72%', height: 18, mt: 1.2, borderRadius: 999, bgcolor: '#ef6b7b' }} />
                <Stack spacing={0.75} sx={{ mt: 1.3 }}>
                  {[0, 1, 2, 3].map((item) => (
                    <Box key={item} sx={{ height: 8, borderRadius: 999, bgcolor: '#e8edf9' }} />
                  ))}
                </Stack>
              </Box>
            </Grid>
          </Grid>
        </Box>
      )}
    </Box>
  );
}

export function ContentInteractionPreview() {
  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: { xs: 360, md: 430 },
        mx: 'auto',
        maxWidth: 620,
      }}
    >
      <FloatingFilterCard
        sx={{ left: { xs: 10, md: 56 }, top: { xs: 12, md: 18 }, width: 132 }}
        title="Saved"
      >
        <Stack direction="row" spacing={0.75} alignItems="center">
          <Box
            sx={{
              width: 18,
              height: 18,
              borderRadius: '50%',
              border: '2px solid #efb7cb',
              color: '#ef2f7a',
              display: 'grid',
              placeItems: 'center',
            }}
          >
            <Iconify icon="mdi:heart-outline" width={11} />
          </Box>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
            Add to study list
          </Typography>
        </Stack>
      </FloatingFilterCard>

      <FloatingFilterCard
        sx={{ left: { xs: 150, md: 188 }, top: 0, width: 126 }}
        title="Access"
      >
        <Stack spacing={0.7}>
          {['Free modules', 'Paid modules', 'Subscription only'].map((label, index) => (
            <Stack key={label} direction="row" spacing={0.9} alignItems="center">
              <Box
                sx={{
                  width: 11,
                  height: 11,
                  borderRadius: 0.5,
                  bgcolor: index < 2 ? '#52d273' : '#eef2fb',
                }}
              />
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {label}
              </Typography>
            </Stack>
          ))}
        </Stack>
      </FloatingFilterCard>

      <FloatingFilterCard
        sx={{ left: { xs: 18, md: 64 }, top: { xs: 86, md: 96 }, width: 148 }}
        title="Rating"
      >
        <Stack spacing={0.7}>
          {[
            ['#52d273', '4.5 & up'],
            ['#9bc8ff', '4.0 & up'],
            ['#d9dce5', '3.5 & up'],
            ['#d9dce5', '3.0 & up'],
          ].map(([color, label]) => (
            <Stack key={label} direction="row" spacing={0.8} alignItems="center">
              <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: color }} />
              <Typography variant="caption" sx={{ color: '#f3b23c', letterSpacing: 1 }}>
                ★★★★★
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {label}
              </Typography>
            </Stack>
          ))}
        </Stack>
      </FloatingFilterCard>

      <FloatingFilterCard
        sx={{ right: { xs: 78, md: 130 }, top: { xs: 110, md: 122 }, width: 154 }}
        title="Status"
      >
        <Box
          sx={{
            px: 1.25,
            py: 1,
            borderRadius: 1,
            bgcolor: '#f6f8fd',
            border: '1px solid #eef2fb',
          }}
        >
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="caption" sx={{ color: 'text.primary', fontWeight: 600 }}>
              Review Available
            </Typography>
            <Iconify icon="mdi:chevron-down" width={16} sx={{ color: 'text.secondary' }} />
          </Stack>
        </Box>
      </FloatingFilterCard>

      <Box
        sx={{
          position: 'absolute',
          right: { xs: 24, md: 50 },
          top: { xs: 92, md: 104 },
          width: 44,
          height: 44,
          borderRadius: '50%',
          bgcolor: '#8a56ff',
          color: 'common.white',
          display: 'grid',
          placeItems: 'center',
          boxShadow: '0 14px 26px rgba(138, 86, 255, 0.28)',
        }}
      >
        <Iconify icon="mdi:check-bold" width={20} />
      </Box>

      <Box
        sx={{
          position: 'absolute',
          left: { xs: 186, md: 246 },
          top: { xs: 218, md: 234 },
          width: 48,
          height: 48,
          borderRadius: '50%',
          bgcolor: '#4ec7dd',
          color: 'common.white',
          display: 'grid',
          placeItems: 'center',
          boxShadow: '0 14px 26px rgba(78, 199, 221, 0.24)',
        }}
      >
        <Iconify icon="mdi:pencil-outline" width={22} />
      </Box>

      <FloatingFilterCard
        sx={{ left: { xs: 232, md: 300 }, top: { xs: 208, md: 222 }, width: 146 }}
        title="Topics"
      >
        <Stack spacing={0.75}>
          {[
            'Hydraulics (91)',
            'Structural (88)',
            'Materials (86)',
            'Surveying (34)',
            'Sanitary (28)',
          ].map((label, index) => (
            <Stack key={label} direction="row" spacing={0.8} alignItems="center">
              <Box
                sx={{
                  width: 11,
                  height: 11,
                  borderRadius: 0.5,
                  bgcolor: index < 2 ? '#52d273' : '#eef2fb',
                }}
              />
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {label}
              </Typography>
            </Stack>
          ))}
          <Typography variant="caption" sx={{ color: '#a0a9ba' }}>
            Show all 18
          </Typography>
        </Stack>
      </FloatingFilterCard>

      <FloatingFilterCard
        sx={{ right: { xs: 12, md: 30 }, top: { xs: 238, md: 224 }, width: 128 }}
        title=""
      >
        <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
          <Typography variant="body2" sx={{ fontWeight: 700 }}>
            4.7
          </Typography>
          <Typography variant="caption" sx={{ color: '#f3b23c', letterSpacing: 1 }}>
            ★★★★★
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            3 reviews
          </Typography>
        </Stack>
      </FloatingFilterCard>

      <FloatingFilterCard
        sx={{ right: { xs: 32, md: 52 }, top: { xs: 292, md: 300 }, width: 110 }}
        title="Levels"
      >
        <Stack spacing={0.85}>
          {['Beginner', 'Intermediate', 'Advanced'].map((label, index) => (
            <Stack key={label} direction="row" spacing={0.8} alignItems="center">
              <Box
                sx={{
                  width: 11,
                  height: 11,
                  borderRadius: 0.5,
                  bgcolor: '#52d273',
                }}
              />
              <Typography
                variant="caption"
                sx={{ color: index === 2 ? 'text.primary' : 'text.secondary' }}
              >
                {label}
              </Typography>
            </Stack>
          ))}
        </Stack>
      </FloatingFilterCard>
    </Box>
  );
}

export function FloatingFilterCard({ title, sx, children }) {
  return (
    <Box
      sx={{
        position: 'absolute',
        p: 1.5,
        borderRadius: 2,
        bgcolor: 'common.white',
        boxShadow: '0 18px 32px rgba(15, 23, 42, 0.1)',
        ...sx,
      }}
    >
      {title ? (
        <Typography
          variant="subtitle2"
          sx={{ mb: 1, color: 'text.primary', fontSize: '0.82rem' }}
        >
          {title}
        </Typography>
      ) : null}
      {children}
    </Box>
  );
}

export function LessonQuizStylesPreview() {
  return (
    <Box
      sx={{
        p: 1,
        borderRadius: 2,
        bgcolor: '#f7f9fd',
        boxShadow: '0 24px 42px rgba(7, 12, 24, 0.22)',
      }}
    >
      <Box
        sx={{
          position: 'relative',
          minHeight: { xs: 280, md: 340 },
          borderRadius: 1.5,
          overflow: 'hidden',
          bgcolor: 'common.white',
        }}
      >
        <Box
          sx={{
            px: 1.5,
            py: 1,
            borderBottom: '1px solid #eef2fb',
            bgcolor: '#fbfcfe',
          }}
        >
          <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
            <Stack direction="row" spacing={0.9} alignItems="center">
              <Box sx={{ width: 18, height: 18, borderRadius: 0.75, bgcolor: '#4f8bff' }} />
              <Typography variant="caption" sx={{ color: '#8f9bb0' }}>
                CE Curriculum
              </Typography>
              <Typography variant="caption" sx={{ color: '#1f2c45', fontWeight: 600 }}>
                Fluid Mechanics Quiz
              </Typography>
            </Stack>

            <Stack direction="row" spacing={0.75} alignItems="center">
              <Box
                sx={{
                  px: 1,
                  py: 0.35,
                  borderRadius: 999,
                  bgcolor: '#4f8bff',
                  color: 'common.white',
                  typography: 'caption',
                  fontWeight: 700,
                }}
              >
                48:57:30
              </Box>
              <Iconify icon="mdi:cog-outline" width={16} sx={{ color: '#a3adbf' }} />
              <Typography variant="caption" sx={{ color: '#7a8599' }}>
                Discussions
              </Typography>
            </Stack>
          </Stack>
        </Box>

        <Box sx={{ px: { xs: 2, md: 3 }, py: { xs: 2, md: 2.5 } }}>
          <Stack spacing={2.25}>
            <QuestionBlock
              number="1."
              prompt="Which hydraulic principle is most closely used when analyzing pressure changes in flowing water?"
              options={['Hooke law', 'Bernoulli equation', 'Ohm law', 'Young modulus']}
              selected={1}
            />

            <QuestionBlock
              number="2."
              prompt="Which topic usually belongs to sanitary and plumbing systems design?"
              options={['Pipe sizing', 'Circuit analysis', 'Heat treatment', 'Signal processing']}
              selected={0}
            />

            <QuestionBlock
              number="3."
              prompt="Which unit is commonly used when measuring pump discharge in applied hydraulics?"
              options={['m3/s', 'kg/m', 'N/mm2', 'rad/s']}
              selected={0}
            />
          </Stack>
        </Box>

        <Box
          sx={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            px: 3.25,
            py: 1.6,
            borderRadius: 999,
            bgcolor: '#4f8bff',
            color: 'common.white',
            boxShadow: '0 18px 30px rgba(79, 139, 255, 0.3)',
            typography: 'subtitle1',
            fontWeight: 700,
          }}
        >
          LIVE PREVIEW
        </Box>

        <Box
          sx={{
            px: { xs: 2, md: 3 },
            py: 1.2,
            borderTop: '1px solid #eef2fb',
            bgcolor: '#fbfcfe',
          }}
        >
          <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
            <Typography variant="caption" sx={{ color: '#7f8ca3' }}>
              Previous
            </Typography>

            <Stack direction="row" spacing={0.6}>
              {[1, 2, 3, 4, 5].map((page) => (
                <Box
                  key={page}
                  sx={{
                    width: 22,
                    height: 22,
                    borderRadius: 0.9,
                    display: 'grid',
                    placeItems: 'center',
                    bgcolor: page === 2 ? '#4f8bff' : '#f0f4fb',
                    color: page === 2 ? 'common.white' : '#7f8ca3',
                    typography: 'caption',
                    fontWeight: 700,
                  }}
                >
                  {page}
                </Box>
              ))}
            </Stack>

            <Stack direction="row" spacing={1} alignItems="center">
              <Box
                sx={{
                  px: 1.5,
                  py: 0.65,
                  borderRadius: 0.9,
                  bgcolor: '#2f66d4',
                  color: 'common.white',
                  typography: 'caption',
                  fontWeight: 700,
                }}
              >
                Submit quiz
              </Box>
              <Typography variant="caption" sx={{ color: '#7f8ca3' }}>
                Next
              </Typography>
            </Stack>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}

export function QuestionBlock({ number, prompt, options, selected }) {
  return (
    <Stack spacing={1.1}>
      <Typography variant="subtitle2" sx={{ color: '#1f2c45' }}>
        {number} {prompt}
      </Typography>

      <Stack spacing={0.85}>
        {options.map((option, index) => (
          <Stack key={option} direction="row" spacing={1} alignItems="center">
            <Box
              sx={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                bgcolor: index === selected ? '#4f8bff' : '#d9e2f1',
              }}
            />
            <Typography variant="caption" sx={{ minWidth: 72, color: '#5f6b80' }}>
              {option}
            </Typography>
            <Box
              sx={{
                flexGrow: 1,
                height: 14,
                borderRadius: 1,
                bgcolor: index === selected ? '#eef4ff' : '#f5f7fc',
              }}
            />
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
}

export function CollaborationPreview() {
  return (
    <Box
      sx={{
        p: 1.2,
        borderRadius: 2,
        bgcolor: 'common.white',
        boxShadow: '0 20px 40px rgba(15, 23, 42, 0.12)',
      }}
    >
      <Box
        sx={{
          position: 'relative',
          minHeight: { xs: 290, md: 380 },
          borderRadius: 1.5,
          overflow: 'hidden',
          background:
            'radial-gradient(circle at center, rgba(243,247,255,0.95) 0%, rgba(255,255,255,1) 70%)',
        }}
      >
        <CollabAvatar
          sx={{ left: { xs: 18, md: 48 }, top: { xs: 78, md: 108 } }}
          hair="#724a3b"
          shirt="#335c97"
          accessory="glasses"
        />

        <CollabAvatar
          sx={{ right: { xs: 26, md: 44 }, top: { xs: 22, md: 54 } }}
          hair="#8c5b48"
          shirt="#31466f"
          tie
        />

        <CollabAvatar
          sx={{ right: { xs: 24, md: 44 }, bottom: { xs: 24, md: 42 } }}
          hair="#c08663"
          shirt="#31466f"
          tie
        />

        <Box
          sx={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: { xs: 66, md: 84 },
            height: { xs: 50, md: 64 },
            transform: 'translate(-50%, -50%)',
            borderRadius: 1.5,
            border: '4px solid #5e708f',
            bgcolor: 'common.white',
            boxShadow: '0 12px 24px rgba(15, 23, 42, 0.08)',
          }}
        >
          <Iconify
            icon="mdi:web"
            width={30}
            sx={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              color: '#406ea8',
            }}
          />
        </Box>

        {[
          { left: '34%', top: '50%', width: 72, rotate: 0 },
          { right: '30%', top: '38%', width: 64, rotate: -28 },
          { right: '30%', top: '62%', width: 64, rotate: 28 },
        ].map((line, index) => (
          <Box
            key={index}
            sx={{
              position: 'absolute',
              height: 4,
              borderRadius: 999,
              bgcolor: '#b4bdca',
              transform: `translateY(-50%) rotate(${line.rotate}deg)`,
              ...line,
            }}
          />
        ))}

        <CollabDoc sx={{ right: { xs: 126, md: 148 }, top: { xs: 54, md: 94 } }} />
        <CollabDoc sx={{ right: { xs: 126, md: 148 }, bottom: { xs: 54, md: 84 } }} />
      </Box>
    </Box>
  );
}

export function CollabAvatar({ sx, hair, shirt, accessory, tie = false }) {
  return (
    <Box
      sx={{
        position: 'absolute',
        width: { xs: 110, md: 136 },
        height: { xs: 146, md: 174 },
        ...sx,
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          left: '50%',
          top: 8,
          width: { xs: 58, md: 72 },
          height: { xs: 66, md: 82 },
          transform: 'translateX(-50%)',
          borderRadius: '50% 50% 44% 44%',
          bgcolor: hair,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          left: '50%',
          top: { xs: 20, md: 24 },
          width: { xs: 50, md: 62 },
          height: { xs: 58, md: 72 },
          transform: 'translateX(-50%)',
          borderRadius: '50%',
          bgcolor: '#f5c79b',
          zIndex: 1,
        }}
      />
      {accessory === 'glasses' ? (
        <>
          <Box
            sx={{
              position: 'absolute',
              left: '50%',
              top: { xs: 44, md: 52 },
              width: { xs: 18, md: 22 },
              height: { xs: 18, md: 22 },
              transform: 'translateX(-120%)',
              borderRadius: '50%',
              border: '4px solid #244261',
              zIndex: 2,
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              left: '50%',
              top: { xs: 44, md: 52 },
              width: { xs: 18, md: 22 },
              height: { xs: 18, md: 22 },
              transform: 'translateX(20%)',
              borderRadius: '50%',
              border: '4px solid #244261',
              zIndex: 2,
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              left: '50%',
              top: { xs: 52, md: 60 },
              width: { xs: 10, md: 14 },
              height: 4,
              transform: 'translateX(-50%)',
              borderRadius: 999,
              bgcolor: '#244261',
              zIndex: 2,
            }}
          />
        </>
      ) : null}

      <Box
        sx={{
          position: 'absolute',
          left: '50%',
          bottom: 0,
          width: { xs: 74, md: 92 },
          height: { xs: 74, md: 92 },
          transform: 'translateX(-50%)',
          borderRadius: '26px 26px 12px 12px',
          bgcolor: shirt,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          left: '50%',
          bottom: { xs: 56, md: 70 },
          width: { xs: 34, md: 42 },
          height: { xs: 28, md: 34 },
          transform: 'translateX(-50%)',
          bgcolor: '#f7fbff',
          clipPath: 'polygon(50% 100%, 0 0, 100% 0)',
        }}
      />
      {tie ? (
        <Box
          sx={{
            position: 'absolute',
            left: '50%',
            bottom: { xs: 18, md: 24 },
            width: { xs: 14, md: 16 },
            height: { xs: 40, md: 48 },
            transform: 'translateX(-50%)',
            borderRadius: '6px 6px 12px 12px',
            bgcolor: '#e06a46',
          }}
        />
      ) : null}
    </Box>
  );
}

export function CollabDoc({ sx }) {
  return (
    <Box
      sx={{
        position: 'absolute',
        width: { xs: 44, md: 56 },
        height: { xs: 60, md: 76 },
        borderRadius: 1.5,
        bgcolor: '#ffcb3d',
        boxShadow: '0 12px 22px rgba(255, 203, 61, 0.24)',
        ...sx,
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          right: 0,
          top: 0,
          width: 16,
          height: 16,
          bgcolor: '#ffd95f',
          clipPath: 'polygon(0 0, 100% 0, 100% 100%)',
        }}
      />
      <Stack spacing={0.7} sx={{ p: 1.2, pt: 1.5 }}>
        {[0, 1, 2].map((item) => (
          <Box
            key={item}
            sx={{ width: item === 2 ? '70%' : '100%', height: 4, borderRadius: 999, bgcolor: '#5d4a23' }}
          />
        ))}
      </Stack>
    </Box>
  );
}

export function IntegrationCard({ item }) {
  return (
    <Box
      sx={{
        height: 1,
        minHeight: 122,
        px: { xs: 2.5, md: 3.25 },
        py: { xs: 3, md: 3.25 },
        borderRadius: 1,
        bgcolor: 'common.white',
        color: 'text.primary',
        boxShadow: '0 10px 20px rgba(7, 12, 24, 0.08)',
        display: 'grid',
        placeItems: 'center',
        transition:
          'transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.35s cubic-bezier(0.22, 1, 0.36, 1)',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 20px 40px rgba(7, 12, 24, 0.14)',
        },
      }}
    >
      <IntegrationWordmark item={item} />
    </Box>
  );
}

export function IntegrationWordmark({ item }) {
  if (item.key === 'elementor') {
    return (
      <Stack direction="row" spacing={1.4} alignItems="center">
        <Box
          sx={{
            width: 34,
            height: 34,
            borderRadius: '50%',
            bgcolor: '#b83280',
            color: 'common.white',
            display: 'grid',
            placeItems: 'center',
            typography: 'subtitle1',
            fontWeight: 800,
          }}
        >
          e
        </Box>
        <Typography sx={{ fontSize: '2rem', fontWeight: 700, color: '#9c145c' }}>
          elementor
        </Typography>
      </Stack>
    );
  }

  if (item.key === 'wpbakery') {
    return (
      <Stack direction="row" spacing={1.4} alignItems="center">
        <Box sx={{ position: 'relative', width: 40, height: 28 }}>
          <Box
            sx={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: 28,
              height: 28,
              borderRadius: '50%',
              bgcolor: '#35a7ff',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              right: 0,
              bottom: 0,
              width: 18,
              height: 18,
              borderRadius: '50%',
              bgcolor: '#53b8ff',
            }}
          />
        </Box>
        <Stack spacing={0.1}>
          <Typography sx={{ fontSize: '1.3rem', fontWeight: 800, color: '#258ad9', lineHeight: 1 }}>
            WPBakery
          </Typography>
          <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: '#2f6ea3', lineHeight: 1 }}>
            Page Builder
          </Typography>
        </Stack>
      </Stack>
    );
  }

  if (item.key === 'woocommerce') {
    return (
      <Stack direction="row" spacing={1.1} alignItems="center">
        <Box
          sx={{
            px: 1.2,
            py: 0.3,
            borderRadius: 1,
            bgcolor: '#b25bb8',
            color: 'common.white',
            typography: 'subtitle1',
            fontWeight: 800,
            lineHeight: 1,
          }}
        >
          WOO
        </Box>
        <Typography sx={{ fontSize: '1.9rem', fontWeight: 800, color: '#1f2435' }}>
          COMMERCE
        </Typography>
      </Stack>
    );
  }

  if (item.key === 'zoom') {
    return <Typography sx={{ fontSize: '3.2rem', fontWeight: 800, color: '#2d8cff' }}>zoom</Typography>;
  }

  if (item.key === 'paidmemberships') {
    return (
      <Stack direction="row" spacing={1.1} alignItems="center">
        <Box
          sx={{
            width: 28,
            height: 28,
            borderRadius: 0.75,
            border: '2px solid #8fbf6d',
            color: '#5fa75f',
            display: 'grid',
            placeItems: 'center',
          }}
        >
          <Iconify icon="mdi:check-bold" width={18} />
        </Box>
        <Typography sx={{ fontSize: '1.6rem', fontWeight: 700, color: '#5b8c54' }}>
          PaidMembershipsPro
        </Typography>
      </Stack>
    );
  }

  if (item.key === 'stripe') {
    return <Typography sx={{ fontSize: '3.2rem', fontWeight: 800, color: '#635bff' }}>stripe</Typography>;
  }

  if (item.key === 'paypal') {
    return (
      <Stack direction="row" spacing={1.15} alignItems="center">
        <Box sx={{ position: 'relative', width: 28, height: 34 }}>
          <Typography
            sx={{
              position: 'absolute',
              left: 0,
              top: 0,
              fontSize: '2.2rem',
              fontWeight: 900,
              color: '#0a66c2',
              lineHeight: 1,
            }}
          >
            P
          </Typography>
          <Typography
            sx={{
              position: 'absolute',
              left: 8,
              top: 4,
              fontSize: '2rem',
              fontWeight: 900,
              color: '#003087',
              opacity: 0.9,
              lineHeight: 1,
            }}
          >
            P
          </Typography>
        </Box>
        <Typography sx={{ fontSize: '2.1rem', fontWeight: 800, color: '#0a66c2' }}>
          PayPal
        </Typography>
      </Stack>
    );
  }

  if (item.key === 'gamipress') {
    return (
      <Stack direction="row" spacing={1.1} alignItems="center">
        <Iconify icon="mdi:crown-outline" width={34} sx={{ color: '#28b1f0' }} />
        <Typography sx={{ fontSize: '2rem', fontWeight: 400, color: '#28b1f0' }}>
          GamiPress
        </Typography>
      </Stack>
    );
  }

  if (item.key === 'presto') {
    return (
      <Stack direction="row" spacing={1} alignItems="center">
        <Typography sx={{ fontSize: '1.75rem', fontWeight: 800, color: '#292929' }}>
          PRESTO
        </Typography>
        <Box
          sx={{
            width: 0,
            height: 0,
            borderTop: '12px solid transparent',
            borderBottom: '12px solid transparent',
            borderLeft: '20px solid #6b5cff',
          }}
        />
        <Typography sx={{ fontSize: '1.75rem', fontWeight: 400, color: '#585f6d' }}>
          player
        </Typography>
      </Stack>
    );
  }

  if (item.key === 'googleclassroom') {
    return (
      <Stack direction="row" spacing={1.2} alignItems="center">
        <Box
          sx={{
            width: 42,
            height: 32,
            borderRadius: 0.8,
            bgcolor: '#f6c343',
            p: 0.45,
          }}
        >
          <Box
            sx={{
              width: 1,
              height: 1,
              borderRadius: 0.6,
              bgcolor: '#5bb974',
              display: 'grid',
              placeItems: 'center',
              color: 'common.white',
            }}
          >
            <Iconify icon="mdi:account-school-outline" width={16} />
          </Box>
        </Box>
        <Stack spacing={0}>
          <Typography sx={{ fontSize: '1.05rem', color: '#6b7280', lineHeight: 1 }}>
            Google
          </Typography>
          <Typography sx={{ fontSize: '1.65rem', color: '#4b5563', lineHeight: 1.05 }}>
            Classroom
          </Typography>
        </Stack>
      </Stack>
    );
  }

  if (item.key === 'mailchimp') {
    return (
      <Stack direction="row" spacing={1.1} alignItems="center">
        <Box
          sx={{
            width: 34,
            height: 34,
            borderRadius: '50%',
            border: '3px solid #111827',
            display: 'grid',
            placeItems: 'center',
            color: '#111827',
          }}
        >
          <Iconify icon="mdi:gesture-tap-button" width={18} />
        </Box>
        <Typography sx={{ fontSize: '2rem', fontWeight: 800, color: '#111827' }}>
          mailchimp
        </Typography>
      </Stack>
    );
  }

  if (item.key === 'wpml') {
    return (
      <Stack direction="row" spacing={0.2} alignItems="center">
        {[
          ['W', '#5f6672'],
          ['P', '#7fc7d6'],
          ['M', '#6aa7bf'],
          ['L', '#d56a43'],
        ].map(([letter, color]) => (
          <Typography key={letter} sx={{ fontSize: '3rem', fontWeight: 400, color, lineHeight: 1 }}>
            {letter}
          </Typography>
        ))}
      </Stack>
    );
  }

  if (item.key === 'contactform') {
    return (
      <Stack direction="row" spacing={1.1} alignItems="center">
        <Box
          sx={{
            width: 34,
            height: 34,
            borderRadius: '50%',
            bgcolor: '#2f6ea3',
            color: 'common.white',
            display: 'grid',
            placeItems: 'center',
          }}
        >
          <Iconify icon="mdi:send-circle-outline" width={20} />
        </Box>
        <Typography sx={{ fontSize: '1.7rem', fontWeight: 500, color: '#475569' }}>
          Contact Form 7
        </Typography>
      </Stack>
    );
  }

  if (item.key === 'h5p') {
    return <Typography sx={{ fontSize: '3.6rem', fontWeight: 800, color: '#3296f3' }}>H5P</Typography>;
  }

  if (item.key === 'buddypress') {
    return (
      <Stack direction="row" spacing={1.1} alignItems="center">
        <Box
          sx={{
            width: 34,
            height: 34,
            borderRadius: '50%',
            border: '3px solid #d86d4d',
            color: '#d86d4d',
            display: 'grid',
            placeItems: 'center',
          }}
        >
          <Iconify icon="mdi:account-group-outline" width={20} />
        </Box>
        <Typography sx={{ fontSize: '2rem', fontWeight: 500, color: '#a5482e' }}>
          BuddyPress
        </Typography>
      </Stack>
    );
  }

  return (
    <Typography sx={{ fontSize: '1.8rem', fontWeight: 700, color: '#1f2937', textAlign: 'center' }}>
      {item.title}
    </Typography>
  );
}

export function TranslationReadyIllustration() {
  const markers = [
    { top: '14%', left: '52%', label: 'UA', colors: ['#3b82f6', '#facc15'] },
    { top: '18%', left: '20%', label: 'PH', colors: ['#2563eb', '#dc2626'] },
    { top: '22%', left: '38%', label: 'ES', colors: ['#dc2626', '#fbbf24', '#dc2626'] },
    { top: '20%', left: '66%', label: 'RU', colors: ['#ffffff', '#2563eb', '#dc2626'] },
    { top: '24%', left: '54%', label: 'NL', colors: ['#dc2626', '#ffffff', '#2563eb'] },
    { top: '34%', left: '10%', label: 'UK', colors: ['#1d4ed8', '#ffffff', '#dc2626'], union: true },
    { top: '36%', left: '30%', label: 'FR', colors: ['#2563eb', '#ffffff', '#dc2626'], vertical: true },
    { top: '42%', left: '48%', label: 'DE', colors: ['#111827', '#dc2626', '#fbbf24'] },
    { top: '40%', left: '64%', label: 'IT', colors: ['#16a34a', '#ffffff', '#dc2626'], vertical: true },
    { top: '34%', left: '80%', label: 'CN', colors: ['#dc2626'], star: true },
    { top: '54%', left: '76%', label: 'IN', colors: ['#f97316', '#ffffff', '#16a34a'] },
    { top: '64%', left: '18%', label: 'AF', colors: ['#111827', '#dc2626', '#16a34a'], crest: true },
    { top: '58%', left: '36%', label: 'KR', colors: ['#ffffff'], yinYang: true },
    { top: '72%', left: '50%', label: 'JP', colors: ['#ffffff'], dot: '#dc2626' },
    { top: '64%', left: '66%', label: 'EG', colors: ['#dc2626', '#ffffff', '#111827'] },
  ];

  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: { xs: 320, md: 420 },
        mx: 'auto',
        maxWidth: 560,
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: { xs: 260, md: 340 },
          height: { xs: 260, md: 340 },
          transform: 'translate(-50%, -50%)',
          borderRadius: '50%',
          border: '2px solid rgba(255,255,255,0.15)',
        }}
      />

      {[
        { width: '86%', height: '86%', borderColor: 'rgba(255,255,255,0.12)' },
        { width: '62%', height: '100%', borderColor: 'rgba(255,255,255,0.12)' },
        { width: '100%', height: '62%', borderColor: 'rgba(255,255,255,0.12)' },
      ].map((ring, index) => (
        <Box
          key={index}
          sx={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: { xs: ring.width, md: ring.width },
            height: { xs: ring.height, md: ring.height },
            maxWidth: 340,
            maxHeight: 340,
            transform: 'translate(-50%, -50%)',
            borderRadius: '50%',
            border: `2px solid ${ring.borderColor}`,
          }}
        />
      ))}

      {markers.map((marker) => (
        <LanguageMarker key={`${marker.label}-${marker.top}-${marker.left}`} marker={marker} />
      ))}
    </Box>
  );
}

export function LanguageMarker({ marker }) {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: marker.top,
        left: marker.left,
        transform: 'translate(-50%, -50%)',
      }}
    >
      <Stack spacing={0.6} alignItems="center">
        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: '50%',
            bgcolor: 'common.white',
            boxShadow: '0 10px 18px rgba(15, 23, 42, 0.18)',
            p: 0.45,
          }}
        >
          <Box
            sx={{
              width: 1,
              height: 1,
              borderRadius: '50%',
              overflow: 'hidden',
              position: 'relative',
              bgcolor: marker.colors[0],
            }}
          >
            {marker.vertical ? (
              <Stack direction="row" spacing={0} sx={{ width: 1, height: 1 }}>
                {marker.colors.map((color, index) => (
                  <Box key={index} sx={{ flex: 1, bgcolor: color }} />
                ))}
              </Stack>
            ) : marker.colors.length > 1 ? (
              <Stack spacing={0} sx={{ width: 1, height: 1 }}>
                {marker.colors.map((color, index) => (
                  <Box key={index} sx={{ flex: 1, bgcolor: color }} />
                ))}
              </Stack>
            ) : null}

            {marker.union ? (
              <>
                <Box sx={{ position: 'absolute', inset: 0, bgcolor: '#1d4ed8' }} />
                <Box sx={{ position: 'absolute', left: '46%', top: 0, bottom: 0, width: 4, bgcolor: '#ffffff' }} />
                <Box sx={{ position: 'absolute', top: '46%', left: 0, right: 0, height: 4, bgcolor: '#ffffff' }} />
                <Box sx={{ position: 'absolute', left: '47%', top: 0, bottom: 0, width: 2, bgcolor: '#dc2626' }} />
                <Box sx={{ position: 'absolute', top: '47%', left: 0, right: 0, height: 2, bgcolor: '#dc2626' }} />
              </>
            ) : null}

            {marker.star ? (
              <Iconify
                icon="mdi:star"
                width={10}
                sx={{ position: 'absolute', left: 7, top: 7, color: '#fbbf24' }}
              />
            ) : null}

            {marker.crest ? (
              <Box
                sx={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  width: 10,
                  height: 10,
                  transform: 'translate(-50%, -50%)',
                  borderRadius: '50%',
                  bgcolor: '#fbbf24',
                }}
              />
            ) : null}

            {marker.dot ? (
              <Box
                sx={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  width: 14,
                  height: 14,
                  transform: 'translate(-50%, -50%)',
                  borderRadius: '50%',
                  bgcolor: marker.dot,
                }}
              />
            ) : null}

            {marker.yinYang ? (
              <>
                <Box
                  sx={{
                    position: 'absolute',
                    left: '44%',
                    top: '44%',
                    width: 10,
                    height: 10,
                    transform: 'translate(-50%, -50%)',
                    borderRadius: '50%',
                    bgcolor: '#dc2626',
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    left: '56%',
                    top: '56%',
                    width: 10,
                    height: 10,
                    transform: 'translate(-50%, -50%)',
                    borderRadius: '50%',
                    bgcolor: '#2563eb',
                  }}
                />
              </>
            ) : null}
          </Box>
        </Box>
        <Box
          sx={{
            width: 0,
            height: 0,
            borderLeft: '7px solid transparent',
            borderRight: '7px solid transparent',
            borderTop: '10px solid rgba(255,255,255,0.92)',
            filter: 'drop-shadow(0 4px 6px rgba(15, 23, 42, 0.12))',
            mt: -0.2,
          }}
        />
      </Stack>
    </Box>
  );
}

export function TestimonialBackdrop() {
  const avatars = [
    { left: '6%', top: '18%' },
    { left: '18%', top: '12%' },
    { left: '34%', top: '16%' },
    { left: '48%', top: '14%' },
    { left: '66%', top: '12%' },
    { left: '82%', top: '16%' },
    { left: '94%', top: '18%' },
    { left: '12%', top: '62%' },
    { left: '28%', top: '70%' },
    { left: '44%', top: '68%' },
    { left: '60%', top: '72%' },
    { left: '78%', top: '68%' },
    { left: '92%', top: '70%' },
  ];

  return (
    <Box sx={{ position: 'absolute', inset: 0, opacity: 0.18, pointerEvents: 'none' }}>
      {avatars.map((avatar, index) => (
        <Box
          key={index}
          sx={{
            position: 'absolute',
            left: avatar.left,
            top: avatar.top,
            width: { xs: 74, md: 96 },
            height: { xs: 74, md: 96 },
            transform: 'translate(-50%, -50%)',
            borderRadius: '50%',
            bgcolor: 'rgba(255,255,255,0.12)',
            '&::before': {
              content: '""',
              position: 'absolute',
              left: '50%',
              top: '22%',
              width: '34%',
              height: '34%',
              borderRadius: '50%',
              bgcolor: 'rgba(255,255,255,0.18)',
              transform: 'translateX(-50%)',
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              left: '50%',
              bottom: '14%',
              width: '56%',
              height: '34%',
              borderRadius: '999px 999px 18px 18px',
              bgcolor: 'rgba(255,255,255,0.16)',
              transform: 'translateX(-50%)',
            },
          }}
        />
      ))}

      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg, rgba(42,52,75,0.5) 0%, rgba(42,52,75,0.2) 35%, rgba(42,52,75,0.6) 100%)',
        }}
      />
    </Box>
  );
}

export function TestimonialCard({ item }) {
  return (
    <Box
      sx={{
        position: 'relative',
        height: 1,
        px: { xs: 2.25, md: 2.5 },
        py: { xs: 2.5, md: 2.75 },
        borderRadius: 0.75,
        bgcolor: item.color,
        textAlign: 'center',
        boxShadow: '0 12px 24px rgba(7, 12, 24, 0.14)',
        transition:
          'transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.35s cubic-bezier(0.22, 1, 0.36, 1)',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 24px 42px rgba(7, 12, 24, 0.2)',
        },
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          left: '50%',
          top: -10,
          transform: 'translateX(-50%)',
          px: 1.1,
          py: 0.45,
          borderRadius: 0.5,
          bgcolor: 'common.white',
          boxShadow: '0 8px 16px rgba(15, 23, 42, 0.12)',
        }}
      >
        <Typography sx={{ fontSize: '0.78rem', color: '#f4b740', letterSpacing: 1 }}>★★★★★</Typography>
      </Box>

      <Stack spacing={1.8} sx={{ pt: 0.75 }}>
        <Typography
          variant="body2"
          sx={{
            color: 'common.white',
            lineHeight: 1.7,
            fontSize: { xs: '0.86rem', md: '0.9rem' },
          }}
        >
          {item.quote}
        </Typography>

        <Typography
          variant="caption"
          sx={{
            color: 'rgba(255,255,255,0.9)',
            letterSpacing: 1.2,
            fontWeight: 700,
          }}
        >
          {item.author}
        </Typography>
      </Stack>
    </Box>
  );
}

export function FaqRow({ label, content, last = false, defaultExpanded = false }) {
  return (
    <Accordion
      disableGutters
      elevation={0}
      square
      defaultExpanded={defaultExpanded}
      sx={{
        bgcolor: 'transparent',
        color: (theme) =>
          theme.palette.mode === 'dark' ? theme.palette.common.white : theme.palette.text.primary,
        borderTop: (theme) =>
          `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.12)' : theme.palette.divider}`,
        borderBottom: (theme) =>
          last
            ? `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.12)' : theme.palette.divider}`
            : 'none',
        '&::before': { display: 'none' },
        '&.Mui-expanded': { m: 0 },
      }}
    >
      <AccordionSummary
        expandIcon={
          <Box
            sx={{
              width: 34,
              height: 34,
              borderRadius: '50%',
              bgcolor: (theme) =>
                theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(79,121,227,0.10)',
              display: 'grid',
              placeItems: 'center',
              color: (theme) =>
                theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.9)' : theme.palette.primary.main,
              '.Mui-expanded &': {
                bgcolor: '#4f79e3',
                color: 'common.white',
              },
            }}
          >
            <Iconify icon="mdi:chevron-down" width={20} />
          </Box>
        }
        sx={{
          px: 0,
          py: 2.6,
          minHeight: 'unset',
          '& .MuiAccordionSummary-content': {
            m: 0,
            pr: 2,
          },
          '& .MuiAccordionSummary-content.Mui-expanded': {
            m: 0,
          },
          '&.Mui-expanded': {
            minHeight: 'unset',
          },
          '& .MuiAccordionSummary-expandIconWrapper': {
            transform: 'rotate(0deg)',
          },
          '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
            transform: 'rotate(180deg)',
          },
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontSize: { xs: '1.2rem', md: '2rem' },
            lineHeight: 1.3,
            letterSpacing: '-0.02em',
          }}
        >
          {label}
        </Typography>
      </AccordionSummary>

      <AccordionDetails
        sx={{
          px: 0,
          pb: 2.8,
          pt: 0,
          maxWidth: 1030,
        }}
      >
        <Typography
          variant="body1"
          sx={{
            color: (theme) =>
              theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.84)' : theme.palette.text.secondary,
            lineHeight: 1.85,
            fontSize: { xs: '1rem', md: '1.15rem' },
          }}
        >
          {content}
        </Typography>
      </AccordionDetails>
    </Accordion>
  );
}

export function SupportInfoCard() {
  return (
    <Box
      sx={{
        p: { xs: 2.5, md: 3 },
        borderRadius: 1.25,
        bgcolor: 'common.white',
        color: 'text.primary',
        boxShadow: '0 16px 34px rgba(7, 12, 24, 0.12)',
        textAlign: 'center',
        transition:
          'transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.35s cubic-bezier(0.22, 1, 0.36, 1)',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 24px 46px rgba(7, 12, 24, 0.16)',
        },
      }}
    >
      <Stack spacing={1.5} alignItems="center">
        <Typography variant="h5" sx={{ fontSize: { xs: '1.25rem', md: '1.7rem' } }}>
          24/7 SUPPORT
        </Typography>

        <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.75 }}>
          We support review-center teams and learners with dependable assistance for setup,
          questions, and LMS guidance throughout the platform experience.
        </Typography>

        <Box sx={{ width: 1, maxWidth: 220 }}>
          <SupportIllustration />
        </Box>
      </Stack>
    </Box>
  );
}

export function CommunityInfoCard() {
  return (
    <Box
      sx={{
        p: { xs: 2.5, md: 3 },
        borderRadius: 1.25,
        bgcolor: '#2f66d4',
        color: 'common.white',
        boxShadow: '0 18px 36px rgba(47, 102, 212, 0.22)',
        textAlign: 'center',
        transition:
          'transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.35s cubic-bezier(0.22, 1, 0.36, 1)',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 26px 50px rgba(47, 102, 212, 0.3)',
        },
      }}
    >
      <Stack spacing={1.8} alignItems="center">
        <Typography variant="h5" sx={{ fontSize: { xs: '1.2rem', md: '1.65rem' } }}>
          FACEBOOK COMMUNITY
        </Typography>

        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.88)', lineHeight: 1.75 }}>
          Join discussions, get answers to course questions, and stay updated with important EERC
          LMS announcements and engineering-review news.
        </Typography>

        <Button
          variant="contained"
          sx={{
            px: 3.2,
            py: 1.2,
            borderRadius: 999,
            bgcolor: 'common.white',
            color: '#2f66d4',
            fontWeight: 700,
            '&:hover': { bgcolor: '#f4f6fb' },
          }}
        >
          JOIN NOW!
        </Button>

        <Box sx={{ width: 1, maxWidth: 230 }}>
          <CommunityJoinIllustration />
        </Box>
      </Stack>
    </Box>
  );
}

export function SupportIllustration() {
  return (
    <Box sx={{ position: 'relative', minHeight: 140 }}>
      <Box
        sx={{
          position: 'absolute',
          left: '50%',
          bottom: 18,
          width: 92,
          height: 56,
          transform: 'translateX(-50%)',
          borderRadius: 2,
          bgcolor: '#dde7fb',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          left: '50%',
          bottom: 66,
          width: 58,
          height: 58,
          transform: 'translateX(-50%)',
          borderRadius: '50%',
          bgcolor: '#f4c7a8',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          left: '50%',
          bottom: 44,
          width: 88,
          height: 76,
          transform: 'translateX(-50%)',
          borderRadius: '28px 28px 16px 16px',
          bgcolor: '#f6cf47',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          left: '50%',
          bottom: 100,
          width: 74,
          height: 40,
          transform: 'translateX(-50%)',
          borderRadius: '30px 30px 14px 14px',
          bgcolor: '#3d4f72',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          left: '50%',
          bottom: 86,
          width: 92,
          height: 16,
          transform: 'translateX(-50%)',
          borderRadius: 999,
          border: '4px solid #4f6186',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          right: 18,
          top: 34,
          width: 40,
          height: 40,
          borderRadius: '50%',
          bgcolor: '#7fd5ff',
          opacity: 0.9,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          left: 16,
          top: 42,
          width: 12,
          height: 12,
          borderRadius: '50%',
          bgcolor: '#ef2f7a',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          right: 36,
          top: 82,
          width: 18,
          height: 18,
          borderRadius: '50%',
          bgcolor: '#f4d35e',
        }}
      />
    </Box>
  );
}

export function CommunityJoinIllustration() {
  return (
    <Box sx={{ position: 'relative', minHeight: 126 }}>
      {[0, 1, 2, 3].map((index) => (
        <Box
          key={index}
          sx={{
            position: 'absolute',
            left: `${18 + index * 22}%`,
            bottom: 0,
            width: 48,
            height: 108,
            transform: 'translateX(-50%)',
          }}
        >
          <Box
            sx={{
              width: 28,
              height: 28,
              mx: 'auto',
              borderRadius: '50%',
              bgcolor: '#f4c7a8',
            }}
          />
          <Box
            sx={{
              width: 40,
              height: 54,
              mx: 'auto',
              mt: 0.5,
              borderRadius: '18px 18px 10px 10px',
              bgcolor: ['#ef2f7a', '#ffd166', '#52d273', '#7fd5ff'][index],
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              left: 6,
              top: 52,
              width: 36,
              height: 8,
              borderRadius: 999,
              bgcolor: ['#ef2f7a', '#ffd166', '#52d273', '#7fd5ff'][index],
              transform: index % 2 === 0 ? 'rotate(-24deg)' : 'rotate(24deg)',
            }}
          />
        </Box>
      ))}
    </Box>
  );
}

export function QuizFeaturePanel({ title, description, buttonLabel, buttonColor, children }) {
  return (
    <Box
      sx={{
        height: 1,
        px: { xs: 3, md: 4 },
        py: { xs: 4, md: 5 },
        borderRadius: 1.5,
        bgcolor: '#eef2fb',
        boxShadow: '0 12px 30px rgba(15, 23, 42, 0.06)',
        transition:
          'transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.35s cubic-bezier(0.22, 1, 0.36, 1)',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 22px 44px rgba(15, 23, 42, 0.12)',
        },
      }}
    >
      <Stack spacing={3} alignItems="center" sx={{ height: 1, textAlign: 'center' }}>
        <Stack spacing={1.5} sx={{ maxWidth: 420 }}>
          <Typography
            variant="h3"
            sx={{
              fontSize: { xs: '2rem', md: '2.4rem' },
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
            }}
          >
            {title}
          </Typography>

          <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.9 }}>
            {description}
          </Typography>
        </Stack>

        <Box sx={{ width: 1 }}>{children}</Box>

        <Button
          variant="contained"
          sx={{
            mt: 'auto',
            px: 3.5,
            py: 1.5,
            borderRadius: 999,
            bgcolor: buttonColor,
            boxShadow:
              buttonColor === '#ef2f7a'
                ? '0 12px 24px rgba(239, 47, 122, 0.26)'
                : '0 12px 24px rgba(47, 95, 255, 0.26)',
            '&:hover': {
              bgcolor: buttonColor === '#ef2f7a' ? '#d6246a' : 'primary.dark',
            },
          }}
        >
          {buttonLabel}
        </Button>
      </Stack>
    </Box>
  );
}

export function MiniQuizCard({ kind }) {
  return (
    <Box
      sx={{
        p: 1.5,
        minHeight: 110,
        borderRadius: 1.25,
        bgcolor: 'common.white',
        boxShadow: '0 8px 18px rgba(15, 23, 42, 0.08)',
      }}
    >
      {kind === 'single' && (
        <Stack spacing={1}>
          {['Item', 'Bernoulli', 'Hydraulic'].map((item, index) => (
            <Stack key={item} direction="row" spacing={1} alignItems="center">
              <Box
                sx={{
                  height: 8,
                  flexGrow: 1,
                  borderRadius: 999,
                  bgcolor: index === 1 ? '#e5f7ea' : '#f2f5fb',
                }}
              />
              <Box sx={{ width: 9, height: 9, borderRadius: '50%', bgcolor: '#52d273' }} />
            </Stack>
          ))}
        </Stack>
      )}

      {kind === 'match' && (
        <Stack spacing={1}>
          {[0, 1, 2].map((row) => (
            <Grid key={row} container spacing={0.75}>
              <Grid size={{ xs: 6 }}>
                <Box sx={{ height: 18, borderRadius: 1, bgcolor: '#f2f5fb' }} />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <Box sx={{ height: 18, borderRadius: 1, bgcolor: row === 1 ? '#e5f7ea' : '#f2f5fb' }} />
              </Grid>
            </Grid>
          ))}
        </Stack>
      )}

      {kind === 'image' && (
        <Grid container spacing={1}>
          {['#ffd166', '#ff9aa2', '#86efac', '#7cb7ff'].map((color, index) => (
            <Grid key={index} size={{ xs: 6 }}>
              <Box sx={{ height: 36, borderRadius: 1, bgcolor: color }} />
            </Grid>
          ))}
        </Grid>
      )}

      {kind === 'gap' && (
        <Stack spacing={1}>
          <Box sx={{ height: 8, width: '94%', borderRadius: 999, bgcolor: '#f2f5fb' }} />
          <Box sx={{ height: 8, width: '88%', borderRadius: 999, bgcolor: '#f2f5fb' }} />
          <Box sx={{ height: 8, width: '72%', borderRadius: 999, bgcolor: '#e5f7ea' }} />
          <Box sx={{ height: 8, width: '90%', borderRadius: 999, bgcolor: '#f2f5fb' }} />
        </Stack>
      )}
    </Box>
  );
}

export function QuizReviewPreview() {
  return (
    <Box
      sx={{
        minHeight: 250,
        position: 'relative',
        display: 'grid',
        placeItems: 'center',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          right: '18%',
          top: '20%',
          width: 130,
          height: 170,
          borderRadius: 3,
          bgcolor: 'rgba(255,255,255,0.7)',
          transform: 'rotate(10deg)',
          boxShadow: '0 18px 30px rgba(15, 23, 42, 0.08)',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          right: '26%',
          top: '18%',
          width: 130,
          height: 170,
          borderRadius: 3,
          bgcolor: 'common.white',
          boxShadow: '0 18px 30px rgba(15, 23, 42, 0.12)',
          p: 2,
        }}
      >
        <Stack spacing={1.1}>
          {[true, false, true, true, false].map((ok, index) => (
            <Stack key={index} direction="row" spacing={1} alignItems="center">
              <Box
                sx={{
                  width: 18,
                  height: 18,
                  borderRadius: '50%',
                  bgcolor: ok ? '#b4f0c4' : '#ffd4dd',
                  color: ok ? '#2b8a57' : '#d13c6f',
                  display: 'grid',
                  placeItems: 'center',
                  typography: 'caption',
                  fontWeight: 700,
                }}
              >
                {ok ? '|' : 'x'}
              </Box>
              <Box sx={{ height: 8, flexGrow: 1, borderRadius: 999, bgcolor: '#edf1f8' }} />
            </Stack>
          ))}
        </Stack>
      </Box>

      <Box
        sx={{
          position: 'absolute',
          left: '18%',
          bottom: '8%',
          width: 92,
          height: 170,
        }}
      >
        <Box
          sx={{
            width: 34,
            height: 34,
            borderRadius: '50%',
            bgcolor: '#0f766e',
            mx: 'auto',
          }}
        />
        <Box
          sx={{
            width: 52,
            height: 88,
            borderRadius: '22px 22px 14px 14px',
            bgcolor: '#ff6b57',
            mx: 'auto',
            mt: 0.5,
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            left: 12,
            top: 102,
            width: 10,
            height: 64,
            borderRadius: 999,
            bgcolor: '#14213d',
            transform: 'rotate(10deg)',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            right: 12,
            top: 102,
            width: 10,
            height: 64,
            borderRadius: 999,
            bgcolor: '#14213d',
            transform: 'rotate(-10deg)',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            left: -4,
            top: 72,
            width: 40,
            height: 10,
            borderRadius: 999,
            bgcolor: '#ff6b57',
            transform: 'rotate(32deg)',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            right: -4,
            top: 78,
            width: 48,
            height: 10,
            borderRadius: 999,
            bgcolor: '#ff6b57',
            transform: 'rotate(-22deg)',
          }}
        />
      </Box>
    </Box>
  );
}

export function QuizTypeCard({ item }) {
  return (
    <Stack spacing={1.25} alignItems="center" sx={{ textAlign: 'center' }}>
      <Box
        sx={{
          width: 1,
          minHeight: 126,
          p: 2,
          borderRadius: 1.5,
          bgcolor: 'common.white',
          boxShadow: '0 16px 32px rgba(7, 12, 24, 0.18)',
          transition:
            'transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.35s cubic-bezier(0.22, 1, 0.36, 1)',
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: '0 26px 48px rgba(7, 12, 24, 0.22)',
          },
        }}
      >
        <Stack spacing={1.1}>
          {item.lines?.map((line, index) => (
            <Stack key={index} direction="row" spacing={1} alignItems="center">
              <Box
                sx={{
                  flexGrow: 1,
                  height: 8,
                  borderRadius: 999,
                  width: line.width,
                  bgcolor: line.color,
                }}
              />
              <Box
                sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: item.accent }}
              />
            </Stack>
          ))}

          {item.pills && (
            <Grid container spacing={1}>
              {item.pills.map((pill, index) => (
                <Grid key={pill} size={{ xs: 6 }}>
                  <Box
                    sx={{
                      py: 0.85,
                      borderRadius: 1,
                      bgcolor: index < 2 ? '#e5f7ea' : '#fde8f0',
                      color: index < 2 ? '#2b8a57' : '#c9386d',
                      typography: 'caption',
                      fontWeight: 700,
                    }}
                  >
                    {pill}
                  </Box>
                </Grid>
              ))}
            </Grid>
          )}

          {item.paragraph && (
            <Stack spacing={0.75} sx={{ pt: 0.5 }}>
              <Box sx={{ height: 8, borderRadius: 999, width: '94%', bgcolor: '#f4f6fb' }} />
              <Box sx={{ height: 8, borderRadius: 999, width: '88%', bgcolor: '#f4f6fb' }} />
              <Box sx={{ height: 8, borderRadius: 999, width: '76%', bgcolor: '#e5f7ea' }} />
              <Box sx={{ height: 8, borderRadius: 999, width: '90%', bgcolor: '#f4f6fb' }} />
            </Stack>
          )}

          {item.gallery && (
            <Grid container spacing={1}>
              {['#7cb7ff', '#ffd166', '#86efac', '#fda4af'].map((color, index) => (
                <Grid key={index} size={{ xs: 3 }}>
                  <Box sx={{ height: 42, borderRadius: 1, bgcolor: color }} />
                </Grid>
              ))}
            </Grid>
          )}

          {item.imageChoice && (
            <Grid container spacing={1}>
              <Grid size={{ xs: 6 }}>
                <Box sx={{ height: 60, borderRadius: 1, bgcolor: '#ffe28a' }} />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <Box
                  sx={{
                    height: 60,
                    borderRadius: 1,
                    bgcolor: '#ffd5dd',
                    border: '2px solid #ef2f7a',
                  }}
                />
              </Grid>
            </Grid>
          )}
        </Stack>
      </Box>

      <Typography
        variant="caption"
        sx={{
          color: 'rgba(255,255,255,0.8)',
          textTransform: 'uppercase',
          letterSpacing: 1,
        }}
      >
        {item.title}
      </Typography>
    </Stack>
  );
}

export function InstructorProfileShowcase() {
  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 980,
        p: { xs: 2, md: 3 },
        borderRadius: 2,
        bgcolor: 'common.white',
        border: '1px solid rgba(15, 23, 42, 0.08)',
        boxShadow: '0 24px 60px rgba(15, 23, 42, 0.14)',
      }}
    >
      <Grid container spacing={{ xs: 2, md: 3 }} alignItems="start">
        <Grid size={{ xs: 12, md: 2.5 }}>
          <Stack spacing={1.25} sx={{ pt: 1 }}>
            {PROFILE_MENU_ITEMS.map((item, index) => (
              <Stack
                key={item}
                direction="row"
                spacing={1.25}
                alignItems="center"
                sx={{
                  px: 1.5,
                  py: 1.2,
                  borderRadius: 1.25,
                  bgcolor: index === 0 ? 'rgba(47, 95, 255, 0.08)' : 'transparent',
                }}
              >
                <Iconify
                  icon={
                    index === 0
                      ? 'solar:widget-5-bold-duotone'
                      : index === 1
                        ? 'solar:speaker-bold-duotone'
                        : index === 2
                          ? 'solar:chart-2-bold-duotone'
                          : index === 3
                            ? 'solar:checklist-minimalistic-bold-duotone'
                            : index === 4
                              ? 'solar:book-bookmark-bold-duotone'
                              : 'solar:add-circle-bold-duotone'
                  }
                  width={18}
                  sx={{ color: index === 0 ? 'primary.main' : 'text.secondary' }}
                />
                <Typography
                  variant="body2"
                  sx={{
                    color: index === 0 ? 'primary.main' : 'text.primary',
                    fontWeight: index === 0 ? 700 : 500,
                  }}
                >
                  {item}
                </Typography>
              </Stack>
            ))}
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, md: 9.5 }}>
          <Stack spacing={2}>
            <Grid container spacing={2} alignItems="center">
              <Grid size={{ xs: 12, md: 4 }}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: '50%',
                      bgcolor: 'primary.main',
                      color: 'common.white',
                      display: 'grid',
                      placeItems: 'center',
                      typography: 'subtitle2',
                      fontWeight: 700,
                    }}
                  >
                    ER
                  </Box>
                  <Stack spacing={0.25}>
                    <Typography variant="subtitle2">Engr. Rafael Dela Cruz</Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      Instructor profile
                    </Typography>
                  </Stack>
                </Stack>
              </Grid>

              <Grid size={{ xs: 12, md: 8 }}>
                <Grid container spacing={1.5}>
                  {[
                    ['Active learners', '128'],
                    ['Published modules', '24'],
                    ['Quiz banks', '18'],
                    ['Completion rate', '89%'],
                  ].map(([label, value]) => (
                    <Grid key={label} size={{ xs: 6, md: 3 }}>
                      <Box
                        sx={{
                          p: 1.5,
                          borderRadius: 1.5,
                          bgcolor: '#f8fafc',
                          border: '1px solid',
                          borderColor: 'divider',
                          textAlign: 'left',
                        }}
                      >
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          {label}
                        </Typography>
                        <Typography variant="subtitle2" sx={{ mt: 0.5 }}>
                          {value}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              {[
                ['Hydraulics Masterclass', 'CE Review', '14 lessons'],
                ['Plumbing Code Essentials', 'Master Plumbing', '9 lessons'],
                ['Engineering Materials', 'Materials Eng.', '12 lessons'],
                ['Mock Board Intensive', 'Assessment Track', '6 quizzes'],
              ].map(([title, tag, meta], index) => (
                <Grid key={title} size={{ xs: 12, sm: 6, lg: 3 }}>
                  <Box
                    sx={{
                      overflow: 'hidden',
                      borderRadius: 1.75,
                      border: '1px solid',
                      borderColor: 'divider',
                      bgcolor: 'common.white',
                    }}
                  >
                    <Box
                      sx={{
                        height: 112,
                        background:
                          index === 0
                            ? 'linear-gradient(135deg, #2453d4 0%, #68a1ff 100%)'
                            : index === 1
                              ? 'linear-gradient(135deg, #0f766e 0%, #34d399 100%)'
                              : index === 2
                                ? 'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)'
                                : 'linear-gradient(135deg, #ef2f7a 0%, #ff7fb0 100%)',
                      }}
                    />
                    <Stack spacing={1} sx={{ p: 1.5 }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Chip label={tag} size="small" color="primary" variant="outlined" />
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          {meta}
                        </Typography>
                      </Stack>
                      <Typography variant="subtitle2" sx={{ minHeight: 44 }}>
                        {title}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        Last updated 2 days ago
                      </Typography>
                    </Stack>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}

export function LessonTypesPreview() {
  return (
    <Box
      sx={{
        mx: 'auto',
        maxWidth: 860,
        p: { xs: 2, md: 2.5 },
        borderRadius: 1.5,
        bgcolor: '#1b2233',
        border: '1px solid rgba(255,255,255,0.06)',
        boxShadow: '0 24px 60px rgba(7, 12, 24, 0.28)',
      }}
    >
      <Grid container spacing={0}>
        <Grid size={{ xs: 12, md: 3 }}>
          <Box
            sx={{
              height: 1,
              p: 2,
              borderRadius: 1,
              bgcolor: '#20283b',
              borderRight: { md: '1px solid rgba(255,255,255,0.06)' },
              borderBottom: { xs: '1px solid rgba(255,255,255,0.06)', md: 'none' },
            }}
          >
            <Typography variant="overline" sx={{ color: 'rgba(255,255,255,0.5)' }}>
              Lesson Catalog
            </Typography>
            <Stack spacing={1.25} sx={{ mt: 2 }}>
              {[
                'Video Lesson Types',
                'PDF Lesson References',
                'E-Book Lesson Materials',
                'Recorded Explanations',
                'Formula Handouts',
                'Module Attachments',
                'Checkpoint Quizzes',
              ].map((item, index) => (
                <Box
                  key={item}
                  sx={{
                    px: 1.25,
                    py: 1,
                    borderRadius: 1,
                    bgcolor: index === 2 ? 'rgba(255,209,102,0.12)' : 'transparent',
                    border: '1px solid',
                    borderColor: index === 2 ? 'rgba(255,209,102,0.28)' : 'rgba(255,255,255,0.06)',
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      color: index === 2 ? '#ffd166' : 'rgba(255,255,255,0.78)',
                      fontWeight: index === 2 ? 700 : 500,
                    }}
                  >
                    {item}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 9 }}>
          <Box sx={{ p: { xs: 2, md: 2.5 } }}>
            <Typography variant="subtitle1" sx={{ color: 'common.white', mb: 1.5 }}>
              Mixed Lesson Experience: Plumbing Systems Coaching
            </Typography>

            <Box
              sx={{
                position: 'relative',
                minHeight: { xs: 260, md: 420 },
                borderRadius: 1.5,
                overflow: 'hidden',
                background:
                  'linear-gradient(135deg, rgba(27,30,39,0.98) 0%, rgba(45,34,26,0.92) 38%, rgba(73,46,32,0.88) 100%)',
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'radial-gradient(circle at 50% 18%, rgba(255,207,128,0.18), transparent 28%)',
                }}
              />

              <Box
                sx={{
                  position: 'absolute',
                  top: 18,
                  right: 18,
                  px: 1.25,
                  py: 0.5,
                  borderRadius: 999,
                  bgcolor: 'rgba(239,47,122,0.18)',
                  color: '#ff7dad',
                  typography: 'caption',
                  fontWeight: 700,
                }}
              >
                LIVE
              </Box>

              <Stack
                direction="row"
                spacing={2}
                alignItems="flex-end"
                justifyContent="space-between"
                sx={{ position: 'absolute', inset: 0, p: { xs: 2, md: 3 } }}
              >
                <Stack spacing={1.25} sx={{ maxWidth: 360 }}>
                  <Typography variant="h5" sx={{ color: 'common.white' }}>
                    Video lecture with PDF references and e-book support
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.8 }}>
                    Guide CE and Master Plumbing learners through recorded explanations, attached
                    review PDFs, and structured e-book reading materials inside one lesson flow.
                  </Typography>
                </Stack>

                <Box
                  sx={{
                    width: 76,
                    height: 76,
                    flexShrink: 0,
                    borderRadius: '50%',
                    bgcolor: 'rgba(255,255,255,0.14)',
                    border: '1px solid rgba(255,255,255,0.22)',
                    display: 'grid',
                    placeItems: 'center',
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  <Iconify icon="solar:play-bold" width={34} sx={{ color: 'common.white' }} />
                </Box>
              </Stack>
            </Box>

            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={1.5}
              justifyContent="space-between"
              sx={{ mt: 2 }}
            >
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.64)' }}>
                Formats: Video, PDF, E-Book
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.64)' }}>
                Use case: Review lectures, remediation, live mentoring
              </Typography>
            </Stack>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export function BackendManagementPreview() {
  return (
    <Box
      sx={{
        p: { xs: 2, md: 3 },
        borderRadius: 1,
        bgcolor: 'common.white',
        border: '1px solid rgba(15, 23, 42, 0.08)',
        boxShadow: '0 20px 50px rgba(15, 23, 42, 0.14)',
      }}
    >
      <Box
        sx={{
          px: 2,
          py: 1.25,
          borderRadius: 1,
          bgcolor: '#1f2937',
          color: 'common.white',
        }}
      >
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={1.5}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', sm: 'center' }}
        >
          <Stack direction="row" spacing={2.5} alignItems="center">
            <Typography variant="subtitle2">eerc admin</Typography>
            <Stack direction="row" spacing={2}>
              {['Curriculum', 'Units', 'Settings', 'Pricing', 'QA', 'Notes'].map((item) => (
                <Typography key={item} variant="caption" sx={{ color: 'rgba(255,255,255,0.72)' }}>
                  {item}
                </Typography>
              ))}
            </Stack>
          </Stack>

          <Stack direction="row" spacing={1}>
            <Chip label="Draft" size="small" sx={{ bgcolor: 'rgba(255,255,255,0.12)', color: 'common.white' }} />
            <Chip label="Visible" size="small" color="primary" />
          </Stack>
        </Stack>
      </Box>

      <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mt: 0.5 }}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Box
            sx={{
              p: { xs: 2, md: 2.5 },
              minHeight: 380,
              borderRadius: 1,
              bgcolor: '#f8fafc',
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Stack spacing={2}>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={1.5}
                justifyContent="space-between"
                alignItems={{ xs: 'flex-start', sm: 'center' }}
              >
                <Typography variant="subtitle1">New Hydraulics Program Lesson</Typography>
                <Button size="small" variant="contained">
                  Create
                </Button>
              </Stack>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 7 }}>
                  <Box sx={{ p: 1.5, borderRadius: 1.5, bgcolor: 'common.white', border: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      Lesson title
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 0.75, fontWeight: 600 }}>
                      Bernoulli Equation and Pipe Losses
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 5 }}>
                  <Box sx={{ p: 1.5, borderRadius: 1.5, bgcolor: 'common.white', border: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      Program track
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 0.75, fontWeight: 600 }}>
                      CE Board Review
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box sx={{ p: 1.5, borderRadius: 1.5, bgcolor: 'common.white', border: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      Subject
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 0.75 }}>
                      Hydraulics
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box sx={{ p: 1.5, borderRadius: 1.5, bgcolor: 'common.white', border: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      Lesson type
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 0.75 }}>
                      Video + PDF + Quiz
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              <Box
                sx={{
                  p: 1.5,
                  minHeight: 150,
                  borderRadius: 1.5,
                  bgcolor: 'common.white',
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Lesson content
                </Typography>
                <Stack spacing={1} sx={{ mt: 1.5 }}>
                  <Box sx={{ height: 10, width: '92%', borderRadius: 999, bgcolor: '#e2e8f0' }} />
                  <Box sx={{ height: 10, width: '88%', borderRadius: 999, bgcolor: '#e2e8f0' }} />
                  <Box sx={{ height: 10, width: '96%', borderRadius: 999, bgcolor: '#dbeafe' }} />
                  <Box sx={{ height: 10, width: '84%', borderRadius: 999, bgcolor: '#e2e8f0' }} />
                  <Box sx={{ height: 10, width: '72%', borderRadius: 999, bgcolor: '#e2e8f0' }} />
                </Stack>
              </Box>
            </Stack>
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Stack spacing={2}>
            <Box sx={{ p: 2, borderRadius: 1.5, bgcolor: '#f8fafc', border: '1px solid', borderColor: 'divider' }}>
              <Typography variant="overline" sx={{ color: 'text.disabled' }}>
                Publishing
              </Typography>
              <Stack spacing={1.25} sx={{ mt: 1.5 }}>
                <PreviewMetaRow label="Mentor" value="Engr. Santos" />
                <PreviewMetaRow label="Visibility" value="Learner Access" />
                <PreviewMetaRow label="Resources" value="3 Files" />
                <PreviewMetaRow label="Checkpoint Quiz" value="Enabled" />
              </Stack>
            </Box>

            <Box sx={{ p: 2, borderRadius: 1.5, bgcolor: '#f8fafc', border: '1px solid', borderColor: 'divider' }}>
              <Typography variant="overline" sx={{ color: 'text.disabled' }}>
                Workflow
              </Typography>
              <Stack spacing={1.25} sx={{ mt: 1.5 }}>
                {['Upload lecture', 'Attach handouts', 'Set quiz', 'Publish module'].map((item) => (
                  <Stack key={item} direction="row" spacing={1} alignItems="center">
                    <Iconify icon="solar:check-circle-bold" width={16} sx={{ color: 'primary.main' }} />
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {item}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </Box>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}

export function CourseDeliveryVideoPreview() {
  return (
    <Box
      sx={{
        p: { xs: 2, md: 3 },
        borderRadius: 1,
        bgcolor: 'common.white',
        border: '1px solid rgba(15, 23, 42, 0.08)',
        boxShadow: '0 20px 50px rgba(15, 23, 42, 0.14)',
      }}
    >
      <Grid container spacing={{ xs: 2, md: 3 }}>
        <Grid size={{ xs: 12, md: 9 }}>
          <Stack spacing={2}>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={1.5}
              justifyContent="space-between"
              alignItems={{ xs: 'flex-start', sm: 'center' }}
            >
              <Stack spacing={0.5}>
                <Typography variant="h5">Hydraulics Review Session</Typography>
                <Stack direction="row" spacing={1.25} flexWrap="wrap">
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    Mentor: Engr. Reyes
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    Duration: 42 min
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    Track: CE Board Review
                  </Typography>
                </Stack>
              </Stack>

              <Chip label="Streaming Lesson" color="primary" size="small" />
            </Stack>

            <Stack direction="row" spacing={3} sx={{ borderBottom: '1px solid', borderColor: 'divider', pb: 1 }}>
              {['Overview', 'Resources', 'Quiz', 'Discussion', 'Resume'].map((item) => (
                <Typography
                  key={item}
                  variant="caption"
                  sx={{
                    fontWeight: item === 'Overview' ? 700 : 600,
                    color: item === 'Overview' ? 'text.primary' : 'text.secondary',
                  }}
                >
                  {item}
                </Typography>
              ))}
            </Stack>

            <Box
              sx={{
                position: 'relative',
                minHeight: { xs: 220, md: 340 },
                borderRadius: 2,
                overflow: 'hidden',
                background:
                  'linear-gradient(135deg, rgba(8,15,37,0.96) 0%, rgba(15,28,67,0.92) 45%, rgba(33,77,189,0.82) 100%)',
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'repeating-linear-gradient(135deg, rgba(255,255,255,0.04) 0 12px, transparent 12px 24px)',
                }}
              />

              <Stack
                spacing={2}
                sx={{
                  position: 'absolute',
                  inset: 0,
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  px: 3,
                  color: 'common.white',
                }}
              >
                <Box
                  sx={{
                    width: 74,
                    height: 74,
                    borderRadius: '50%',
                    bgcolor: 'rgba(255,255,255,0.16)',
                    backdropFilter: 'blur(8px)',
                    display: 'grid',
                    placeItems: 'center',
                    border: '1px solid rgba(255,255,255,0.22)',
                  }}
                >
                  <Iconify icon="solar:play-bold" width={32} />
                </Box>

                <Stack spacing={0.5}>
                  <Typography variant="h5">Module 03: Bernoulli and Pipe Flow</Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    Streaming-only engineering lesson with synced reviewer notes and checkpoint quiz.
                  </Typography>
                </Stack>
              </Stack>

              <Stack
                direction="row"
                spacing={1}
                sx={{
                  position: 'absolute',
                  left: 16,
                  bottom: 16,
                  flexWrap: 'wrap',
                }}
              >
                <Chip label="Watermark Active" size="small" sx={{ bgcolor: 'rgba(255,255,255,0.14)', color: 'common.white' }} />
                <Chip label="Resume 31:10" size="small" sx={{ bgcolor: 'rgba(255,255,255,0.14)', color: 'common.white' }} />
              </Stack>
            </Box>

            <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
              Learners can continue the module, open supporting PDF references, and move directly
              into the next practice quiz without leaving the lesson experience.
            </Typography>
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <Stack spacing={2}>
            <Box sx={{ p: 2, borderRadius: 2, bgcolor: '#f8fafc', border: '1px solid', borderColor: 'divider' }}>
              <Typography variant="overline" sx={{ color: 'text.disabled' }}>
                Module Info
              </Typography>
              <Stack spacing={1.25} sx={{ mt: 1.5 }}>
                <PreviewMetaRow label="Subject" value="Hydraulics" />
                <PreviewMetaRow label="Format" value="Video + PDF" />
                <PreviewMetaRow label="Difficulty" value="Intermediate" />
                <PreviewMetaRow label="Status" value="In Progress" />
              </Stack>
            </Box>

            <Box sx={{ p: 2, borderRadius: 2, bgcolor: '#f8fafc', border: '1px solid', borderColor: 'divider' }}>
              <Typography variant="overline" sx={{ color: 'text.disabled' }}>
                Lesson Assets
              </Typography>
              <Stack spacing={1.25} sx={{ mt: 1.5 }}>
                {['Lecture video', 'Formula sheet', 'Hydraulics handout', 'Checkpoint quiz'].map((item) => (
                  <Stack key={item} direction="row" spacing={1} alignItems="center">
                    <Iconify icon="solar:check-circle-bold" width={16} sx={{ color: 'primary.main' }} />
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {item}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </Box>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}

export function PreviewMetaRow({ label, value }) {
  return (
    <Stack direction="row" justifyContent="space-between" spacing={1}>
      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
        {label}
      </Typography>
      <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.primary' }}>
        {value}
      </Typography>
    </Stack>
  );
}

export function EngineeringIllustration() {
  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: { xs: 320, md: 420 },
        mx: 'auto',
        maxWidth: 500,
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: { xs: 170, md: 230 },
          height: { xs: 220, md: 300 },
          borderRadius: '48% 48% 42% 42% / 36% 36% 58% 58%',
          transform: 'translate(-50%, -50%)',
          background: 'linear-gradient(180deg, #4e7fff 0%, #2352d8 100%)',
          boxShadow: '0 28px 64px rgba(53, 94, 211, 0.28)',
        }}
      />

      <Box
        sx={{
          position: 'absolute',
          left: '50%',
          top: '46%',
          width: { xs: 78, md: 102 },
          height: { xs: 112, md: 148 },
          borderRadius: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'common.white',
        }}
      />

      <Box
        sx={{
          position: 'absolute',
          left: '50%',
          bottom: { xs: 36, md: 54 },
          width: { xs: 110, md: 144 },
          height: { xs: 28, md: 36 },
          borderRadius: 999,
          transform: 'translateX(-50%)',
          bgcolor: 'rgba(38, 64, 138, 0.12)',
        }}
      />

      <EngineerCharacter
        sx={{ left: { xs: 16, md: 26 }, bottom: { xs: 26, md: 38 } }}
        accent="#3156c9"
        accessory="solar:laptop-bold-duotone"
      />

      <EngineerCharacter
        sx={{ right: { xs: 18, md: 30 }, bottom: { xs: 32, md: 44 } }}
        accent="#ef2f7a"
        accessory="solar:notebook-bookmark-bold-duotone"
      />
    </Box>
  );
}

export function EngineerCharacter({ sx, accent, accessory }) {
  return (
    <Box sx={{ position: 'absolute', width: { xs: 96, md: 116 }, ...sx }}>
      <Box
        sx={{
          mx: 'auto',
          width: { xs: 26, md: 30 },
          height: { xs: 26, md: 30 },
          borderRadius: '50%',
          bgcolor: '#f7c5a8',
        }}
      />
      <Box
        sx={{
          mx: 'auto',
          mt: 0.5,
          width: { xs: 48, md: 56 },
          height: { xs: 70, md: 82 },
          borderRadius: '18px 18px 12px 12px',
          bgcolor: accent,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          left: '50%',
          top: { xs: 46, md: 54 },
          width: { xs: 46, md: 54 },
          height: { xs: 28, md: 34 },
          borderRadius: 2,
          transform: 'translateX(-50%)',
          bgcolor: 'common.white',
          boxShadow: '0 10px 24px rgba(15, 23, 42, 0.12)',
          display: 'grid',
          placeItems: 'center',
        }}
      >
        <Iconify icon={accessory} width={22} />
      </Box>
      <Box
        sx={{
          position: 'absolute',
          left: { xs: 28, md: 34 },
          bottom: { xs: -2, md: -4 },
          width: 10,
          height: { xs: 44, md: 54 },
          borderRadius: 999,
          bgcolor: '#22315d',
          transform: 'rotate(8deg)',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          right: { xs: 28, md: 34 },
          bottom: { xs: -2, md: -4 },
          width: 10,
          height: { xs: 44, md: 54 },
          borderRadius: 999,
          bgcolor: '#22315d',
          transform: 'rotate(-8deg)',
        }}
      />
    </Box>
  );
}

export function HeroIllustration() {
  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: { xs: 360, md: 520 },
        mx: 'auto',
        maxWidth: 760,
      }}
    >
      <SoftCloud sx={{ top: 24, left: 32, width: 110 }} />
      <SoftCloud sx={{ top: 70, right: 56, width: 128 }} />
      <SoftCloud sx={{ bottom: 92, left: 12, width: 98 }} />
      <SoftCloud sx={{ bottom: 34, right: 24, width: 120 }} />

      <Box
        sx={{
          position: 'absolute',
          right: { xs: 8, md: 28 },
          top: { xs: 72, md: 92 },
          width: { xs: 250, md: 410 },
          height: { xs: 180, md: 280 },
          borderRadius: 6,
          bgcolor: '#7ca4ff',
          boxShadow: '0 24px 60px rgba(61, 89, 177, 0.28)',
          transform: 'skew(-8deg)',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            inset: 14,
            borderRadius: 4,
            bgcolor: 'common.white',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            left: 38,
            right: 38,
            top: 52,
            bottom: 48,
            borderRadius: 3,
            border: '3px solid #d8e3ff',
            bgcolor: '#f8fbff',
          }}
        />
        <Stack
          spacing={1.5}
          sx={{
            position: 'absolute',
            left: 66,
            right: 66,
            top: 86,
          }}
        >
          {Array.from({ length: 4 }).map((_, index) => (
            <Box
              key={index}
              sx={{
                height: 12,
                borderRadius: 999,
                bgcolor: index === 2 ? '#ef2f7a' : '#d9e5ff',
                width: index === 3 ? '68%' : '100%',
              }}
            />
          ))}
        </Stack>
        <Box
          sx={{
            position: 'absolute',
            right: 24,
            bottom: 22,
            width: 24,
            height: 24,
            borderRadius: '50%',
            bgcolor: '#ffffff',
            display: 'grid',
            placeItems: 'center',
          }}
        >
          <Iconify icon="solar:alt-arrow-right-linear" width={18} />
        </Box>
      </Box>

      <Box
        sx={{
          position: 'absolute',
          left: { xs: 90, md: 180 },
          top: { xs: 24, md: 28 },
          width: { xs: 84, md: 120 },
          height: { xs: 84, md: 120 },
          borderRadius: '50%',
          bgcolor: '#ffd95c',
          boxShadow: '0 18px 44px rgba(255, 217, 92, 0.5)',
          display: 'grid',
          placeItems: 'center',
        }}
      >
        <Iconify icon="solar:lightbulb-bolt-bold-duotone" width={64} />
      </Box>

      <Stack
        spacing={0}
        sx={{
          position: 'absolute',
          left: { xs: 64, md: 110 },
          top: { xs: 140, md: 162 },
          transform: 'rotate(-17deg)',
        }}
      >
        <Box
          sx={{
            width: { xs: 170, md: 230 },
            height: 36,
            borderRadius: '16px 16px 4px 4px',
            bgcolor: '#ef2f7a',
          }}
        />
        <Box
          sx={{
            width: { xs: 170, md: 230 },
            height: 30,
            bgcolor: '#ffffff',
            borderLeft: '6px solid #5e7ce2',
          }}
        />
        <Box
          sx={{
            width: { xs: 170, md: 230 },
            height: 30,
            bgcolor: '#ffffff',
            borderLeft: '6px solid #3e56a5',
          }}
        />
        <Box
          sx={{
            width: { xs: 170, md: 230 },
            height: 30,
            borderRadius: '0 0 10px 10px',
            bgcolor: '#4b67cf',
          }}
        />
      </Stack>

      <LearnerBubble sx={{ left: 28, bottom: 54, bgcolor: '#6f88ff' }} />
      <LearnerBubble sx={{ left: 246, bottom: 36, bgcolor: '#ff9f43' }} />
      <LearnerBubble sx={{ right: 92, top: 44, bgcolor: '#7f5af0' }} />
      <LearnerBubble sx={{ right: 16, bottom: 26, bgcolor: '#ff6b8b' }} />
    </Box>
  );
}

export function SoftCloud({ sx }) {
  return (
    <Stack direction="row" spacing={1} sx={{ position: 'absolute', opacity: 0.8, ...sx }}>
      <Box sx={{ width: '30%', height: 18, borderRadius: 999, bgcolor: 'rgba(208,214,233,0.9)' }} />
      <Box sx={{ width: '48%', height: 18, borderRadius: 999, bgcolor: 'rgba(221,226,243,0.9)' }} />
      <Box sx={{ width: '22%', height: 18, borderRadius: 999, bgcolor: 'rgba(208,214,233,0.9)' }} />
    </Stack>
  );
}

export function LearnerBubble({ sx }) {
  return (
    <Box
      sx={{
        position: 'absolute',
        width: 66,
        height: 66,
        borderRadius: '50%',
        boxShadow: '0 16px 32px rgba(23, 34, 63, 0.14)',
        display: 'grid',
        placeItems: 'center',
        ...sx,
      }}
    >
      <Iconify icon="solar:user-rounded-bold-duotone" width={38} sx={{ color: 'common.white' }} />
    </Box>
  );
}
