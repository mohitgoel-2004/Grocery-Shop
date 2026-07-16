

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiPlus, FiGrid, FiList, FiArrowLeft,
  FiTag, FiPackage, FiCalendar, FiEdit2,
} from 'react-icons/fi';

// Import category UI components from the combined component file.
import {
  CategoryCard,
  CategoryForm,
  CategoryTable,
    DeleteProductModal,
} from '../../components/admin/Category'; 

// Import delete modal from ProductComponents (reusable)


// Import the category context (assumed to be at ../../../context/CategoryContext)
import { useCategories } from "../../Context/CategoryContext";

// ============================================================
// 1. CategoriesPage – lists all categories with search, filter, pagination
// ============================================================
 const CategoriesPage = () => {
  const {
    categories,
    allCategories,
    loading,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    currentPage,
    setCurrentPage,
    totalPages,
    deleteCategory,
    toggleStatus,
    resetFilters,
  } = useCategories();

  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'
  const [deleteCategoryId, setDeleteCategoryId] = useState(null);

  const handleDelete = (id) => setDeleteCategoryId(id);
  const confirmDelete = () => {
    console.log("Confirm Delete");
  console.log(deleteCategoryId);

    if (deleteCategoryId) {
      deleteCategory(deleteCategoryId);
      setDeleteCategoryId(null);
    }
  };

  const navigate = useNavigate();
  const handleEdit = (category) => {
    navigate(`/admin/categories/edit/${category._id}`);
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-800  flex items-center gap-2">
            <FiTag className="text-emerald-500" />
            Category Management
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Organize your grocery products into categories.
          </p>
        </div>
        <Link
          to="/admin/categories/add"
          className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-6 py-3 rounded-2xl font-semibold shadow-lg shadow-emerald-200/50 dark:shadow-emerald-900/30 flex items-center gap-2 transition-all inline-flex"
        >
          <FiPlus size={20} />
          Add Category
        </Link>
      </div>

      {/* Search & Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100/80 dark:border-gray-700/80 p-4 sm:p-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/70 dark:bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-emerald-400/60 text-sm dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            />
            <FiTag className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
          </div>
          <div className="flex flex-wrap gap-3">
            {/* Status filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/70 dark:bg-gray-700/50 text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <button
              onClick={resetFilters}
              className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/70 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-600 transition text-gray-600 dark:text-gray-300 flex items-center gap-2"
            >
              {/* <FiRefreshCw size={16} /> */}
              Reset
            </button>
            {/* View toggle */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2.5 rounded-xl border ${
                  viewMode === 'grid'
                    ? 'bg-emerald-100 border-emerald-300 dark:bg-emerald-900/30'
                    : 'border-gray-200 dark:border-gray-700'
                } hover:bg-gray-100 dark:hover:bg-gray-700 transition`}
              >
                <FiGrid size={18} />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-2.5 rounded-xl border ${
                  viewMode === 'table'
                    ? 'bg-emerald-100 border-emerald-300 dark:bg-emerald-900/30'
                    : 'border-gray-200 dark:border-gray-700'
                } hover:bg-gray-100 dark:hover:bg-gray-700 transition`}
              >
                <FiList size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Category List */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
          {/* Simple skeleton for categories */}
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100/80 dark:border-gray-700/80 overflow-hidden animate-pulse">
              <div className="h-32 bg-gray-200 dark:bg-gray-700"></div>
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      ) : allCategories.length === 0 ? (
        <div className="text-center py-16">
          <FiTag size={64} className="mx-auto text-gray-300 dark:text-gray-600" />
          <h3 className="mt-4 text-xl font-semibold text-gray-600 dark:text-gray-400">No categories found</h3>
          <p className="text-gray-400 dark:text-gray-500">Try adjusting your search or filters.</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
          {categories.map((category) => (
            <CategoryCard
              key={category._id}
              category={category}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggleStatus={toggleStatus}
            />
          ))}
        </div>
      ) : (
        <CategoryTable
          categories={categories}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleStatus={toggleStatus}
        />
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button
            onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-xl border border-gray-200 dark:border-gray-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            <FiChevronLeft size={18} />
          </button>
          <span className="text-sm text-gray-600 dark:text-gray-300">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-xl border border-gray-200 dark:border-gray-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            <FiChevronRight size={18} />
          </button>
        </div>
      )}

      {/* Delete Modal (reusing the product delete modal) */}
      <DeleteProductModal
        isOpen={!!deleteCategoryId}
        onClose={() => setDeleteCategoryId(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

// ============================================================
// 2. AddCategoryPage – form to add a new category
// ============================================================
export const AddCategoryPage = () => {
  const navigate = useNavigate();
  const { addCategory } = useCategories();

  const handleSubmit = (data) => {
    addCategory(data);
    navigate('/admin/categories');
  };

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-extrabold text-gray-800 dark:text-white mb-6">Add New Category</h1>
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100/80 dark:border-gray-700/80 p-6">
        <CategoryForm
          onSubmit={handleSubmit}
          onCancel={() => navigate('/admin/categories')}
          submitLabel="Add Category"
        />
      </div>
    </div>
  );
};

// ============================================================
// 3. EditCategoryPage – form to edit an existing category
// ============================================================
export const EditCategoryPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { categories, updateCategory, loading } = useCategories();
  const [category, setCategory] = useState(null);

  useEffect(() => {
    const found = categories.find(
   c => c._id === id
);
    if (found) setCategory(found);
  }, [id, categories]);

  if (loading) return <div className="p-6 text-gray-600 dark:text-gray-300">Loading...</div>;
  if (!category) return <div className="p-6 text-gray-600 dark:text-gray-300">Category not found</div>;

  const handleSubmit = (data) => {
    updateCategory(category._id, data);
    navigate('/admin/categories');
  };

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-extrabold text-gray-800 dark:text-white mb-6">Edit Category</h1>
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100/80 dark:border-gray-700/80 p-6">
        <CategoryForm
          initialData={category}
          onSubmit={handleSubmit}
          onCancel={() => navigate('/admin/categories')}
          submitLabel="Update Category"
        />
      </div>
    </div>
  );
};

// ============================================================
// 4. CategoryDetailsPage – view full category details
// ============================================================
export const CategoryDetailsPage = () => {
  const { id } = useParams();
  const { categories, loading } = useCategories();
  const [category, setCategory] = useState(null);

  useEffect(() => {
const found = categories.find(
c=>c._id===id
);
    setCategory(found);
  }, [id, categories]);

  if (loading) return <div className="p-6 text-gray-600 dark:text-gray-300">Loading...</div>;
  if (!category) return <div className="p-6 text-gray-600 dark:text-gray-300">Category not found</div>;

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto">
      <Link to="/admin/categories" className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 mb-6">
        <FiArrowLeft /> Back to Categories
      </Link>
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100/80 dark:border-gray-700/80 p-6 space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-800 dark:text-white flex items-center gap-3">
              {category.icon && <span className="text-3xl">{category.icon}</span>}
              {category.name}
            </h1>
            <p className="text-gray-500 dark:text-gray-400">Category ID: {category._id}</p>
          </div>
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-3">
            {category.image && (
              <div>
                <img src={category.image} alt={category.name} className="w-48 h-48 object-cover rounded-xl border border-gray-200 dark:border-gray-700" />
              </div>
            )}
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
              <FiPackage className="text-emerald-500" /> Products in category: <span className="font-bold">{category.productCount || 0}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
              <FiCalendar className="text-emerald-500" /> Created: <span className="font-bold">{category.createdAt || 'N/A'}</span>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-white mb-2">Description</h3>
            <p className="text-gray-600 dark:text-gray-300">{category.description || 'No description provided.'}</p>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-gray-100 dark:border-gray-700">
          <Link
            to={`/admin/categories/edit/${category._id}`}
            className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold shadow-lg shadow-emerald-200/50 dark:shadow-emerald-900/30 flex items-center gap-2 transition"
          >
            <FiEdit2 /> Edit Category
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;