import { useState, useEffect, useCallback } from 'react';

import { usePathname } from 'src/routes/hooks';

import axios from 'src/lib/axios';
import { lmsEndpoints } from 'src/redux/api/lmsEndpoints';

import { useAuthContext } from 'src/auth/hooks';
import { normalizeUserRole } from 'src/auth/utils/role';

import NotificationsDrawer from '../components/notifications-drawer';

const STUDENT_NOTIFICATION_KINDS = new Set([
  'announcement',
  'enrollment_approved',
  'enrollment_rejected',
  'enrollment_on_hold',
]);

function isStudentFacingNotification(item) {
  const kind = String(item?.notificationKind ?? item?.kind ?? '').trim();
  if (STUDENT_NOTIFICATION_KINDS.has(kind)) {
    return true;
  }
  return String(item?.category ?? '').trim() === 'Announcement';
}

function rowsFromResponse(res) {
  return Array.isArray(res?.data?.data) ? res.data.data : [];
}

function filterRowsForRole(rows, role) {
  if (normalizeUserRole(role) !== 'student') {
    return rows;
  }
  return rows.filter(isStudentFacingNotification);
}

/**
 * In-app LMS notifications for the signed-in account. Guests see no bell.
 * Students only receive enrollment / announcement items for their own account.
 */
export function LmsNotificationsDrawer(props) {
  const { authenticated, user } = useAuthContext();
  const pathname = usePathname();
  const [data, setData] = useState([]);

  const applyRows = useCallback(
    (rows) => {
      setData(filterRowsForRole(Array.isArray(rows) ? rows : [], user?.role));
    },
    [user?.role]
  );

  const fetchNotifications = useCallback(async () => {
    if (!authenticated) {
      setData([]);
      return;
    }

    try {
      const res = await axios.get(lmsEndpoints.notifications());
      applyRows(rowsFromResponse(res));
    } catch {
      setData([]);
    }
  }, [authenticated, applyRows]);

  useEffect(() => {
    let cancelled = false;

    if (!authenticated) {
      setData([]);
      return undefined;
    }

    (async () => {
      try {
        const res = await axios.get(lmsEndpoints.notifications());
        if (!cancelled) {
          applyRows(rowsFromResponse(res));
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
  }, [authenticated, applyRows, pathname]);

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
        applyRows(rowsFromResponse(res));
      } catch {
        /* ignore */
      }
    }
  }, [authenticated, applyRows, fetchNotifications]);

  const handleMarkNotificationRead = useCallback(
    async (publicId) => {
      if (!authenticated) {
        return;
      }

      const current = data.find((item) => item.id === publicId);
      if (current?.removeOnRead) {
        setData((prev) => prev.filter((n) => n.id !== publicId));
      } else {
        setData((prev) => prev.map((n) => (n.id === publicId ? { ...n, isUnRead: false } : n)));
      }

      try {
        const res = await axios.patch(lmsEndpoints.notificationMarkRead(publicId));
        if (res.data?.removed) {
          setData((prev) => prev.filter((n) => n.id !== publicId));
        }
      } catch {
        try {
          const res = await axios.get(lmsEndpoints.notifications());
          applyRows(rowsFromResponse(res));
        } catch {
          /* ignore */
        }
      }
    },
    [authenticated, applyRows, data]
  );

  const handleMarkNotificationUnread = useCallback(
    async (publicId) => {
      if (!authenticated) {
        return;
      }
      setData((prev) => prev.map((n) => (n.id === publicId ? { ...n, isUnRead: true } : n)));
      try {
        await axios.patch(lmsEndpoints.notificationMarkUnread(publicId));
      } catch {
        try {
          const res = await axios.get(lmsEndpoints.notifications());
          applyRows(rowsFromResponse(res));
        } catch {
          /* ignore */
        }
      }
    },
    [authenticated, applyRows]
  );

  if (!authenticated) {
    return null;
  }

  return (
    <NotificationsDrawer
      {...props}
      data={data}
      onDrawerOpen={fetchNotifications}
      onMarkAllAsRead={handleMarkAllAsRead}
      onMarkNotificationRead={handleMarkNotificationRead}
      onMarkNotificationUnread={handleMarkNotificationUnread}
    />
  );
}
