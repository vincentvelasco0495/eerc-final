import { useAuth0 } from '@auth0/auth0-react';
import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Collapse from '@mui/material/Collapse';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { CONFIG } from 'src/global-config';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';

import { useAuthContext } from 'src/auth/hooks';
import { signOut as jwtSignOut } from 'src/auth/context/jwt/action';
import { signOut as amplifySignOut } from 'src/auth/context/amplify/action';
import { signOut as supabaseSignOut } from 'src/auth/context/supabase/action';
import { signOut as firebaseSignOut } from 'src/auth/context/firebase/action';

import { styles, stylesChip, subNavListSx, getSidebarItemSx, getSubSidebarItemSx } from './styles';

const signOut =
  (CONFIG.auth.method === 'supabase' && supabaseSignOut) ||
  (CONFIG.auth.method === 'firebase' && firebaseSignOut) ||
  (CONFIG.auth.method === 'amplify' && amplifySignOut) ||
  jwtSignOut;

function InstructorSidebarItem({ item, depth = 0, onLogout }) {
  const theme = useTheme();
  const isLink = Boolean(item.path);
  const isSubItem = depth > 0;

  return (
    <Box
      component={isLink ? RouterLink : 'div'}
      href={isLink ? item.path : undefined}
      onClick={item.action === 'logout' ? onLogout : undefined}
      sx={isSubItem ? getSubSidebarItemSx(item, theme) : getSidebarItemSx(item)}
    >
      <Stack direction="row" spacing={1.25} alignItems="center" sx={{ minWidth: 0, flex: 1 }}>
        {!isSubItem && item.icon ? <Iconify icon={item.icon} width={18} /> : null}
        <Typography variant="body2" sx={{ color: 'inherit', fontWeight: item.active ? 700 : 500 }}>
          {item.label}
        </Typography>
      </Stack>

      {item.badge ? (
        <Chip label={item.badge} size="small" color="primary" sx={stylesChip} />
      ) : null}
    </Box>
  );
}

function InstructorSidebarNavItem({ item, onLogout }) {
  const hasChildren = Array.isArray(item.children) && item.children.length > 0;
  const [open, setOpen] = useState(Boolean(item.open));

  useEffect(() => {
    if (item.active) {
      setOpen(true);
    }
  }, [item.active]);

  const handleToggle = useCallback(() => {
    setOpen((value) => !value);
  }, []);

  if (!hasChildren) {
    return <InstructorSidebarItem item={item} onLogout={onLogout} />;
  }

  return (
    <Box>
      <Box
        role="button"
        tabIndex={0}
        onClick={handleToggle}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            handleToggle();
          }
        }}
        sx={getSidebarItemSx(item)}
      >
        <Stack direction="row" spacing={1.25} alignItems="center" sx={{ minWidth: 0, flex: 1 }}>
          {item.icon ? <Iconify icon={item.icon} width={18} /> : null}
          <Typography variant="body2" sx={{ color: 'inherit', fontWeight: item.active ? 700 : 500 }}>
            {item.label}
          </Typography>
        </Stack>

        <Iconify
          icon={open ? 'eva:arrow-ios-downward-fill' : 'eva:arrow-ios-forward-fill'}
          width={16}
          sx={{ color: 'text.disabled', flexShrink: 0 }}
        />
      </Box>

      <Collapse in={open} timeout="auto" unmountOnExit>
        <Box sx={(theme) => subNavListSx(theme)}>
          <Stack spacing={0.45}>
            {item.children.map((child) => (
              <InstructorSidebarItem key={child.label} item={child} depth={1} onLogout={onLogout} />
            ))}
          </Stack>
        </Box>
      </Collapse>
    </Box>
  );
}

export function InstructorProfileSidebar({ profile, navGroups, disableSticky = false }) {
  const router = useRouter();
  const { checkUserSession } = useAuthContext();
  const { logout: signOutAuth0 } = useAuth0();

  const handleLogout = useCallback(async () => {
    try {
      if (CONFIG.auth.method === 'auth0') {
        await signOutAuth0();
      } else {
        await signOut();
        await checkUserSession?.();
      }

      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error('Unable to logout!');
    }
  }, [checkUserSession, router, signOutAuth0]);

  return (
    <Box
      sx={
        disableSticky
          ? { ...styles.stickyWrap, position: 'static', top: 'auto' }
          : styles.stickyWrap
      }
    >
      <Card sx={styles.card}>
        <Stack spacing={3} sx={styles.stackPadding}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Avatar src={profile.avatarUrl || undefined} sx={styles.avatar}>
              {profile.initials}
            </Avatar>

            <Stack spacing={0.35}>
              <Typography variant="h6">{profile.name}</Typography>
              {profile.subtitle ? (
                <Typography variant="body2" sx={styles.subtitle}>
                  {profile.subtitle}
                </Typography>
              ) : null}
            </Stack>
          </Stack>

          {navGroups.map((group, index) => (
            <Stack key={group.title} spacing={1.2}>
              {index > 0 ? <Divider /> : null}

              <Typography variant="overline" sx={styles.groupHeading}>
                {group.title}
              </Typography>

              <Stack spacing={0.45}>
                {group.items.map((item) => (
                  <InstructorSidebarNavItem key={item.label} item={item} onLogout={handleLogout} />
                ))}
              </Stack>
            </Stack>
          ))}
        </Stack>
      </Card>
    </Box>
  );
}
