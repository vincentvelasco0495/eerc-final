import { varAlpha } from 'minimal-shared/utils';

import { switchClasses } from '@mui/material/Switch';

// ----------------------------------------------------------------------

const DIMENSIONS = {
  small: { thumb: 10, track: 16, trackRadius: 8, translateX: '10px' },
  medium: { thumb: 14, track: 20, trackRadius: 10, translateX: '14px' },
};

/* **********************************************************************
 * 🗳️ Variants
 * **********************************************************************/
const colorVariants = [
  {
    props: (props) => props.color === 'default',
    style: ({ theme }) => ({
      [`&.${switchClasses.checked}`]: {
        [`& + .${switchClasses.track}`]: {
          backgroundColor: theme.vars.palette.text.primary,
        },
        [`& .${switchClasses.thumb}`]: {
          color: theme.vars.palette.brand.surface,
        },
      },
    }),
  },
];

const sizeVariants = [
  {
    props: (props) => props.size === 'small',
    style: {
      [`& .${switchClasses.switchBase}`]: {
        [`&.${switchClasses.checked}`]: {
          transform: `translateX(${DIMENSIONS.small.translateX})`,
        },
      },
      [`& .${switchClasses.thumb}`]: {
        width: DIMENSIONS.small.thumb,
        height: DIMENSIONS.small.thumb,
      },
      [`& .${switchClasses.track}`]: {
        height: DIMENSIONS.small.track,
        borderRadius: DIMENSIONS.small.trackRadius,
      },
    },
  },
];

const disabledVariants = [
  {
    props: {},
    style: ({ theme }) => ({
      [`&.${switchClasses.disabled}`]: {
        [`& + .${switchClasses.track}`]: {
          opacity: theme.vars.opacity.switchTrackDisabled,
        },
        [`& .${switchClasses.thumb}`]: {
          opacity: theme.vars.opacity.switchTrackDisabled,
        },
      },
    }),
  },
];

const checkedVariants = [
  {
    props: {},
    style: ({ theme }) => ({
      [`&.${switchClasses.checked}`]: {
        transform: `translateX(${DIMENSIONS.medium.translateX})`,
        [`& + .${switchClasses.track}`]: {
          opacity: theme.vars.opacity.switchTrack,
        },
      },
    }),
  },
];

/* **********************************************************************
 * 🧩 Components
 * **********************************************************************/
const MuiSwitch = {
  // ▼▼▼▼▼▼▼▼ 🎨 STYLE ▼▼▼▼▼▼▼▼
  styleOverrides: {
    root: {
      alignItems: 'center',
      variants: [...sizeVariants],
    },
    switchBase: {
      top: 'auto',
      left: '6px',
      variants: [...colorVariants, ...checkedVariants, ...disabledVariants],
    },
    thumb: ({ theme }) => ({
      width: DIMENSIONS.medium.thumb,
      height: DIMENSIONS.medium.thumb,
      color: theme.vars.palette.common.white,
    }),
    track: ({ theme }) => ({
      height: DIMENSIONS.medium.track,
      borderRadius: DIMENSIONS.medium.trackRadius,
      backgroundColor: varAlpha(theme.vars.palette.grey['500Channel'], 0.48),
    }),
  },
};

/* **********************************************************************
 * 🚀 Export
 * **********************************************************************/
export const switches = {
  MuiSwitch,
};
