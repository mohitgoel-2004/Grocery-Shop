import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiPlus, FiGrid, FiList, FiArrowLeft,
  FiDollarSign, FiPercent, FiBox, FiTag, FiCalendar,
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

// ============================================================
// 1. ProductsPage – lists all products with search, filter, pagination
// ============================================================
export const ProductsPage = () => {
  const {
    products,
    allProducts,
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
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* ===== Header with Filters & Total Products (Mobile-friendly) ===== */}
      <div className="flex flex-col gap-3">
        {/* Top row: filters and total count */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-4">
            {/* Filter dropdowns – using ProductFilter component but we'll style it inline */}
            <ProductFilter
              filterCategory={filterCategory}
              setFilterCategory={setFilterCategory}
              filterStatus={filterStatus}
              setFilterStatus={setFilterStatus}
              resetFilters={resetFilters}
            />
          </div>
          <div className="flex items-center gap-3">
           
            {/* View toggle – kept small */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-xl border ${
                  viewMode === 'grid'
                    ? 'bg-emerald-100 border-emerald-300 text-emerald-700'
                    : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                } transition`}
                aria-label="Grid view"
              >
                <FiGrid size={16} />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-2 rounded-xl border ${
                  viewMode === 'table'
                    ? 'bg-emerald-100 border-emerald-300 text-emerald-700'
                    : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                } transition`}
                aria-label="Table view"
              >
                <FiList size={16} />
              </button>
               <span className="text-sm font-semibold text-gray-500 whitespace-nowrap">
              Total Products:
              <span className="text-emerald-600 ml-2 font-bold">
                {allProducts.length}
              </span>
            </span>
            </div>
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
        className="fixed bottom-24 right-6 
                   w-14 h-14 rounded-full
                   bg-gradient-to-r from-emerald-500 to-emerald-600
                   text-white shadow-xl shadow-emerald-300/50
                   flex items-center justify-center
                   z-50 hover:scale-105 transition-transform"
        aria-label="Add Product"
      >
        <FiPlus size={28} />
      </Link>

      {/* ===== Product List ===== */}
      {loading ? (
        <ProductSkeleton count={8} />
      ) : allProducts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 shadow-sm">
          <p className="text-gray-400">
            No products found. Try adjusting your filters.
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="px-2">
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
    <div className="p-4 sm:p-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link
          to="/admin/products"
          className="p-2 rounded-xl hover:bg-gray-100 transition text-gray-500 hover:text-emerald-600"
        >
          <FiArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-extrabold text-gray-800">Add New Product</h1>
      </div>
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100/80 p-5 sm:p-6">
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
  const { products, updateProduct, loading } = useProducts();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const found = products.find(
      p => String(p._id || p.id) === String(id)
    );
    if (found) setProduct(found);
  }, [id, products]);

  if (loading) return <div className="p-6 text-gray-600">Loading...</div>;
  if (!product) return <div className="p-6 text-gray-600">Product not found</div>;

  const handleSubmit = async (data) => {
    await updateProduct(product._id || product.id, data);
    navigate("/admin/products");
  };

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link
          to="/admin/products"
          className="p-2 rounded-xl hover:bg-gray-100 transition text-gray-500 hover:text-emerald-600"
        >
          <FiArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-extrabold text-gray-800">Edit Product</h1>
      </div>
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100/80 p-5 sm:p-6">
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
    <div className="p-4 sm:p-6 max-w-3xl mx-auto">
      <Link
        to="/admin/products"
        className="inline-flex items-center gap-2 text-gray-500 hover:text-emerald-600 mb-6 transition"
      >
        <FiArrowLeft size={18} /> Back to Products
      </Link>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100/80 p-5 sm:p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-800">{product.name}</h1>
            <p className="text-gray-500 text-sm mt-1">
              {product.category?.name || product.category} • {product.brand?.name || product.brand}
            </p>
          </div>
          <ProductStatusBadge status={product.status} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-gray-700">
              <FiDollarSign className="text-emerald-500" size={18} />
              <span>Price:</span>
              <span className="font-bold text-gray-800">₹{product.price}</span>
            </div>
            {product.discount > 0 && (
              <div className="flex items-center gap-2 text-gray-700">
                <FiPercent className="text-emerald-500" size={18} />
                <span>Discount:</span>
                <span className="font-bold text-gray-800">{product.discount}%</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-gray-700">
              <FiBox className="text-emerald-500" size={18} />
              <span>Stock:</span>
              <span className="font-bold text-gray-800">{product.stock} units</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <FiTag className="text-emerald-500" size={18} />
              <span>SKU:</span>
              <span className="font-bold text-gray-800">{product.sku || 'N/A'}</span>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Description</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              {product.description || 'No description provided.'}
            </p>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-gray-800 mb-3">Product Images</h3>
          <div className="flex flex-wrap gap-3">
            {product.images && product.images.length > 0 ? (
              product.images.map((src, idx) => (
                <img
                  key={idx}
                  src={src}
                  alt={`${product.name} ${idx}`}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover border border-gray-200 shadow-sm"
                />
              ))
            ) : (
              <p className="text-gray-400 text-sm">No images uploaded.</p>
            )}
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-gray-100">
          <Link
            to={`/admin/products/edit/${product._id || product.id}`}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold shadow-lg shadow-emerald-200/50 flex items-center gap-2 transition"
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