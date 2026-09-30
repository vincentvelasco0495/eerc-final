import { varAlpha, noRtlFlip } from 'minimal-shared/utils';

import { dividerClasses } from '@mui/material/Divider';
import { checkboxClasses } from '@mui/material/Checkbox';
import { menuItemClasses } from '@mui/material/MenuItem';
import { autocompleteClasses } from '@mui/material/Autocomplete';

// ----------------------------------------------------------------------

/**
 * Generates styles for menu item components.
 *
 * @param theme - The MUI theme object.
 * @returns A CSS object with styles.
 *
 * @example
 * ...theme.mixins.menuItemStyles(theme)
 */

export function menuItemStyles(theme) {
  return {
    ...theme.typography.body2,
    padding: theme.spacing(0.75, 1),
    borderRadius: Number(theme.shape.borderRadius) * 0.75,
    '&:not(:last-of-type)': {
      marginBottom: 4,
    },
    [`&.${menuItemClasses.selected}`]: {
      fontWeight: theme.typography.fontWeightSemiBold,
      color: theme.vars.palette.brand.accentText,
      backgroundColor: theme.vars.palette.action.selected,
      '&:hover': { backgroundColor: theme.vars.palette.action.focus },
    },
    [`& .${checkboxClasses.root}`]: {
      padding: theme.spacing(0.5),
      marginLeft: theme.spacing(-0.5),
      marginRight: theme.spacing(0.5),
    },
    [`&.${autocompleteClasses.option}[aria-selected="true"]`]: {
      backgroundColor: theme.vars.palette.action.selected,
      '&:hover': { backgroundColor: theme.vars.palette.action.hover },
    },
    [`&+.${dividerClasses.root}`]: {
      margin: theme.spacing(0.5, 0),
    },
  };
}

// ----------------------------------------------------------------------

/**
 * Generates styles for paper components.
 *
 * @param theme - The MUI theme object.
 * @param options.blur - (Optional) Blur intensity in pixels. Defaults to 20.
 * @param options.color - (Optional) Background color. Defaults to semi-transparent paper color.
 * @param options.dropdown - (Optional) If true, applies padding, box-shadow, and border-radius for dropdowns.
 * @returns A CSS object with styles.
 *
 * @example
 * // Paper with default styles
 * ...theme.mixins.paperStyles(theme);
 *
 * @example
 * // Paper with dropdown styles and custom blur
 * ...theme.mixins.paperStyles(theme, {
 *   blur: 10,
 *   color: varAlpha(theme.vars.palette.background.defaultChannel, 0.9),
 *   dropdown: true
 * })
 */

export function paperStyles(theme, options) {
  const { blur = 20, color, dropdown } = options ?? {};

  return {
    // Subtle brand glows: gold top-right, blue bottom-left.
    ...theme.mixins.bgGradient({
      images: [
        `radial-gradient(at top right, ${varAlpha(theme.vars.palette.primary.mainChannel, 0.12)}, transparent 70%)`,
        `radial-gradient(at left bottom, ${varAlpha(theme.vars.palette.info.mainChannel, 0.1)}, transparent 70%)`,
      ],
      sizes: ['50%', '50%'],
      positions: [noRtlFlip('top right'), noRtlFlip('left bottom')],
    }),
    backdropFilter: `blur(${blur}px)`,
    WebkitBackdropFilter: `blur(${blur}px)`,
    backgroundColor: color ?? varAlpha(theme.vars.palette.background.paperChannel, 0.96),
    ...(dropdown && {
      padding: theme.spacing(0.5),
      border: `1px solid ${theme.vars.palette.brand.borderSubtle}`,
      boxShadow: theme.vars.customShadows.dropdown,
      borderRadius: `${Number(theme.shape.borderRadius) * 1.25}px`,
    }),
  };
}

// ----------------------------------------------------------------------

/**
 * Generate style variant for components like Button, Chip, Label, etc.
 *
 * @param theme - The MUI theme object.
 * @param colorKey - 'default', 'inherit', or a palette color key like 'primary', 'secondary', etc.
 * @param options.hover - (Optional) Enable hover styles or provide custom hover styles.
 * @returns A CSS object with styles.
 *
 * @example
 * // Filled styles
 * ...theme.mixins.filledStyles(theme, 'inherit', { hover: true })
 * ...theme.mixins.filledStyles(theme, 'inherit', { hover: { boxShadow: theme.vars.customShadows.z8 }, })
 *
 * // Soft styles
 * ...theme.mixins.softStyles(theme, 'inherit')
 * ...theme.mixins.softStyles(theme, 'primary', { hover: true })
 */

function getHoverStyles(hoverOption, hoverBase) {
  if (!hoverOption) return {};

  return {
    '&:hover': {
      ...hoverBase,
      ...(typeof hoverOption === 'object' ? hoverOption : {}),
    },
  };
}

export function filledStyles(theme, colorKey, options) {
  if (!colorKey) {
    console.warn(
      '[filledStyles] Missing colorKey. Please provide a valid color such as "primary", "black", or "default".'
    );
    return {};
  }

  // Neutral fills resolve to navy in both schemes so gold stays reserved for primary CTAs.
  if (colorKey === 'default') {
    const base = {
      color: theme.vars.palette.brand.onNeutralFill,
      backgroundColor: theme.vars.palette.brand.neutralFill,
    };

    const hover = getHoverStyles(options?.hover, {
      backgroundColor: theme.vars.palette.brand.neutralFillHover,
    });

    return { ...base, ...hover };
  }

  if (colorKey === 'inherit') {
    const base = {
      color: theme.vars.palette.brand.onNeutralFill,
      backgroundColor: theme.vars.palette.brand.neutralFill,
      border: `1px solid ${theme.vars.palette.brand.borderSubtle}`,
    };

    const hover = getHoverStyles(options?.hover, {
      backgroundColor: theme.vars.palette.brand.neutralFillHover,
      borderColor: theme.vars.palette.brand.borderDefault,
    });

    return { ...base, ...hover };
  }

  if (colorKey === 'white' || colorKey === 'black') {
    const base = {
      color: `${theme.vars.palette.common[colorKey === 'white' ? 'black' : 'white']}`,
      backgroundColor: theme.vars.palette.common[colorKey],
    };

    const hover = getHoverStyles(options?.hover, {
      backgroundColor: varAlpha(
        `${theme.vars.palette.common[`${colorKey}Channel`]}`,
        theme.vars.opacity.filled.commonHoverBg
      ),
    });

    return { ...base, ...hover };
  }

  const colorPalette = {
    base: {
      color: theme.vars.palette[colorKey].contrastText,
      backgroundColor: theme.vars.palette[colorKey].main,
    },
    hover: getHoverStyles(options?.hover, {
      backgroundColor: theme.vars.palette[colorKey].dark,
    }),
  };

  return { ...colorPalette.base, ...colorPalette.hover };
}

export function softStyles(theme, colorKey, options) {
  if (!colorKey) {
    console.warn(
      '[softStyles] Missing colorKey. Please provide a valid color such as "primary", "black", or "default".'
    );
    return {};
  }

  if (colorKey === 'default') {
    return {
      ...filledStyles(theme, 'default', options),
      boxShadow: 'none',
    };
  }

  if (colorKey === 'inherit') {
    const base = {
      boxShadow: 'none',
      backgroundColor: varAlpha(theme.vars.palette.grey['500Channel'], theme.vars.opacity.soft.bg),
    };

    const hover = getHoverStyles(options?.hover, {
      backgroundColor: varAlpha(
        theme.vars.palette.grey['500Channel'],
        theme.vars.opacity.soft.hoverBg
      ),
    });

    return { ...base, ...hover };
  }

  if (colorKey === 'white' || colorKey === 'black') {
    const base = {
      boxShadow: 'none',
      color: theme.vars.palette.common[colorKey],
      backgroundColor: varAlpha('currentColor', theme.vars.opacity.soft.commonBg),
    };

    const hover = getHoverStyles(options?.hover, {
      backgroundColor: varAlpha('currentColor', theme.vars.opacity.soft.commonHoverBg),
    });

    return { ...base, ...hover };
  }

  const colorPalette = {
    base: {
      boxShadow: 'none',
      /**
       * Tint direction flips per scheme so soft chips stay legible on either surface.
       * Light uses `darker` rather than `dark` because the 16% tint leaves an almost
       * white background, and mid-tones (gold especially) fail contrast against it.
       */
      color: theme.vars.palette[colorKey].darker,
      backgroundColor: varAlpha(
        theme.vars.palette[colorKey].mainChannel,
        theme.vars.opacity.soft.bg
      ),
      ...theme.applyStyles('dark', { color: theme.vars.palette[colorKey].light }),
    },
    hover: getHoverStyles(options?.hover, {
      backgroundColor: varAlpha(
        theme.vars.palette[colorKey].mainChannel,
        theme.vars.opacity.soft.hoverBg
      ),
    }),
  };

  return { ...colorPalette.base, ...colorPalette.hover };
}
