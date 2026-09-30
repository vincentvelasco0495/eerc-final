import { useState, useEffect, useCallback } from 'react';

import { usePathname } from 'src/routes/hooks';

import axios from 'src/lib/axios';
import { _notifications } from 'src/_mock';
import { lmsEndpoints } from 'src/redux/api/lmsEndpoints';

import { useAuthContext } from 'src/auth/hooks';

import NotificationsDrawer from '../components/notifications-drawer';

// ----------------------------------------------------------------------

/**
 * Loads LMS in-app notifications when authenticated; falls back to demo data otherwise.
 */
export function LmsNotificationsDrawer(props) {
  const { authenticated } = useAuthContext();
  const pathname = usePathname();
  const [data, setData] = useState(() => (authenticated ? [] : _notifications));

  const fetchNotifications = useCallback(async () => {
    if (!authenticated) {
      setData(_notifications);
      return;
    }

    try {
      const res = await axios.get(lmsEndpoints.notifications());
      const rows = Array.isArray(res.data?.data) ? res.data.data : [];
      setData(rows);
    } catch {
      setData([]);
    }
  }, [authenticated]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      if (!authenticated) {
        setData(_notifications);
        return;
      }

      try {
        const res = await axios.get(lmsEndpoints.notifications());
        const rows = Array.isArray(res.data?.data) ? res.data.data : [];
        if (!cancelled) {
          setData(rows);
        }
      } catch {
        if (!cancelled) {
          setData([]);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [authenticated, pathname]);

  const handleMarkAllAsRead = useCallback(async () => {
    if (!authenticated) {
      return;
    }
    setData((prev) => prev.filter((n) => !n.removeOnRead).map((n) => ({ ...n, isUnRead: false })));
    try {
      await axios.patch(lmsEndpoints.notificationsReadAll());
      await fetchNotifications();
    } catch {
      try {
        const res = await axios.get(lmsEndpoints.notifications());
        setData(Array.isArray(res.data?.data) ? res.data.data : []);
      } catch {
        /* ignore */
      }
    }
  }, [authenticated, fetchNotifications]);

  const handleMarkNotificationRead = useCallback(
    async (publicId) => {
      if (!authenticated) {
        return;
      }

      const current = data.find((item) => item.id === publicId);
      if (current?.removeOnRead) {
        setData((prev) => prev.filter((n) => n.id !== publicId));
      } else {
        setData((prev) =>
          prev.map((n) => (n.id === publicId ? { ...n, isUnRead: false } : n))
        );
      }

      try {
        const res = await axios.patch(lmsEndpoints.notificationMarkRead(publicId));
        if (res.data?.removed) {
          setData((prev) => prev.filter((n) => n.id !== publicId));
        }
      } catch {
        try {
          const res = await axios.get(lmsEndpoints.notifications());
          setData(Array.isArray(res.data?.data) ? res.data.data : []);
        } catch {
          /* ignore */
        }
      }
    },
    [authenticated, data]
  );

  const handleMarkNotificationUnread = useCallback(
    async (publicId) => {
      if (!authenticated) {
        return;
      }
      setData((prev) =>
        prev.map((n) => (n.id === publicId ? { ...n, isUnRead: true } : n))
      );
      try {
        await axios.patch(lmsEndpoints.notificationMarkUnread(publicId));
      } catch {
        try {
          const res = await axios.get(lmsEndpoints.notifications());
          setData(Array.isArray(res.data?.data) ? res.data.data : []);
        } catch {
          /* ignore */
        }
      }
    },
    [authenticated]
  );

  return (
    <NotificationsDrawer
      {...props}
      data={data}
      onDrawerOpen={authenticated ? fetchNotifications : undefined}
      onMarkAllAsRead={authenticated ? handleMarkAllAsRead : undefined}
      onMarkNotificationRead={authenticated ? handleMarkNotificationRead : undefined}
      onMarkNotificationUnread={authenticated ? handleMarkNotificationUnread : undefined}
    />
  );
}
