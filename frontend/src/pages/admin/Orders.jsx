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
    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
      <div className="space-y-4 p-4">

        <div className="flex justify-between">
          <div>
            <p className="font-bold text-slate-900">{order.orderNumber}</p>
            <p className="text-sm text-slate-500">{order.customer}</p>
          </div>

          <OrderStatusBadge status={order.status} />
        </div>

        <div className="flex justify-between">
          <span className="font-semibold text-slate-900">₹{order.total}</span>
          <span className="text-slate-500">{order.items.length} Items</span>
        </div>

        {/* STATUS DROPDOWN */}

        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-500">
            Update Status
          </label>

          <select
            value={order.status}
            onChange={(e) => onStatusChange(order._id, e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-400"
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
          className="w-full rounded-lg bg-linear-to-r from-emerald-500 to-emerald-600 py-2 text-white"
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
    <div className="overflow-x-auto rounded-2xl border border-slate-100 bg-white shadow-sm">
      <table className="w-full text-sm">
        <thead className="border-b border-slate-100 bg-slate-50/80">
          <tr className="text-left text-xs font-medium uppercase tracking-wider text-slate-500">
            <th className="px-4 py-3">Order</th>
            <th className="px-4 py-3">Customer</th>
            <th className="px-4 py-3">Date</th>
            <th className="px-4 py-3">Total</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3 text-center">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100/80">
          {orders.map((order) => (
            <tr key={order._id} className="transition hover:bg-emerald-50/30">
              <td className="px-4 py-3 font-medium text-slate-900">{order.orderNumber}</td>
              <td className="px-4 py-3 text-slate-600">{order.customer}</td>
              <td className="px-4 py-3 text-slate-600">
                {new Date(order.createdAt).toLocaleDateString()}
              </td>
              <td className="px-4 py-3 font-bold text-slate-900">₹{order.total}</td>
              <td className="px-4 py-3"><
                OrderStatusBadge status={order.status} /></td>
              <td className="px-4 py-3 text-center">
                <button
                  onClick={() => onViewDetails(order._id)}
                  className="rounded-lg bg-emerald-100 px-4 py-1.5 text-xs font-medium text-emerald-700 transition hover:bg-emerald-200"
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
    <div className="rounded-3xl border border-slate-100 bg-white p-4 shadow-sm sm:p-6">
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search by order number or customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 pl-11 pr-4 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
          />
        </div>
        <div className="flex flex-wrap gap-3">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
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
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-2.5 text-slate-600 transition hover:bg-slate-100"
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
    <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="flex items-center gap-2 text-2xl font-extrabold text-slate-900">
            <FiPackage className="text-emerald-500" />
            Order Management
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Track and manage all grocery orders.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`rounded-xl border p-2.5 transition ${viewMode === 'grid' ? 'border-emerald-300 bg-emerald-100' : 'border-slate-200'} hover:bg-slate-100`}
          >
            {/* <FiGrid size={18} /> */}
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`rounded-xl border p-2.5 transition ${viewMode === 'table' ? 'border-emerald-300 bg-emerald-100' : 'border-slate-200'} hover:bg-slate-100`}
          >
            {/* <FiList size={18} /> */}
          </button>
        </div>
      </div>

      {/* Quick Status Tabs */}
      <div className="flex flex-wrap gap-2 rounded-2xl border border-slate-100 bg-white p-2">
        {statusTabs.map((tab) => (
          <Link
            key={tab.value}
            to={tab.path}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
              (tab.value === 'all' && window.location.pathname === '/admin/orders') ||
              window.location.pathname === tab.path
                ? 'bg-emerald-100 text-emerald-700'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      <OrderFilters />

      {/* Order List */}
      {loading ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm animate-pulse">
              <div className="p-4 space-y-3">
                <div className="h-4 w-3/4 rounded bg-slate-200"></div>
                <div className="h-3 w-1/2 rounded bg-slate-200"></div>
                <div className="h-6 w-20 rounded bg-slate-200"></div>
              </div>
            </div>
          ))}
        </div>
      ) : allOrders.length === 0 ? (
        <div className="text-center py-16">
          <FiPackage size={64} className="mx-auto text-slate-300" />
          <h3 className="mt-4 text-xl font-semibold text-slate-600">No orders found</h3>
          <p className="text-slate-400">Try adjusting your search or filters.</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
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
    <div className="mx-auto max-w-4xl p-4 sm:p-6">
      <Link to="/admin/orders" className="mb-6 inline-flex items-center gap-2 text-slate-600 hover:text-emerald-600">
        <FiArrowLeft /> Back to Orders
      </Link>

      <div className="space-y-6 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
        {/* Header */}
        <div className="flex flex-wrap justify-between items-start gap-4">
          <div>
            <h1 className="flex items-center gap-3 text-2xl font-extrabold text-slate-900">
              Order {order.orderNumber}
              <OrderStatusBadge status={order.status} />
            </h1>
            <p className="text-sm text-slate-500">
              Placed on {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>
          <div className="flex gap-2">
            <button className="rounded-xl border border-slate-200 p-2 transition hover:bg-slate-50">
              <FiPrinter size={18} className="text-slate-600" />
            </button>
            <button className="rounded-xl border border-slate-200 p-2 transition hover:bg-slate-50">
              <FiDownload size={18} className="text-slate-600" />
            </button>
          </div>
        </div>

        {/* Status Update */}
        <div className="flex flex-wrap items-center gap-3 rounded-xl bg-slate-50 p-4">
          <span className="text-sm font-medium text-slate-700">Update Status:</span>
          <select
            value={order.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          >
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
            <option value="returned">Returned</option>
            <option value="refund">Refund</option>
          </select>
          <span className="text-xs text-slate-400">Last updated: {new Date(order.updatedAt).toLocaleString()}</span>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 font-semibold text-slate-900">
              <FiUser className="text-emerald-500" /> Customer Info
            </h3>
            <div className="space-y-2 text-sm">
              <p><span className="text-slate-500">Name:</span> {order.customer}</p>
              <p><span className="text-slate-500">Email:</span> {order.email}</p>
              <p><span className="text-slate-500">Phone:</span> {order.phone}</p>
            </div>

            <h3 className="mt-4 flex items-center gap-2 font-semibold text-slate-900">
              <FiMapPin className="text-emerald-500" /> Shipping Address
            </h3>
            <p className="text-sm text-slate-600">{order.address}</p>
            {order.notes && (
              <div>
                <h3 className="mt-4 font-semibold text-slate-900">Notes</h3>
                <p className="text-sm text-slate-600">{order.notes}</p>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <h3 className="flex items-center gap-2 font-semibold text-slate-900">
              <FiCreditCard className="text-emerald-500" /> Payment
            </h3>
            <p className="text-sm text-slate-600">{order.paymentMethod}</p>

            <h3 className="mt-4 font-semibold text-slate-900">Order Summary</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between"><span className="text-slate-500">Subtotal</span><span>₹{order.subtotal}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Shipping</span><span>₹{order.shipping}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Tax</span><span>₹{order.tax}</span></div>
              {order.discount > 0 && (
                <div className="flex justify-between"><span className="text-slate-500">Discount</span><span>-₹{order.discount}</span></div>
              )}
              <div className="flex justify-between border-t border-slate-200 pt-2 font-bold text-slate-900">
                <span>Total</span><span>₹{order.total}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Items List */}
        <div>
          <h3 className="mb-3 font-semibold text-slate-900">Items</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr className="text-left text-xs uppercase text-slate-500">
                  <th className="px-4 py-2">Product</th>
                  <th className="px-4 py-2 text-center">Qty</th>
                  <th className="px-4 py-2 text-right">Price</th>
                  <th className="px-4 py-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, idx) => (
                  <tr key={idx} className="border-b border-slate-100/80">
                    <td className="px-4 py-2 text-slate-900">{item.name}</td>
                    <td className="px-4 py-2 text-center text-slate-600">{item.quantity}</td>
                    <td className="px-4 py-2 text-right text-slate-600">₹{item.price}</td>
                    <td className="px-4 py-2 text-right font-bold text-slate-900">₹{item.price * item.quantity}</td>
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
      <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6">
        <div className="flex items-center gap-3">
          <Link to="/admin/orders" className="text-slate-600 hover:text-emerald-600">
            <FiArrowLeft size={20} />
          </Link>
          <h1 className="flex items-center gap-2 text-2xl font-extrabold text-slate-900">
            <FiPackage className="text-emerald-500" />
            {title}
          </h1>
          <span className="text-sm text-slate-500">({filtered.length} orders)</span>
        </div>

        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-slate-500">No {status} orders found.</div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
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