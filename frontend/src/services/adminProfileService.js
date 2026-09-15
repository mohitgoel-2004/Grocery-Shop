import api from "../api/axios";

// Get Profile
export const getAdminProfile = async () => {
  const res = await api.get("/admin/profile");
  return res.data;
};

// Update Profile
export const updateProfile = async (data) => {
  const res = await api.put("/admin/profile", data);
  return res.data;
};

// Change Password
export const changePassword = async (data) => {
  const res = await api.put("/admin/profile/password", data);
  return res.data;
};

export const uploadProfileImage = async (formData) => {
  const payload = formData instanceof FormData ? formData : (() => {
    const data = new FormData();
    data.append("image", formData);
    return data;
  })();

  const res = await api.put("/admin/profile/image", payload);

  return res.data;
};