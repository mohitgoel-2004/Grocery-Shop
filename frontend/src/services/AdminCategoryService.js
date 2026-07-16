import api from "../api/axios";

// Get All Categories
export const fetchCategories = async () => {
  const res = await api.get("/categories");
  return res.data;
};

// Create Category
export const createCategory = async (category) => {
  const res = await api.post("/categories", category);
  return res.data;
};

// Update Category
export const updateCategory = async (id, category) => {
  const res = await api.put(`/categories/${id}`, category);
  return res.data;
};

// Delete Category
export const deleteCategory = async (id) => {
  const res = await api.delete(`/categories/${id}`);
  return res.data;
};