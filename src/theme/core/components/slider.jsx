import { varAlpha } from 'minimal-shared/utils';

import { sliderClasses } from '@mui/material/Slider';

// ----------------------------------------------------------------------

const SIZES = ['small', 'medium'];
const ORIENTATIONS = ['horizontal', 'vertical'];
const DIMENSIONS = {
  small: { rail: 6, thumb: 16, mark: 4 },
  medium: { rail: 10, thumb: 20, mark: 6 },
};

/* **********************************************************************
 * 🗳️ Variants
 * **********************************************************************/
const thumbVariants = [
  ...SIZES.map((size) => ({
    props: (props) => props.size === size,
    style: {
      width: DIMENSIONS[size].thumb,
      height: DIMENSIONS[size].thumb,
    },
  })),
];

const railVariants = [
  ...ORIENTATIONS.flatMap((orientation) =>
    SIZES.map((size) => ({
      props: (props) => props.orientation === orientation && props.size === size,
      style:
        orientation === 'horizontal'
          ? { height: DIMENSIONS[size].rail }
          : { width: DIMENSIONS[size].rail },
    }))
  ),
];

const trackVariants = [
  ...ORIENTATIONS.flatMap((orientation) =>
    SIZES.map((size) => ({
      props: (props) => props.orientation === orientation && props.size === size,
      style:
        orientation === 'horizontal'
          ? { height: DIMENSIONS[size].rail }
          : { width: DIMENSIONS[size].rail },
    }))
  ),
];

const markVariants = [
  ...ORIENTATIONS.flatMap((orientation) =>
    SIZES.map((size) => ({
      props: (props) => props.orientation === orientation && props.size === size,
      style:
        orientation === 'horizontal'
          ? { width: 1, height: DIMENSIONS[size].mark }
          : { height: 1, width: DIMENSIONS[size].mark },
    }))
  ),
];

const markActiveVariants = [
  {
    props: (props) => props.color === 'inherit',
    style: ({ theme }) => ({
      backgroundColor: varAlpha(theme.vars.palette.grey['800Channel'], 0.48),
    }),
  },
];

const disabledVariants = [
  {
    props: {},
    style: ({ theme }) => ({
      [`&.${sliderClasses.disabled}`]: {
        color: theme.vars.palette.action.disabled,
      },
    }),
  },
];

/* **********************************************************************
 * 🧩 Components
 * **********************************************************************/
const MuiSlider = {
  // ▼▼▼▼▼▼▼▼ ⚙️ PROPS ▼▼▼▼▼▼▼▼
  defaultProps: {
    size: 'small',
  },
  // ▼▼▼▼▼▼▼▼ 🎨 STYLE ▼▼▼▼▼▼▼▼
  styleOverrides: {
    root: {
      variants: [...disabledVariants],
    },
    thumb: ({ theme }) => ({
      boxShadow: theme.vars.customShadows.z1,
      color: theme.vars.palette.common.white,
      border: `solid 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.08)}`,
      '&::before': {
        opacity: 0.4,
        boxShadow: 'none',
        width: 'calc(100% - 4px)',
        height: 'calc(100% - 4px)',
        backgroundImage: `linear-gradient(180deg, ${theme.vars.palette.grey[500]}, transparent)`,
      },
      variants: [...thumbVariants],
    }),
    rail: ({ theme }) => ({
      opacity: 0.12,
      backgroundColor: theme.vars.palette.grey[500],
      variants: [...railVariants],
    }),
    track: {
      variants: [...trackVariants],
    },
    mark: ({ style, theme }) => ({
      backgroundColor: varAlpha(theme.vars.palette.grey['500Channel'], 0.48),
      // start mark
      '&[data-index="0"]': { display: 'none' },
      // end mark
      ...((style?.left || style?.bottom) === '100%' && { display: 'none' }),
      variants: [...markVariants],
    }),
    markActive: ({ theme }) => ({
      backgroundColor: varAlpha(theme.vars.palette.common.whiteChannel, 0.64),
      variants: [...markActiveVariants],
    }),
    markLabel: ({ theme }) => ({
      fontSize: theme.typography.pxToRem(13),
      color: theme.vars.palette.text.disabled,
    }),
    valueLabel: ({ theme }) => ({
      borderRadius: 8,
      backgroundColor: theme.vars.palette.brand.elevated,
    }),
  },
};

/* **********************************************************************
 * 🚀 Export
 * **********************************************************************/
export const slider = {
  MuiSlider,
};
