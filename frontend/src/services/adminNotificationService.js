import api from "../api/axios";

// ==========================================
// GET ADMIN NOTIFICATIONS
// ==========================================

export const getAdminNotifications = async () => {
  const res = await api.get("/notifications/admin");
  return res.data;
};

// ==========================================
// MARK ONE AS READ
// ==========================================

export const markAdminNotificationAsRead = async (id) => {
  const res = await api.patch(
    `/notifications/${id}/read`
  );

  return res.data;
};

// ==========================================
// MARK ALL AS READ
// ==========================================

export const markAllAdminNotificationsRead = async () => {
  const res = await api.patch(
    "/notifications/read-all"
  );

  return res.data;
};

// ==========================================
// DELETE ONE
// ==========================================

export const deleteAdminNotification = async (id) => {
  const res = await api.delete(
    `/notifications/${id}`
  );

  return res.data;
};