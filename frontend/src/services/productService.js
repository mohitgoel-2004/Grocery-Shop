import api from "../api/axios";

export const fetchProducts = async (params = {}) => {
  const response = await api.get("/products", { params });
  return response.data;
};

export const fetchProductById = async (id) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

export const fetchCategories = async () => {
  const response = await api.get("/categories");
  return response.data;
};

// Get Products
export const getAdminProducts = async (params = {}) => {
  const response = await api.get("/admin/products", { params });
  return response.data;
};

// Get Single Product
export const getAdminProductById = async (id) => {
  const response = await api.get(`/admin/products/${id}`);
  return response.data;
};

// Add Product
export const createProduct = async (productData) => {
  const response = await api.post("/admin/products", productData);
  return response.data;
};

// Update Product
export const updateProduct = async (id, productData) => {
  const response = await api.put(`/admin/products/${id}`, productData);
  return response.data;
};

// Delete Product
export const deleteProduct = async (id) => {
  const response = await api.delete(`/admin/products/${id}`);
  return response.data;
};

// Toggle Product Status
export const toggleProductStatus = async (id) => {
  const response = await api.patch(`/admin/products/${id}/status`);
  return response.data;
};