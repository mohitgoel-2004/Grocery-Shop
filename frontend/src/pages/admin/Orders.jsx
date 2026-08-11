import React, { useState, useEffect, createContext, useContext } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiPackage,
  FiSearch,
  FiRefreshCw,
  FiChevronLeft,
  FiChevronRight,
  FiTruck,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiArrowLeft,
  FiUser,
  FiCalendar,
  FiDollarSign,
  FiMapPin,
  FiCreditCard,
  FiEdit2,
  FiPrinter,
  FiDownload,
  FiGrid,
  FiList,
  FiFilter,
  FiAlertCircle,
  FiShoppingBag,
  FiTrendingUp,
  FiRotateCcw ,
} from "react-icons/fi";

import { useOrders } from "../../Context/OrderContext";
import { OrderStatusBadge } from "../../components/admin/Order";

// ---------- STATUS CONFIGURATION WITH ICONS ----------
const statusIconConfig = {
  pending: { icon: FiClock, bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-200" },
  processing: { icon: FiRefreshCw, bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-200" },
  shipped: { icon: FiTruck, bg: "bg-indigo-50", text: "text-indigo-600", border: "border-indigo-200" },
  delivered: { icon: FiCheckCircle, bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-200" },
  cancelled: { icon: FiXCircle, bg: "bg-red-50", text: "text-red-600", border: "border-red-200" },
  returned: { icon: FiRotateCcw, bg: "bg-pink-50", text: "text-pink-600", border: "border-pink-200" },
  refund: { icon: FiDollarSign, bg: "bg-purple-50", text: "text-purple-600", border: "border-purple-200" },
};

// ---------- ORDER CARD (Enhanced Grid View) ----------
const OrderCard = ({ order, onViewDetails, onStatusChange }) => {
  const statusKey = String(order.status || "").trim().toLowerCase();
  const statusIcon = statusIconConfig[statusKey]?.icon || FiPackage;
  const statusBg = statusIconConfig[statusKey]?.bg || "bg-gray-50";
  const statusText = statusIconConfig[statusKey]?.text || "text-gray-600";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm hover:shadow-xl transition-all duration-300"
    >
      <div className="relative p-4 md:p-5 space-y-4">
        {/* Status Badge - Top Right */}
        <div className="absolute top-3 right-3">
          <OrderStatusBadge status={order.status} />
        </div>

        {/* Order Header */}
        <div className="flex items-start justify-between pr-20">
          <div>
            <p className="font-bold text-slate-800 text-base md:text-lg flex items-center gap-2">
              <FiShoppingBag className="text-emerald-500" size={16} />
              {order.orderNumber}
            </p>
            <p className="text-sm text-slate-500 mt-0.5 flex items-center gap-1">
              <FiUser size={12} />
              {order.customer}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between py-2 border-t border-b border-slate-100">
          <div>
            <p className="text-xs text-slate-400">Total Amount</p>
            <p className="text-xl font-bold text-slate-800">₹{order.total}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-400">Items</p>
            <p className="text-lg font-semibold text-slate-600">{order.items?.length || 0}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-400">Date</p>
            <p className="text-sm font-medium text-slate-600">
              {new Date(order.createdAt).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>

        {/* Status Update Dropdown */}
        <div>
          <label className="text-xs font-semibold text-slate-500 mb-1.5 block flex items-center gap-1.5">
            <FiEdit2 size={12} />
            Update Status
          </label>
          <div className="relative">
            <select
              value={order.status}
              onChange={(e) => onStatusChange(order._id, e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-400/60 focus:border-transparent transition appearance-none cursor-pointer hover:bg-slate-100"
            >
              <option value="pending">⏳ Pending</option>
              <option value="processing">🔄 Processing</option>
              <option value="shipped">🚚 Shipped</option>
              <option value="delivered">✅ Delivered</option>
              <option value="cancelled">❌ Cancelled</option>
              <option value="returned">↩️ Returned</option>
              <option value="refund">💰 Refund</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => onViewDetails(order._id)}
          className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 active:scale-[0.98] transition-all duration-200 py-2.5 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-sm shadow-emerald-200/50"
        >
          <FiPackage size={16} />
          View Details
        </button>
      </div>
    </motion.div>
  );
};

// ---------- ORDER TABLE (Enhanced Table View) ----------
const OrderTable = ({ orders, onViewDetails, onStatusChange }) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gradient-to-r from-slate-50 to-slate-100/50 border-b border-slate-200/80">
            <tr className="text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
              <th className="px-4 py-3.5">Order</th>
              <th className="px-4 py-3.5">Customer</th>
              <th className="px-4 py-3.5 hidden md:table-cell">Date</th>
              <th className="px-4 py-3.5">Total</th>
              <th className="px-4 py-3.5 hidden sm:table-cell">Status</th>
              <th className="px-4 py-3.5 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100/80">
            {orders.map((order, index) => (
              <motion.tr
                key={order._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                className="hover:bg-emerald-50/30 transition-colors duration-150"
              >
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-2">
                    <FiShoppingBag className="text-emerald-500" size={14} />
                    <span className="font-medium text-slate-800">{order.orderNumber}</span>
                  </div>
                </td>
                <td className="px-4 py-3.5 text-slate-600">{order.customer}</td>
                <td className="px-4 py-3.5 text-slate-600 hidden md:table-cell">
                  {new Date(order.createdAt).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </td>
                <td className="px-4 py-3.5 font-bold text-slate-800">₹{order.total}</td>
                <td className="px-4 py-3.5 hidden sm:table-cell">
                  <OrderStatusBadge status={order.status} />
                </td>
                <td className="px-4 py-3.5 text-center">
                  <button
                    onClick={() => onViewDetails(order._id)}
                    className="group relative overflow-hidden rounded-lg bg-emerald-50 px-4 py-1.5 text-xs font-medium text-emerald-700 transition-all duration-200 hover:bg-emerald-100 hover:shadow-md"
                  >
                    <span className="relative z-10">View</span>
                    <span className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-emerald-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ---------- ORDER FILTERS & SEARCH (Enhanced) ----------
const OrderFilters = () => {
  const {
    searchTerm,
    setSearchTerm,
    filterStatus,
    setFilterStatus,
    resetFilters,
  } = useOrders();

  const statusOptions = [
    { value: 'all', label: 'All Orders', icon: FiPackage },
    { value: 'pending', label: 'Pending', icon: FiClock },
    { value: 'processing', label: 'Processing', icon: FiRefreshCw },
    { value: 'shipped', label: 'Shipped', icon: FiTruck },
    { value: 'delivered', label: 'Delivered', icon: FiCheckCircle },
    { value: 'cancelled', label: 'Cancelled', icon: FiXCircle },
    { value: 'returned', label: 'Returned', icon: FiRotateCcw },
    { value: 'refund', label: 'Refund', icon: FiDollarSign },
  ];

  const selectedOption = statusOptions.find(opt => opt.value === filterStatus);

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm md:p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search by order number or customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 pl-11 pr-4 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/60 focus:border-transparent transition"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <FiFilter className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/70 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-400/60 focus:border-transparent transition appearance-none cursor-pointer hover:bg-slate-100"
            >
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          <button
            onClick={resetFilters}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-2.5 text-sm text-slate-600 transition hover:bg-slate-100 hover:border-slate-300"
          >
            <FiRefreshCw size={16} />
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

// ---------- PAGINATION (Enhanced) ----------
const OrderPagination = () => {
  const { currentPage, setCurrentPage, totalPages } = useOrders();
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
      <button
        onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
        disabled={currentPage === 1}
        className="rounded-xl border border-slate-200 p-2.5 transition hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <FiChevronLeft size={18} />
      </button>

      {getPageNumbers().map((page, idx) => (
        <React.Fragment key={idx}>
          {page === '...' ? (
            <span className="px-3 py-1 text-slate-400">...</span>
          ) : (
            <button
              onClick={() => setCurrentPage(page)}
              className={`px-4 py-1.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                currentPage === page
                  ? 'bg-emerald-500 text-white shadow-md shadow-emerald-200/50'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {page}
            </button>
          )}
        </React.Fragment>
      ))}

      <button
        onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
        disabled={currentPage === totalPages}
        className="rounded-xl border border-slate-200 p-2.5 transition hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <FiChevronRight size={18} />
      </button>
    </div>
  );
};

// ============================================================
// PAGE: ORDERS (Main page with tabs)
// ============================================================
export const OrdersPage = () => {
  const navigate = useNavigate();
  const { orders, allOrders, loading, updateOrderStatus } = useOrders();
  const [viewMode, setViewMode] = useState("grid");

  const handleViewDetails = (id) => {
    navigate(`/admin/orders/${id}`);
  };

  const handleStatusChange = async (id, status) => {
    try {
      await updateOrderStatus(id, status);
    } catch (err) {
      console.log(err);
    }
  };

  const statusTabs = [
    { label: "All", value: "all", path: "/admin/orders", icon: FiPackage },
    { label: "Pending", value: "pending", path: "/admin/orders/pending", icon: FiClock },
    { label: "Processing", value: "processing", path: "/admin/orders/processing", icon: FiRefreshCw },
    { label: "Shipped", value: "shipped", path: "/admin/orders/shipped", icon: FiTruck },
    { label: "Delivered", value: "delivered", path: "/admin/orders/delivered", icon: FiCheckCircle },
    { label: "Cancelled", value: "cancelled", path: "/admin/orders/cancelled", icon: FiXCircle },
    { label: "Returned", value: "returned", path: "/admin/orders/returned", icon: FiRotateCcw },
    { label: "Refund", value: "refund", path: "/admin/orders/refund", icon: FiDollarSign },
  ];

  // Get counts for each status
  const getStatusCount = (status) => {
    if (status === 'all') return allOrders.length;
    return allOrders.filter(o => o.status?.toLowerCase() === status).length;
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-3 text-2xl md:text-3xl font-extrabold text-slate-900">
            <div className="p-2.5 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-200/50">
              <FiPackage size={24} />
            </div>
            Order Management
          </h1>
          <p className="mt-1 text-sm text-slate-500 flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400"></span>
            Track and manage all customer orders
          </p>
        </div>
        <div className="flex items-center gap-2 bg-slate-100/50 p-1 rounded-xl border border-slate-200/60">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2.5 rounded-lg transition-all duration-200 ${
              viewMode === "grid" 
                ? "bg-white shadow-sm text-emerald-600" 
                : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
            }`}
          >
            <FiGrid size={18} />
          </button>
          <button
            onClick={() => setViewMode("table")}
            className={`p-2.5 rounded-lg transition-all duration-200 ${
              viewMode === "table" 
                ? "bg-white shadow-sm text-emerald-600" 
                : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
            }`}
          >
            <FiList size={18} />
          </button>
        </div>
      </div>

    {/* Quick Status Tabs */}
<div className="flex flex-nowrap gap-1.5 overflow-x-auto rounded-2xl border border-slate-200/80 bg-white p-1.5 shadow-sm scrollbar-hide md:flex-wrap">
  {statusTabs.map((tab) => {
    const isActive =
      (tab.value === "all" &&
        window.location.pathname === "/admin/orders") ||
      window.location.pathname === tab.path;

    const count = getStatusCount(tab.value);
    const Icon = tab.icon;

    return (
      <Link
        key={tab.value}
        to={tab.path}
        className={`flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-medium transition-all duration-200 ${
          isActive
            ? "bg-emerald-500 text-white shadow-md shadow-emerald-200/50"
            : "text-slate-600 hover:bg-slate-100"
        }`}
      >
        <Icon size={15} />

        {tab.label}

        {count > 0 && (
          <span
            className={`rounded-full px-1.5 py-0.5 text-xs ${
              isActive
                ? "bg-white/20 text-white"
                : "bg-slate-200 text-slate-600"
            }`}
          >
            {count}
          </span>
        )}
      </Link>
    );
  })}
</div>
      <OrderFilters />

      {/* Stats Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl bg-white border border-slate-200/80 p-3 shadow-sm">
          <p className="text-xs text-slate-400">Total Orders</p>
          <p className="text-xl font-bold text-slate-800">{allOrders.length}</p>
        </div>
        <div className="rounded-xl bg-white border border-slate-200/80 p-3 shadow-sm">
          <p className="text-xs text-slate-400">Pending</p>
          <p className="text-xl font-bold text-amber-600">{getStatusCount('pending')}</p>
        </div>
        <div className="rounded-xl bg-white border border-slate-200/80 p-3 shadow-sm">
          <p className="text-xs text-slate-400">Processing</p>
          <p className="text-xl font-bold text-blue-600">{getStatusCount('processing')}</p>
        </div>
        <div className="rounded-xl bg-white border border-slate-200/80 p-3 shadow-sm">
          <p className="text-xs text-slate-400">Delivered</p>
          <p className="text-xl font-bold text-emerald-600">{getStatusCount('delivered')}</p>
        </div>
      </div>

      {/* Order List */}
      {loading ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm animate-pulse"
            >
              <div className="p-4 space-y-4">
                <div className="flex justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="h-5 w-3/4 rounded bg-slate-200"></div>
                    <div className="h-4 w-1/2 rounded bg-slate-200"></div>
                  </div>
                  <div className="h-8 w-20 rounded-full bg-slate-200"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-10 rounded bg-slate-200"></div>
                  <div className="h-10 rounded bg-slate-200"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : allOrders.length === 0 ? (
        <div className="text-center py-16 rounded-2xl border border-slate-200/80 bg-white">
          <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto">
            <FiPackage size={40} className="text-slate-300" />
          </div>
          <h3 className="mt-4 text-xl font-semibold text-slate-600">
            No orders found
          </h3>
          <p className="text-slate-400 mt-1">
            Try adjusting your search or filters
          </p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {orders.map((order) => (
            <OrderCard
              key={order._id}
              order={order}
              onViewDetails={handleViewDetails}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      ) : (
        <OrderTable
          orders={orders}
          onViewDetails={handleViewDetails}
          onStatusChange={handleStatusChange}
        />
      )}

      <OrderPagination />
    </div>
  );
};

// ============================================================
// PAGE: ORDER DETAILS (Enhanced)
// ============================================================
export const OrderDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { orders, updateOrderStatus } = useOrders();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const found = orders.find((o) => o._id === id);
    if (found) setOrder(found);
  }, [id, orders]);

  if (!order) {
    return (
      <div className="mx-auto max-w-4xl p-6 text-center">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-12 shadow-sm">
          <FiAlertCircle size={48} className="mx-auto text-slate-300" />
          <h3 className="mt-4 text-xl font-semibold text-slate-600">Order not found</h3>
          <p className="text-slate-400">The order you're looking for doesn't exist.</p>
          <Link to="/admin/orders" className="inline-block mt-4 text-emerald-600 hover:text-emerald-700 font-medium">
            ← Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  const handleStatusChange = (newStatus) => {
    updateOrderStatus(order._id, newStatus);
    setOrder({ ...order, status: newStatus });
  };

  return (
    <div className="mx-auto max-w-6xl p-4 sm:p-6">
      <Link
        to="/admin/orders"
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-emerald-600 transition-colors mb-6 group"
      >
        <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" size={18} />
        Back to Orders
      </Link>

      <div className="space-y-6">
        {/* Header Card */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap justify-between items-start gap-4">
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
                  <FiShoppingBag className="text-emerald-500" />
                  Order {order.orderNumber}
                </h1>
                <OrderStatusBadge status={order.status} />
              </div>
              <p className="text-sm text-slate-500 mt-1 flex items-center gap-2">
                <FiCalendar size={14} />
                Placed on {new Date(order.createdAt).toLocaleString('en-US', { 
                  weekday: 'short',
                  month: 'long', 
                  day: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            <div className="flex gap-2">
              <button className="rounded-xl border border-slate-200 p-2.5 transition hover:bg-slate-50 hover:border-slate-300">
                <FiPrinter size={18} className="text-slate-600" />
              </button>
              <button className="rounded-xl border border-slate-200 p-2.5 transition hover:bg-slate-50 hover:border-slate-300">
                <FiDownload size={18} className="text-slate-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Status Update */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <FiEdit2 size={16} className="text-emerald-500" />
              Update Status:
            </span>
            <div className="relative flex-1 max-w-xs">
              <select
                value={order.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-400/60 focus:border-transparent transition appearance-none cursor-pointer hover:bg-slate-100"
              >
                <option value="pending">⏳ Pending</option>
                <option value="processing">🔄 Processing</option>
                <option value="shipped">🚚 Shipped</option>
                <option value="delivered">✅ Delivered</option>
                <option value="cancelled">❌ Cancelled</option>
                <option value="returned">↩️ Returned</option>
                <option value="refund">💰 Refund</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            <span className="text-xs text-slate-400">
              Last updated: {new Date(order.updatedAt).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Customer Info */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
              <h3 className="flex items-center gap-2 font-semibold text-slate-800 mb-3">
                <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-500">
                  <FiUser size={18} />
                </div>
                Customer Information
              </h3>
              <div className="space-y-2 text-sm ml-1">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 w-20">Name:</span>
                  <span className="text-slate-800 font-medium">{order.user?.fullName || "Guest"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 w-20">Email:</span>
                  <span className="text-slate-600">{order.user?.email || "-"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 w-20">Phone:</span>
                  <span className="text-slate-600">{order.user?.mobile || "-"}</span>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
              <h3 className="flex items-center gap-2 font-semibold text-slate-800 mb-3">
                <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-500">
                  <FiMapPin size={18} />
                </div>
                Shipping Address
              </h3>
              <p className="text-sm text-slate-600 ml-1">
                {order.deliveryAddress || "Address not available"}
              </p>
              {order.notes && (
                <div className="mt-3 pt-3 border-t border-slate-100">
                  <p className="text-xs font-medium text-slate-500">Notes:</p>
                  <p className="text-sm text-slate-600 mt-1">{order.notes}</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Payment Details */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
              <h3 className="flex items-center gap-2 font-semibold text-slate-800 mb-3">
                <div className="p-1.5 rounded-lg bg-purple-50 text-purple-500">
                  <FiCreditCard size={18} />
                </div>
                Payment Details
              </h3>
              <div className="space-y-2 text-sm ml-1">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 w-28">Method:</span>
                  <span className="text-slate-800 font-medium uppercase">{order.paymentMethod || "N/A"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 w-28">Status:</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    order.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {order.paymentStatus || "Pending"}
                  </span>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
              <h3 className="flex items-center gap-2 font-semibold text-slate-800 mb-3">
                <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-500">
                  <FiDollarSign size={18} />
                </div>
                Order Summary
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Subtotal</span>
                  <span className="font-medium text-slate-700">₹{Number(order.subtotal || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Delivery Charge</span>
                  <span className="font-medium text-slate-700">₹{Number(order.deliveryCharge || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Tax</span>
                  <span className="font-medium text-slate-700">₹{Number(order.tax || 0).toFixed(2)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-500">Discount</span>
                    <span className="font-medium text-red-500">-₹{Number(order.discount || 0).toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between py-2 font-bold text-slate-800 border-t-2 border-slate-200">
                  <span>Total</span>
                  <span className="text-lg text-emerald-600">₹{Number(order.total || 0).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Items List */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <h3 className="flex items-center gap-2 font-semibold text-slate-800 mb-4">
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-500">
              <FiPackage size={18} />
            </div>
            Order Items ({order.items?.length || 0})
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50/80 rounded-xl">
                <tr className="text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <th className="px-4 py-2.5">Product</th>
                  <th className="px-4 py-2.5 text-center">Quantity</th>
                  <th className="px-4 py-2.5 text-right">Price</th>
                  <th className="px-4 py-2.5 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/80">
                {order.items.map((item, idx) => (
                  <motion.tr
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-4 py-3 text-slate-800 font-medium">{item.name}</td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 text-slate-700 font-semibold text-sm">
                        {item.quantity}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-slate-600">₹{Number(item.price || 0).toFixed(0)}</td>
                    <td className="px-4 py-3 text-right font-bold text-slate-800">₹{Number(item.price || 0) * Number(item.quantity || 0)}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// HELPER: Filtered status page generator (Enhanced)
// ============================================================
const createStatusPage = (status, title) => {
  return () => {
    const navigate = useNavigate();
    const { allOrders, loading } = useOrders();

    const filtered = allOrders.filter((o) => {
      return o.status?.toLowerCase() === status.toLowerCase();
    });

    const handleViewDetails = (id) => {
      navigate(`/admin/orders/${id}`);
    };

    const statusIcons = {
      pending: { icon: FiClock, color: "text-amber-600", bg: "bg-amber-50" },
      processing: { icon: FiRefreshCw, color: "text-blue-600", bg: "bg-blue-50" },
      shipped: { icon: FiTruck, color: "text-indigo-600", bg: "bg-indigo-50" },
      delivered: { icon: FiCheckCircle, color: "text-emerald-600", bg: "bg-emerald-50" },
      cancelled: { icon: FiXCircle, color: "text-red-600", bg: "bg-red-50" },
      returned: { icon: FiRotateCcw, color: "text-pink-600", bg: "bg-pink-50" },
      refund: { icon: FiDollarSign, color: "text-purple-600", bg: "bg-purple-50" },
    };

    const config = statusIcons[status] || statusIcons.pending;
    const Icon = config.icon;

    return (
      <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6">
        <div className="flex flex-wrap items-center gap-4">
          <Link
            to="/admin/orders"
            className="flex items-center gap-2 text-slate-500 hover:text-emerald-600 transition-colors group"
          >
            <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" size={20} />
            Back
          </Link>
          <div className={`flex items-center gap-3 px-5 py-3 rounded-2xl ${config.bg} border border-slate-200/80`}>
            <div className={`p-2 rounded-xl ${config.bg} shadow-sm`}>
              <Icon className={config.color} size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900">{title}</h1>
              <p className="text-sm text-slate-500">{filtered.length} orders</p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-slate-200/80 bg-white p-4 animate-pulse">
                <div className="space-y-3">
                  <div className="h-5 w-3/4 rounded bg-slate-200"></div>
                  <div className="h-4 w-1/2 rounded bg-slate-200"></div>
                  <div className="h-20 rounded bg-slate-200"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-slate-200/80 bg-white p-16 text-center shadow-sm">
            <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto">
              <Icon size={40} className="text-slate-300" />
            </div>
            <h3 className="mt-4 text-xl font-semibold text-slate-600">No {status} orders</h3>
            <p className="text-slate-400">All orders are being processed or completed</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((order) => (
              <OrderCard
                key={order._id}
                order={order}
                onViewDetails={handleViewDetails}
                onStatusChange={() => {}}
              />
            ))}
          </div>
        )}
      </div>
    );
  };
};

// ============================================================
// EXPORT ALL STATUS PAGES
// ============================================================
export const PendingOrdersPage = createStatusPage("pending", "Pending Orders");
export const ProcessingOrdersPage = createStatusPage("processing", "Processing Orders");
export const ShippedOrdersPage = createStatusPage("shipped", "Shipped Orders");
export const DeliveredOrdersPage = createStatusPage("delivered", "Delivered Orders");
export const CancelledOrdersPage = createStatusPage("cancelled", "Cancelled Orders");
export const ReturnedOrdersPage = createStatusPage("returned", "Returned Orders");
export const RefundOrdersPage = createStatusPage("refund", "Refund Orders");

// Also export the main Orders page as Orders
export default OrdersPage;