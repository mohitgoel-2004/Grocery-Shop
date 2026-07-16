// src/utils/orderHelpers.js

// -------------------------------
// Format Currency
// -------------------------------
export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return "₹0";

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(amount));
};

// -------------------------------
// Format Date
// -------------------------------
export const formatDate = (date) => {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// -------------------------------
// Format Date & Time
// -------------------------------
export const formatDateTime = (date) => {
  if (!date) return "-";

  return new Date(date).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// -------------------------------
// Status Color
// -------------------------------
export const getStatusColor = (status = "") => {
  switch (status.toLowerCase()) {
    case "pending":
      return "bg-yellow-100 text-yellow-700";

    case "processing":
      return "bg-blue-100 text-blue-700";

    case "shipped":
      return "bg-indigo-100 text-indigo-700";

    case "delivered":
      return "bg-green-100 text-green-700";

    case "cancelled":
      return "bg-red-100 text-red-700";

    case "returned":
      return "bg-orange-100 text-orange-700";

    default:
      return "bg-gray-100 text-gray-700";
  }
};

// -------------------------------
// Payment Status Color
// -------------------------------
export const getPaymentStatusColor = (status = "") => {
  switch (status.toLowerCase()) {
    case "paid":
      return "bg-green-100 text-green-700";

    case "pending":
      return "bg-yellow-100 text-yellow-700";

    case "failed":
      return "bg-red-100 text-red-700";

    default:
      return "bg-gray-100 text-gray-700";
  }
};

// -------------------------------
// Total Items
// -------------------------------
export const getTotalItems = (items = []) => {
  return items.reduce((total, item) => total + Number(item.qty || 0), 0);
};

// -------------------------------
// Discount Price
// -------------------------------
export const getDiscountPrice = (price, discount = 0) => {
  return Number(price) - (Number(price) * Number(discount)) / 100;
};

// -------------------------------
// Search Orders
// -------------------------------
export const searchOrders = (orders = [], keyword = "") => {
  if (!keyword.trim()) return orders;

  const search = keyword.toLowerCase();

  return orders.filter((order) => {
    return (
      order.orderNumber?.toLowerCase().includes(search) ||
      order.customer?.name?.toLowerCase().includes(search) ||
      order.customer?.phone?.toLowerCase().includes(search)
    );
  });
};

// -------------------------------
// Filter Orders
// -------------------------------
export const filterOrders = (
  orders = [],
  status = "",
  paymentStatus = ""
) => {
  return orders.filter((order) => {
    const statusMatch = status
      ? order.orderStatus === status
      : true;

    const paymentMatch = paymentStatus
      ? order.paymentStatus === paymentStatus
      : true;

    return statusMatch && paymentMatch;
  });
};

// -------------------------------
// Pagination
// -------------------------------
export const paginateOrders = (
  orders = [],
  currentPage = 1,
  itemsPerPage = 10
) => {
  const start = (currentPage - 1) * itemsPerPage;

  return orders.slice(start, start + itemsPerPage);
};

// -------------------------------
// Dashboard Statistics
// -------------------------------
export const calculateOrderStats = (orders = []) => {
  return {
    totalOrders: orders.length,

    pendingOrders: orders.filter(
      (o) => o.orderStatus === "Pending"
    ).length,

    processingOrders: orders.filter(
      (o) => o.orderStatus === "Processing"
    ).length,

    shippedOrders: orders.filter(
      (o) => o.orderStatus === "Shipped"
    ).length,

    deliveredOrders: orders.filter(
      (o) => o.orderStatus === "Delivered"
    ).length,

    cancelledOrders: orders.filter(
      (o) => o.orderStatus === "Cancelled"
    ).length,

    returnedOrders: orders.filter(
      (o) => o.orderStatus === "Returned"
    ).length,

    totalRevenue: orders
      .filter((o) => o.paymentStatus === "Paid")
      .reduce((sum, order) => sum + Number(order.total || 0), 0),
  };
};

// -------------------------------
// Generate Order Number
// -------------------------------
export const generateOrderNumber = () => {
  return `ORD-${Date.now().toString().slice(-6)}`;
};