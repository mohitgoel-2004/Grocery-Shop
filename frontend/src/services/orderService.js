// src/services/orderService.js

import api from "./api";

export const placeOrder = async (payload) => {
  const res = await api.post("/orders", payload);
  return res.data.data.order;
};

export const fetchUserOrders = async () => {
  const res = await api.get("/orders/my-orders");
  return res.data.data.orders;
};

export const cancelOrder = async (id) => {
  const res = await api.put("/orders/cancel", {
    orderId: id,
  });

  return res.data.data.order;
};

export const getOrderById = async (orderId) => {
  const res = await api.get(`/orders/my-orders/${orderId}`);

  return res.data.data.order;
};