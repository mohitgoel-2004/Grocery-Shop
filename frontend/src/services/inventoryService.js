import api from "../api/axios";

const getToken = () => {
  return (
    localStorage.getItem("adminToken") ||
    sessionStorage.getItem("adminToken")
  );
};

const authConfig = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

// ======================================================
// GET INVENTORY
// ======================================================

export const fetchInventory = async () => {
  const res = await api.get(
    "/inventory",
    authConfig()
  );

  console.log(
    "📦 INVENTORY API RESPONSE:",
    res.data
  );

  return (
    res.data?.data?.products ||
    res.data?.products ||
    res.data?.data ||
    []
  );
};

// ======================================================
// SUMMARY
// ======================================================

export const fetchInventorySummary =
  async () => {
    const res = await api.get(
      "/inventory/summary",
      authConfig()
    );

    return (
      res.data?.data?.summary ||
      res.data?.data ||
      res.data?.summary ||
      {}
    );
  };

// ======================================================
// STOCK MOVEMENTS
// ======================================================

export const fetchStockMovements =
  async () => {
    const res = await api.get(
      "/inventory/movements",
      authConfig()
    );

    return (
      res.data?.data?.movements ||
      res.data?.movements ||
      res.data?.data ||
      []
    );
  };

// ======================================================
// RESTOCK
// ======================================================

export const restockProduct = async (
  productId,
  payload
) => {
  const res = await api.post(
    `/inventory/${productId}/restock`,
    payload,
    authConfig()
  );

  return (
    res.data?.data?.product ||
    res.data?.product ||
    res.data
  );
};

// ======================================================
// ADJUST
// ======================================================

export const adjustStock = async (
  productId,
  payload
) => {
  const res = await api.post(
    `/inventory/${productId}/adjust`,
    payload,
    authConfig()
  );

  return (
    res.data?.data?.product ||
    res.data?.product ||
    res.data
  );
};

// ======================================================
// DAMAGED
// ======================================================

export const markDamagedStock = async (
  productId,
  payload
) => {
  const res = await api.post(
    `/inventory/${productId}/damaged`,
    payload,
    authConfig()
  );

  return (
    res.data?.data?.product ||
    res.data?.product ||
    res.data
  );
};

// ======================================================
// EXPIRED
// ======================================================

export const markExpiredStock = async (
  productId,
  payload
) => {
  const res = await api.post(
    `/inventory/${productId}/expired`,
    payload,
    authConfig()
  );

  return (
    res.data?.data?.product ||
    res.data?.product ||
    res.data
  );
};

// ======================================================
// BATCHES
// ======================================================

export const fetchProductBatches =
  async (productId) => {
    const res = await api.get(
      `/inventory/${productId}/batches`,
      authConfig()
    );

    return (
      res.data?.data?.batches ||
      res.data?.batches ||
      res.data?.data ||
      []
    );
  };