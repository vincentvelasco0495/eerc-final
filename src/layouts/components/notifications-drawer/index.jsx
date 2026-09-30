import { m } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useBoolean } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Badge from '@mui/material/Badge';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { varTap, varHover, transitionTap } from 'src/components/animate';

import { NotificationItem } from './notification-item';

// ----------------------------------------------------------------------

export function NotificationsDrawer({
  data = [],
  onMarkAllAsRead,
  onMarkNotificationRead,
  onMarkNotificationUnread,
  onDrawerOpen,
  sx,
  ...other
}) {
  const { value: open, onFalse: onClose, onTrue: onOpen } = useBoolean();

  const handleOpen = () => {
    onDrawerOpen?.();
    onOpen();
  };

  const [notifications, setNotifications] = useState(data);

  useEffect(() => {
    setNotifications(data);
  }, [data]);

  const totalUnRead = notifications.filter((item) => item.isUnRead === true).length;

  const handleMarkAllAsRead = () => {
    if (onMarkAllAsRead) {
      onMarkAllAsRead();
    } else {
      setNotifications((prev) => prev.map((notification) => ({ ...notification, isUnRead: false })));
    }
  };

  const renderHead = () => (
    <Box
      sx={{
        py: 2,
        pr: 1,
        pl: 2.5,
        minHeight: 68,
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Typography variant="h6" sx={{ flexGrow: 1 }}>
        Notifications
      </Typography>

      {!!totalUnRead && (
        <Tooltip title="Mark all as read">
          <IconButton color="primary" onClick={handleMarkAllAsRead}>
            <Iconify icon="eva:done-all-fill" />
          </IconButton>
        </Tooltip>
      )}

      <IconButton onClick={onClose} sx={{ display: { xs: 'inline-flex', sm: 'none' } }}>
        <Iconify icon="mingcute:close-line" />
      </IconButton>

      <IconButton>
        <Iconify icon="solar:settings-bold-duotone" />
      </IconButton>
    </Box>
  );

  const renderList = () => {
    if (!notifications?.length) {
      return (
        <Box
          sx={{
            px: 3,
            py: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          <Iconify
            icon="solar:bell-off-bold-duotone"
            width={48}
            sx={{ color: 'text.disabled', mb: 2 }}
          />
          <Typography variant="subtitle1">No notifications</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            You&apos;re all caught up. New updates will appear here.
          </Typography>
        </Box>
      );
    }

    return (
      <Scrollbar>
        <Box component="ul">
          {notifications.map((notification) => (
            <Box component="li" key={notification.id} sx={{ display: 'flex' }}>
              <NotificationItem
                notification={notification}
                onMarkRead={onMarkNotificationRead}
                onMarkUnread={onMarkNotificationUnread}
              />
            </Box>
          ))}
        </Box>
      </Scrollbar>
    );
  };

  return (
    <>
      <IconButton
        component={m.button}
        whileTap={varTap(0.96)}
        whileHover={varHover(1.04)}
        transition={transitionTap()}
        aria-label="Notifications button"
        onClick={handleOpen}
        sx={sx}
        {...other}
      >
        <Badge badgeContent={totalUnRead} color="error" invisible={totalUnRead === 0}>
          <Iconify width={24} icon="solar:bell-bing-bold-duotone" />
        </Badge>
      </IconButton>

      <Drawer
        open={open}
        onClose={onClose}
        anchor="right"
        slotProps={{
          backdrop: { invisible: true },
          paper: { sx: { width: 1, maxWidth: 420 } },
        }}
      >
        {renderHead()}
        {renderList()}

        {notifications.length > 0 ? (
          <Box sx={{ p: 1 }}>
            <Button fullWidth size="large">
              View all
            </Button>
          </Box>
        ) : null}
      </Drawer>
    </>
  );
}

export default NotificationsDrawer;
