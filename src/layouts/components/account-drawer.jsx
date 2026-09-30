import { useMemo } from 'react';
import { varAlpha } from 'minimal-shared/utils';
import { useBoolean } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Drawer from '@mui/material/Drawer';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { AnimateBorder } from 'src/components/animate';

import { useAuthContext } from 'src/auth/hooks';
import { normalizeUserRole } from 'src/auth/utils/role';

import { AccountButton } from './account-button';
import { SignOutButton } from './sign-out-button';

// ----------------------------------------------------------------------

function formatRoleLabel(role) {
  const r = normalizeUserRole(role);
  if (r === 'student') return 'Student';
  if (r === 'instructor') return 'Instructor';
  if (r === 'admin') return 'Administrator';
  if (!r) return '';
  return `${role}`.trim().charAt(0).toUpperCase() + `${role}`.trim().slice(1).toLowerCase();
}

export function AccountDrawer({ sx, ...other }) {
  const { user, loading } = useAuthContext();

  const { value: open, onFalse: onClose, onTrue: onOpen } = useBoolean();

  const displayName = useMemo(() => {
    const fromUser = `${user?.displayName ?? user?.name ?? ''}`.trim();
    if (fromUser) return fromUser;
    const emailLocal = user?.email ? String(user.email).split('@')[0] : '';
    if (emailLocal) return emailLocal;
    return '';
  }, [user]);

  const email = user?.email ?? '';
  const roleLabel = user?.role ? formatRoleLabel(user.role) : '';

  const photoURL = user?.photoURL || user?.photoUrl || user?.avatarUrl || '';

  const renderAvatar = () => (
    <AnimateBorder
      sx={{ mb: 2, p: '6px', width: 96, height: 96, borderRadius: '50%' }}
      slotProps={{
        primaryBorder: { size: 120, sx: { color: 'primary.main' } },
      }}
    >
      {photoURL ? (
        <Avatar src={photoURL} alt={displayName} sx={{ width: 1, height: 1 }}>
          {(displayName || '?').trim().charAt(0).toUpperCase()}
        </Avatar>
      ) : (
        <Box
          sx={{
            width: 1,
            height: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Skeleton
            variant="circular"
            animation="wave"
            sx={{
              width: '88%',
              height: '88%',
              bgcolor: (theme) => varAlpha(theme.vars.palette.grey['500Channel'], 0.16),
            }}
          />
        </Box>
      )}
    </AnimateBorder>
  );

  return (
    <>
      <AccountButton
        onClick={onOpen}
        photoURL={photoURL}
        displayName={displayName}
        sx={sx}
        {...other}
      />

      <Drawer
        open={open}
        onClose={onClose}
        anchor="right"
        slotProps={{
          backdrop: { invisible: true },
          paper: { sx: { width: 320 } },
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{
            top: 12,
            left: 12,
            zIndex: 9,
            position: 'absolute',
          }}
        >
          <Iconify icon="mingcute:close-line" />
        </IconButton>

        <Scrollbar>
          <Box
            sx={{
              pt: 8,
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column',
              px: 2,
            }}
          >
            {renderAvatar()}

            {loading && !user ? (
              <>
                <Skeleton variant="text" width="70%" sx={{ mt: 2 }} />
                <Skeleton variant="text" width="85%" />
                <Skeleton variant="text" width="50%" sx={{ mt: 1 }} />
              </>
            ) : (
              <>
                <Typography variant="subtitle1" textAlign="center" sx={{ mt: 2 }} noWrap>
                  {displayName || '—'}
                </Typography>

                {email ? (
                  <Typography
                    variant="body2"
                    sx={{ color: 'text.secondary', mt: 0.5 }}
                    textAlign="center"
                    noWrap
                  >
                    {email}
                  </Typography>
                ) : null}

                {roleLabel ? (
                  <Typography
                    variant="overline"
                    sx={{ color: 'text.secondary', mt: 1.5, letterSpacing: 1 }}
                    textAlign="center"
                  >
                    {roleLabel}
                  </Typography>
                ) : null}
              </>
            )}
          </Box>
        </Scrollbar>

        <Box sx={{ p: 2.5 }}>
          <SignOutButton onClose={onClose} />
        </Box>
      </Drawer>
    </>
  );
}
