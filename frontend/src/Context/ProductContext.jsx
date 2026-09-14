import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import * as productService from "../services/AdminProductService";

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  // ==========================================
  // LOAD PRODUCTS
  // ==========================================

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await productService.getAdminProducts({
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm.trim(),
        category: filterCategory,
        status: filterStatus,
      });

      console.log("🔥 ADMIN PRODUCTS RESPONSE:", response);
      console.log("🔥 RESPONSE DATA:", response?.data);

      const data =
        response?.data?.data ||
        response?.data ||
        response ||
        {};

      const fetchedProducts = Array.isArray(data.products)
        ? data.products
        : [];

      setProducts(fetchedProducts);

      setTotalPages(Number(data.totalPages) || 1);
      setTotalProducts(Number(data.total) || 0);
    } catch (err) {
      console.error("LOAD PRODUCTS ERROR:", err);

      setProducts([]);
      setTotalPages(1);
      setTotalProducts(0);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load products"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // REFRESH PRODUCTS
  // ==========================================
  // Same loadProducts function, but exposed
  // separately for manual refresh after image job.

  const refreshProducts = async () => {
    console.log("🔄 Refreshing admin products...");

    await loadProducts();

    console.log("✅ Admin products refreshed");
  };

  // ==========================================
  // LOAD WHEN FILTER/PAGE CHANGES
  // ==========================================

  useEffect(() => {
    loadProducts();
  }, [
    currentPage,
    searchTerm,
    filterCategory,
    filterStatus,
  ]);

  // ==========================================
  // GET SINGLE PRODUCT
  // ==========================================

  const getProductById = async (id) => {
    try {
      const response =
        await productService.getAdminProductById(id);

      const data =
        response?.data?.data ||
        response?.data ||
        response ||
        {};

      return data.product || null;
    } catch (err) {
      console.error("GET PRODUCT ERROR:", err);

      throw new Error(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to fetch product"
      );
    }
  };

  // ==========================================
  // ADD PRODUCT
  // ==========================================

  const addProduct = async (product) => {
    try {
      setError("");

      await productService.createProduct(product);

      setCurrentPage(1);

      if (currentPage === 1) {
        await loadProducts();
      }
    } catch (err) {
      console.error("ADD PRODUCT ERROR:", err);

      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to create product";

      setError(message);

      throw err;
    }
  };

  // ==========================================
  // UPDATE PRODUCT
  // ==========================================

  const updateProduct = async (id, product) => {
    try {
      setError("");

      await productService.updateProduct(id, product);

      await loadProducts();
    } catch (err) {
      console.error("UPDATE PRODUCT ERROR:", err);

      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to update product";

      setError(message);

      throw err;
    }
  };

  // ==========================================
  // DELETE PRODUCT
  // ==========================================

  const deleteProduct = async (id) => {
    try {
      setError("");

      await productService.deleteProduct(id);

      await loadProducts();

      if (
        currentPage > 1 &&
        products.length === 1 &&
        currentPage > totalPages
      ) {
        setCurrentPage((page) => Math.max(page - 1, 1));
      }
    } catch (err) {
      console.error("DELETE PRODUCT ERROR:", err);

      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to delete product";

      setError(message);

      throw err;
    }
  };

  // ==========================================
  // TOGGLE STATUS
  // ==========================================

  const toggleProductStatus = async (id) => {
    try {
      setError("");

      await productService.toggleProductStatus(id);

      await loadProducts();
    } catch (err) {
      console.error("TOGGLE STATUS ERROR:", err);

      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to update product status";

      setError(message);

      throw err;
    }
  };

  // ==========================================
  // AUTO FETCH PRODUCT IMAGES
  // ==========================================

  const autoFetchProductImages = async () => {
    try {
      setError("");

      // Call the service function to trigger image fetching on backend
      await productService.autoFetchProductImages();

      await loadProducts();
    } catch (err) {
      console.error("AUTO FETCH IMAGES ERROR:", err);

      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to fetch product images";

      setError(message);

      throw err;
    }
  };

  // ==========================================
  // RESET FILTERS
  // ==========================================

  const resetFilters = () => {
    setSearchTerm("");
    setFilterCategory("");
    setFilterStatus("");
    setCurrentPage(1);
  };

  // ==========================================
  // CONTEXT VALUE
  // ==========================================

  const value = {
    // Products
    products,

    // Backward compatibility
    allProducts: products,

    totalProducts,

    // State
    loading,
    error,

    // Search
    searchTerm,
    setSearchTerm,

    // Category filter
    filterCategory,
    setFilterCategory,

    // Status filter
    filterStatus,
    setFilterStatus,

    // Pagination
    currentPage,
    setCurrentPage,
    totalPages,
    itemsPerPage,

    // APIs
    loadProducts,
    refreshProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleProductStatus,

    // Filters
    resetFilters,
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);

  if (!context) {
    throw new Error(
      "useProducts must be used within ProductProvider"
    );
  }

  return context;
};