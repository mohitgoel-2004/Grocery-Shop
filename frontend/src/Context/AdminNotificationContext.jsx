import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import toast from "react-hot-toast";

import {
  getAdminNotifications,
  markAdminNotificationAsRead,
  markAllAdminNotificationsRead,
  deleteAdminNotification,
} from "../services/adminNotificationService";

const AdminNotificationContext = createContext();

export const useAdminNotification = () =>
  useContext(AdminNotificationContext);

export const AdminNotificationProvider = ({
  children,
}) => {
  const [notifications, setNotifications] =
    useState([]);

  const [loading, setLoading] = useState(false);

  // ==========================================
  // UNREAD COUNT
  // ==========================================

  const unreadCount = notifications.filter(
    (notification) => !notification.isRead
  ).length;

  // ==========================================
  // FETCH
  // ==========================================

  const fetchAdminNotifications = async () => {
    try {
      setLoading(true);

      const res = await getAdminNotifications();

      console.log(
        "ADMIN NOTIFICATION RESPONSE:",
        res.data
      );

      const data =
        res?.data?.data?.notifications ||
        res?.data?.notifications ||
        [];

      setNotifications(data);
    } catch (error) {
      console.error(
        "ADMIN NOTIFICATION ERROR:",
        error
      );

      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // MARK ONE READ
  // ==========================================

  const readAdminNotification = async (id) => {
    try {
      await markAdminNotificationAsRead(id);

      setNotifications((prev) =>
        prev.map((notification) =>
          String(notification._id) === String(id)
            ? {
                ...notification,
                isRead: true,
              }
            : notification
        )
      );
    } catch (error) {
      console.error(error);

      toast.error(
        "Error updating notification"
      );
    }
  };

  // ==========================================
  // MARK ALL READ
  // ==========================================

  const readAllAdminNotifications = async () => {
    try {
      await markAllAdminNotificationsRead();

      setNotifications((prev) =>
        prev.map((notification) => ({
          ...notification,
          isRead: true,
        }))
      );

      toast.success(
        "All notifications marked as read"
      );
    } catch (error) {
      console.error(error);

      toast.error(
        "Error updating notifications"
      );
    }
  };

  // ==========================================
  // DELETE
  // ==========================================

  const removeAdminNotification = async (id) => {
    try {
      await deleteAdminNotification(id);

      setNotifications((prev) =>
        prev.filter(
          (notification) =>
            String(notification._id) !==
            String(id)
        )
      );

      toast.success(
        "Notification deleted"
      );
    } catch (error) {
      console.error(error);

      toast.error(
        "Error deleting notification"
      );
    }
  };

  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    const isAdminRoute =
      window.location.pathname.startsWith(
        "/admin"
      );

    if (isAdminRoute) {
      fetchAdminNotifications();
    }
  }, []);

  return (
    <AdminNotificationContext.Provider
      value={{
        notifications,
        loading,
        unreadCount,

        fetchAdminNotifications,

        readAdminNotification,
        readAllAdminNotifications,
        removeAdminNotification,
      }}
    >
      {children}
    </AdminNotificationContext.Provider>
  );
};