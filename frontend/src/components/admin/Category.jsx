

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
  'bg-red-100 text-red-700',
  'bg-blue-100 text-blue-700',
  'bg-green-100 text-green-700',
  'bg-yellow-100 text-yellow-700',
  'bg-purple-100 text-purple-700',
  'bg-pink-100 text-pink-700',
  'bg-indigo-100 text-indigo-700',
  'bg-orange-100 text-orange-700',
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
    <div className="group overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:shadow-xl">
      <div className="relative flex h-32 items-center justify-center bg-linear-to-br from-slate-50 to-slate-100">
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
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-slate-100 text-slate-700'
            }`}
          >
            {category.status === 'active' ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-bold leading-tight text-slate-900">
              {category.name}
            </h3>
            <p className="text-sm text-slate-500">
              {category.productCount || 0} products
            </p>
            {category.description && (
              <p className="mt-1 line-clamp-2 text-xs text-slate-400">
                {category.description}
              </p>
            )}
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => onEdit(category)}
              className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-emerald-600"
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
  className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-red-600"
>
  <FiTrash2 size={16} />
</button>
            <button
              onClick={() => onToggleStatus(category._id)}
              className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-emerald-600"
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

        <div className="flex items-center justify-between border-t border-slate-100 pt-1 text-xs text-slate-400">
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
    <div className="overflow-x-auto rounded-2xl border border-slate-100 bg-white shadow-sm">
      <table className="w-full text-sm">
        <thead className="border-b border-slate-100 bg-slate-50/80">
          <tr className="text-left text-xs font-medium uppercase tracking-wider text-slate-500">
            <th className="px-4 py-3">Category</th>
            <th className="px-4 py-3">Description</th>
            <th className="px-4 py-3">Products</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100/80">
          {categories.map((category) => (
            <tr key={category._id} className="transition hover:bg-emerald-50/30">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  {category.image ? (
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                      <FiTag size={18} />
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-slate-900">{category.name}</p>
                    <p className="text-xs text-slate-400">ID: {category._id}</p>
                  </div>
                </div>
              </td>
              <td className="max-w-xs truncate px-4 py-3 text-slate-600">
                {category.description || '—'}
              </td>
              <td className="px-4 py-3 text-slate-600">
                {category.productCount || 0}
              </td>
              <td className="px-4 py-3">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    category.status === 'active'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {category.status === 'active' ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-center gap-2">
                  <Link
                    to={`/admin/categories/${category._id}`}
                    className="rounded-lg p-1.5 text-blue-500 hover:bg-slate-100"
                  >
                    <FiEdit2 size={16} />
                  </Link>
                  <button
                    onClick={() => onEdit(category)}
                    className="rounded-lg p-1.5 text-emerald-500 hover:bg-slate-100"
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
  className="rounded-lg p-1.5 text-red-500 hover:bg-slate-100"
>
  <FiTrash2 size={16} />
</button>
                  <button
                    onClick={() => onToggleStatus(category._id)}
                    className="rounded-lg p-1.5 hover:bg-slate-100"
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
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Category Name *
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={`w-full px-4 py-2.5 rounded-xl border ${
            errors.name ? 'border-red-500' : 'border-slate-200'
          } bg-slate-50/70 focus:outline-none focus:ring-2 focus:ring-emerald-400/60 text-slate-900`}
          placeholder="e.g. Dairy Products"
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
      </div>

      {/* Description */}
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="3"
          className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
          placeholder="Brief description of the category..."
        />
      </div>

      {/* Image URL */}
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Image URL (optional)
        </label>
        <input
          type="text"
          name="image"
          value={formData.image}
          onChange={handleChange}
          className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
          placeholder="https://example.com/category.jpg"
        />
      </div>

      {/* Icon (optional) */}
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Icon (emoji or text, optional)
        </label>
        <input
          type="text"
          name="icon"
          value={formData.icon}
          onChange={handleChange}
          className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
          placeholder="🥛 or Dairy"
        />
      </div>

      {/* Status */}
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Status
        </label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
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
          className="rounded-xl border border-slate-200 px-6 py-2.5 text-slate-600 transition hover:bg-slate-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex items-center gap-2 rounded-xl bg-linear-to-r from-emerald-500 to-emerald-600 px-6 py-2.5 font-semibold text-white shadow-lg shadow-emerald-200/50 transition hover:from-emerald-600 hover:to-emerald-700"
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40">
      <div className="w-full max-w-md rounded-2xl border border-slate-100 bg-white p-6 shadow-xl">
        <h2 className="text-xl font-bold text-slate-900">
          Delete Category
        </h2>

        <p className="mt-3 text-slate-600">
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

