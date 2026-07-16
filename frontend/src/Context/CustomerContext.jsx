import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import * as customerService from "../services/customerService";

const CustomerContext = createContext();

export const CustomerProvider = ({ children }) => {
  // ============================
  // STATE
  // ============================

  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterSort, setFilterSort] = useState("newest");
  const [showDeleted, setShowDeleted] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Selected Customer
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Stats
  const [stats, setStats] = useState({
    totalCustomers: 0,
    activeCustomers: 0,
    blockedCustomers: 0,
    premiumCustomers: 0,
    deletedCustomers: 0,
    totalRevenue: 0,
  });

  // ============================
  // LOAD CUSTOMERS
  // ============================

  const loadCustomers = async (page = currentPage,  deleted = showDeleted) => {
    try {
      setLoading(true);
console.log("SHOW DELETED =", showDeleted);
    const response = await customerService.fetchCustomers({
    page,
  search: searchTerm,
  status: filterStatus,
  deleted,
});
console.log("API RESPONSE =", response);

setCustomers(response.customers || []);

console.log("CUSTOMERS =", response.customers);

      if (response.pagination) {
        setCurrentPage(response.pagination.currentPage);
        setTotalPages(response.pagination.totalPages || 1);
      }

      setError("");
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to load customers"
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================
  // LOAD STATS
  // ============================
const loadStats = async () => {
  try {
    const response = await customerService.getCustomerStats();

    console.log("STATS API RESPONSE =", response);

    setStats(response.stats || {});
  } catch (err) {
    console.log(err);
  }
};

  // ============================
  // INITIAL LOAD
  // ============================

  useEffect(() => {
    loadCustomers(1);
    loadStats();
  }, []);

  // ============================
  // RELOAD WHEN FILTER CHANGES
  // ============================

  useEffect(() => {
    loadCustomers(currentPage);
  }, [
    currentPage,
    searchTerm,
    filterStatus,
    showDeleted,
  ]);

  // ============================
  // ADD CUSTOMER
  // ============================

  const addCustomer = async (data) => {
    try {
      setLoading(true);

      const response =
        await customerService.createCustomer(data);

      await loadCustomers(1);
      await loadStats();

      return response.customer;
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ============================
  // UPDATE CUSTOMER
  // ============================

  const updateCustomer = async (id, data) => {
    try {
      setLoading(true);

      const response =
        await customerService.updateCustomer(
          id,
          data
        );

      await loadCustomers(currentPage);

      return response.customer;
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ============================
  // SOFT DELETE
  // ============================

  const deleteCustomer = async (id) => {
    try {
      await customerService.deleteCustomer(id);

      await loadCustomers(currentPage);
      await loadStats();
    } catch (err) {
      throw err;
    }
  };

  // ============================
  // RESTORE CUSTOMER
  // ============================

  const restoreCustomer = async (id) => {
    try {
      await customerService.restoreCustomer(id);

      await loadCustomers(currentPage);
      await loadStats();
    } catch (err) {
      throw err;
    }
  };

  // ============================
  // PERMANENT DELETE
  // ============================

  const permanentDelete = async (id) => {
    try {
      await customerService.permanentDeleteCustomer(
        id
      );

      await loadCustomers(currentPage);
      await loadStats();
    } catch (err) {
      throw err;
    }
  };

  // ============================
  // BLOCK CUSTOMER
  // ============================

  const blockCustomer = async (id) => {
    try {
      await customerService.blockCustomer(id);

      await loadCustomers(currentPage);
      await loadStats();
    } catch (err) {
      throw err;
    }
  };

  // ============================
  // UNBLOCK CUSTOMER
  // ============================

  const unblockCustomer = async (id) => {
    try {
      await customerService.unblockCustomer(id);

      await loadCustomers(currentPage);
      await loadStats();
    } catch (err) {
      throw err;
    }
  };

  // ============================
  // PREMIUM CUSTOMER
  // ============================

  const makePremiumCustomer = async (id) => {
    try {
     await customerService.makePremiumCustomer(id);

      await loadCustomers(currentPage);
      await loadStats();
    } catch (err) {
      throw err;
    }
  };
    // ============================
  // CUSTOMER DETAILS
  // ============================

  const getCustomerById = async (id) => {
    try {
      setLoading(true);

      const response =
        await customerService.getCustomerById(id);

      setSelectedCustomer(response.customer);

      return response;
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ============================
  // RESET FILTERS
  // ============================

  const resetFilters = () => {
    setSearchTerm("");
    setFilterStatus("");
    setFilterSort("newest");
    setShowDeleted(false);
    setCurrentPage(1);
  };

  // ============================
  // NEXT PAGE
  // ============================

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  // ============================
  // PREVIOUS PAGE
  // ============================

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  // ============================
  // REFRESH
  // ============================

  const refreshCustomers = async () => {
    await loadCustomers(currentPage);
    await loadStats();
  };

  // ============================
  // CONTEXT VALUE
  // ============================

  const value = {
    // Data
    customers,
    allCustomers: customers,
    stats,

    // Loading
    loading,
    error,

    getCustomerById,
    selectedCustomer,
    setSelectedCustomer,

    // Search
    searchTerm,
    setSearchTerm,

    // Filters
    filterStatus,
    setFilterStatus,

    filterSort,
    setFilterSort,

    showDeleted,
    setShowDeleted,

    // Pagination
    currentPage,
    totalPages,
    setCurrentPage,
    nextPage,
    prevPage,

    // CRUD
    loadCustomers,
    refreshCustomers,
    getCustomerById,

    addCustomer,
    updateCustomer,

    deleteCustomer,
    restoreCustomer,
    permanentDelete,

    blockCustomer,
    unblockCustomer,
    makePremiumCustomer,

    // Selected
    setSelectedCustomer,

    // Utilities
    resetFilters,
  };

  return (
    <CustomerContext.Provider value={value}>
      {children}
    </CustomerContext.Provider>
  );
};

// ============================
// CUSTOM HOOK
// ============================

export const useCustomers = () => {
  const context = useContext(CustomerContext);

  if (!context) {
    throw new Error(
      "useCustomers must be used within CustomerProvider"
    );
  }

  return context;
};

export default CustomerContext;