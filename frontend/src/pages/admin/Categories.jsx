

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiPlus, FiGrid, FiList, FiArrowLeft, FiX,
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
    addCategory,
    toggleStatus,
    resetFilters,
  } = useCategories();

  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'
  const [deleteCategoryId, setDeleteCategoryId] = useState(null);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);

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

  const handleAddCategory = (data) => {
    addCategory(data);
    setIsAddCategoryOpen(false);
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 pb-24 sm:p-6 sm:pb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h4 className="flex items-center gap-2 text-2xl font-extrabold text-slate-900">
            <FiTag className="text-emerald-500" />
            Category Management
          </h4>
          <p className="mt-1 text-sm text-slate-500">
            Organize your grocery products into categories.
          </p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="rounded-3xl border border-slate-100 bg-white p-4 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
          {/* Search */}
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 pl-11 pr-4 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
            />
            <FiTag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap lg:justify-end">
            {/* Status filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-400/60 sm:w-auto"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <button
              onClick={resetFilters}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-2.5 text-slate-600 transition hover:bg-slate-100 sm:w-auto"
            >
              {/* <FiRefreshCw size={16} /> */}
              Reset
            </button>
            {/* View toggle */}
            <div className="flex items-center justify-center gap-2 sm:justify-start">
              <button
                onClick={() => setViewMode('grid')}
                className={`rounded-xl border p-2.5 ${
                  viewMode === 'grid'
                    ? 'bg-emerald-100 border-emerald-300'
                    : 'border-slate-200'
                } hover:bg-slate-100 transition`}
              >
                <FiGrid size={18} />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`rounded-xl border p-2.5 ${
                  viewMode === 'table'
                    ? 'bg-emerald-100 border-emerald-300'
                    : 'border-slate-200'
                } hover:bg-slate-100 transition`}
              >
                <FiList size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Category List */}
      {loading ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {/* Simple skeleton for categories */}
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm animate-pulse">
              <div className="h-32 bg-slate-200"></div>
              <div className="p-4 space-y-3">
                <div className="h-4 w-3/4 rounded bg-slate-200"></div>
                <div className="h-3 w-1/2 rounded bg-slate-200"></div>
              </div>
            </div>
          ))}
        </div>
      ) : allCategories.length === 0 ? (
        <div className="text-center py-16">
          <FiTag size={64} className="mx-auto text-slate-300" />
          <h3 className="mt-4 text-xl font-semibold text-slate-600">No categories found</h3>
          <p className="text-slate-400">Try adjusting your search or filters.</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
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
        <div className="mt-6 flex items-center justify-center gap-2">
          <button
            onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="rounded-xl border border-slate-200 p-2 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <FiChevronLeft size={18} />
          </button>
          <span className="text-sm text-slate-600">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="rounded-xl border border-slate-200 p-2 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
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

      <motion.button
        type="button"
        onClick={() => setIsAddCategoryOpen(true)}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-5 right-5 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-linear-to-r from-emerald-500 to-emerald-600 text-white shadow-[0_18px_40px_rgba(16,185,129,0.35)] transition hover:from-emerald-600 hover:to-emerald-700 sm:bottom-6 sm:right-6"
        aria-label="Add category"
      >
        <FiPlus size={24} />
      </motion.button>

      {isAddCategoryOpen && (
        <div className="fixed inset-0 z-40 flex items-end justify-center bg-slate-900/40 p-3 sm:p-6">
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 320, damping: 30 }}
            className="w-full max-w-3xl overflow-hidden rounded-t-4xl rounded-b-2xl border border-slate-100 bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
              <div>
                <p className="text-sm font-medium text-emerald-600">Quick action</p>
                <h2 className="text-xl font-bold text-slate-900">Add New Category</h2>
              </div>
              <button
                type="button"
                onClick={() => setIsAddCategoryOpen(false)}
                className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                aria-label="Close add category modal"
              >
                <FiX size={20} />
              </button>
            </div>
            <div className="max-h-[75vh] overflow-y-auto px-5 py-5 sm:px-6">
              <CategoryForm
                onSubmit={handleAddCategory}
                onCancel={() => setIsAddCategoryOpen(false)}
                submitLabel="Add Category"
              />
            </div>
          </motion.div>
        </div>
      )}
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
    <div className="mx-auto max-w-3xl p-4 sm:p-6">
      <h1 className="mb-6 text-2xl font-extrabold text-slate-900">Add New Category</h1>
      <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
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

  if (loading) return <div className="p-6 text-slate-600">Loading...</div>;
  if (!category) return <div className="p-6 text-slate-600">Category not found</div>;

  const handleSubmit = (data) => {
    updateCategory(category._id, data);
    navigate('/admin/categories');
  };

  return (
    <div className="mx-auto max-w-3xl p-4 sm:p-6">
      <h1 className="mb-6 text-2xl font-extrabold text-slate-900">Edit Category</h1>
      <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
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

  if (loading) return <div className="p-6 text-slate-600">Loading...</div>;
  if (!category) return <div className="p-6 text-slate-600">Category not found</div>;

  return (
    <div className="mx-auto max-w-3xl p-4 sm:p-6">
      <Link to="/admin/categories" className="mb-6 inline-flex items-center gap-2 text-slate-600 hover:text-emerald-600">
        <FiArrowLeft /> Back to Categories
      </Link>
      <div className="space-y-6 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="flex items-center gap-3 text-2xl font-extrabold text-slate-900">
              {category.icon && <span className="text-3xl">{category.icon}</span>}
              {category.name}
            </h1>
            <p className="text-slate-500">Category ID: {category._id}</p>
          </div>
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-3">
            {category.image && (
              <div>
                <img src={category.image} alt={category.name} className="h-48 w-48 rounded-xl border border-slate-200 object-cover" />
              </div>
            )}
            <div className="flex items-center gap-2 text-slate-600">
              <FiPackage className="text-emerald-500" /> Products in category: <span className="font-bold">{category.productCount || 0}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <FiCalendar className="text-emerald-500" /> Created: <span className="font-bold">{category.createdAt || 'N/A'}</span>
            </div>
          </div>
          <div>
            <h3 className="mb-2 font-semibold text-slate-900">Description</h3>
            <p className="text-slate-600">{category.description || 'No description provided.'}</p>
          </div>
        </div>

        <div className="flex justify-end border-t border-slate-100 pt-4">
          <Link
            to={`/admin/categories/edit/${category._id}`}
            className="flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-2.5 font-semibold text-white shadow-lg shadow-emerald-200/50 transition hover:bg-emerald-600"
          >
            <FiEdit2 /> Edit Category
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;