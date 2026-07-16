import api from "../api/axios";

// =======================================
// GET ALL CUSTOMERS
// =======================================

export const fetchCustomers = async (params = {}) => {
  console.log("Sending Params:", params);

  const response = await api.get("/admin/customers", {
    params,
  });

  console.log("Response:", response.data);

  return response.data;
};

// =======================================
// GET CUSTOMER DETAILS
// =======================================

export const getCustomerById = async (id) => {
  const { data } = await api.get(`/admin/customers/${id}`);
  return data;
};

// =======================================
// CUSTOMER STATS
// =======================================

export const getCustomerStats = async () => {
  const response = await api.get("/admin/customers/stats");

  return response.data;
};

// =======================================
// CREATE CUSTOMER
// =======================================

export const createCustomer = async (customer) => {
  const response = await api.post(
    "/admin/customers",
    customer
  );

  return response.data;
};

// =======================================
// UPDATE CUSTOMER
// =======================================

export const updateCustomer = async (
  id,
  customer
) => {
  const response = await api.put(
    `/admin/customers/${id}`,
    customer
  );

  return response.data;
};

// =======================================
// SOFT DELETE
// =======================================

export const deleteCustomer = async (id) => {
  const response = await api.delete(
    `/admin/customers/${id}`
  );

  return response.data;
};

// =======================================
// RESTORE CUSTOMER
// =======================================

export const restoreCustomer = async (id) => {
  const response = await api.patch(
    `/admin/customers/${id}/restore`
  );

  return response.data;
};

// =======================================
// PERMANENT DELETE
// =======================================

export const permanentDeleteCustomer = async (
  id
) => {
  const response = await api.delete(
    `/admin/customers/${id}/permanent`
  );

  return response.data;
};

// =======================================
// BLOCK CUSTOMER
// =======================================

export const blockCustomer = async (id) => {
  const response = await api.patch(
    `/admin/customers/${id}/block`
  );

  return response.data;
};

// =======================================
// UNBLOCK CUSTOMER
// =======================================

export const unblockCustomer = async (id) => {
  const response = await api.patch(
    `/admin/customers/${id}/unblock`
  );

  return response.data;
};

// =======================================
// MAKE PREMIUM
// =======================================

export const makePremiumCustomer = async (
  id
) => {
  const response = await api.patch(
    `/admin/customers/${id}/premium`
  );

  return response.data;
};