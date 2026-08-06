
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { getOrderById } from "../services/orderService";

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
      error?.response?.data?.message ||
      "Failed to load order"
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="h-10 w-10 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto" />

          <p className="mt-4 text-sm text-gray-500">
            Loading order tracking...
          </p>
        </div>
      </div>
    );
  }

  // Order not found
  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="w-full max-w-sm bg-white rounded-2xl shadow-md p-6 text-center">

          <div className="mx-auto w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center text-3xl">
            📦
          </div>

          <h2 className="mt-4 text-xl font-bold text-gray-800">
            Order Not Found
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            We couldn't find this order.
          </p>

          <button
            onClick={() => navigate("/orders")}
            className="mt-6 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-xl transition"
          >
            Back to Orders
          </button>

        </div>
      </div>
    );
  }

  const status = order.status?.toLowerCase();

  const statusText =
    status?.charAt(0).toUpperCase() + status?.slice(1);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ================= HEADER ================= */}
      <header className="bg-emerald-600 text-white sticky top-0 z-50 shadow-md">

        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">

          <button
            onClick={() => navigate(-1)}
            className="h-9 w-9 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 text-xl transition"
          >
            ←
          </button>

          <div>
            <h1 className="text-lg font-bold">
              Track Order
            </h1>

            <p className="text-xs text-emerald-100">
              Order delivery status
            </p>
          </div>

        </div>

      </header>

      {/* ================= MAIN ================= */}
      <main className="max-w-2xl mx-auto px-4 py-4 space-y-4">

        {/* ================= ORDER CARD ================= */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

          <div className="p-4">

            <div className="flex items-start justify-between gap-3">

              <div className="min-w-0">

                <p className="text-xs text-gray-400">
                  Order Number
                </p>

                <h2 className="mt-1 text-base font-bold text-gray-800 truncate">
                  {order.orderNumber}
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  Placed on{" "}
                  {new Date(order.createdAt).toLocaleString()}
                </p>

              </div>

              <span
                className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold ${
                  status === "delivered"
                    ? "bg-green-100 text-green-700"
                    : status === "cancelled"
                    ? "bg-red-100 text-red-700"
                    : "bg-emerald-100 text-emerald-700"
                }`}
              >
                {statusText}
              </span>

            </div>

          </div>

          <div className="border-t border-gray-100 bg-gray-50 px-4 py-3 flex items-center justify-between">

            <span className="text-sm text-gray-500">
              Total Amount
            </span>

            <span className="text-base font-bold text-gray-800">
              ₹{Number(order.total || 0).toLocaleString("en-IN")}
            </span>

          </div>

        </section>

        {/* ================= TRACKING ================= */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">

          <div className="flex items-center justify-between mb-7">

            <div>
              <h2 className="text-base font-bold text-gray-800">
                Order Status
              </h2>

              <p className="text-xs text-gray-500 mt-1">
                Track your order
              </p>
            </div>

            <div className="h-10 w-10 rounded-full bg-emerald-50 flex items-center justify-center text-xl">
              🚚
            </div>

          </div>

          <TrackingTimeline status={status} />

        </section>

        {/* ================= DELIVERY DETAILS ================= */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">

          <h2 className="text-base font-bold text-gray-800 mb-5">
            Delivery Details
          </h2>

          <div className="space-y-5">

            {/* Address */}
            <div className="flex items-start gap-3">

              <div className="h-10 w-10 shrink-0 rounded-full bg-emerald-50 flex items-center justify-center">
                📍
              </div>

              <div className="min-w-0">

                <p className="text-xs text-gray-400">
                  Delivery Address
                </p>

                <p className="mt-1 text-sm text-gray-700 leading-5">
                  {order.deliveryAddress || "Address not available"}
                </p>

              </div>

            </div>

            {/* Payment */}
            <div className="flex items-center gap-3">

              <div className="h-10 w-10 shrink-0 rounded-full bg-blue-50 flex items-center justify-center">
                💳
              </div>

              <div>

                <p className="text-xs text-gray-400">
                  Payment Method
                </p>

                <p className="mt-1 text-sm font-semibold text-gray-700">
                  {order.paymentMethod
                    ? order.paymentMethod.toUpperCase()
                    : "Not available"}
                </p>

              </div>

            </div>

            {/* Amount */}
            <div className="flex items-center gap-3">

              <div className="h-10 w-10 shrink-0 rounded-full bg-yellow-50 flex items-center justify-center">
                💰
              </div>

              <div>

                <p className="text-xs text-gray-400">
                  Order Total
                </p>

                <p className="mt-1 text-sm font-bold text-gray-800">
                  ₹{Number(order.total || 0).toLocaleString("en-IN")}
                </p>

              </div>

            </div>

          </div>

        </section>

        {/* ================= ORDERS BUTTON ================= */}
        <button
          onClick={() => navigate("/orders")}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3.5 rounded-xl shadow-sm transition active:scale-[0.98]"
        >
          View My Orders
        </button>

      </main>

    </div>
  );
};


/* ======================================================
   TRACKING TIMELINE
====================================================== */

const TrackingTimeline = ({ status }) => {

  const steps = [
    {
      key: "pending",
      title: "Order Placed",
      description: "Your order has been successfully placed",
    },
    {
      key: "processing",
      title: "Processing",
      description: "Your order is being prepared",
    },
    {
      key: "shipped",
      title: "Shipped",
      description: "Your order is on the way",
    },
    {
      key: "delivered",
      title: "Delivered",
      description: "Your order has been delivered",
    },
  ];

  const currentIndex = steps.findIndex(
    (step) => step.key === status
  );

  return (
    <div className="relative">

      {steps.map((step, index) => {

        const completed =
          currentIndex >= 0 && index <= currentIndex;

        const active =
          index === currentIndex;

        const isLast =
          index === steps.length - 1;

        return (
          <div
            key={step.key}
            className="relative flex gap-4"
          >

            {/* Connector */}
            {!isLast && (
              <div
                className={`absolute left-[18px] top-9 w-0.5 h-[calc(100%-5px)] ${
                  index < currentIndex
                    ? "bg-emerald-500"
                    : "bg-gray-200"
                }`}
              />
            )}

            {/* Circle */}
            <div
              className={`relative z-10 h-9 w-9 shrink-0 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                completed
                  ? "bg-emerald-500 text-white"
                  : "bg-gray-100 text-gray-400"
              } ${
                active
                  ? "ring-4 ring-emerald-100"
                  : ""
              }`}
            >
              {completed ? "✓" : index + 1}
            </div>

            {/* Text */}
            <div
              className={`flex-1 ${
                isLast ? "pb-0" : "pb-7"
              }`}
            >

              <div className="flex flex-wrap items-center gap-2">

                <h3
                  className={`text-sm font-bold ${
                    completed
                      ? "text-gray-800"
                      : "text-gray-400"
                  }`}
                >
                  {step.title}
                </h3>

                {active && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold">
                    Current
                  </span>
                )}

              </div>

              <p
                className={`mt-1 text-xs leading-5 ${
                  completed
                    ? "text-gray-500"
                    : "text-gray-400"
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

