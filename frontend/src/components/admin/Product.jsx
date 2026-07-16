import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FiEdit2,
  FiTrash2,
  FiToggleLeft,
  FiToggleRight,
  FiImage,
  FiDollarSign,
  FiPercent,
  FiBox,
  FiTag,
  FiCalendar,
  FiSearch,
  FiRefreshCw,
  FiChevronLeft,
  FiChevronRight,
  FiUpload,
  FiX,
  FiGrid,
  FiList,
  FiPlus,
  FiArrowLeft,
  FiEye,
  FiPackage,
} from "react-icons/fi";
import { useCategories } from "../../Context/CategoryContext";

// ---------- Utility functions (unchanged) ----------
const uploadImage = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const validateProduct = (data) => {
  const errors = {};
  if (!data.name?.trim()) errors.name = "Product name is required";
  if (!data.category) errors.category = "Category is required";
  if (!data.price || data.price <= 0)
    errors.price = "Price must be greater than 0";
  if (data.stock === undefined || data.stock < 0)
    errors.stock = "Stock must be a non-negative number";
  if (data.discount && (data.discount < 0 || data.discount > 100))
    errors.discount = "Discount must be between 0 and 100";
  if (data.weight && data.weight < 0) errors.weight = "Weight must be positive";
  return errors;
};

// ---------- ProductStatusBadge ----------
export const ProductStatusBadge = ({ status }) => {
  const statusMap = {
    active: "bg-emerald-100 text-emerald-700",
    inactive: "bg-gray-100 text-gray-600",
    draft: "bg-amber-100 text-amber-700",
  };
  const labelMap = {
    active: "Active",
    inactive: "Inactive",
    draft: "Draft",
  };
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium shadow-sm ${statusMap[status] || statusMap.inactive}`}
    >
      {labelMap[status] || "Unknown"}
    </span>
  );
};

// ---------- ProductSkeleton ----------
export const ProductSkeleton = ({ count = 8 }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-3xl border border-gray-100/80 shadow-sm overflow-hidden animate-pulse p-4"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="w-full sm:w-32 h-48 sm:h-32 bg-gray-200 rounded-2xl"></div>
            <div className="flex-1 space-y-3">
              <div className="h-5 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="flex gap-3">
                <div className="h-8 bg-gray-200 rounded w-20"></div>
                <div className="h-6 bg-gray-200 rounded w-16"></div>
              </div>
              <div className="h-6 bg-gray-200 rounded w-24"></div>
              <div className="flex justify-end gap-3 mt-4">
                <div className="w-10 h-10 bg-gray-200 rounded-xl"></div>
                <div className="w-10 h-10 bg-gray-200 rounded-xl"></div>
                <div className="w-10 h-10 bg-gray-200 rounded-xl"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// ---------- ProductSearch ----------
export const ProductSearch = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="relative flex-1 min-w-[180px]">
      <FiSearch
        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
        size={18}
      />
      <input
        type="text"
        placeholder="Search by name or SKU..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/70 focus:outline-none focus:ring-2 focus:ring-emerald-400/60 text-sm text-gray-700 placeholder-gray-400 transition-shadow hover:shadow-sm"
      />
    </div>
  );
};

// ---------- ProductFilter ----------
export const ProductFilter = ({
  filterCategory,
  setFilterCategory,
  filterStatus,
  setFilterStatus,
  resetFilters,
}) => {
  const { allCategories } = useCategories();

  return (
    <div className="flex flex-wrap items-center gap-3">
      <select
        value={filterCategory}
        onChange={(e) => setFilterCategory(e.target.value)}
        className="px-4 py-2.5 pr-10 rounded-xl border border-gray-200 bg-gray-50/70 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-400/60 appearance-none bg-no-repeat bg-[right_0.75rem_center] bg-[length:1rem_1rem]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
        }}
      >
        <option value="">All Categories</option>
        {allCategories?.map((category) => (
          <option key={category._id} value={category._id}>
            {category.name}
          </option>
        ))}
      </select>

      <select
        value={filterStatus}
        onChange={(e) => setFilterStatus(e.target.value)}
        className="px-4 py-2.5 pr-10 rounded-xl border border-gray-200 bg-gray-50/70 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-400/60 appearance-none bg-no-repeat bg-[right_0.75rem_center] bg-[length:1rem_1rem]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
        }}
      >
        <option value="">All Status</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
        <option value="draft">Draft</option>
      </select>

      <button
        onClick={resetFilters}
        className="px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/70 hover:bg-gray-100 transition text-gray-600 flex items-center gap-2 text-sm w-full"
      >
        <FiRefreshCw size={16} />
        Reset
      </button>
    </div>
  );
};

// ---------- ProductPagination ----------
export const ProductPagination = ({
  currentPage,
  totalPages,
  setCurrentPage,
}) => {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-3 mt-8">
      <button
        onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
        disabled={currentPage === 1}
        className="p-2.5 rounded-xl border border-gray-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 transition text-gray-600"
      >
        <FiChevronLeft size={18} />
      </button>
      <span className="text-sm font-medium text-gray-600">
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
        disabled={currentPage === totalPages}
        className="p-2.5 rounded-xl border border-gray-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 transition text-gray-600"
      >
        <FiChevronRight size={18} />
      </button>
    </div>
  );
};

// ---------- DeleteProductModal ----------
export const DeleteProductModal = ({ isOpen, onClose, onConfirm }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 border border-gray-100/80"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center text-red-500">
                <FiTrash2 size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Delete Product</h3>
            </div>
            <p className="text-gray-600 mb-6 pl-1">
              Are you sure you want to delete this product? This action cannot
              be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="px-5 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold shadow-lg shadow-red-200/50 transition"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ---------- ProductImages ----------
export const ProductImages = ({ images = [], setImages }) => {
  const [previews, setPreviews] = useState(images);
  const fileInputRef = useRef(null);

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files);
    const newPreviews = await Promise.all(
      files.map((file) => uploadImage(file))
    );
    const updated = [...previews, ...newPreviews];
    setPreviews(updated);
    setImages(updated);
  };

  const removeImage = (index) => {
    const updated = previews.filter((_, i) => i !== index);
    setPreviews(updated);
    setImages(updated);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Product Images
      </label>
      <div className="flex flex-wrap gap-3 p-4 border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50/50 transition-colors hover:border-emerald-300">
        {previews.map((src, idx) => (
          <div
            key={idx}
            className="relative w-20 h-20 rounded-xl overflow-hidden group shadow-sm"
          >
            <img
              src={src}
              alt={`Preview ${idx}`}
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={() => removeImage(idx)}
              className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white"
            >
              <FiX size={20} />
            </button>
          </div>
        ))}
        <label className="w-20 h-20 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition text-gray-500">
          <FiUpload size={20} />
          <span className="text-[10px] mt-1">Upload</span>
          <input
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleUpload}
          />
        </label>
      </div>
    </div>
  );
};

// ---------- ProductForm ----------
const brandOptions = [
  "Nature's Best",
  "FreshFarm",
  "GreenLeaf",
  "DairyPure",
  "Bakery Fresh",
  "OceanHarvest",
  "SnackTime",
  "Organic Valley",
];
const unitOptions = ["kg", "g", "L", "mL", "pcs", "box", "pack"];

export const ProductForm = ({
  initialData,
  onSubmit,
  onCancel,
  submitLabel = "Add Product",
}) => {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    brand: "",
    price: "",
    discount: "",
    stock: "",
    sku: "",
    weight: "",
    unit: "",
    description: "",
    status: "active",
    images: [],
  });
  const [errors, setErrors] = useState({});
  const { categories } = useCategories();

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        price: initialData.price?.toString() || "",
        discount: initialData.discount?.toString() || "",
        stock: initialData.stock?.toString() || "",
        weight: initialData.weight?.toString() || "",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImagesChange = (images) => {
    setFormData((prev) => ({ ...prev, images }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateProduct(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    const submitData = {
      ...formData,
      price: parseFloat(formData.price),
      discount: parseInt(formData.discount) || 0,
      stock: parseInt(formData.stock),
      weight: parseFloat(formData.weight) || 0,
    };
    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Name */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          Product Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={`w-full px-4 py-2.5 rounded-xl border ${
            errors.name ? "border-red-500 ring-2 ring-red-200" : "border-gray-200"
          } bg-gray-50/70 focus:outline-none focus:ring-2 focus:ring-emerald-400/60 text-gray-700 transition-shadow`}
          placeholder="e.g. Organic Apples"
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1.5 flex items-center gap-1">
            <span className="w-1 h-1 rounded-full bg-red-500 inline-block" /> {errors.name}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/70 focus:outline-none focus:ring-2 focus:ring-emerald-400/60 text-gray-700 appearance-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 0.75rem center",
              backgroundSize: "1rem",
            }}
          >
            <option value="">Select Category</option>
            {categories?.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="text-red-500 text-sm mt-1.5 flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-red-500 inline-block" /> {errors.category}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Brand
          </label>
          <select
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/70 focus:outline-none focus:ring-2 focus:ring-emerald-400/60 text-gray-700 appearance-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 0.75rem center",
              backgroundSize: "1rem",
            }}
          >
            <option value="">Select Brand</option>
            {brandOptions.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Price (₹) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className={`w-full px-4 py-2.5 rounded-xl border ${
              errors.price ? "border-red-500 ring-2 ring-red-200" : "border-gray-200"
            } bg-gray-50/70 focus:outline-none focus:ring-2 focus:ring-emerald-400/60 text-gray-700 transition-shadow`}
            placeholder="199"
            min="0"
            step="0.01"
          />
          {errors.price && (
            <p className="text-red-500 text-sm mt-1.5 flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-red-500 inline-block" /> {errors.price}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Discount (%)
          </label>
          <input
            type="number"
            name="discount"
            value={formData.discount}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/70 focus:outline-none focus:ring-2 focus:ring-emerald-400/60 text-gray-700 transition-shadow"
            placeholder="10"
            min="0"
            max="100"
          />
          {errors.discount && (
            <p className="text-red-500 text-sm mt-1.5 flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-red-500 inline-block" /> {errors.discount}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Stock <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            className={`w-full px-4 py-2.5 rounded-xl border ${
              errors.stock ? "border-red-500 ring-2 ring-red-200" : "border-gray-200"
            } bg-gray-50/70 focus:outline-none focus:ring-2 focus:ring-emerald-400/60 text-gray-700 transition-shadow`}
            placeholder="50"
            min="0"
          />
          {errors.stock && (
            <p className="text-red-500 text-sm mt-1.5 flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-red-500 inline-block" /> {errors.stock}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            SKU
          </label>
          <input
            type="text"
            name="sku"
            value={formData.sku}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/70 focus:outline-none focus:ring-2 focus:ring-emerald-400/60 text-gray-700 transition-shadow"
            placeholder="SKU-001"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Weight
          </label>
          <input
            type="number"
            name="weight"
            value={formData.weight}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/70 focus:outline-none focus:ring-2 focus:ring-emerald-400/60 text-gray-700 transition-shadow"
            placeholder="1.5"
            min="0"
            step="0.1"
          />
          {errors.weight && (
            <p className="text-red-500 text-sm mt-1.5 flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-red-500 inline-block" /> {errors.weight}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Unit
          </label>
          <select
            name="unit"
            value={formData.unit}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/70 focus:outline-none focus:ring-2 focus:ring-emerald-400/60 text-gray-700 appearance-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 0.75rem center",
              backgroundSize: "1rem",
            }}
          >
            <option value="">Select Unit</option>
            {unitOptions.map((unit) => (
              <option key={unit} value={unit}>
                {unit}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="3"
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/70 focus:outline-none focus:ring-2 focus:ring-emerald-400/60 text-gray-700 resize-none transition-shadow"
          placeholder="Describe your product..."
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          Status
        </label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/70 focus:outline-none focus:ring-2 focus:ring-emerald-400/60 text-gray-700 appearance-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 0.75rem center",
            backgroundSize: "1rem",
          }}
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      <ProductImages images={formData.images} setImages={handleImagesChange} />

      <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-100">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold shadow-lg shadow-emerald-200/50 transition"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
};

// ---------- ProductCard (Horizontal, Mobile‑First) ----------
// ---------- ProductCard (Extremely Compact for Mobile) ----------
export const ProductCard = ({
  product,
  onEdit,
  onDelete,
  onToggleStatus,
}) => {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
     className="relative w-[340px] bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-3 -ml-9"
    >
      {/* Discount Badge – छोटा */}
      {product.discount > 0 && (
        <div className="absolute left-2 top-2 z-10 bg-red-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full">
          {product.discount}% OFF
        </div>
      )}

      {/* Status – छोटा */}
      <div className="absolute top-2 right-2">
        <ProductStatusBadge status={product.status} />
      </div>

      {/* Horizontal Layout */}
      <div className="flex flex-row gap-2.5">
        {/* Image – अब सिर्फ w-16 h-16 */}
        <div className="w-16 h-16 flex-shrink-0 flex items-center justify-center bg-gray-50 rounded-xl overflow-hidden">
          {product.images?.length > 0 ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-contain p-1"
            />
          ) : (
            <FiImage className="text-gray-300" size={24} />
          )}
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-gray-900 text-xs sm:text-sm truncate leading-tight">
              {product.name}
            </h3>
            <p className="text-gray-500 text-[10px] leading-tight">
              {product.brand?.name || product.brand || "FreshFarm"}
            </p>

            {/* Price & Discount – छोटा */}
            <div className="flex items-center gap-1 mt-0.5 flex-wrap">
              <span className="text-emerald-600 font-bold text-sm">
                ₹{product.price}
              </span>
              {product.discount > 0 && (
                <>
                  <span className="text-gray-400 line-through text-[9px]">
                    ₹{Math.round(product.price / (1 - product.discount / 100))}
                  </span>
                  <span className="bg-emerald-100 text-emerald-700 text-[8px] px-1 rounded-full font-semibold">
                    {product.discount}% off
                  </span>
                </>
              )}
            </div>

            {/* Stock – छोटा */}
            <div className="mt-0.5 inline-flex items-center gap-0.5 bg-gray-100 rounded-full px-1.5 py-0.5 text-[8px] text-gray-700">
              <FiBox size={10} />
              {product.stock} in stock
            </div>
          </div>

          {/* Actions – आइकॉन और भी छोटे */}
          <div className="flex justify-end gap-1 mt-1.5">
            <button
              onClick={() => onEdit(product)}
              className="w-6 h-6 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition"
              aria-label="Edit"
            >
              <FiEdit2 size={11} />
            </button>
            <button
              onClick={() => onDelete(product._id || product.id)}
              className="w-6 h-6 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center transition"
              aria-label="Delete"
            >
              <FiTrash2 size={11} />
            </button>
            <button
              onClick={() => onToggleStatus(product._id || product.id)}
              className="w-6 h-6 flex items-center justify-center"
              aria-label={product.status === "active" ? "Deactivate" : "Activate"}
            >
              {product.status === "active" ? (
                <FiToggleRight size={20} className="text-emerald-500" />
              ) : (
                <FiToggleLeft size={20} className="text-gray-300" />
              )}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ---------- ProductTable ----------
export const ProductTable = ({
  products,
  onEdit,
  onDelete,
  onToggleStatus,
}) => {
  return (
    <div className="overflow-x-auto bg-white rounded-2xl shadow-sm border border-gray-100/80">
      <table className="w-full text-sm">
        <thead className="bg-gradient-to-r from-gray-50/90 to-gray-100/50 border-b border-gray-100">
          <tr className="text-left text-gray-500 text-xs font-semibold uppercase tracking-wider">
            <th className="px-4 py-3.5">Product</th>
            <th className="px-4 py-3.5 hidden sm:table-cell">Category</th>
            <th className="px-4 py-3.5">Price</th>
            <th className="px-4 py-3.5 hidden md:table-cell">Stock</th>
            <th className="px-4 py-3.5 hidden lg:table-cell">Status</th>
            <th className="px-4 py-3.5 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {products.map((product) => (
            <tr
              key={product._id || product.id}
              className="hover:bg-gray-50/50 transition"
            >
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <FiPackage size={20} />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-800 truncate">
                      {product.name}
                    </p>
                    <p className="text-xs text-gray-400 font-mono">
                      SKU: {product.sku || "N/A"}
                    </p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 text-gray-600 hidden sm:table-cell">
                {product.category?.name || product.category || "—"}
              </td>
              <td className="px-4 py-3 font-bold text-gray-800">
                ₹{product.price}
              </td>
              <td className="px-4 py-3 text-gray-600 hidden md:table-cell">
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    product.stock > 10
                      ? "bg-emerald-100 text-emerald-700"
                      : product.stock > 0
                      ? "bg-amber-100 text-amber-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {product.stock}
                </span>
              </td>
              <td className="px-4 py-3 hidden lg:table-cell">
                <ProductStatusBadge status={product.status} />
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-center gap-1.5">
                  <Link
                    to={`/admin/products/${product.id || product._id}`}
                    className="p-1.5 rounded-lg hover:bg-gray-100 text-blue-500 transition"
                    title="View"
                  >
                    <FiEye size={16} />
                  </Link>
                  <button
                    onClick={() => onEdit(product)}
                    className="p-1.5 rounded-lg hover:bg-gray-100 text-emerald-500 transition"
                    title="Edit"
                  >
                    <FiEdit2 size={16} />
                  </button>
                  <button
                    onClick={() => onDelete(product.id || product._id)}
                    className="p-1.5 rounded-lg hover:bg-gray-100 text-red-500 transition"
                    title="Delete"
                  >
                    <FiTrash2 size={16} />
                  </button>
                  <button
                    onClick={() => onToggleStatus(product.id || product._id)}
                    className="p-1.5 rounded-lg hover:bg-gray-100 transition"
                    title={product.status === "active" ? "Deactivate" : "Activate"}
                  >
                    {product.status === "active" ? (
                      <FiToggleRight size={18} className="text-emerald-500" />
                    ) : (
                      <FiToggleLeft size={18} className="text-gray-400" />
                    )}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};