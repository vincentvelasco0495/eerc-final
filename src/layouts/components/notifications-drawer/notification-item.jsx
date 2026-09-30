import { useState } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Dialog from '@mui/material/Dialog';
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import ListItemText from '@mui/material/ListItemText';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';

import { fToNow } from 'src/utils/format-time';

import { Label } from 'src/components/label';
import { FileThumbnail } from 'src/components/file-thumbnail';

import { notificationIcons } from './icons';

// ----------------------------------------------------------------------

const readerContent = (data) => (
  <Box
    dangerouslySetInnerHTML={{ __html: data }}
    sx={{
      '& p': { m: 0, typography: 'body2' },
      '& a': { color: 'inherit', textDecoration: 'none' },
      '& strong': { typography: 'subtitle2' },
    }}
  />
);

const hasHtmlMessage = (notification) =>
  typeof notification.message === 'string' && notification.message.trim().length > 0;

const renderIcon = (type) =>
  (
    {
      order: notificationIcons.order,
      chat: notificationIcons.chat,
      mail: notificationIcons.mail,
      delivery: notificationIcons.delivery,
    }[type] ?? notificationIcons.mail
  );

export function NotificationItem({ notification, onMarkRead, onMarkUnread }) {
  const [detailOpen, setDetailOpen] = useState(false);

  const isAnnouncement = notification.category === 'Announcement';
  const isEnrollment = notification.category === 'Enrollment';
  const hasDetailDialog = isAnnouncement || isEnrollment;
  const isDismissOnRead = Boolean(notification.removeOnRead);

  const openDetail = () => {
    setDetailOpen(true);
    if (notification.isUnRead && onMarkRead && !isDismissOnRead) {
      onMarkRead(notification.id);
    }
  };

  const handleCloseDetail = () => {
    setDetailOpen(false);
    if (notification.isUnRead && onMarkRead && isDismissOnRead) {
      onMarkRead(notification.id);
    }
  };

  const renderPrimaryTitle = () => {
    if (!hasDetailDialog) {
      return readerContent(notification.title);
    }

    return (
      <Box
        component="span"
        role="button"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            event.stopPropagation();
            openDetail();
          }
        }}
        onClick={(event) => {
          event.stopPropagation();
          openDetail();
        }}
        sx={{
          cursor: 'pointer',
          display: 'inline-block',
          width: '100%',
          outline: 'none',
          borderRadius: 0.5,
          '&:focus-visible': {
            boxShadow: (theme) => `0 0 0 2px ${theme.vars.palette.primary.main}`,
          },
          '&:hover': { opacity: 0.85 },
        }}
      >
        {readerContent(notification.title)}
      </Box>
    );
  };

  const renderAvatar = () => (
    <ListItemAvatar>
      {notification.avatarUrl ? (
        <Avatar src={notification.avatarUrl} sx={{ bgcolor: 'background.neutral' }} />
      ) : (
        <Box
          sx={{
            width: 40,
            height: 40,
            display: 'flex',
            borderRadius: '50%',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'background.neutral',
          }}
        >
          <SvgIcon sx={{ width: 24, height: 24 }}>{renderIcon(notification.type)}</SvgIcon>
        </Box>
      )}
    </ListItemAvatar>
  );

  const renderText = () => (
    <ListItemText
      primary={renderPrimaryTitle()}
      secondary={
        <>
          {fToNow(notification.createdAt)}
          <Box
            component="span"
            sx={{ width: 2, height: 2, borderRadius: '50%', bgcolor: 'currentColor' }}
          />
          {notification.category}
        </>
      }
      slotProps={{
        primary: {
          sx: { mb: 0.5 },
        },
        secondary: {
          sx: {
            gap: 0.5,
            display: 'flex',
            alignItems: 'center',
            typography: 'caption',
            color: 'text.disabled',
          },
        },
      }}
    />
  );

  const renderUnReadBadge = () =>
    notification.isUnRead && (
      <Box
        sx={{
          top: 26,
          width: 8,
          height: 8,
          right: 20,
          borderRadius: '50%',
          bgcolor: 'info.main',
          position: 'absolute',
        }}
      />
    );

  const renderFriendAction = () => (
    <Box sx={{ gap: 1, mt: 1.5, display: 'flex' }}>
      <Button size="small" variant="contained">
        Accept
      </Button>
      <Button size="small" variant="outlined">
        Decline
      </Button>
    </Box>
  );

  const renderProjectAction = () => (
    <>
      <Box
        sx={{
          p: 1.5,
          my: 1.5,
          borderRadius: 1.5,
          color: 'text.secondary',
          bgcolor: 'background.neutral',
        }}
      >
        {readerContent(
          `<p><strong>@Jaydon Frankie</strong> feedback by asking questions or just leave a note of appreciation.</p>`
        )}
      </Box>

      <Button size="small" variant="contained" sx={{ alignSelf: 'flex-start' }}>
        Reply
      </Button>
    </>
  );

  const renderFileAction = () => (
    <Box
      sx={(theme) => ({
        p: theme.spacing(1.5, 1.5, 1.5, 1),
        gap: 1,
        mt: 1.5,
        display: 'flex',
        borderRadius: 1.5,
        bgcolor: 'background.neutral',
      })}
    >
      <FileThumbnail file="http://localhost:8080/httpsdesign-suriname-2015.mp3" />

      <ListItemText
        primary="design-suriname-2015.mp3 design-suriname-2015.mp3"
        secondary="2.3 Mb"
        slotProps={{
          primary: {
            noWrap: true,
            sx: (theme) => ({
              color: 'text.secondary',
              fontSize: theme.typography.pxToRem(13),
            }),
          },
          secondary: {
            sx: {
              mt: 0.25,
              typography: 'caption',
              color: 'text.disabled',
            },
          },
        }}
      />

      <Button size="small" variant="outlined" sx={{ flexShrink: 0 }}>
        Download
      </Button>
    </Box>
  );

  const renderTagsAction = () => (
    <Box
      sx={{
        mt: 1.5,
        gap: 0.75,
        display: 'flex',
        flexWrap: 'wrap',
      }}
    >
      <Label variant="outlined" color="info">
        Design
      </Label>
      <Label variant="outlined" color="warning">
        Dashboard
      </Label>
      <Label variant="outlined">Design system</Label>
    </Box>
  );

  const renderPaymentAction = () => (
    <Box sx={{ gap: 1, mt: 1.5, display: 'flex' }}>
      <Button size="small" variant="contained">
        Pay
      </Button>
      <Button size="small" variant="outlined">
        Decline
      </Button>
    </Box>
  );

  const messageBodySx = {
    color: 'text.secondary',
    '& p': { m: 0, typography: 'body2', mb: 1 },
    '& p:last-child': { mb: 0 },
    '& a': { color: 'brand.accentText', textDecoration: 'underline' },
    '& ul, & ol': { my: 0.5, pl: 2.5 },
    '& img': { maxWidth: 1, height: 'auto', borderRadius: 1 },
  };

  return (
    <>
      <ListItemButton
        disableRipple
        sx={[
          (theme) => ({
            p: 2.5,
            alignItems: 'flex-start',
            borderBottom: `dashed 1px ${theme.vars.palette.divider}`,
          }),
        ]}
      >
        {renderUnReadBadge()}
        {renderAvatar()}

        <Box sx={{ minWidth: 0, flex: '1 1 auto' }}>
          {renderText()}
          {notification.type === 'friend' && renderFriendAction()}
          {notification.type === 'project' && renderProjectAction()}
          {notification.type === 'file' && renderFileAction()}
          {notification.type === 'tags' && renderTagsAction()}
          {notification.type === 'payment' && renderPaymentAction()}
        </Box>
      </ListItemButton>

      {hasDetailDialog && (
        <Dialog
          open={detailOpen}
          onClose={handleCloseDetail}
          maxWidth="sm"
          fullWidth
          aria-labelledby="notification-dialog-title"
        >
          <DialogTitle id="notification-dialog-title">
            {notification.notificationKind === 'enrollment_rejected'
              ? 'Enrollment rejected'
              : notification.notificationKind === 'enrollment_approved'
                ? 'Enrollment approved'
                : isEnrollment
                  ? 'Enrollment update'
                  : 'Announcement'}
          </DialogTitle>
          <DialogContent dividers>
            <Box sx={{ mb: 2 }}>{readerContent(notification.title)}</Box>
            {isEnrollment ? (
              <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>
                {notification.message || 'No details were included with this notification.'}
              </Typography>
            ) : hasHtmlMessage(notification) ? (
              <Box dangerouslySetInnerHTML={{ __html: notification.message }} sx={messageBodySx} />
            ) : (
              <Typography variant="body2" color="text.secondary">
                No message was included with this announcement.
              </Typography>
            )}
            {notification.notificationKind === 'enrollment_rejected' &&
            notification.rejectionReason ? (
              <Box
                sx={{
                  mt: 2,
                  p: 2,
                  borderRadius: 1.5,
                  bgcolor: 'error.lighter',
                  border: '1px solid',
                  borderColor: 'error.light',
                }}
              >
                <Typography variant="subtitle2" color="error.dark">
                  Reason
                </Typography>
                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', mt: 0.5 }}>
                  {notification.rejectionReason}
                </Typography>
              </Box>
            ) : null}
          </DialogContent>
          <DialogActions>
            {!notification.isUnRead && onMarkUnread && !isDismissOnRead ? (
              <Button
                color="inherit"
                onClick={() => {
                  onMarkUnread(notification.id);
                }}
              >
                Mark as unread
              </Button>
            ) : null}
            <Button variant="contained" onClick={handleCloseDetail}>
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
}
