import { useRef, useCallback } from 'react';
import { useBoolean } from 'minimal-shared/hooks';
import { varAlpha, isActiveLink, isExternalLink } from 'minimal-shared/utils';

import Collapse from '@mui/material/Collapse';

import { paths } from 'src/routes/paths';
import { usePathname } from 'src/routes/hooks';

import { CONFIG } from 'src/global-config';
import { whiteAlpha, brandPalette } from 'src/theme/brand-tokens';

import { navSectionClasses, NavSectionVertical } from 'src/components/nav-section';

import { NavLi } from '../components';
import { NavItem } from './nav-mobile-item';

// ----------------------------------------------------------------------

export function NavList({ data, sx, ...other }) {
  const pathname = usePathname();
  const navItemRef = useRef(null);
  const childGroups = data.children
    ? data.children.some((child) => Array.isArray(child.items))
      ? data.children
      : [{ items: data.children }]
    : [];
  const childItems = childGroups.flatMap((group) => group.items ?? []);

  const isNotRootOrDocs = !['/', paths.docs].includes(pathname);
  const isNotComponentsPath = !pathname.startsWith(paths.components);
  const isOpenPath = !!childItems.length && isNotRootOrDocs && isNotComponentsPath;

  const isActive = isActiveLink(pathname, data.path, data.deepMatch ?? !!childItems.length);

  const { value: open, onToggle } = useBoolean(isOpenPath);

  const handleToggleMenu = useCallback(() => {
    if (childItems.length) {
      onToggle();
    }
  }, [childItems.length, onToggle]);

  const renderNavItem = () => (
    <NavItem
      ref={navItemRef}
      // slots
      path={data.path}
      icon={data.icon}
      title={data.title}
      // state
      open={open}
      active={isActive}
      // options
      hasChild={!!childItems.length}
      externalLink={isExternalLink(data.path)}
      // actions
      onClick={handleToggleMenu}
    />
  );

  const renderCollapse = () =>
    !!childItems.length && (
      <Collapse in={open}>
        <NavSectionVertical
          data={childGroups}
          sx={{
            px: 1.5,
            '--nav-item-color': whiteAlpha(0.78),
            '--nav-item-root-active-color': brandPalette.gold,
            '--nav-item-root-open-color': brandPalette.gold,
            '--nav-item-sub-active-color': brandPalette.gold,
            '--nav-item-sub-open-color': brandPalette.gold,
            '--nav-subheader-color': whiteAlpha(0.45),
            '--nav-subheader-hover-color': brandPalette.gold,
          }}
          slotProps={{
            rootItem: {
              sx: [
                (theme) => ({
                  minHeight: 36,
                  '&[aria-label="Dashboard"]': {
                    [`& .${navSectionClasses.item.title}`]: {
                      display: 'none',
                    },
                    height: 180,
                    borderRadius: 1.5,
                    backgroundSize: 'auto 88%',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    backgroundImage: `url(${CONFIG.assetsDir}/assets/illustrations/illustration-dashboard.webp)`,
                    border: `solid 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.12)}`,
                  },
                }),
              ],
            },
          }}
        />
      </Collapse>
    );

  return (
    <NavLi sx={sx} {...other}>
      {renderNavItem()}
      {renderCollapse()}
    </NavLi>
  );
}
