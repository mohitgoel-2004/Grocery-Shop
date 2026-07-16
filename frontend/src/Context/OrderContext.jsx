import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import * as orderService from "../services/AdminOrderServices";

const OrdersContext = createContext();

export const OrdersProvider = ({ children }) => {
  const [orders,setOrders]=useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  // ===============================
  // Load Orders
  // ===============================

  const loadOrders = async () => {
    try {
      setLoading(true);

      const data = await orderService.fetchOrders();

      setOrders(Array.isArray(data) ? data : []);
      setError("");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // Update Status
  // ===============================

  const updateOrderStatus = async (id, status) => {
  try {

  await orderService.updateStatus(id, status);

    setOrders(prev =>
      prev.map(order =>
        order._id === id
          ? { ...order, status }
          : order
      )
    );

  } catch (err) {
    console.log(err);
  }
};

  // ===============================
  // Delete Order
  // ===============================

  const deleteOrder = async (id) => {
    try {
      await orderService.deleteOrder(id);

      setOrders((prev) =>
        prev.filter((item) => item._id !== id)
      );
    } catch (err) {
      console.error(err);
    }
  };

  // ===============================
  // Status Shortcuts
  // ===============================

  const cancelOrder = (id) =>
    updateOrderStatus(id, "Cancelled");

  const returnOrder = (id) =>
    updateOrderStatus(id, "Returned");

  const refundOrder = (id) =>
    updateOrderStatus(id, "Refunded");

  // ===============================
  // Filter Orders
  // ===============================

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const keyword = searchTerm.toLowerCase();

      const matchesSearch =
        order.orderNumber?.toLowerCase().includes(keyword) ||
        order.customerName?.toLowerCase().includes(keyword) ||
        order.customer?.name?.toLowerCase().includes(keyword) ||
        order.customer?.email?.toLowerCase().includes(keyword);

      const matchesStatus =
        statusFilter === ""
          ? true
          : order.status?.toLowerCase() ===
            statusFilter.toLowerCase();

      const matchesPayment =
        paymentFilter === ""
          ? true
          : order.paymentStatus === paymentFilter;

      const matchesDate =
        dateFilter === ""
          ? true
          : new Date(order.createdAt)
              .toISOString()
              .slice(0, 10) === dateFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPayment &&
        matchesDate
      );
    });
  }, [
    orders,
    searchTerm,
    statusFilter,
    paymentFilter,
    dateFilter,
  ]);

  // ===============================
  // Pagination
  // ===============================

  const totalPages = Math.ceil(
    filteredOrders.length / itemsPerPage
  );

  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // ===============================
  // Reset Filters
  // ===============================

  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("");
    setPaymentFilter("");
    setDateFilter("");
    setCurrentPage(1);
  };

  // ===============================

  return (
    <OrdersContext.Provider
      value={{
        filterStatus: statusFilter,
         setFilterStatus: setStatusFilter,
        orders: paginatedOrders,
        allOrders: filteredOrders,

        loading,
        error,

        selectedOrder,
        setSelectedOrder,

        searchTerm,
        setSearchTerm,

        statusFilter,
        setStatusFilter,

        paymentFilter,
        setPaymentFilter,

        dateFilter,
        setDateFilter,

        currentPage,
        setCurrentPage,

        totalPages,
        itemsPerPage,

        loadOrders,

        updateOrderStatus,
        deleteOrder,

        cancelOrder,
        returnOrder,
        refundOrder,

        resetFilters,
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrdersContext);

  if (!context) {
    throw new Error(
      "useOrders must be used within OrdersProvider"
    );
  }

  return context;
};