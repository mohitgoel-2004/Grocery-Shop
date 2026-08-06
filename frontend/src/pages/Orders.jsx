import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { fetchUserOrders, cancelOrder } from "../services/orderService";

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
        order._id === updatedOrder._id
          ? updatedOrder
          : order
      )
    );

    toast.success("Order cancelled successfully");
  } catch (error) {
    console.error("Cancel order error:", error);

    toast.error(
      error?.response?.data?.message ||
      "Failed to cancel order"
    );
  }
};
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-emerald-600 text-white p-4 flex items-center gap-3">
        <button onClick={() => navigate(-1)}>←</button>

        <h1 className="text-xl font-bold">My Orders</h1>
      </div>

      <div className="p-4">
        {isLoading ? (
          <div className="bg-white rounded-xl p-10 text-center shadow text-gray-500">
            Loading orders...
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-xl p-10 text-center shadow">
            <h2 className="text-xl font-bold">No Orders Found</h2>

            <p className="text-gray-500 mt-2">Place your first order.</p>
          </div>
        ) : (
          orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-xl shadow p-4 mb-5"
            >
              <div className="flex justify-between">
                <div>
                  <h2 className="font-bold">{order.orderNumber}</h2>

                  <p className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold
    ${
      order.status === "processing"
        ? "bg-yellow-100 text-yellow-700"
        : order.status === "pending"
          ? "bg-blue-100 text-blue-700"
          : order.status === "shipped"
            ? "bg-purple-100 text-purple-700"
            : order.status === "delivered"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
    }`}
                >
                  {order.status}
                </span>
              </div>

              <div className="mt-4">
                {order.items.map((item) => (
                  <div
                    key={item.product?._id || item.name}
                    className="flex justify-between border-b py-2"
                  >
                    <div>
                      <h3>{item.name}</h3>

                      <p className="text-sm text-gray-500">
                        Qty : {item.quantity}
                      </p>
                    </div>

                    <div>₹{item.price * item.quantity}</div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between mt-4 font-bold">
                <span>Total</span>
                <span>₹{order.total}</span>
              </div>

              <div className="mt-4 flex flex-wrap gap-3">
                {/* Track Order */}
                <button
                  onClick={() => navigate(`/orders/${order._id}/track`)}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg transition"
                >
                  Track Order
                </button>

                {/* Cancel Order */}
                {(order.status === "pending" ||
                  order.status === "processing") && (
                  <button
                    onClick={() => handleCancelOrder(order._id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
                  >
                    Cancel Order
                  </button>
                )}
              </div>

              <div className="mt-4 text-sm text-gray-500">
                <p>📍 {order.deliveryAddress}</p>

                <p>💳 {order.paymentMethod}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Orders;
