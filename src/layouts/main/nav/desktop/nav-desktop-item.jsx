import { mergeClasses } from 'minimal-shared/utils';

import { styled } from '@mui/material/styles';
import ButtonBase from '@mui/material/ButtonBase';

import { goldAlpha, whiteAlpha, brandPalette } from 'src/theme/brand-tokens';

import { Iconify } from 'src/components/iconify';
import { createNavItem, navItemStyles, navSectionClasses } from 'src/components/nav-section';

// ----------------------------------------------------------------------

export function NavItem({
  title,
  path,
  /********/
  open,
  active,
  /********/
  subItem,
  hasChild,
  className,
  externalLink,
  ...other
}) {
  const navItem = createNavItem({ path, hasChild, externalLink });

  const ownerState = { open, active, variant: !subItem ? 'rootItem' : 'subItem' };

  return (
    <ItemRoot
      disableRipple
      aria-label={title}
      {...ownerState}
      {...navItem.baseProps}
      className={mergeClasses([navSectionClasses.item.root, className], {
        [navSectionClasses.state.open]: open,
        [navSectionClasses.state.active]: active,
      })}
      {...other}
    >
      <ItemTitle {...ownerState}> {title}</ItemTitle>

      {hasChild && <ItemArrow {...ownerState} icon="eva:arrow-ios-downward-fill" />}
    </ItemRoot>
  );
}

// ----------------------------------------------------------------------

const shouldForwardProp = (prop) => !['open', 'active', 'variant', 'sx'].includes(prop);

/**
 * @slot root
 */
const ItemRoot = styled(ButtonBase, { shouldForwardProp })(({ active, open, theme }) => {
  const rootItemStyles = {
    position: 'relative',
    paddingInline: theme.spacing(1.5),
    minHeight: 36,
    borderRadius: 999,
    color: whiteAlpha(0.78),
    '&:hover': {
      color: brandPalette.gold,
      backgroundColor: goldAlpha(0.12),
    },
    ...(open && {
      color: brandPalette.gold,
      backgroundColor: goldAlpha(0.12),
    }),
    ...(active && {
      color: brandPalette.gold,
    }),
    '&::after': {
      content: '""',
      position: 'absolute',
      left: 14,
      right: 14,
      bottom: 5,
      height: 2,
      borderRadius: 99,
      backgroundColor: brandPalette.gold,
      opacity: active ? 1 : 0,
      transform: active ? 'scaleX(1)' : 'scaleX(0.4)',
      transition: theme.transitions.create(['opacity', 'transform'], {
        duration: theme.transitions.duration.shorter,
      }),
    },
  };

  const subItemStyles = {
    color: theme.vars.palette.text.secondary,
    '&:hover': { color: theme.vars.palette.brand.accentText },
    ...(active && { color: theme.vars.palette.brand.accentText }),
  };

  return {
    flexShrink: 0,
    transition: theme.transitions.create(['color', 'background-color'], {
      duration: theme.transitions.duration.shorter,
    }),
    variants: [
      { props: { variant: 'rootItem' }, style: rootItemStyles },
      { props: { variant: 'subItem' }, style: subItemStyles },
    ],
  };
});

/**
 * @slot title
 */
const ItemTitle = styled('span', { shouldForwardProp })(({ theme }) => ({
  ...navItemStyles.title(theme),
  ...theme.typography.body2,
  display: 'inline-flex',
  flex: '0 0 auto',
  minWidth: 'max-content',
  overflow: 'visible',
  textOverflow: 'clip',
  WebkitLineClamp: 'unset',
  WebkitBoxOrient: 'initial',
  fontWeight: theme.typography.fontWeightMedium,
  letterSpacing: '0.01em',
  variants: [
    { props: { variant: 'subItem' }, style: { fontSize: theme.typography.pxToRem(13) } },
    { props: { active: true }, style: { fontWeight: theme.typography.fontWeightSemiBold } },
  ],
}));

/**
 * @slot arrow
 */
const ItemArrow = styled(Iconify, { shouldForwardProp })(({ theme }) => ({
  ...navItemStyles.arrow(theme),
  color: 'inherit',
}));
