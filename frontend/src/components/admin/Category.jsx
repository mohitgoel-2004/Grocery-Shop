

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FiEdit2,
  FiTrash2,
  FiToggleLeft,
  FiToggleRight,
  FiImage,
  FiTag,
  FiPackage,
  FiSave,
  FiX,
  FiPlus,
} from 'react-icons/fi';

// ---------- Optional: color palette for categories ----------
const categoryColors = [
  'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
  'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300',
  'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300',
  'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
];

// ---------- Component: CategoryCard ----------
export const CategoryCard = ({
  category,
  onEdit,
  onDelete,
  onToggleStatus,
}) => {
  const colorClass =
  categoryColors[
    (category.name?.length || 0) % categoryColors.length
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100/80 dark:border-gray-700/80 overflow-hidden hover:shadow-xl transition-all duration-300 group">
      <div className="relative h-32 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center">
        {category.image ? (
          <img
            src={category.image}
            alt={category.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className={`w-20 h-20 rounded-full ${colorClass} flex items-center justify-center text-3xl font-bold`}>
            {category.icon || category.name.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="absolute top-3 right-3">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              category.status === 'active'
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
            }`}
          >
            {category.status === 'active' ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold text-gray-800 dark:text-white text-lg leading-tight">
              {category.name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {category.productCount || 0} products
            </p>
            {category.description && (
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 line-clamp-2">
                {category.description}
              </p>
            )}
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => onEdit(category)}
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400"
            >
              <FiEdit2 size={16} />
            </button>
            <button
  type="button"
  onClick={(e) => {
    e.preventDefault();
    e.stopPropagation();

    console.log("Delete Button Clicked");
    console.log("Category ID:", category._id);
    console.log("onDelete:", onDelete);

    onDelete(category._id);
  }}
  className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition text-gray-400 hover:text-red-600 dark:hover:text-red-400"
>
  <FiTrash2 size={16} />
</button>
            <button
              onClick={() => onToggleStatus(category._id)}
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400"
              title={category.status === 'active' ? 'Deactivate' : 'Activate'}
            >
              {category.status === 'active' ? (
                <FiToggleRight size={18} className="text-emerald-500" />
              ) : (
                <FiToggleLeft size={18} className="text-gray-400" />
              )}
            </button>
          </div>
        </div>

        <div className="flex justify-between items-center text-xs text-gray-400 dark:text-gray-500 pt-1 border-t border-gray-100 dark:border-gray-700">
          <span>Created: {category.createdAt || 'N/A'}</span>
          <Link
            to={`/admin/categories/${category._id}`}
            className="text-emerald-600 hover:underline"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

// ---------- Component: CategoryTable ----------
export const CategoryTable = ({
  categories,
  onEdit,
  onDelete,
  onToggleStatus,
}) => {
  return (
    <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100/80 dark:border-gray-700/80">
      <table className="w-full text-sm">
        <thead className="bg-gray-50/80 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
          <tr className="text-left text-gray-500 dark:text-gray-400 text-xs font-medium uppercase tracking-wider">
            <th className="px-4 py-3">Category</th>
            <th className="px-4 py-3">Description</th>
            <th className="px-4 py-3">Products</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
          {categories.map((category) => (
            <tr key={category._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  {category.image ? (
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400">
                      <FiTag size={18} />
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-gray-800 dark:text-white">{category.name}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">ID: {category._id}</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 text-gray-600 dark:text-gray-300 max-w-xs truncate">
                {category.description || '—'}
              </td>
              <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                {category.productCount || 0}
              </td>
              <td className="px-4 py-3">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    category.status === 'active'
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                  }`}
                >
                  {category.status === 'active' ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-center gap-2">
                  <Link
                    to={`/admin/categories/${category._id}`}
                    className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-blue-500"
                  >
                    <FiEdit2 size={16} />
                  </Link>
                  <button
                    onClick={() => onEdit(category)}
                    className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-emerald-500"
                  >
                    <FiEdit2 size={16} />
                  </button>
                  <button
  type="button"
  onClick={(e) => {
    e.stopPropagation();
    console.log("Delete:", category._id);

    if (onDelete) {
      onDelete(category._id);
    }
  }}
  className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-red-500"
>
  <FiTrash2 size={16} />
</button>
                  <button
                    onClick={() => onToggleStatus(category._id)}
                    className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    {category.status === 'active' ? (
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

// ---------- Component: CategoryForm ----------
export const CategoryForm = ({
  initialData,
  onSubmit,
  onCancel,
  submitLabel = 'Add Category',
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    status: 'active',
    icon: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        description: initialData.description || '',
        image: initialData.image || '',
        status: initialData.status || 'active',
        icon: initialData.icon || '',
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simple validation
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Category name is required';
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Category Name *
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={`w-full px-4 py-2.5 rounded-xl border ${
            errors.name ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
          } bg-gray-50/70 dark:bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-emerald-400/60 dark:text-white`}
          placeholder="e.g. Dairy Products"
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="3"
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/70 dark:bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-emerald-400/60 dark:text-white resize-none"
          placeholder="Brief description of the category..."
        />
      </div>

      {/* Image URL */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Image URL (optional)
        </label>
        <input
          type="text"
          name="image"
          value={formData.image}
          onChange={handleChange}
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/70 dark:bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-emerald-400/60 dark:text-white"
          placeholder="https://example.com/category.jpg"
        />
      </div>

      {/* Icon (optional) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Icon (emoji or text, optional)
        </label>
        <input
          type="text"
          name="icon"
          value={formData.icon}
          onChange={handleChange}
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/70 dark:bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-emerald-400/60 dark:text-white"
          placeholder="🥛 or Dairy"
        />
      </div>

      {/* Status */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Status
        </label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/70 dark:bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-emerald-400/60 dark:text-white"
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold shadow-lg shadow-emerald-200/50 dark:shadow-emerald-900/30 transition flex items-center gap-2"
        >
          <FiSave size={18} />
          {submitLabel}
        </button>
      </div>
    </form>

    
  );
};

export const DeleteProductModal = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-xl">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">
          Delete Category
        </h2>

        <p className="mt-3 text-gray-600 dark:text-gray-300">
          Are you sure you want to delete this category?
        </p>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-lg"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

