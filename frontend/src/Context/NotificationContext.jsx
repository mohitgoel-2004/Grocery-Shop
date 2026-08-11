import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  getNotifications,
  markAsRead,
  markAllRead,
  deleteNotification,
} from "../services/notificationService";

import toast from "react-hot-toast";

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  // ============================================
  // UNREAD COUNT
  // ============================================
  const unreadCount = notifications.filter(
    (notification) => !notification.isRead
  ).length;

  // ============================================
  // FETCH NOTIFICATIONS
  // ============================================
  const fetchNotifications = async () => {
    try {
      setLoading(true);

      const res = await getNotifications();

      console.log("NOTIFICATION API =", res.data);

      const notificationData = res.data?.notifications;

      if (Array.isArray(notificationData)) {
        setNotifications(notificationData);
      } else {
        setNotifications([]);
      }
    } catch (err) {
      console.error("FETCH NOTIFICATIONS ERROR =", err);

      toast.error("Failed to load notifications");

      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // MARK SINGLE NOTIFICATION AS READ
  // ============================================
  const readNotification = async (id) => {
    try {
      await markAsRead(id);

      setNotifications((prev) =>
        prev.map((notification) =>
          notification._id === id
            ? {
                ...notification,
                isRead: true,
              }
            : notification
        )
      );
    } catch (err) {
      console.error("READ NOTIFICATION ERROR =", err);

      toast.error("Error updating notification");
    }
  };

  // ============================================
  // MARK ALL NOTIFICATIONS AS READ
  // ============================================
  const readAll = async () => {
    try {
      await markAllRead();

      setNotifications((prev) =>
        prev.map((notification) => ({
          ...notification,
          isRead: true,
        }))
      );

      toast.success("All notifications marked as read");
    } catch (err) {
      console.error("MARK ALL READ ERROR =", err);

      toast.error("Error updating notifications");
    }
  };

  // ============================================
  // DELETE SINGLE NOTIFICATION
  // ============================================
  const removeNotification = async (id) => {
    try {
      // First delete from backend
      await deleteNotification(id);

      // Then immediately remove from frontend state
      setNotifications((prev) =>
        prev.filter((notification) => notification._id !== id)
      );

      toast.success("Notification deleted");
    } catch (err) {
      console.error("DELETE NOTIFICATION ERROR =", err);

      toast.error("Error deleting notification");
    }
  };

  // ============================================
  // FETCH ON CUSTOMER SIDE
  // ============================================
  useEffect(() => {
    const isAdminRoute = window.location.pathname.startsWith("/admin");

    // Don't fetch customer notifications inside admin panel
    if (isAdminRoute) {
      return;
    }

    fetchNotifications();
  }, []);

  // ============================================
  // PROVIDER
  // ============================================
  return (
    <NotificationContext.Provider
      value={{
        notifications,
        loading,
        unreadCount,

        fetchNotifications,
        readNotification,
        readAll,
        removeNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;