
// import api from "../api/axios";

// // ================================
// // ADMIN PRODUCT API SERVICE
// // ================================

// // Get paginated/filterable products
// export const getAdminProducts = (params = {}) => {
//   return api.get("/admin/products", {
//     params,
//   });
// };

// // Get single product
// export const getAdminProductById = (id) => {
//   return api.get(`/admin/products/${id}`);
// };

// // Create product
// export const createProduct = (data) => {
//   return api.post("/admin/products", data);
// };

// // Update product
// export const updateProduct = (id, data) => {
//   return api.put(`/admin/products/${id}`, data);
// };

// // Delete product
// export const deleteProduct = (id) => {
//   return api.delete(`/admin/products/${id}`);
// };

// // Toggle product status
// // Backend route: PATCH /api/admin/products/:id/status
// export const toggleProductStatus = (id) => {
//   return api.patch(`/admin/products/${id}/status`);
// };


import api from "../api/axios";

// ==========================================
// ADMIN PRODUCT API SERVICE
// ==========================================

// Get paginated / filtered products
export const getAdminProducts = (params = {}) => {
  return api.get("/admin/products", {
    params,
  });
};

// Get single product
export const getAdminProductById = (id) => {
  return api.get(`/admin/products/${id}`);
};

// Create product
export const createProduct = (data) => {
  return api.post("/admin/products", data);
};

// Update product
export const updateProduct = (id, data) => {
  return api.put(`/admin/products/${id}`, data);
};

// Delete product
export const deleteProduct = (id) => {
  return api.delete(`/admin/products/${id}`);
};

// Toggle product status
// Backend route:
// PATCH /api/admin/products/:id/status
export const toggleProductStatus = (id) => {
  return api.patch(`/admin/products/${id}/status`);
};

// ==========================================
// BULK IMPORT PRODUCTS
// ==========================================

export const bulkImportProducts = async (file) => {
  const formData = new FormData();

  formData.append("file", file);

  const response = await api.post(
    "/admin/products/bulk-import",
    formData
  );

  return response.data;
};