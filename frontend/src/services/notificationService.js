import api from "../api/axios";


// CUSTOMER: Get notifications
export const getNotifications = () => {
  return api.get("/notifications");
};


// CUSTOMER: Mark single read
export const markAsRead = (id) => {
  return api.patch(`/notifications/${id}/read`);
};


// CUSTOMER: Mark all read
export const markAllRead = () => {
  return api.patch("/notifications/read-all");
};


// CUSTOMER: Delete notification
export const deleteNotification = (id) => {
  return api.delete(`/notifications/${id}`);
};


// ADMIN: Send notification
export const sendNotification = (data) => {
  return api.post("/notifications/send", data);
};