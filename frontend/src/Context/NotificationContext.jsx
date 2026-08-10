import React, { createContext, useContext, useEffect, useState } from "react";
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
 const unreadCount = notifications.filter(n => !n.isRead).length;

  // Fetch notifications
const fetchNotifications = async () => {
  try {
    setLoading(true);

    const res = await getNotifications();

    console.log("NOTIFICATION API =", res.data);

    setNotifications(res.data.notifications || []);
  } catch (err) {
    console.log(err);

    toast.error("Failed to load notifications");
    setNotifications([]);
  } finally {
    setLoading(false);
  }
};

  // Mark single as read
  const readNotification = async (id) => {
    try {
      await markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) =>
          n._id === id ? { ...n, isRead: true } : n
        )
      );
    } catch (err) {
      toast.error("Error updating notification");
    }
  };

  // Mark all as read
 const readAll = async () => {
  try {
    await markAllRead();

    setNotifications((prev) =>
      prev.map((n) => ({
        ...n,
        isRead: true,
      }))
    );

    toast.success("All notifications marked as read");
  } catch (err) {
    toast.error("Error updating notifications");
  }
};

  // Delete notification
  const removeNotification = async (id) => {
    try {
      await deleteNotification(id);
      setNotifications((prev) =>
        prev.filter((n) => n._id !== id)
      );
      toast.success("Notification deleted");
    } catch (err) {
      toast.error("Error deleting notification");
    }
  };

useEffect(() => {
  const isAdminRoute = window.location.pathname.startsWith("/admin");

  if (isAdminRoute) {
    return;
  }

  fetchNotifications();
}, []);

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