import { m } from 'framer-motion';

import Box from '@mui/material/Box';

import { varFade , varContainer, MotionViewport } from 'src/components/animate';

export function ScrollReveal({
  children,
  direction = 'inUp',
  distance = 32,
  viewport,
  sx,
  ...other
}) {
  return (
    <MotionViewport viewport={{ amount: 0.2, ...viewport }} sx={sx}>
      <Box
        component={m.div}
        variants={varFade(direction, {
          distance,
          transitionIn: { duration: 0.75 },
        })}
        {...other}
      >
        {children}
      </Box>
    </MotionViewport>
  );
}

export function ScrollRevealStagger({ children, stagger = 0.1, sx, ...other }) {
  return (
    <MotionViewport viewport={{ amount: 0.15 }} sx={sx}>
      <Box
        component={m.div}
        variants={varContainer({
          transitionIn: { staggerChildren: stagger, delayChildren: 0.06 },
        })}
        {...other}
      >
        {children}
      </Box>
    </MotionViewport>
  );
}

export function ScrollRevealItem({ children, direction = 'inUp', distance = 28, ...other }) {
  return (
    <Box
      component={m.div}
      variants={varFade(direction, {
        distance,
        transitionIn: { duration: 0.65 },
      })}
      {...other}
    >
      {children}
    </Box>
  );
}
