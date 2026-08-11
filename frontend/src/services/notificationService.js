import api from "../api/axios";

// ========================================
// CUSTOMER
// ========================================

export const getNotifications = () => {
  return api.get("/notifications");
};

export const markAsRead = (id) => {
  return api.patch(`/notifications/${id}/read`);
};

export const markAllRead = () => {
  return api.patch("/notifications/read-all");
};

export const deleteNotification = (id) => {
  return api.delete(`/notifications/${id}`);
};

// ========================================
// ADMIN
// ========================================

export const getAdminNotifications = () => {
  return api.get("/notifications/admin");
};

export const markAdminNotificationAsRead = (id) => {
  return api.patch(
    `/notifications/admin/${id}/read`
  );
};

// ========================================
// ADMIN SEND TO CUSTOMER
// ========================================

export const sendNotification = (data) => {
  return api.post("/notifications/send", data);
};