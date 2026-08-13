import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { fetchUserOrders, cancelOrder } from "../services/orderService";
import { 
  FiArrowLeft, 
  FiPackage, 
  FiClock, 
  FiMapPin, 
  FiCreditCard, 
  FiTruck,
  FiXCircle,
  FiCheckCircle,
  FiRefreshCw,
  FiAlertCircle,
  FiShoppingBag,
  FiCalendar,
  FiDollarSign
} from "react-icons/fi";

const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const response = await fetchUserOrders();
        setOrders(response || []);
      } catch (error) {
        console.error("Failed to load orders:", error);
        toast.error(
          error?.response?.data?.message || "Failed to load orders"
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadOrders();
  }, []);

  const handleCancelOrder = async (orderId) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!confirmCancel) return;

    try {
      const updatedOrder = await cancelOrder(orderId);
      setOrders((prev) =>
        prev.map((order) =>
          order._id === updatedOrder._id ? updatedOrder : order
        )
      );
      toast.success("Order cancelled successfully");
    } catch (error) {
      console.error("Cancel order error:", error);
      toast.error(
        error?.response?.data?.message || "Failed to cancel order"
      );
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <FiClock className="text-blue-500" size={16} />;
      case "processing":
        return <FiRefreshCw className="text-amber-500 animate-spin" size={16} />;
      case "shipped":
        return <FiTruck className="text-purple-500" size={16} />;
      case "delivered":
        return <FiCheckCircle className="text-emerald-500" size={16} />;
      case "cancelled":
        return <FiXCircle className="text-red-500" size={16} />;
      default:
        return <FiPackage className="text-gray-500" size={16} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "text-blue-600 bg-blue-50 border-blue-200";
      case "processing":
        return "text-amber-600 bg-amber-50 border-amber-200";
      case "shipped":
        return "text-purple-600 bg-purple-50 border-purple-200";
      case "delivered":
        return "text-emerald-600 bg-emerald-50 border-emerald-200";
      case "cancelled":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-white px-0 py-0 md:px-4 md:py-4 lg:px-6">
      <div className="mx-auto flex min-h-screen w-full max-w-107.5 flex-col overflow-hidden bg-white md:min-h-[calc(100vh-2rem)] md:rounded-[30px] md:border md:border-emerald-100 lg:max-w-120">
        
        {/* Header */}
        <div className="shrink-0 bg-gradient-to-b from-emerald-100 via-emerald-50 to-white px-4 pt-4 pb-3">
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={() => navigate(-1)}
              className="grid h-11 w-11 place-items-center rounded-full border border-emerald-100 bg-white shadow-sm transition hover:scale-105 hover:bg-emerald-50"
              aria-label="Go back"
            >
              <FiArrowLeft className="text-lg text-emerald-600" />
            </button>

            <div className="text-center">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-emerald-600">
                Your Orders
              </p>
              <h2 className="text-base font-bold text-gray-900 sm:text-lg">
                My Orders
              </h2>
            </div>

            <div className="grid h-11 w-11 place-items-center rounded-full border border-emerald-100 bg-white shadow-sm">
              <FiShoppingBag className="text-lg text-emerald-600" />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto px-4 pb-[calc(7rem+env(safe-area-inset-bottom))] pt-4">
          
          {/* Order Stats */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-3 text-center">
              <p className="text-xs text-gray-500">Total Orders</p>
              <p className="text-lg font-bold text-emerald-600">{orders.length}</p>
            </div>
            <div className="rounded-xl bg-blue-50 border border-blue-100 p-3 text-center">
              <p className="text-xs text-gray-500">Pending</p>
              <p className="text-lg font-bold text-blue-600">
                {orders.filter(o => o.status === 'pending' || o.status === 'processing').length}
              </p>
            </div>
            <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-3 text-center">
              <p className="text-xs text-gray-500">Delivered</p>
              <p className="text-lg font-bold text-emerald-600">
                {orders.filter(o => o.status === 'delivered').length}
              </p>
            </div>
          </div>

          {isLoading ? (
            <div className="rounded-2xl border border-emerald-100/80 bg-white p-12 text-center shadow-sm">
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
                <p className="text-gray-500 font-medium">Loading orders...</p>
              </div>
            </div>
          ) : orders.length === 0 ? (
            <div className="rounded-2xl border border-emerald-100/80 bg-white p-12 text-center shadow-sm">
              <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center mx-auto">
                <FiPackage className="text-emerald-400 text-4xl" />
              </div>
              <h2 className="mt-4 text-xl font-bold text-gray-800">
                No Orders Found
              </h2>
              <p className="text-gray-500 mt-2">Place your first order and track it here.</p>
              <button
                onClick={() => navigate("/products")}
                className="mt-4 rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white shadow-md shadow-emerald-200/50 transition hover:bg-emerald-700 hover:scale-[1.01]"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            orders.map((order) => (
              <div
                key={order._id}
                className="rounded-2xl border border-emerald-100/80 bg-white p-4 shadow-sm mb-4 transition hover:shadow-md"
              >
                {/* Order Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <FiPackage className="text-emerald-600" size={16} />
                      <h2 className="font-bold text-gray-800">
                        #{order.orderNumber}
                      </h2>
                    </div>
                    <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                      <FiCalendar size={12} />
                      {new Date(order.createdAt).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>

                  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold uppercase ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    {order.status}
                  </div>
                </div>

                {/* Order Items */}
                <div className="mt-4 bg-gray-50/50 rounded-xl p-3">
                  {order.items.map((item) => (
                    <div
                      key={item.product?._id || item.name}
                      className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                          <FiShoppingBag className="text-emerald-600" size={16} />
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-800">
                            {item.name}
                          </h3>
                          <p className="text-xs text-gray-400">
                            Qty: {item.quantity}
                          </p>
                        </div>
                      </div>
                      <span className="text-sm font-bold text-gray-700">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                  <span className="text-sm font-medium text-gray-500">Total Amount</span>
                  <span className="text-lg font-bold text-emerald-600">
                    ₹{order.total}
                  </span>
                </div>

                {/* Delivery & Payment Info */}
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-gray-500">
                  <div className="flex items-center gap-1.5">
                    <FiMapPin size={14} className="text-gray-400" />
                    <span className="truncate">{order.deliveryAddress}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <FiCreditCard size={14} className="text-gray-400" />
                    <span>{order.paymentMethod}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    onClick={() => navigate(`/orders/${order._id}/track`)}
                    className="flex-1 min-w-[100px] flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 text-sm font-bold transition shadow-md shadow-emerald-200/50 hover:scale-[1.01]"
                  >
                    <FiTruck size={16} />
                    Track Order
                  </button>

                  {(order.status === "pending" || order.status === "processing") && (
                    <button
                      onClick={() => handleCancelOrder(order._id)}
                      className="flex-1 min-w-[100px] flex items-center justify-center gap-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-4 py-2.5 text-sm font-bold transition hover:scale-[1.01]"
                    >
                      <FiXCircle size={16} />
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Orders;