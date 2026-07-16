import api from "../api/axios";
const API_URL = "http://10.77.245.168:5000/api/addresses";

const getToken = () =>
  localStorage.getItem("customerToken") ||
  localStorage.getItem("token");

const authConfig = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

// ==========================
// Get All Addresses
// ==========================
// export const getAddresses = () => {
//   return axios.get(API_URL, authConfig());
// };
export const getAddresses = () => api.get("/addresses");

export const createAddress = (data) =>
  api.post("/addresses", data);

export const updateAddress = (id, data) =>
  api.put(`/addresses/${id}`, data);

export const deleteAddress = (id) =>
  api.delete(`/addresses/${id}`);

export const updateDefaultAddress = (id) =>
  api.patch(`/addresses/default/${id}`);