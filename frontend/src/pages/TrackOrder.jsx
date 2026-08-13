import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { getOrderById } from "../services/orderService";
import { 
  FiArrowLeft, 
  FiPackage, 
  FiTruck, 
  FiCheckCircle, 
  FiClock, 
  FiMapPin, 
  FiCreditCard, 
  FiDollarSign,
  FiShoppingBag,
  FiCalendar,
  FiLoader,
  FiAlertCircle,
  FiHome
} from "react-icons/fi";

const TrackOrder = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadOrder = async () => {
    try {
      setLoading(true);
      const orderData = await getOrderById(id);
      console.log("Tracking Order:", orderData);
      setOrder(orderData || null);
    } catch (error) {
      console.error("Tracking error:", error);
      toast.error(
        error?.response?.data?.message || "Failed to load order"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadOrder();
    }
  }, [id]);

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen bg-white px-0 py-0 md:px-4 md:py-4 lg:px-6">
        <div className="mx-auto flex min-h-screen w-full max-w-107.5 flex-col bg-white md:min-h-[calc(100vh-2rem)] md:rounded-[30px] md:border md:border-emerald-100 lg:max-w-120">
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <FiLoader className="text-emerald-600" size={24} />
                </div>
              </div>
              <p className="mt-4 text-sm text-gray-500 font-medium">
                Loading order tracking...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Order not found
  if (!order) {
    return (
      <div className="min-h-screen bg-white px-0 py-0 md:px-4 md:py-4 lg:px-6">
        <div className="mx-auto flex min-h-screen w-full max-w-107.5 flex-col bg-white md:min-h-[calc(100vh-2rem)] md:rounded-[30px] md:border md:border-emerald-100 lg:max-w-120">
          <div className="flex-1 flex items-center justify-center px-4">
            <div className="w-full max-w-sm text-center">
              <div className="w-24 h-24 rounded-full bg-emerald-50 flex items-center justify-center mx-auto">
                <FiPackage className="text-emerald-400 text-5xl" />
              </div>
              <h2 className="mt-4 text-2xl font-bold text-gray-800">
                Order Not Found
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                We couldn't find this order. It may have been removed or doesn't exist.
              </p>
              <button
                onClick={() => navigate("/orders")}
                className="mt-6 w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold py-3.5 shadow-lg shadow-emerald-200/50 transition hover:scale-[1.01]"
              >
                Back to Orders
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const status = order.status?.toLowerCase();
  const statusText = status?.charAt(0).toUpperCase() + status?.slice(1);

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
                Track Order
              </p>
              <h2 className="text-base font-bold text-gray-900 sm:text-lg">
                Order Tracking
              </h2>
            </div>

            <div className="grid h-11 w-11 place-items-center rounded-full border border-emerald-100 bg-white shadow-sm">
              <FiTruck className="text-lg text-emerald-600" />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto px-4 pb-[calc(2rem+env(safe-area-inset-bottom))] pt-4 space-y-4">
          
          {/* Order Info Card */}
          <div className="rounded-2xl border border-emerald-100/80 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <FiPackage className="text-emerald-600" size={16} />
                  <p className="text-xs text-gray-400">Order Number</p>
                </div>
                <h2 className="mt-1 text-base font-bold text-gray-800 truncate">
                  #{order.orderNumber}
                </h2>
                <p className="mt-1 text-xs text-gray-400 flex items-center gap-1">
                  <FiCalendar size={12} />
                  Placed on {new Date(order.createdAt).toLocaleString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>

              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold uppercase ${
                status === "delivered" ? "text-emerald-600 bg-emerald-50 border-emerald-200" :
                status === "cancelled" ? "text-red-600 bg-red-50 border-red-200" :
                status === "shipped" ? "text-purple-600 bg-purple-50 border-purple-200" :
                status === "processing" ? "text-amber-600 bg-amber-50 border-amber-200" :
                "text-blue-600 bg-blue-50 border-blue-200"
              }`}>
                {status === "delivered" && <FiCheckCircle size={14} />}
                {status === "cancelled" && <FiAlertCircle size={14} />}
                {status === "shipped" && <FiTruck size={14} />}
                {status === "processing" && <FiLoader size={14} className="animate-spin" />}
                {status === "pending" && <FiClock size={14} />}
                {statusText}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
              <span className="text-sm text-gray-500">Total Amount</span>
              <span className="text-lg font-bold text-emerald-600">
                ₹{Number(order.total || 0).toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          {/* Tracking Timeline */}
          <div className="rounded-2xl border border-emerald-100/80 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                  <FiTruck className="text-emerald-600" size={16} />
                  Order Status
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">Track your order progress</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-emerald-50 flex items-center justify-center">
                <FiHome className="text-emerald-600" size={18} />
              </div>
            </div>

            <TrackingTimeline status={status} />
          </div>

          {/* Delivery Details */}
          <div className="rounded-2xl border border-emerald-100/80 bg-white p-4 shadow-sm">
            <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2 mb-4">
              <FiMapPin className="text-emerald-600" size={16} />
              Delivery Details
            </h2>

            <div className="space-y-4">
              {/* Address */}
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-emerald-50">
                  <FiMapPin className="text-emerald-600" size={16} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-gray-400">Delivery Address</p>
                  <p className="mt-0.5 text-sm text-gray-700 leading-5">
                    {order.deliveryAddress || "Address not available"}
                  </p>
                </div>
              </div>

              {/* Payment */}
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-50">
                  <FiCreditCard className="text-blue-600" size={16} />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Payment Method</p>
                  <p className="mt-0.5 text-sm font-medium text-gray-700">
                    {order.paymentMethod ? order.paymentMethod.toUpperCase() : "Not available"}
                  </p>
                </div>
              </div>

              {/* Amount */}
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-50">
                  <FiDollarSign className="text-amber-600" size={16} />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Order Total</p>
                  <p className="mt-0.5 text-sm font-bold text-emerald-600">
                    ₹{Number(order.total || 0).toLocaleString("en-IN")}
                  </p>
                </div>
              </div>

              {/* Items Count */}
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-50">
                  <FiShoppingBag className="text-purple-600" size={16} />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Items</p>
                  <p className="mt-0.5 text-sm font-medium text-gray-700">
                    {order.items?.length || 0} items
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* View Orders Button */}
          <button
            onClick={() => navigate("/orders")}
            className="w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold py-3.5 shadow-lg shadow-emerald-200/50 transition hover:scale-[1.01]"
          >
            View All Orders
          </button>
        </div>
      </div>
    </div>
  );
};

/* ======================================================
   TRACKING TIMELINE - Enhanced Version
====================================================== */

const TrackingTimeline = ({ status }) => {
  const steps = [
    {
      key: "pending",
      title: "Order Placed",
      description: "Your order has been successfully placed",
      icon: FiClock,
    },
    {
      key: "processing",
      title: "Processing",
      description: "Your order is being prepared",
      icon: FiLoader,
    },
    {
      key: "shipped",
      title: "Shipped",
      description: "Your order is on the way",
      icon: FiTruck,
    },
    {
      key: "delivered",
      title: "Delivered",
      description: "Your order has been delivered",
      icon: FiCheckCircle,
    },
  ];

  const currentIndex = steps.findIndex((step) => step.key === status);

  return (
    <div className="relative">
      {steps.map((step, index) => {
        const completed = currentIndex >= 0 && index <= currentIndex;
        const active = index === currentIndex;
        const isLast = index === steps.length - 1;
        const Icon = step.icon;

        return (
          <div key={step.key} className="relative flex gap-4">
            {/* Connector Line */}
            {!isLast && (
              <div
                className={`absolute left-[18px] top-9 w-0.5 h-[calc(100%-5px)] transition-all duration-500 ${
                  index < currentIndex ? "bg-emerald-500" : "bg-gray-200"
                }`}
              />
            )}

            {/* Step Circle */}
            <div
              className={`relative z-10 h-9 w-9 shrink-0 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                completed
                  ? "bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-200/50"
                  : "bg-gray-100 text-gray-400"
              } ${active ? "ring-4 ring-emerald-100" : ""}`}
            >
              {completed ? <FiCheckCircle size={16} /> : <Icon size={16} />}
            </div>

            {/* Step Text */}
            <div className={`flex-1 ${isLast ? "pb-0" : "pb-7"}`}>
              <div className="flex flex-wrap items-center gap-2">
                <h3
                  className={`text-sm font-bold transition-colors ${
                    completed ? "text-gray-800" : "text-gray-400"
                  }`}
                >
                  {step.title}
                </h3>
                {active && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold animate-pulse">
                    Current
                  </span>
                )}
                {completed && !active && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold">
                    ✓ Done
                  </span>
                )}
              </div>
              <p
                className={`mt-1 text-xs leading-5 transition-colors ${
                  completed ? "text-gray-500" : "text-gray-400"
                }`}
              >
                {step.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TrackOrder;