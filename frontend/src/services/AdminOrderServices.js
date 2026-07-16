import api from "../api/axios";

const getToken = () => localStorage.getItem("adminToken");

export const fetchOrders = async () => {
  const res = await api.get("/admin/orders", {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return res.data.data.orders;
};

export const fetchOrder = async (id) => {
  const res = await api.get(`/admin/orders/${id}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return res.data.data.order;
};

export const updateStatus = async (id, status) => {
  const res = await api.put(
    `/admin/orders/${id}/status`,
    { status },
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );

  return res.data.data.order;
};

export const deleteOrder = async (id) => {
  return await api.delete(`/admin/orders/${id}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
};