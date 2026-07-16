import React, { useState, useEffect, createContext, useContext } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiPackage, FiSearch, FiRefreshCw, FiChevronLeft, FiChevronRight, FiTruck, FiCheckCircle, FiXCircle, FiClock, FiArrowLeft, FiUser, FiCalendar, FiDollarSign,
  FiMapPin, FiCreditCard, FiEdit2, FiPrinter, FiDownload} from 'react-icons/fi';

import { useOrders } from '../../Context/OrderContext';
import { OrderStatusBadge } from "../../components/admin/Order";



// ---------- ORDER CARD (for grid view) ----------
const OrderCard = ({ order, onViewDetails, onStatusChange }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
      <div className="p-4 space-y-4">

        <div className="flex justify-between">
          <div>
            <p className="font-bold">{order.orderNumber}</p>
            <p className="text-sm text-gray-500">{order.customer}</p>
          </div>

          <OrderStatusBadge status={order.status} />
        </div>

        <div className="flex justify-between">
          <span>₹{order.total}</span>
          <span>{order.items.length} Items</span>
        </div>

        {/* STATUS DROPDOWN */}

        <div>
          <label className="text-xs font-semibold text-gray-500 mb-1 block">
            Update Status
          </label>

          <select
            value={order.status}
            onChange={(e) => onStatusChange(order._id, e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
          >
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
            <option value="returned">Returned</option>
            <option value="refund">Refund</option>
          </select>
        </div>

        <button
          onClick={() => onViewDetails(order._id)}
          className="w-full bg-emerald-500 text-white rounded-lg py-2"
        >
          View Details
        </button>

      </div>
    </div>
  );
}

// ---------- ORDER TABLE (for table view) ----------
const OrderTable = ({ orders, onViewDetails, onStatusChange }) => {
  return (
    <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100/80 dark:border-gray-700/80">
      <table className="w-full text-sm">
        <thead className="bg-gray-50/80 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
          <tr className="text-left text-gray-500 dark:text-gray-400 text-xs font-medium uppercase tracking-wider">
            <th className="px-4 py-3">Order</th>
            <th className="px-4 py-3">Customer</th>
            <th className="px-4 py-3">Date</th>
            <th className="px-4 py-3">Total</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3 text-center">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
          {orders.map((order) => (
            <tr key={order._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition">
              <td className="px-4 py-3 font-medium text-gray-800 dark:text-white">{order.orderNumber}</td>
              <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{order.customer}</td>
              <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                {new Date(order.createdAt).toLocaleDateString()}
              </td>
              <td className="px-4 py-3 font-bold text-gray-800 dark:text-white">₹{order.total}</td>
              <td className="px-4 py-3"><
                OrderStatusBadge status={order.status} /></td>
              <td className="px-4 py-3 text-center">
                <button
                  onClick={() => onViewDetails(order._id)}
                  className="px-4 py-1.5 rounded-lg text-xs font-medium bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:hover:bg-emerald-900/50 transition"
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// ---------- ORDER FILTERS & SEARCH ----------
const OrderFilters = () => {
  const { searchTerm, setSearchTerm, filterStatus, setFilterStatus, resetFilters } = useOrders();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100/80 dark:border-gray-700/80 p-4 sm:p-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
          <input
            type="text"
            placeholder="Search by order number or customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/70 dark:bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-emerald-400/60 text-sm dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
          />
        </div>
        <div className="flex flex-wrap gap-3">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/70 dark:bg-gray-700/50 text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
          >
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
            <option value="returned">Returned</option>
            <option value="refund">Refund</option>
          </select>
          <button
            onClick={resetFilters}
            className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/70 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-600 transition text-gray-600 dark:text-gray-300 flex items-center gap-2"
          >
            <FiRefreshCw size={16} />
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

// ---------- PAGINATION ----------
const OrderPagination = () => {
  const { currentPage, setCurrentPage, totalPages } = useOrders();
  if (totalPages <= 1) return null;
  return (
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
  );
};

// ============================================================
// PAGE: ORDERS (Main page with tabs)
// ============================================================
export const OrdersPage = () => {
  const navigate = useNavigate();
  const {
    orders,
    allOrders,
    loading,
    updateOrderStatus,
  } = useOrders();

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

  // Quick status tabs for navigation to dedicated pages
  const statusTabs = [
    { label: 'All', value: 'all', path: '/admin/orders' },
    { label: 'Pending', value: 'pending', path: '/admin/orders/pending' },
    { label: 'Processing', value: 'processing', path: '/admin/orders/processing' },
    { label: 'Shipped', value: 'shipped', path: '/admin/orders/shipped' },
    { label: 'Delivered', value: 'delivered', path: '/admin/orders/delivered' },
    { label: 'Cancelled', value: 'cancelled', path: '/admin/orders/cancelled' },
    { label: 'Returned', value: 'returned', path: '/admin/orders/returned' },
    { label: 'Refund', value: 'refund', path: '/admin/orders/refund' },
  ];

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-800 dark:text-white flex items-center gap-2">
            <FiPackage className="text-emerald-500" />
            Order Management
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Track and manage all grocery orders.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2.5 rounded-xl border ${viewMode === 'grid' ? 'bg-emerald-100 border-emerald-300 dark:bg-emerald-900/30' : 'border-gray-200 dark:border-gray-700'} hover:bg-gray-100 dark:hover:bg-gray-700 transition`}
          >
            {/* <FiGrid size={18} /> */}
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`p-2.5 rounded-xl border ${viewMode === 'table' ? 'bg-emerald-100 border-emerald-300 dark:bg-emerald-900/30' : 'border-gray-200 dark:border-gray-700'} hover:bg-gray-100 dark:hover:bg-gray-700 transition`}
          >
            {/* <FiList size={18} /> */}
          </button>
        </div>
      </div>

      {/* Quick Status Tabs */}
      <div className="flex flex-wrap gap-2 bg-white dark:bg-gray-800 rounded-2xl p-2 border border-gray-100/80 dark:border-gray-700/80">
        {statusTabs.map((tab) => (
          <Link
            key={tab.value}
            to={tab.path}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
              (tab.value === 'all' && window.location.pathname === '/admin/orders') ||
              window.location.pathname === tab.path
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      <OrderFilters />

      {/* Order List */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100/80 dark:border-gray-700/80 overflow-hidden animate-pulse">
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
              </div>
            </div>
          ))}
        </div>
      ) : allOrders.length === 0 ? (
        <div className="text-center py-16">
          <FiPackage size={64} className="mx-auto text-gray-300 dark:text-gray-600" />
          <h3 className="mt-4 text-xl font-semibold text-gray-600 dark:text-gray-400">No orders found</h3>
          <p className="text-gray-400 dark:text-gray-500">Try adjusting your search or filters.</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
         {orders.map((order) => {
            

  return (
   <OrderCard
    key={order._id}
    order={order}
    onViewDetails={handleViewDetails}
    onStatusChange={handleStatusChange}
/>
  );
})}
         
        </div>
      ) : (
        <OrderTable orders={orders} onViewDetails={handleViewDetails} onStatusChange={handleStatusChange} />
      )}

      <OrderPagination />
    </div>
  );
};

// ============================================================
// PAGE: ORDER DETAILS
// ============================================================
export const OrderDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { orders, updateOrderStatus } = useOrders();
  const [order, setOrder] = useState(null);

  useEffect(() => {
   const found = orders.find(
    o => o._id === id
);
    if (found) setOrder(found);
  }, [id, orders]);

  if (!order) {
    return (
      <div className="p-6 text-center text-gray-600 dark:text-gray-300">
        <p>Order not found.</p>
        <Link to="/admin/orders" className="text-emerald-600 hover:underline">Back to Orders</Link>
      </div>
    );
  }

  const handleStatusChange = (newStatus) => {
    updateOrderStatus(order._id, newStatus);
    setOrder({ ...order, status: newStatus });
  };

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto">
      <Link to="/admin/orders" className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 mb-6">
        <FiArrowLeft /> Back to Orders
      </Link>

      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100/80 dark:border-gray-700/80 p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-wrap justify-between items-start gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-800 dark:text-white flex items-center gap-3">
              Order {order.orderNumber}
              <OrderStatusBadge status={order.status} />
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Placed on {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>
          <div className="flex gap-2">
            <button className="p-2 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
              <FiPrinter size={18} className="text-gray-600 dark:text-gray-300" />
            </button>
            <button className="p-2 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
              <FiDownload size={18} className="text-gray-600 dark:text-gray-300" />
            </button>
          </div>
        </div>

        {/* Status Update */}
        <div className="flex flex-wrap items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Update Status:</span>
          <select
            value={order.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
          >
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
            <option value="returned">Returned</option>
            <option value="refund">Refund</option>
          </select>
          <span className="text-xs text-gray-400">Last updated: {new Date(order.updatedAt).toLocaleString()}</span>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800 dark:text-white flex items-center gap-2">
              <FiUser className="text-emerald-500" /> Customer Info
            </h3>
            <div className="space-y-2 text-sm">
              <p><span className="text-gray-500 dark:text-gray-400">Name:</span> {order.customer}</p>
              <p><span className="text-gray-500 dark:text-gray-400">Email:</span> {order.email}</p>
              <p><span className="text-gray-500 dark:text-gray-400">Phone:</span> {order.phone}</p>
            </div>

            <h3 className="font-semibold text-gray-800 dark:text-white flex items-center gap-2 mt-4">
              <FiMapPin className="text-emerald-500" /> Shipping Address
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">{order.address}</p>
            {order.notes && (
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-white mt-4">Notes</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">{order.notes}</p>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800 dark:text-white flex items-center gap-2">
              <FiCreditCard className="text-emerald-500" /> Payment
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">{order.paymentMethod}</p>

            <h3 className="font-semibold text-gray-800 dark:text-white mt-4">Order Summary</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span>₹{order.subtotal}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Shipping</span><span>₹{order.shipping}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Tax</span><span>₹{order.tax}</span></div>
              {order.discount > 0 && (
                <div className="flex justify-between"><span className="text-gray-500">Discount</span><span>-₹{order.discount}</span></div>
              )}
              <div className="flex justify-between font-bold text-gray-800 dark:text-white border-t border-gray-200 dark:border-gray-700 pt-2">
                <span>Total</span><span>₹{order.total}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Items List */}
        <div>
          <h3 className="font-semibold text-gray-800 dark:text-white mb-3">Items</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-700/30">
                <tr className="text-left text-gray-500 dark:text-gray-400 text-xs uppercase">
                  <th className="px-4 py-2">Product</th>
                  <th className="px-4 py-2 text-center">Qty</th>
                  <th className="px-4 py-2 text-right">Price</th>
                  <th className="px-4 py-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, idx) => (
                  <tr key={idx} className="border-b border-gray-100 dark:border-gray-700/50">
                    <td className="px-4 py-2 text-gray-800 dark:text-white">{item.name}</td>
                    <td className="px-4 py-2 text-center text-gray-600 dark:text-gray-300">{item.quantity}</td>
                    <td className="px-4 py-2 text-right text-gray-600 dark:text-gray-300">₹{item.price}</td>
                    <td className="px-4 py-2 text-right font-bold text-gray-800 dark:text-white">₹{item.price * item.quantity}</td>
                  </tr>
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
// HELPER: Filtered status page generator
// ============================================================
const createStatusPage = (status, title) => {
  return () => {
    const navigate = useNavigate();
    const { allOrders, loading } = useOrders();
 console.log("TAB STATUS =", status);
console.log("ALL ORDERS =", allOrders);

const filtered = allOrders.filter((o) => {
  console.log("ORDER =", o);
  console.log("ORDER STATUS =", o.status);
  console.log("COMPARE =", o.status === status);

  return o.status?.toLowerCase() === status.toLowerCase();
});

console.log("FILTERED =", filtered);
    const handleViewDetails = (id) => {
      navigate(`/admin/orders/${id}`);
    };

    return (
      <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Link to="/admin/orders" className="text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400">
            <FiArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-extrabold text-gray-800 dark:text-white flex items-center gap-2">
            <FiPackage className="text-emerald-500" />
            {title}
          </h1>
          <span className="text-sm text-gray-500 dark:text-gray-400">({filtered.length} orders)</span>
        </div>

        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-500 dark:text-gray-400">No {status} orders found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {filtered.map((order) => (
              <OrderCard key={order._id} order={order} onViewDetails={handleViewDetails} />
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
export const PendingOrdersPage = createStatusPage('pending', 'Pending Orders');
export const ProcessingOrdersPage = createStatusPage('processing', 'Processing Orders');
export const ShippedOrdersPage = createStatusPage('shipped', 'Shipped Orders');
export const DeliveredOrdersPage = createStatusPage('delivered', 'Delivered Orders');
export const CancelledOrdersPage = createStatusPage('cancelled', 'Cancelled Orders');
export const ReturnedOrdersPage = createStatusPage('returned', 'Returned Orders');
export const RefundOrdersPage = createStatusPage('refund', 'Refund Orders');

// Also export the main Orders page as Orders (to match the naming)
export default OrdersPage;