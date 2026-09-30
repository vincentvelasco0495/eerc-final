import { mergeClasses } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import { styled } from '@mui/material/styles';

import { RouterLink } from 'src/routes/components';

import { CONFIG } from 'src/global-config';

import { logoClasses } from './classes';

// ----------------------------------------------------------------------

const BADGE_SRC = `${CONFIG.assetsDir}/logo/eerc-badge.png`;

export function Logo({ sx, disabled, className, href = '/', isSingle = true, ...other }) {
  const size = isSingle ? 44 : 56;

  return (
    <LogoRoot
      component={RouterLink}
      href={href}
      aria-label="EERC home"
      underline="none"
      className={mergeClasses([logoClasses.root, className])}
      sx={[
        {
          width: size,
          height: size,
          borderRadius: '50%',
          overflow: 'hidden',
          bgcolor: 'transparent',
          ...(disabled && { pointerEvents: 'none' }),
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <Box
        component="img"
        alt="EERC Learning Center"
        src={BADGE_SRC}
        sx={{
          width: '108%',
          height: '108%',
          ml: '-4%',
          mt: '-4%',
          display: 'block',
          objectFit: 'cover',
        }}
      />
    </LogoRoot>
  );
}

// ----------------------------------------------------------------------

const LogoRoot = styled(Link)(() => ({
  flexShrink: 0,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  verticalAlign: 'middle',
  color: 'inherit',
}));
