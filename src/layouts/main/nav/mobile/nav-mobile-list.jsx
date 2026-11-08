import { useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router';
import { useBoolean } from 'minimal-shared/hooks';
import { isActiveLink, isExternalLink } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';

import { paths } from 'src/routes/paths';
import { usePathname } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { goldAlpha, whiteAlpha, brandPalette } from 'src/theme/brand-tokens';

import { NavLi } from '../components';
import { NavItem } from './nav-mobile-item';

// ----------------------------------------------------------------------

function isChildItemActive(pathname, searchParams, itemPath) {
  if (!itemPath) {
    return false;
  }

  let itemUrl;
  try {
    itemUrl = new URL(itemPath, window.location.origin);
  } catch {
    return false;
  }

  if (pathname !== itemUrl.pathname) {
    return false;
  }

  for (const [key, value] of itemUrl.searchParams.entries()) {
    if (searchParams.get(key) !== value) {
      return false;
    }
  }

  return true;
}

export function NavList({ data, sx, ...other }) {
  const pathname = usePathname();
  const [searchParams] = useSearchParams();
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
      path={data.path}
      icon={data.icon}
      title={data.title}
      open={open}
      active={isActive}
      hasChild={!!childItems.length}
      externalLink={isExternalLink(data.path)}
      onClick={handleToggleMenu}
    />
  );

  const renderCollapse = () =>
    !!childItems.length && (
      <Collapse in={open} timeout="auto" unmountOnExit>
        <Box
          component="ul"
          sx={{
            m: 0,
            mt: 0.75,
            mb: 0.5,
            py: 0.75,
            px: 0.75,
            gap: 0.25,
            display: 'flex',
            listStyle: 'none',
            flexDirection: 'column',
            borderRadius: 1.5,
            bgcolor: whiteAlpha(0.04),
          }}
        >
          {childItems.map((item) => {
            const active = isChildItemActive(pathname, searchParams, item.path);

            return (
              <Box component="li" key={item.path || item.title}>
                <Box
                  component={RouterLink}
                  href={item.path}
                  sx={{
                    gap: 1.25,
                    px: 1.5,
                    py: 1.05,
                    display: 'flex',
                    alignItems: 'center',
                    borderRadius: 1,
                    textDecoration: 'none',
                    fontSize: 14,
                    fontWeight: active ? 700 : 500,
                    color: active ? brandPalette.gold : whiteAlpha(0.82),
                    bgcolor: active ? goldAlpha(0.12) : 'transparent',
                    '&:hover': {
                      color: brandPalette.gold,
                      bgcolor: goldAlpha(0.1),
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 6,
                      height: 6,
                      flexShrink: 0,
                      borderRadius: '50%',
                      bgcolor: active ? brandPalette.gold : whiteAlpha(0.4),
                    }}
                  />
                  {item.title}
                </Box>
              </Box>
            );
          })}
        </Box>
      </Collapse>
    );

  return (
    <NavLi sx={[{ display: 'flex', flexDirection: 'column', width: '100%' }, sx]} {...other}>
      {renderNavItem()}
      {renderCollapse()}
    </NavLi>
  );
}
