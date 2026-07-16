

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
  FiUser,
  FiMapPin,
  FiCreditCard,
  FiDollarSign,
  FiCalendar,
  FiEdit2,
  FiTrash2,
  FiArrowRight,
  FiInfo,
  FiAlertCircle,
  FiSend,
  FiRotateCcw,
} from 'react-icons/fi';


// ---------- STATUS CONFIGURATION ----------
export const statusConfig = {
  pending: { label: 'Pending', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300', icon: FiClock },
  processing: { label: 'Processing', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300', icon: FiRefreshCw },
  shipped: { label: 'Shipped', color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300', icon: FiTruck },
  delivered: { label: 'Delivered', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300', icon: FiCheckCircle },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300', icon: FiXCircle },
  returned: { label: 'Returned', color: 'bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300', icon: FiRotateCcw },
  refund: { label: 'Refund', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300', icon: FiDollarSign },
};

// ---------- 1. OrderStatusBadge ----------
export const OrderStatusBadge = ({ status }) => {

  const key = String(status || "")
    .trim()
    .toLowerCase();


  const config = statusConfig[key];

  // console.log(config);

  if (!config) {
    return (
      <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
        Unknown ({status})
      </span>
    );
  }

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${config.color}`}
    >
      {config.label}
    </span>
  );
};

// ---------- 2. OrderCard (grid view) ----------
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

// ---------- 3. OrderTable (table view) ----------
export const OrderTable = ({ orders, onViewDetails, onStatusChange }) => {
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
              <td className="px-4 py-3"><OrderStatusBadge status={order.status} /></td>
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

// ---------- 4. OrderSearch ----------
export const OrderSearch = ({ searchTerm, setSearchTerm }) => {
  return (
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
  );
};

// ---------- 5. OrderFilters ----------
export const OrderFilters = ({
  filterStatus,
  setFilterStatus,
  resetFilters,
}) => {
  const statusOptions = [
    { value: 'all', label: 'All Orders' },
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'returned', label: 'Returned' },
    { value: 'refund', label: 'Refund' },
  ];

  return (
    <div className="flex flex-wrap gap-3">
      <select
        value={filterStatus}
        onChange={(e) => setFilterStatus(e.target.value)}
        className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/70 dark:bg-gray-700/50 text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
      >
        {statusOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      <button
        onClick={resetFilters}
        className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/70 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-600 transition text-gray-600 dark:text-gray-300 flex items-center gap-2"
      >
        <FiRefreshCw size={16} />
        Reset
      </button>
    </div>
  );
};

// ---------- 6. OrderPagination ----------
export const OrderPagination = ({ currentPage, totalPages, setCurrentPage }) => {
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

// ---------- 7. OrderTimeline ----------
export const OrderTimeline = ({ order }) => {
  const statuses = ['pending', 'processing', 'shipped', 'delivered'];
  const currentIndex = statuses.indexOf(order.status);
  const steps = [
    { key: 'pending', label: 'Order Placed', icon: FiPackage },
    { key: 'processing', label: 'Processing', icon: FiRefreshCw },
    { key: 'shipped', label: 'Shipped', icon: FiTruck },
    { key: 'delivered', label: 'Delivered', icon: FiCheckCircle },
  ];

  return (
    <div className="relative">
      <div className="flex justify-between items-center">
        {steps.map((step, idx) => {
          const isActive = idx <= currentIndex;
          const Icon = step.icon;
          return (
            <div key={step.key} className="flex flex-col items-center flex-1">
              <div className="relative w-full">
                {/* Line */}
                {idx < steps.length - 1 && (
                  <div className={`absolute top-4 left-1/2 w-full h-0.5 ${isActive ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'}`} />
                )}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isActive ? 'bg-emerald-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'} z-10 relative mx-auto`}>
                  <Icon size={16} />
                </div>
              </div>
              <span className={`text-xs mt-2 ${isActive ? 'text-gray-800 dark:text-white font-medium' : 'text-gray-400 dark:text-gray-500'}`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ---------- 8. OrderItemsTable ----------
export const OrderItemsTable = ({ items }) => {
  return (
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
          {items.map((item, idx) => (
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
  );
};

// ---------- 9. OrderSummary ----------
export const OrderSummary = ({ order }) => {
  return (
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
  );
};

// ---------- 10. CustomerDetails ----------
export const CustomerDetails = ({ order }) => {
  return (
    <div className="space-y-2 text-sm">
      <p><span className="text-gray-500 dark:text-gray-400">Name:</span> {order.customer}</p>
      <p><span className="text-gray-500 dark:text-gray-400">Email:</span> {order.email}</p>
      <p><span className="text-gray-500 dark:text-gray-400">Phone:</span> {order.phone}</p>
    </div>
  );
};

// ---------- 11. ShippingDetails ----------
export const ShippingDetails = ({ order }) => {
  return (
    <div className="space-y-2 text-sm">
      <p className="text-gray-600 dark:text-gray-300">{order.address}</p>
      {order.notes && (
        <div>
          <span className="text-gray-500 dark:text-gray-400">Notes:</span>
          <p className="text-gray-600 dark:text-gray-300 mt-1">{order.notes}</p>
        </div>
      )}
    </div>
  );
};

// ---------- 12. PaymentDetails ----------
export const PaymentDetails = ({ order }) => {
  return (
    <div className="space-y-2 text-sm">
      <p><span className="text-gray-500 dark:text-gray-400">Method:</span> {order.paymentMethod}</p>
      <p><span className="text-gray-500 dark:text-gray-400">Status:</span> {order.status === 'refund' ? 'Refunded' : 'Paid'}</p>
    </div>
  );
};

// ---------- 13. ChangeStatusModal ----------
export const ChangeStatusModal = ({ isOpen, onClose, currentStatus, onConfirm }) => {
  const [selectedStatus, setSelectedStatus] = useState(currentStatus);
  const statusOptions = ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'returned', 'refund'];

  useEffect(() => {
    setSelectedStatus(currentStatus);
  }, [currentStatus]);

  const handleConfirm = () => {
    onConfirm(selectedStatus);
    onClose();
  };

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
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Change Order Status</h3>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/70 dark:bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-emerald-400/60 dark:text-white mb-6"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
            <div className="flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold shadow-lg shadow-emerald-200/50 dark:shadow-emerald-900/30 transition"
              >
                Update Status
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ---------- 14. CancelOrderModal ----------
export const CancelOrderModal = ({ isOpen, onClose, onConfirm }) => {
  const [reason, setReason] = useState('');

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
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Cancel Order</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Are you sure you want to cancel this order? This action cannot be undone.
            </p>
            <textarea
              placeholder="Reason for cancellation (optional)"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows="3"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/70 dark:bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-emerald-400/60 dark:text-white resize-none mb-4"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              >
                Keep Order
              </button>
              <button
                onClick={() => { onConfirm(reason); onClose(); }}
                className="px-5 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold shadow-lg shadow-red-200/50 dark:shadow-red-900/30 transition"
              >
                Cancel Order
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ---------- 15. RefundModal ----------
export const RefundModal = ({ isOpen, onClose, onConfirm, orderTotal }) => {
  const [refundAmount, setRefundAmount] = useState(orderTotal || 0);
  const [reason, setReason] = useState('');

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
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Process Refund</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Enter the refund amount and reason for this order.
            </p>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Refund Amount (₹)
                </label>
                <input
                  type="number"
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/70 dark:bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-emerald-400/60 dark:text-white"
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Reason
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows="2"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/70 dark:bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-emerald-400/60 dark:text-white resize-none"
                  placeholder="Reason for refund..."
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => { onConfirm(refundAmount, reason); onClose(); }}
                className="px-5 py-2.5 rounded-xl bg-purple-500 hover:bg-purple-600 text-white font-semibold shadow-lg shadow-purple-200/50 dark:shadow-purple-900/30 transition"
              >
                Process Refund
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ---------- 16. DeleteOrderModal ----------
export const DeleteOrderModal = ({ isOpen, onClose, onConfirm }) => {
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
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Delete Order</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to permanently delete this order? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => { onConfirm(); onClose(); }}
                className="px-5 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold shadow-lg shadow-red-200/50 dark:shadow-red-900/30 transition"
              >
                Delete Order
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};