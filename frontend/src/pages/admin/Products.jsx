import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiPlus, FiGrid, FiList, FiArrowLeft,
  FiDollarSign, FiPercent, FiBox, FiTag, FiCalendar,  FiUpload,
} from 'react-icons/fi';

// Import all product UI components (already light-themed)
import {
  ProductSearch,
  ProductFilter,
  ProductCard,
  ProductTable,
  ProductPagination,
  ProductSkeleton,
  DeleteProductModal,
  ProductForm,
  ProductStatusBadge,
} from '../../components/admin/Product';

import { useProducts } from '../../Context/ProductContext';
import {bulkImportProducts} from "../../services/AdminProductService";

// ============================================================
// 1. ProductsPage – lists all products with search, filter, pagination
// ============================================================
export const ProductsPage = () => {
  const {
    products,
      allProducts,

     totalProducts,
    loading,
    searchTerm,
    setSearchTerm,
    filterCategory,
    setFilterCategory,
    filterStatus,
    setFilterStatus,
    currentPage,
    setCurrentPage,
    totalPages,
    deleteProduct,
    toggleProductStatus,
    resetFilters,
  } = useProducts();

  const [viewMode, setViewMode] = useState('grid');
  const [deleteProductId, setDeleteProductId] = useState(null);
  const [importing, setImporting] = useState(false);
const fileInputRef = useRef(null);

const handleBulkImport = async (e) => {
  const file = e.target.files?.[0];

  if (!file) return;

  const allowedExtensions = [".xlsx", ".xls", ".csv"];
  const extension =
    "." + file.name.split(".").pop().toLowerCase();

  if (!allowedExtensions.includes(extension)) {
    alert("Only Excel (.xlsx, .xls) or CSV files are allowed");
    e.target.value = "";
    return;
  }

  try {
    setImporting(true);

    const response = await bulkImportProducts(file);

    console.log("Bulk Import Response:", response);

    const result = response?.data;

    alert(
      `Import completed!\n\n` +
      `Total Rows: ${result?.totalRows ?? 0}\n` +
      `Valid Rows: ${result?.validRows ?? 0}\n` +
      `Inserted: ${result?.insertedRows ?? 0}\n` +
      `Invalid: ${result?.invalidRows ?? 0}`
    );

    window.location.reload();

  } catch (error) {
    console.error(
      "Bulk Import Error:",
      error
    );

    console.error(
      "Backend Error:",
      error.response?.data
    );

    alert(
      error.response?.data?.message ||
      "Failed to import products"
    );
  } finally {
    setImporting(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }
};

  const handleDelete = (id) => setDeleteProductId(id);
  const confirmDelete = () => {
    if (deleteProductId) {
      deleteProduct(deleteProductId);
      setDeleteProductId(null);
    }
  };

  const navigate = useNavigate();
  const handleEdit = (product) => {
    navigate(`/admin/products/edit/${product._id || product.id}`);
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 pb-24 sm:p-6 sm:pb-6">
      {/* ===== Header with Filters & Total Products (Mobile-friendly) ===== */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h4 className="flex items-center gap-2 text-2xl font-extrabold text-slate-900">
              <FiTag className="text-emerald-500" />
              Product Management
            </h4>
          </div>
          <div className="flex items-center justify-between gap-3 lg:justify-end">
              {/* Import Excel / CSV */}
  <div>
    <input
      ref={fileInputRef}
      type="file"
      accept=".xlsx,.xls,.csv"
      onChange={handleBulkImport}
      className="hidden"
    />

    <button
      type="button"
      onClick={() => fileInputRef.current?.click()}
      disabled={importing}
      className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <FiUpload size={16} />

      {importing ? "Importing..." : "Import Products"}
    </button>
  </div>
           <div className="hidden items-center gap-1 md:flex">
  {/* Grid View */}
  <button
    onClick={() => setViewMode("grid")}
    className={`rounded-xl border p-2 ${
      viewMode === "grid"
        ? "border-emerald-300 bg-emerald-100 text-emerald-700"
        : "border-slate-200 text-slate-500 hover:bg-slate-50"
    } transition`}
    aria-label="Grid view"
  >
    <FiGrid size={16} />
  </button>

  {/* Table View */}
  <button
    onClick={() => setViewMode("table")}
    className={`rounded-xl border p-2 ${
      viewMode === "table"
        ? "border-emerald-300 bg-emerald-100 text-emerald-700"
        : "border-slate-200 text-slate-500 hover:bg-slate-50"
    } transition`}
    aria-label="Table view"
  >
    <FiList size={16} />
  </button>
</div>
            <span className="whitespace-nowrap text-sm font-semibold text-slate-500">
              Total Products:
              <span className="ml-2 font-bold text-emerald-600">
               {totalProducts}
              </span>
            </span>
          </div>
        </div>

        {/* Top row: filters and total count */}
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex w-full flex-wrap items-center gap-4">
            {/* Filter dropdowns – using ProductFilter component but we'll style it inline */}
            <ProductFilter
              filterCategory={filterCategory}
              setFilterCategory={setFilterCategory}
              filterStatus={filterStatus}
              setFilterStatus={setFilterStatus}
              resetFilters={resetFilters}
            />
          </div>
        </div>

        {/* Search bar – full width below filters */}
        <div className="w-full">
          <ProductSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </div>
      </div>

      {/* ===== Floating Add Button (Mobile only) ===== */}
      <Link
        to="/admin/products/add"
        className="fixed bottom-24 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-linear-to-r from-emerald-500 to-emerald-600 text-white shadow-xl shadow-emerald-300/50 transition-transform hover:scale-105"
        aria-label="Add Product"
      >
        <FiPlus size={28} />
      </Link>

      {/* ===== Product List ===== */}
      {loading ? (
        <ProductSkeleton count={8} />
      ) : allProducts.length === 0 ? (
        <div className="rounded-3xl border border-slate-100 bg-white py-16 text-center shadow-sm">
          <p className="text-slate-400">
            No products found. Try adjusting your filters.
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 justify-items-center gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3 2xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard
              key={product._id || product.id}
              product={product}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggleStatus={toggleProductStatus}
            />
          ))}
        </div>
      ) : (
        <ProductTable
          products={products}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleStatus={toggleProductStatus}
        />
      )}

      <ProductPagination
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />

      <DeleteProductModal
        isOpen={!!deleteProductId}
        onClose={() => setDeleteProductId(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

// ============================================================
// 2. AddProductPage – form to add a new product
// ============================================================
export const AddProductPage = () => {
  const navigate = useNavigate();
  const { addProduct } = useProducts();

  const handleSubmit = async (data) => {
    await addProduct(data);
    navigate("/admin/products");
  };

  return (
    <div className="mx-auto max-w-3xl p-4 sm:p-6">
      <div className="mb-6 flex items-center gap-3">
        <Link
          to="/admin/products"
          className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-emerald-600"
        >
          <FiArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-extrabold text-slate-900">Add New Product</h1>
      </div>
      <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
        <ProductForm
          onSubmit={handleSubmit}
          onCancel={() => navigate('/admin/products')}
          submitLabel="Add Product"
        />
      </div>
    </div>
  );
};

// ============================================================
// 3. EditProductPage – form to edit an existing product
// ============================================================
export const EditProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    products,
    getProductById,
    updateProduct,
    loading,
  } = useProducts();

  const [product, setProduct] = useState(null);

  useEffect(() => {
    const found = products.find(
      p => String(p._id || p.id) === String(id)
    );

    if (found) {
      setProduct(found);
    }
  }, [id, products]);

  if (loading) return <div className="p-6 text-gray-600">Loading...</div>;
  if (!product) return <div className="p-6 text-gray-600">Product not found</div>;

  const handleSubmit = async (data) => {
    await updateProduct(product._id || product.id, data);
    navigate("/admin/products");
  };

  return (
    <div className="mx-auto max-w-3xl p-4 sm:p-6">
      <div className="mb-6 flex items-center gap-3">
        <Link
          to="/admin/products"
          className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-emerald-600"
        >
          <FiArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-extrabold text-slate-900">Edit Product</h1>
      </div>
      <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
        <ProductForm
          initialData={product}
          onSubmit={handleSubmit}
          onCancel={() => navigate('/admin/products')}
          submitLabel="Update Product"
        />
      </div>
    </div>
  );
};

// ============================================================
// 4. ProductDetailsPage – view full product details
// ============================================================
export const ProductDetailsPage = () => {
  const { id } = useParams();
  const { products, loading } = useProducts();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const found = products.find(
      p => String(p._id || p.id) === String(id)
    );
    setProduct(found);
  }, [id, products]);

  if (loading) return <div className="p-6 text-gray-600">Loading...</div>;
  if (!product) return <div className="p-6 text-gray-600">Product not found</div>;

  return (
    <div className="mx-auto max-w-3xl p-4 sm:p-6">
      <Link
        to="/admin/products"
        className="mb-6 inline-flex items-center gap-2 text-slate-500 transition hover:text-emerald-600"
      >
        <FiArrowLeft size={18} /> Back to Products
      </Link>

      <div className="space-y-6 rounded-3xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">{product.name}</h1>
            <p className="mt-1 text-sm text-slate-500">
              {product.category?.name || product.category} • {product.brand?.name || product.brand}
            </p>
          </div>
          <ProductStatusBadge status={product.status} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-slate-700">
              <FiDollarSign className="text-emerald-500" size={18} />
              <span>Price:</span>
              <span className="font-bold text-slate-900">₹{product.price}</span>
            </div>
            {product.discount > 0 && (
              <div className="flex items-center gap-2 text-slate-700">
                <FiPercent className="text-emerald-500" size={18} />
                <span>Discount:</span>
                <span className="font-bold text-slate-900">{product.discount}%</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-slate-700">
              <FiBox className="text-emerald-500" size={18} />
              <span>Stock:</span>
              <span className="font-bold text-slate-900">{product.stock} units</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <FiTag className="text-emerald-500" size={18} />
              <span>SKU:</span>
              <span className="font-bold text-slate-900">{product.sku || 'N/A'}</span>
            </div>
          </div>
          <div>
            <h3 className="mb-2 font-semibold text-slate-900">Description</h3>
            <p className="text-sm leading-relaxed text-slate-600">
              {product.description || 'No description provided.'}
            </p>
          </div>
        </div>

        <div>
          <h3 className="mb-3 font-semibold text-slate-900">Product Images</h3>
          <div className="flex flex-wrap gap-3">
            {product.images && product.images.length > 0 ? (
              product.images.map((src, idx) => (
                <img
                  key={idx}
                  src={src}
                  alt={`${product.name} ${idx}`}
                  className="h-20 w-20 rounded-xl border border-slate-200 object-cover shadow-sm sm:h-24 sm:w-24"
                />
              ))
            ) : (
              <p className="text-sm text-slate-400">No images uploaded.</p>
            )}
          </div>
        </div>

        <div className="flex justify-end border-t border-slate-100 pt-4">
          <Link
            to={`/admin/products/edit/${product._id || product.id}`}
            className="flex items-center gap-2 rounded-xl bg-linear-to-r from-emerald-500 to-emerald-600 px-5 py-2.5 font-semibold text-white shadow-lg shadow-emerald-200/50 transition hover:from-emerald-600 hover:to-emerald-700"
          >
            Edit Product
          </Link>
        </div>
      </div>
    </div>
  );
};

// Default export for the main page
export default ProductsPage;