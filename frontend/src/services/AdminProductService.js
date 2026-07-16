import api from "../api/axios";

// Get Products
export const getAdminProducts = (params) => {
  return api.get("/admin/products", { params });
};

// Create Product
export const createProduct = (data) => {
  return api.post("/admin/products", data);
};

// Update Product
export const updateProduct = (id, data) => {
  return api.put(`/admin/products/${id}`, data);
};

// Delete Product
export const deleteProduct = (id) => {
  return api.delete(`/admin/products/${id}`);
};

// Toggle Product Status
export const toggleProductStatus = (id) => {
  return api.patch(`/admin/products/${id}/toggle-status`);
};