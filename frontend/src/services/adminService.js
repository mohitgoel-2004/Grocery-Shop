import api from "../api/axios";

/**
 * Admin Login
 */
 export const loginAdmin = async (email, password) => {
  const response = await api.post("/admin/login", {
    email,
    password,
  });

  return response.data;
};

/**
 * Get Logged In Admin Profile
 */
export const getAdminProfile = async () => {
  const response = await api.get("/admin/profile");

  return response.data;
};

/**
 * Logout Admin
 */
export const logoutAdmin = async () => {
  const response = await api.post("/admin/logout");

  return response.data;
};

