export const styles = {
  stickyWrap: {
    position: { lg: 'sticky' },
    top: {
      lg: 'calc(var(--layout-header-desktop-height) + var(--layout-dashboard-content-pt-desktop))',
    },
  },
  card: {
    borderRadius: 3,
    border: '1px solid',
    borderColor: 'divider',
    boxShadow: 'none',
  },
  stackPadding: { p: 2.5 },
  avatar: {
    width: 56,
    height: 56,
    bgcolor: 'brand.elevated',
    color: 'brand.accentText',
    border: (theme) => `1px solid ${theme.vars.palette.brand.borderDefault}`,
    fontWeight: 700,
  },
  subtitle: { color: 'brand.accentText', fontWeight: 600 },
  groupHeading: { color: 'text.disabled', letterSpacing: 1.1, px: 0.5 },
};

export function getSidebarItemSx(item) {
  const isClickable = item.action === 'logout' || !!item.path;

  return {
    px: 1.5,
    py: { xs: 1.2, sm: 1.1 },
    minHeight: { xs: 48, sm: 44 },
    borderRadius: 1.5,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 1.25,
    position: 'relative',
    color: item.active ? 'brand.accentText' : 'text.secondary',
    bgcolor: (theme) => (item.active ? theme.vars.palette.brand.accentSoft : 'transparent'),
    fontWeight: item.active ? 700 : 500,
    textDecoration: 'none',
    cursor: isClickable ? 'pointer' : 'default',
    transition: (theme) => theme.transitions.create(['background-color', 'color']),
    // Gold rail marks the active route.
    ...(item.active && {
      '&::after': {
        content: '""',
        position: 'absolute',
        left: 0,
        top: 8,
        bottom: 8,
        width: 3,
        borderRadius: 3,
        bgcolor: 'primary.main',
      },
    }),
    ...(isClickable &&
      !item.active && {
        '@media (hover: hover)': {
          '&:hover': {
            color: 'text.primary',
            bgcolor: (theme) => theme.vars.palette.brand.hoverWash,
          },
        },
      }),
  };
}

export const stylesChip = {
  height: 20,
  '& .MuiChip-label': { px: 0.85, fontSize: 11, fontWeight: 700 },
};

const bulletSvg = `"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' fill='none' viewBox='0 0 14 14'%3E%3Cpath d='M1 1v4a8 8 0 0 0 8 8h4' stroke='%23efefef' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E"`;

export const subNavListSx = (theme) => ({
  position: 'relative',
  pl: '14px',
  ml: '15px',
  '&::before': {
    top: 0,
    left: 0,
    width: '2px',
    content: '""',
    position: 'absolute',
    backgroundColor: theme.palette.divider,
    bottom: 'calc(36px - 2px - 7px)',
  },
});

export function getSubSidebarItemSx(item, theme) {
  return {
    ...getSidebarItemSx(item),
    position: 'relative',
    minHeight: 36,
    py: 0.85,
    pl: 2.25,
    '&::before': {
      left: 0,
      content: '""',
      position: 'absolute',
      width: 14,
      height: 14,
      backgroundColor: theme.palette.divider,
      mask: `url(${bulletSvg}) no-repeat 50% 50%/100% auto`,
      WebkitMask: `url(${bulletSvg}) no-repeat 50% 50%/100% auto`,
      transform: 'translate(-14px, -4px)',
    },
  };
}
