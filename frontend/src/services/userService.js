import api from "../api/axios";

export const fetchProfile = async () => {
  const response = await api.get("/user/profile");
  return response.data;
};

export const updateLocation = async (address) => {
  const response = await api.put("/user/location", { address });
  return response.data;
};

export const updateProfile = async (payload) => {
  const response = await api.put("/user/profile", payload);
  return response.data;
};