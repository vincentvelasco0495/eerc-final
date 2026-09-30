import { m } from 'framer-motion';

import Box from '@mui/material/Box';

import { varFade, varContainer } from 'src/components/animate';

export function Reveal({
  children,
  direction = 'inUp',
  distance = 24,
  duration = 0.9,
  ...other
}) {
  return (
    <Box
      component={m.div}
      variants={varFade(direction, {
        distance,
        transitionIn: { duration },
      })}
      {...other}
    >
      {children}
    </Box>
  );
}

export function RevealGroup({ children, stagger = 0.08, delay = 0.08, ...other }) {
  return (
    <Box
      component={m.div}
      variants={varContainer({
        transitionIn: {
          staggerChildren: stagger,
          delayChildren: delay,
        },
      })}
      {...other}
    >
      {children}
    </Box>
  );
}
