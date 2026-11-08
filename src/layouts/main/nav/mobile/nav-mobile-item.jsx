import { mergeClasses } from 'minimal-shared/utils';

import { styled } from '@mui/material/styles';
import ButtonBase from '@mui/material/ButtonBase';

import { goldAlpha, whiteAlpha, brandPalette } from 'src/theme/brand-tokens';

import { Iconify } from 'src/components/iconify';
import { createNavItem, navItemStyles, navSectionClasses } from 'src/components/nav-section';

// ----------------------------------------------------------------------

export function NavItem({
  path,
  icon,
  title,
  /********/
  open,
  active,
  /********/
  hasChild,
  className,
  externalLink,
  ...other
}) {
  const navItem = createNavItem({
    path,
    icon,
    hasChild,
    externalLink,
  });

  const ownerState = { open, active };

  return (
    <ItemRoot
      aria-label={title}
      {...ownerState}
      {...navItem.baseProps}
      className={mergeClasses([navSectionClasses.item.root, className], {
        [navSectionClasses.state.open]: open,
        [navSectionClasses.state.active]: active,
      })}
      {...other}
    >
      <ItemIcon {...ownerState}>{navItem.renderIcon}</ItemIcon>

      <ItemTitle {...ownerState}>{title}</ItemTitle>

      {hasChild && (
        <ItemArrow
          {...ownerState}
          icon={open ? 'eva:arrow-ios-downward-fill' : 'eva:arrow-ios-forward-fill'}
        />
      )}
    </ItemRoot>
  );
}

// ----------------------------------------------------------------------

const shouldForwardProp = (prop) => !['open', 'active', 'sx'].includes(prop);

const highlighted = {
  color: brandPalette.gold,
  backgroundColor: goldAlpha(0.12),
  '&::before': { backgroundColor: brandPalette.gold },
};

/**
 * @slot root
 */
const ItemRoot = styled(ButtonBase, { shouldForwardProp })(({ theme }) => ({
  gap: 12,
  height: 48,
  width: '100%',
  position: 'relative',
  paddingLeft: theme.spacing(1.25),
  paddingRight: theme.spacing(1.5),
  color: whiteAlpha(0.92),
  borderRadius: 12,
  justifyContent: 'flex-start',
  '&::before': {
    content: '""',
    position: 'absolute',
    left: 6,
    top: 12,
    bottom: 12,
    width: 3,
    borderRadius: 99,
    backgroundColor: 'transparent',
  },
  '&:hover': { backgroundColor: whiteAlpha(0.06) },
  variants: [
    {
      props: { active: true },
      style: { ...highlighted, '&:hover': { backgroundColor: goldAlpha(0.18) } },
    },
  ],
}));

/**
 * @slot icon
 */
const ItemIcon = styled('span', { shouldForwardProp })(() => ({
  ...navItemStyles.icon,
  width: 36,
  height: 36,
  borderRadius: 10,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: brandPalette.white,
  backgroundColor: whiteAlpha(0.1),
  '& > :first-of-type:not(style):not(:first-of-type ~ *), & > style + *': {
    width: 20,
    height: 20,
  },
  variants: [
    {
      props: { active: true },
      style: { color: brandPalette.gold, backgroundColor: goldAlpha(0.16) },
    },
  ],
}));

/**
 * @slot title
 */
const ItemTitle = styled('span', { shouldForwardProp })(({ theme }) => ({
  ...navItemStyles.title(theme),
  fontSize: 15,
  fontWeight: 600,
  letterSpacing: 0.1,
  variants: [{ props: { active: true }, style: { fontWeight: 700 } }],
}));

/**
 * @slot arrow
 */
const ItemArrow = styled(Iconify, { shouldForwardProp })(({ theme }) => ({
  ...navItemStyles.arrow(theme),
  marginLeft: 'auto',
  color: 'inherit',
}));
