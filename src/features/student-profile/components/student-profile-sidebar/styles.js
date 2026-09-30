export function getSidebarItemSx(item) {
  const isClickable = item.action === 'logout' || !!item.path;

  return {
    px: 1.5,
    py: { xs: 1.2, sm: 1.15 },
    minHeight: { xs: 48, sm: 44 },
    borderRadius: 1.5,
    display: 'flex',
    alignItems: 'center',
    gap: 1.25,
    position: 'relative',
    color: item.active ? 'brand.accentText' : 'text.secondary',
    bgcolor: (theme) =>
      item.active ? theme.vars.palette.brand.accentSoft : 'transparent',
    fontWeight: item.active ? 700 : 500,
    textDecoration: 'none',
    cursor: item.action === 'logout' ? 'pointer' : 'default',
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
  groupHeading: { color: 'text.disabled', letterSpacing: 1.1, px: 0.5 },
};

export const itemLabelTypography = { fontWeight: 'inherit', color: 'inherit' };
