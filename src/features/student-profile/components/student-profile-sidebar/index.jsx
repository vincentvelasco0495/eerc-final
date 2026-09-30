import { useCallback } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
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

import { styles, getSidebarItemSx, itemLabelTypography } from './styles';

const signOut =
  (CONFIG.auth.method === 'supabase' && supabaseSignOut) ||
  (CONFIG.auth.method === 'firebase' && firebaseSignOut) ||
  (CONFIG.auth.method === 'amplify' && amplifySignOut) ||
  jwtSignOut;

function StudentProfileSidebarItem({ item, onLogout }) {
  const isLink = Boolean(item.path);

  return (
    <Box
      component={isLink ? RouterLink : 'div'}
      href={isLink ? item.path : undefined}
      onClick={item.action === 'logout' ? onLogout : undefined}
      sx={getSidebarItemSx(item)}
    >
      <Iconify icon={item.icon} width={20} />
      <Typography variant="body2" sx={itemLabelTypography}>
        {item.label}
      </Typography>
    </Box>
  );
}

export function StudentProfileSidebar({ user, navGroups, disableSticky = false }) {
  const router = useRouter();
  const { checkUserSession } = useAuthContext();
  const { logout: signOutAuth0 } = useAuth0();

  const initials = user?.displayName?.split(' ').slice(0, 2).map((part) => part[0]).join('').toUpperCase();

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
            <Avatar sx={styles.avatar}>{initials}</Avatar>

            <Stack spacing={0.35}>
              <Typography variant="h6">{user?.displayName ?? 'Student Name'}</Typography>
            </Stack>
          </Stack>

          {navGroups.map((group, index) => (
            <Stack key={group.title} spacing={1.2}>
              {index > 0 ? <Divider /> : null}

              <Typography variant="overline" sx={styles.groupHeading}>
                {group.title}
              </Typography>

              <Stack spacing={0.5}>
                {group.items.map((item) => (
                  <StudentProfileSidebarItem key={item.label} item={item} onLogout={handleLogout} />
                ))}
              </Stack>
            </Stack>
          ))}
        </Stack>
      </Card>
    </Box>
  );
}
