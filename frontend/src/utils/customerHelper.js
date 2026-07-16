

export const formatDate = (date) => {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// ===========================================
// Format Currency
// ===========================================

export const formatCurrency = (amount = 0) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};

// ===========================================
// Customer Badge Color
// ===========================================

export const getCustomerBadge = (membership) => {
  switch (membership) {
    case "VIP":
      return "bg-purple-100 text-purple-700";

    case "Premium":
      return "bg-amber-100 text-amber-700";

    default:
      return "bg-gray-100 text-gray-700";
  }
};

// ===========================================
// Status Badge Color
// ===========================================

export const getCustomerStatus = (status) => {
  switch (status) {
    case "active":
      return {
        label: "Active",
        color: "bg-green-100 text-green-700",
      };

    case "blocked":
      return {
        label: "Blocked",
        color: "bg-red-100 text-red-700",
      };

    default:
      return {
        label: "Unknown",
        color: "bg-gray-100 text-gray-700",
      };
  }
};

// ===========================================
// Total Orders
// ===========================================

export const calculateTotalOrders = (customers = []) => {
  return customers.reduce(
    (sum, customer) => sum + Number(customer.totalOrders || 0),
    0
  );
};

// ===========================================
// Total Revenue
// ===========================================

export const calculateRevenue = (customers = []) => {
  return customers.reduce(
    (sum, customer) => sum + Number(customer.totalSpent || 0),
    0
  );
};

// ===========================================
// Average Order Value
// ===========================================

export const calculateAverageOrder = (customer) => {
  if (!customer) return 0;

  if (!customer.totalOrders) return 0;

  return Math.round(
    customer.totalSpent / customer.totalOrders
  );
};

// ===========================================
// Search Customers
// ===========================================

export const searchCustomers = (
  customers = [],
  keyword = ""
) => {
  if (!keyword) return customers;

  const value = keyword.toLowerCase();

  return customers.filter(
    (customer) =>
      customer.fullName?.toLowerCase().includes(value) ||
      customer.email?.toLowerCase().includes(value) ||
      customer.phone?.includes(value) ||
      customer.customerId?.toLowerCase().includes(value)
  );
};

// ===========================================
// Filter Customers
// ===========================================

export const filterCustomers = (
  customers = [],
  filters = {}
) => {
  const {
    status,
    membership,
    city,
  } = filters;

  return customers.filter((customer) => {
    const statusMatch = status
      ? customer.status === status
      : true;

    const membershipMatch = membership
      ? customer.membership === membership
      : true;

    const cityMatch = city
      ? customer.city === city
      : true;

    return (
      statusMatch &&
      membershipMatch &&
      cityMatch
    );
  });
};

// ===========================================
// Sort Customers
// ===========================================

export const sortCustomers = (
  customers = [],
  field = "fullName",
  order = "asc"
) => {
  const sorted = [...customers];

  sorted.sort((a, b) => {
    const first = a[field];
    const second = b[field];

    if (typeof first === "string") {
      return order === "asc"
        ? first.localeCompare(second)
        : second.localeCompare(first);
    }

    return order === "asc"
      ? first - second
      : second - first;
  });

  return sorted;
};

// ===========================================
// Pagination
// ===========================================

export const paginateCustomers = (
  customers = [],
  page = 1,
  limit = 10
) => {
  const start = (page - 1) * limit;

  const end = start + limit;

  return customers.slice(start, end);
};

// ===========================================
// Customer Statistics
// ===========================================

export const getCustomerStatistics = (
  customers = []
) => ({
  totalCustomers: customers.length,

  activeCustomers: customers.filter(
    (customer) => customer.status === "active"
  ).length,

  blockedCustomers: customers.filter(
    (customer) => customer.status === "blocked"
  ).length,

  premiumCustomers: customers.filter(
    (customer) =>
      customer.membership === "Premium" ||
      customer.membership === "VIP"
  ).length,

  totalRevenue: calculateRevenue(customers),

  totalOrders: calculateTotalOrders(customers),
});