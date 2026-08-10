import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import * as categoryService from "../services/AdminCategoryService";


const CategoryContext = createContext();

export const CategoryProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    loadCategories();
  }, []);

const loadCategories = async () => {
  try {
    setLoading(true);

    const res = await categoryService.fetchCategories();

    console.log("========== CATEGORY DEBUG ==========");
    console.log("FULL RESPONSE:", res);
    console.log("DATA:", res?.data);
    console.log("CATEGORIES:", res?.data?.categories);
    console.log("FIRST CATEGORY:", res?.data?.categories?.[0]);
    console.log(
      "PRODUCT COUNT:",
      res?.data?.categories?.[0]?.productCount
    );
    console.log("====================================");

    const data = res?.data?.categories || [];

    setCategories(data);
  } catch (err) {
    console.error("CATEGORY FETCH ERROR:", err);
  } finally {
    setLoading(false);
  }
};

  // Add

 const addCategory = async (category) => {
  const res = await categoryService.createCategory(category);

  const newCategory =
    res.data ||
    res.category ||
    res;

  setCategories((prev) => [newCategory, ...prev]);
};
  // Update

 const updateCategory = async (id, category) => {
  const res = await categoryService.updateCategory(id, category);

  const updated =
    res?.data ||
    res?.category ||
    res;

  setCategories((prev) =>
    prev.map((item) =>
      String(item._id) === String(id) ? updated : item
    )
  );
};
  // Delete

 const deleteCategory = async (id) => {
  await categoryService.deleteCategory(id);

  setCategories((prev) =>
    prev.filter((item) => String(item._id) !== String(id))
  );
};

  // Toggle Status

const toggleStatus = async (id) => {
  const category = categories.find((c) => c._id === id);

  if (!category) return;

  const res = await categoryService.updateCategory(id, {
    ...category,
    status: category.status === "active" ? "inactive" : "active",
  });

  console.log("Toggle API Response:", res);

  const updated =
    res?.data?.category ||
    res?.category ||
    res;

  console.log("Updated Category:", updated);

  setCategories((prev) =>
    prev.map((item) =>
      item._id === id ? updated : item
    )
  );
};

  const filteredCategories = categories.filter((item) => {
    const matchSearch = item.name
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchStatus = statusFilter
      ? item.status === statusFilter
      : true;

    return matchSearch && matchStatus;
  });

  return (
    <CategoryContext.Provider
      value={{
        categories: filteredCategories,
        allCategories: categories,

        loading,
        error,

        searchTerm,
        setSearchTerm,

        statusFilter,
        setStatusFilter,

        loadCategories,

        addCategory,
        updateCategory,
        deleteCategory,
        toggleStatus,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategories = () => {
  const context = useContext(CategoryContext);

  if (!context) {
    throw new Error(
      "useCategories must be used within CategoryProvider"
    );
  }

  return context;
};