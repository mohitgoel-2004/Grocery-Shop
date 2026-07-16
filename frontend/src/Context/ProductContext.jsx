import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
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

 useEffect(() => {
  loadProducts();
}, [
  currentPage,
  searchTerm,
  filterCategory,
  filterStatus,
]);

  // ---------------- LOAD PRODUCTS ----------------

 const loadProducts = async () => {
  try {
    setLoading(true);
    setError("");

    const response = await productService.getAdminProducts({
      page: currentPage,
      limit: itemsPerPage,
      search: searchTerm,
      category: filterCategory,
      status: filterStatus,
    });

    // console.log("Product API Response:", response);

    // ApiResponse.success() ke andar actual data
    const data = response.data?.data || response.data || response;

    
    setProducts(data.products || []);
    setTotalPages(data.totalPages || 1);
    setTotalProducts(data.total || 0);

  } catch (err) {
    console.error(err);
    setProducts([]);
    setError(err.response?.data?.message || err.message);
  } finally {
    setLoading(false);
  }
};

  // ---------------- FILTER ----------------

  // const filteredProducts = useMemo(() => {
  //   if (!Array.isArray(products)) return [];

  //   return products.filter((p) => {
  //     const search = searchTerm.toLowerCase();

  //     const matchSearch =
  //       (p?.name || "").toLowerCase().includes(search) ||
  //       (p?.sku || "").toLowerCase().includes(search);

  //     const matchCategory = filterCategory
  //       ? p.category === filterCategory
  //       : true;

  //     const matchStatus = filterStatus
  //       ? p.status === filterStatus
  //       : true;

  //     return matchSearch && matchCategory && matchStatus;
  //   });
  // }, [products, searchTerm, filterCategory, filterStatus]);

  // ---------------- PAGINATION ----------------

  // const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  // const paginatedProducts = filteredProducts.slice(
  //   (currentPage - 1) * itemsPerPage,
  //   currentPage * itemsPerPage
  // );

  // ---------------- CRUD ----------------

  const addProduct = async (product) => {
    await productService.createProduct(product);
await loadProducts();
  };

 const updateProduct = async (id, product) => {
  await productService.updateProduct(id, product);
  await loadProducts();
};

  const deleteProduct = async (id) => {
   await productService.deleteProduct(id);
await loadProducts();
  };

 const toggleProductStatus = async (id) => {
  await productService.toggleProductStatus(id);
  await loadProducts();
};

  const resetFilters = () => {
    setSearchTerm("");
    setFilterCategory("");
    setFilterStatus("");
    setCurrentPage(1);
  };

  const value = {
   products,
allProducts: products,
totalProducts,

    loading,
    error,

    searchTerm,
    setSearchTerm,

    filterCategory,
    setFilterCategory,

    filterStatus,
    setFilterStatus,

    currentPage,
    setCurrentPage,

    totalPages,
    itemsPerPage,

    loadProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleProductStatus,
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