// CustomerComponents.jsx
// ============================================================
// Combines all customer-related UI components into one file.
// Components: CustomerCard, CustomerTable, CustomerForm,
// CustomerFilters, CustomerSearch, CustomerStats, CustomerPagination,
// CustomerStatusBadge, CustomerProfileModal, DeleteCustomerModal,
// CustomerAddressCard, CustomerOrderHistory, CustomerWishlist,
// CustomerReviews, CustomerActivity, CustomerNotes.
// Dependencies: React, React Router, Framer Motion, React Icons.
// ============================================================

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiCalendar,
  FiDollarSign,
  FiShoppingBag,
  FiMapPin,
  FiStar,
  FiHeart,
  FiMessageCircle,
  FiActivity,
  FiEdit2,
  FiTrash2,
  FiSearch,
  FiRefreshCw,
  FiChevronLeft,
  FiChevronRight,
  FiX,
  FiPlus,
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
  FiMoreHorizontal,
  FiArrowRight,
  FiEye,
  FiLock,
  FiRotateCcw,

  FiUnlock,
} from "react-icons/fi";

// ---------- STATUS CONFIGURATION ----------
export const customerStatusConfig = {
  active: {
    label: "Active",
    color: "bg-emerald-100 text-emerald-700",
  },
  inactive: {
    label: "Inactive",
    color: "bg-gray-100 text-gray-700",
  },
  blocked: {
    label: "Blocked",
    color: "bg-red-100 text-red-700",
  },
};

// ---------- 1. CustomerStatusBadge ----------
export const CustomerStatusBadge = ({ status }) => {
  const config = customerStatusConfig[status];
  if (!config)
    return (
      <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
        Unknown
      </span>
    );
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${config.color}`}
    >
      {config.label}
    </span>
  );
};

// ---------- 2. CustomerCard (grid view) ----------
export const CustomerCard = ({  customer,
  onViewDetails,
  onEdit,
  onBlock,
  onUnblock,
  onPremium,
  onDelete,
  onRestore,
  onPermanentDelete, }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100/80 overflow-hidden hover:shadow-xl transition-all duration-300 group">
      <div className="p-4 space-y-3">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-black font-bold text-lg">
              {(customer.fullName || customer.name || "U")
                .charAt(0)
                .toUpperCase()}
            </div>

            <div>
              <h3 className="font-bold text-gray-800 dark:text-black">
                {customer.fullName || customer.name || "Unknown Customer"}
              </h3>

              <p className="text-xs text-gray-500 dark:text-gray-700">
                {customer.email}
              </p>
            </div>
          </div>

          <CustomerStatusBadge status={customer.status} />
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-600">
            Orders: {customer.totalOrders}
          </span>
          <span className="font-bold text-gray-800 dark:text-black">
            ₹{customer.totalSpent}
          </span>
        </div>
        <div className="flex justify-between items-center text-xs text-gray-400 dark:text-gray-500">
          <span>
            Joined: {new Date(customer.joinedDate).toLocaleDateString()}
          </span>
          <button
            onClick={() => onViewDetails(customer._id)}
            className="text-emerald-600 hover:underline flex items-center gap-1"
          >
            View <FiArrowRight size={12} />
          </button>
        </div>
      </div>
    </div>
  );
};

// ---------- 3. CustomerTable (table view) ----------
export const CustomerTable = ({
  customers,
  onViewDetails,
  onEdit,
  onBlock,
  onUnblock,
  onPremium,
  onDelete,
  onRestore,
  onPermanentDelete,
}) => {
  return (
    <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100/80 dark:border-gray-700/80">
      <table className="w-full text-sm">
        <thead className="bg-gray-50/80 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
          <tr className="text-left text-gray-500 dark:text-gray-400 text-xs font-medium uppercase tracking-wider">
            <th className="px-4 py-3">Customer</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Orders</th>
            <th className="px-4 py-3">Total Spent</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
          {customers.map((customer) => (
            <tr
              key={customer._id}
              className="hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition"
            >
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-black font-bold text-sm">
                    {customer.fullName?.charAt(0).toUpperCase() || "?"}
                  </div>
                  <span className="font-medium text-gray-800 dark:text-black">
                    {customer.fullName}
                  </span>
                </div>
              </td>
              <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                {customer.email}
              </td>
              <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                {customer.totalOrders}
              </td>
              <td className="px-4 py-3 font-bold text-gray-800 dark:text-black">
                ₹{customer.totalSpent}
              </td>
              <td className="px-4 py-3">
                <CustomerStatusBadge status={customer.status} />
              </td>
              <td className="px-4 py-3">
               <div className="flex items-center justify-center gap-2">

  {/* View */}
  <button
    onClick={() => onViewDetails(customer._id)}
    className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-blue-500"
  >
    <FiEye size={16} />
  </button>

  {/* Edit */}
  {!customer.deleted && (
    <button
      onClick={() => onEdit(customer)}
      className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-emerald-500"
    >
      <FiEdit2 size={16} />
    </button>
  )}

  {/* Active → Block */}
  {!customer.deleted && customer.status !== "blocked" && (
    <button
      onClick={() => onBlock(customer._id)}
      className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-amber-500"
      title="Block Customer"
    >
      <FiLock size={16} />
    </button>
  )}

  {/* Blocked → Unblock */}
  {!customer.deleted && customer.status === "blocked" && (
    <button
      onClick={() => onUnblock(customer._id)}
      className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-green-500"
      title="Unblock Customer"
    >
      <FiUnlock size={16} />
    </button>
  )}

  {/* Premium */}
  {!customer.deleted && !customer.isPremium && (
    <button
      onClick={() => onPremium(customer._id)}
      className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-purple-500"
      title="Make Premium"
    >
      <FiStar size={16} />
    </button>
  )}

  {/* Soft Delete */}
  {!customer.deleted && (
    <button
      onClick={() => onDelete(customer._id)}
      className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-red-500"
      title="Delete"
    >
      <FiTrash2 size={16} />
    </button>
  )}

  {/* Deleted Customers */}
  {customer.deleted && (
    <>
      <button
        onClick={() => onRestore(customer._id)}
        className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-green-600"
        title="Restore"
      >
        <FiRotateCcw size={16} />
      </button>

      <button
        onClick={() => onPermanentDelete(customer._id)}
        className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-red-700"
        title="Permanent Delete"
      >
        <FiTrash2 size={16} />
      </button>
    </>
  )}

</div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// ---------- 4. CustomerSearch ----------
export const CustomerSearch = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="relative flex-1">
      <FiSearch
        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
        size={18}
      />
      <input
        type="text"
        placeholder="Search by name, email, or phone..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-200  bg-gray-50/70  focus:outline-none focus:ring-2 focus:ring-emerald-400/60 text-sm dark:text-white placeholder-gray-400 "
      />
    </div>
  );
};

// ---------- 5. CustomerFilters ----------
export const CustomerFilters = ({
  filterStatus,
  setFilterStatus,
  filterSort,
  setFilterSort,
  resetFilters,
}) => {
  return (
    <div className="flex flex-wrap gap-3">
      <select
        value={filterStatus}
        onChange={(e) => setFilterStatus(e.target.value)}
        className="px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/70  text-sm  focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
      >
        <option value="all">All Status</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
        <option value="blocked">Blocked</option>
      </select>
      <select
        value={filterSort}
        onChange={(e) => setFilterSort(e.target.value)}
        className="px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/70  text-sm  focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
      >
        <option value="newest">Newest</option>
        <option value="oldest">Oldest</option>
        <option value="highest_spent">Highest Spent</option>
        <option value="most_orders">Most Orders</option>
      </select>
      {/* <button
        onClick={resetFilters}
        className="px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/70  text-sm  focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
      >
        <FiRefreshCw size={16} />
        Reset
      </button> */}
    </div>
  );
};

// ---------- 6. CustomerPagination ----------
export const CustomerPagination = ({
  currentPage,
  totalPages,
  setCurrentPage,
}) => {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <button
        onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
        disabled={currentPage === 1}
        className="p-2 rounded-xl border border-gray-200 dark:border-gray-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800 transition"
      >
        <FiChevronLeft size={18} />
      </button>
      <span className="text-sm text-gray-600 dark:text-gray-300">
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
        disabled={currentPage === totalPages}
        className="p-2 rounded-xl border border-gray-200 dark:border-gray-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800 transition"
      >
        <FiChevronRight size={18} />
      </button>
    </div>
  );
};

// ---------- 7. CustomerStats (summary cards) ----------
export const CustomerStats = ({ stats }) => {
  const statItems = [
    {
      label: "Total Customers",
      value: stats?.totalCustomers ?? 0,
      icon: FiUser,
      color: "bg-blue-500",
    },
    {
      label: "Active Customers",
      value: stats?.activeCustomers ?? 0,
      icon: FiCheckCircle,
      color: "bg-emerald-500",
    },
    {
      label: "Premium Customers",
      value: stats?.premiumCustomers ?? 0,
      icon: FiPlus,
      color: "bg-purple-500",
    },
    {
      label: "Total Revenue",
      value: `₹${(stats?.totalRevenue ?? 0).toFixed(2)}`,
      icon: FiDollarSign,
      color: "bg-amber-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
      {statItems.map((item, idx) => {
        const Icon = item.icon;

        return (
          <div
            key={idx}
            className="bg-white rounded-2xl shadow-sm border border-gray-100/80 p-5"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {item.label}
                </p>

                <p className="text-2xl font-extrabold text-gray-800 dark:text-black mt-1">
                  {item.value}
                </p>
              </div>

              <div
                className={`w-12 h-12 rounded-xl ${item.color} flex items-center justify-center text-white`}
              >
                <Icon size={22} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ---------- 8. CustomerForm (add/edit) ----------
export const CustomerForm = ({
  initialData,
  onSubmit,
  onCancel,
  submitLabel = "Add Customer",
}) => {
  const [formData, setFormData] = useState({
    fullName: initialData?.fullName || "",
    mobile: initialData?.mobile || "",
    email: initialData?.email || "",
    city: initialData?.city || "",
    pincode: initialData?.pincode || "",
    address: initialData?.address || "",
    status: initialData?.status || "active",
    isPremium: initialData?.isPremium || false,
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Full Name *
        </label>
        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          className={`w-full px-4 py-2.5 rounded-xl border ${errors.fullName ? "border-red-500" : "border-gray-200 dark:border-gray-700"} bg-gray-50/70 dark:bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-emerald-400/60 dark:text-white`}
          placeholder="John Doe"
        />
        {errors.fullName && (
          <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-4 py-2.5 rounded-xl border ${errors.email ? "border-red-500" : "border-gray-200 dark:border-gray-700"} bg-gray-50/70 dark:bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-emerald-400/60 dark:text-white`}
            placeholder="john@example.com"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Phone
          </label>
          <input
            type="text"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/70 dark:bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-emerald-400/60 dark:text-white"
            placeholder="+91 98765 43210"
          />
        </div>
      </div>

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
          <option value="blocked">Blocked</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Address
        </label>
        <textarea
          name="address"
          value={formData.address}
          onChange={handleChange}
          rows="2"
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/70 dark:bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-emerald-400/60 dark:text-white resize-none"
          placeholder="123, Main Street, City"
        />
      </div>

      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        city
        </label>
        <textarea
          name="city"
          value={formData.city}
          onChange={handleChange}
          rows="2"
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/70 dark:bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-emerald-400/60 dark:text-white resize-none"
          placeholder="City"
        />
      </div>

      <label>
        <input
          type="checkbox"
          checked={formData.isPremium}
          onChange={(e) =>
            setFormData({
              ...formData,
              isPremium: e.target.checked,
            })
          }
        />
        Premium Customer
      </label>

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
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold shadow-lg shadow-emerald-200/50 dark:shadow-emerald-900/30 transition"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
};

// ---------- 9. CustomerProfileModal ----------
export const CustomerProfileModal = ({ isOpen, onClose, customer }) => {
  if (!customer) return null;

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
            className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white text-2xl font-bold">
                 {customer.fullName?.charAt(0).toUpperCase() || "?"}
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold text-gray-800 dark:text-white">
                    {customer.fullName}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {customer.email}
                  </p>
                  <div className="mt-1">
                    <CustomerStatusBadge status={customer.status} />
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                <FiX size={22} className="text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Phone
                </p>
                <p className="font-medium text-gray-800 dark:text-white">
                  {customer.phone || "N/A"}
                </p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Joined
                </p>
                <p className="font-medium text-gray-800 dark:text-white">
                  {new Date(customer.joinedDate).toLocaleDateString()}
                </p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Total Orders
                </p>
                <p className="font-medium text-gray-800 dark:text-white">
                  {customer.totalOrders}
                </p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Total Spent
                </p>
                <p className="font-medium text-gray-800 dark:text-white">
                  ₹{customer.totalSpent}
                </p>
              </div>
            </div>

            {customer.address && (
              <div className="mb-4">
                <h3 className="font-semibold text-gray-800 dark:text-white flex items-center gap-2 mb-2">
                  <FiMapPin className="text-emerald-500" /> Address
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {customer.address}
                </p>
              </div>
            )}

            {customer.notes && (
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-white flex items-center gap-2 mb-2">
                  <FiMessageCircle className="text-emerald-500" /> Notes
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {customer.notes}
                </p>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ---------- 10. DeleteCustomerModal ----------
export const DeleteCustomerModal = ({ isOpen, onClose, onConfirm }) => {
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
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl max-w-md w-full p-6"
          >
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
              Delete Customer
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to delete this customer? This action cannot
              be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className="px-5 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold shadow-lg shadow-red-200/50 dark:shadow-red-900/30 transition"
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

// ---------- 11. CustomerAddressCard ----------
export const CustomerAddressCard = ({ address, onEdit, onDelete }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100/80 dark:border-gray-700/80 p-4">
      <div className="flex justify-between items-start">
        <div>
          <p className="font-medium text-gray-800 dark:text-white">
            {address.label || "Address"}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {address.line1}
          </p>
          {address.line2 && (
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {address.line2}
            </p>
          )}
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {address.city}, {address.state} - {address.pincode}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(address)}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-emerald-500"
          >
            <FiEdit2 size={16} />
          </button>
          <button
            onClick={() => onDelete(address.id)}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-red-500"
          >
            <FiTrash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

// ---------- 12. CustomerOrderHistory ----------
export const CustomerOrderHistory = ({ orders }) => {
  if (!orders || orders.length === 0) {
    return (
      <p className="text-gray-500 dark:text-gray-400 text-sm">No orders yet.</p>
    );
  }
  return (
    <div className="space-y-3">
      {orders.map((order) => (
        <div
          key={order.id}
          className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-4"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="font-medium text-gray-800 dark:text-white">
                {order.orderNumber}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {new Date(order.date).toLocaleDateString()}
              </p>
            </div>
            <span className="font-bold text-gray-800 dark:text-white">
              ₹{order.total}
            </span>
          </div>
          <div className="flex justify-between items-center mt-2 text-sm">
            <span className="text-gray-600 dark:text-gray-300">
              {order.items} items
            </span>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                order.status === "delivered"
                  ? "bg-emerald-100 text-emerald-700"
                  : order.status === "cancelled"
                    ? "bg-red-100 text-red-700"
                    : "bg-amber-100 text-amber-700"
              }`}
            >
              {order.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

// ---------- 13. CustomerWishlist ----------
export const CustomerWishlist = ({ items }) => {
  if (!items || items.length === 0) {
    return (
      <p className="text-gray-500 dark:text-gray-400 text-sm">
        Wishlist is empty.
      </p>
    );
  }
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div
          key={item.id}
          className="flex items-center gap-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-3"
        >
          <img
            src={item.image}
            alt={item.name}
            className="w-16 h-16 rounded-lg object-cover"
          />
          <div className="flex-1">
            <p className="font-medium text-gray-800 dark:text-white">
              {item.name}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              ₹{item.price}
            </p>
          </div>
          <button className="px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 transition text-sm">
            Add to Cart
          </button>
        </div>
      ))}
    </div>
  );
};

// ---------- 14. CustomerReviews ----------
export const CustomerReviews = ({ reviews }) => {
  if (!reviews || reviews.length === 0) {
    return (
      <p className="text-gray-500 dark:text-gray-400 text-sm">
        No reviews yet.
      </p>
    );
  }
  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div
          key={review.id}
          className="border-b border-gray-100 dark:border-gray-700 pb-4 last:border-0"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="font-medium text-gray-800 dark:text-white">
                {review.product}
              </p>
              <div className="flex items-center gap-1 text-amber-400 text-sm">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i}>{i < review.rating ? "★" : "☆"}</span>
                ))}
              </div>
            </div>
            <span className="text-xs text-gray-400 dark:text-gray-500">
              {new Date(review.date).toLocaleDateString()}
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
            {review.comment}
          </p>
        </div>
      ))}
    </div>
  );
};

// ---------- 15. CustomerActivity ----------
export const CustomerActivity = ({ activities }) => {
  if (!activities || activities.length === 0) {
    return (
      <p className="text-gray-500 dark:text-gray-400 text-sm">
        No recent activity.
      </p>
    );
  }
  return (
    <div className="space-y-3">
      {activities.map((activity, idx) => (
        <div key={idx} className="flex items-start gap-3 text-sm">
          <div className="mt-1">
            {activity.type === "order" && (
              <FiShoppingBag className="text-emerald-500" size={16} />
            )}
            {activity.type === "login" && (
              <FiUser className="text-blue-500" size={16} />
            )}
            {activity.type === "review" && (
              <FiStar className="text-amber-500" size={16} />
            )}
            {activity.type === "wishlist" && (
              <FiHeart className="text-red-500" size={16} />
            )}
          </div>
          <div className="flex-1">
            <p className="text-gray-700 dark:text-gray-200">
              {activity.description}
            </p>
            <span className="text-xs text-gray-400 dark:text-gray-500">
              {new Date(activity.timestamp).toLocaleString()}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

// ---------- 16. CustomerNotes ----------
export const CustomerNotes = ({ notes, onAddNote, onDeleteNote }) => {
  const [newNote, setNewNote] = useState("");

  const handleAdd = () => {
    if (newNote.trim()) {
      onAddNote(newNote);
      setNewNote("");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          type="text"
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Add a note..."
          className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/70 dark:bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-emerald-400/60 dark:text-white text-sm"
        />
        <button
          onClick={handleAdd}
          className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold transition"
        >
          Add
        </button>
      </div>
      {notes && notes.length > 0 ? (
        <div className="space-y-2">
          {notes.map((note, idx) => (
            <div
              key={idx}
              className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 flex justify-between items-start"
            >
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-200">
                  {note.text}
                </p>
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  {new Date(note.timestamp).toLocaleString()}
                </span>
              </div>
              <button
                onClick={() => onDeleteNote(idx)}
                className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-red-500"
              >
                <FiTrash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          No notes yet.
        </p>
      )}
    </div>
  );
};
