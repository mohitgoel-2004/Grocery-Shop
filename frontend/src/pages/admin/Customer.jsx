import React, { useState, useEffect, createContext, useContext } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiUser,
  FiPlus,
  FiGrid,
  FiList,
  FiArrowLeft,
  FiPackage,
  FiDollarSign,
  FiCalendar,
  FiEdit2,
  FiTrash2,
  FiRefreshCw,
  FiChevronLeft,
  FiChevronRight,
  FiSearch,
  FiStar,
  FiUsers,
  FiUserX,
  FiUserCheck,
  FiUserPlus,
  FiMapPin,
  FiMessageCircle,
  FiActivity,
} from 'react-icons/fi';

// Import all customer UI components from the combined component file.
import {
  CustomerCard,
  CustomerTable,
  CustomerForm,
  CustomerSearch,
  CustomerFilters,
  CustomerPagination,
  CustomerStats,
  CustomerStatusBadge,
  CustomerProfileModal,
  DeleteCustomerModal,
  CustomerAddressCard,
  CustomerOrderHistory,
  CustomerWishlist,
  CustomerReviews,
  CustomerActivity,
  CustomerNotes,
} from '../../components/admin/Customer';
import { useCustomers } from '../../Context/CustomerContext';


// ---------- HELPER: Filtered status page generator ----------
const createStatusPage = (status, title, icon) => {
  return () => {
    const navigate = useNavigate();
  const {
  allCustomers,
  loading,
  loadCustomers,
  setFilterStatus,
  setShowDeleted,
} = useCustomers();
useEffect(() => {
  setShowDeleted(false);

  if (status === "premium") {
    setFilterStatus("");
    loadCustomers(1, false);
  } else {
    setFilterStatus(status);
    loadCustomers(1, false);
  }

  return () => {
    setFilterStatus("");
  };
}, []);

const filtered =
  status === "active"
    ? allCustomers.filter(c => c.status === "active" && !c.deleted)
    : status === "blocked"
    ? allCustomers.filter(c => c.status === "blocked" && !c.deleted)
    : status === "premium"
    ? allCustomers.filter(c => c.isPremium && !c.deleted)
    : status === "deleted"
    ? allCustomers.filter(c => c.deleted)
    : allCustomers;

    const handleViewDetails = (id) => {
      navigate(`/admin/customers/${id}`);
    };

    return (
      <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Link to="/admin/customers" className="text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400">
            <FiArrowLeft size={20} />
          </Link>
          <h3 className="flex items-center gap-2 text-2xl font-extrabold text-slate-900">
            {icon} {title}
          </h3>
          <span className="text-sm text-gray-500 dark:text-gray-400">({filtered.length} customers)</span>
        </div>

        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-500 dark:text-gray-400">No {status} customers found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {filtered.map((customer) => (
              <CustomerCard
                key={customer._id}
                customer={customer}
                onViewDetails={handleViewDetails}
                onEdit={(c) => navigate(`/admin/customers/edit/${c.id}`)}
                onDelete={() => {}}
              />
            ))}
          </div>
        )}
      </div>
    );
  };
};

// ============================================================
// PAGE: Customers (Main listing with tabs and all features)
// ============================================================
 const CustomersPage = () => {
  const navigate = useNavigate();
  const {
    customers,
    allCustomers,
    loading,
    searchTerm,
    setSearchTerm,
    filterStatus,
    setFilterStatus,
    filterSort,
    setFilterSort,
    currentPage,
    setCurrentPage,
    totalPages,
    stats,
    showDeleted,
    setShowDeleted,
    resetFilters,
    blockCustomer,
    unblockCustomer,
    makePremiumCustomer,
    deleteCustomer,
    restoreCustomer,
    permanentDelete,
    getCustomerById,
    selectedCustomer,
  } = useCustomers();

  console.log("customers =", customers);
console.log("allCustomers =", allCustomers);
console.log("loading =", loading);

  const [viewMode, setViewMode] = useState('grid');
  const [deleteModal, setDeleteModal] = useState(null);
  const [profileModal, setProfileModal] = useState(null);

 const handleViewDetails = (id) => {
  navigate(`/admin/customers/${id}`);
};

const handleEdit = (customer) => {
  navigate(`/admin/customers/edit/${customer._id}`);
};

// Block
const handleBlock = async (id) => {
  try {
    await blockCustomer(id);
  } catch (err) {
    console.error(err);
  }
};

// Unblock
const handleUnblock = async (id) => {
  try {
    await unblockCustomer(id);
  } catch (err) {
    console.error(err);
  }
};

// Make Premium
const handlePremium = async (id) => {
  try {
    await makePremiumCustomer(id);
  } catch (err) {
    console.error(err);
  }
};

// Soft Delete (Modal Open)
const handleDelete = (id) => {
  setDeleteModal({
    id,
    action: "soft",
  });
};

// Restore
const handleRestore = async (id) => {
  try {
    await restoreCustomer(id);
  } catch (err) {
    console.error(err);
  }
};

// Permanent Delete (Modal Open)
const handlePermanentDelete = (id) => {
  setDeleteModal({
    id,
    action: "permanent",
  });
};

// Modal Confirm
const confirmDelete = async () => {
  if (!deleteModal) return;

  try {
    if (deleteModal.action === "soft") {
      await deleteCustomer(deleteModal.id);
    } else {
      await permanentDelete(deleteModal.id);
    }

    setDeleteModal(null);
  } catch (err) {
    console.error(err);
  }
};

  // Tab navigation
  const tabs = [
    { label: 'All', value: 'all', path: '/admin/customers' },
    { label: 'Active', value: 'active', path: '/admin/customers/active' },
    { label: 'Blocked', value: 'blocked', path: '/admin/customers/blocked' },
    { label: 'Premium', value: 'premium', path: '/admin/customers/premium' },
    { label: "Deleted",  value: "deleted", path: "/admin/customers/deleted" },
  ];

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="flex items-center gap-2 text-2xl font-extrabold text-slate-900">
            <FiUsers className="text-emerald-500" />
            Customer Management
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Manage your customer base, view profiles, and track activity.
          </p>
        </div>
        {/* <Link
          to="/admin/customers/add"
          className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-6 py-3 rounded-2xl font-semibold shadow-lg shadow-emerald-200/50 dark:shadow-emerald-900/30 flex items-center gap-2 transition-all inline-flex"
        >
          <FiPlus size={20} />
          Add Customer
        </Link> */}
      </div>

      {/* Stats */}
    <CustomerStats stats={stats} />

      {/* Tabs */}
     <div className="flex flex-wrap gap-2 bg-white rounded-2xl p-2 border border-gray-100/80 w-full overflow-x-hidden">
  {tabs.map((tab) => (
    <Link
      key={tab.value}
      to={tab.path}
      className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
        (tab.value === 'all' &&
          window.location.pathname === '/admin/customers') ||
        window.location.pathname === tab.path
          ? 'bg-emerald-100 text-emerald-700'
          : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      {tab.label}
    </Link>
  ))}
</div>

     {/* Search & Filters */}
<div className="bg-white rounded-3xl shadow-sm border border-gray-100/80 p-3 sm:p-5 w-full overflow-hidden">
  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

    {/* Search */}
    <div className="w-full lg:flex-1 min-w-0">
      <CustomerSearch
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
    </div>

    {/* Filters + Actions */}
    <div className="flex flex-col sm:flex-row sm:flex-wrap lg:flex-nowrap gap-3 w-full lg:w-auto lg:items-center">

      <div className="w-full sm:w-auto">
        <CustomerFilters
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          filterSort={filterSort}
          setFilterSort={setFilterSort}
          resetFilters={resetFilters}
        />
      </div>

      {/* Toggle deleted view - only for main page */}
      {!showDeleted && (
        <button
          onClick={() => setShowDeleted(true)}
          className="w-full sm:w-auto min-h-10 px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/70 hover:bg-gray-100 transition text-gray-600 flex items-center justify-center gap-2 whitespace-nowrap"
        >
          <FiTrash2 size={16} />
          View Deleted
        </button>
      )}

      {showDeleted && (
        <button
          onClick={() => setShowDeleted(false)}
          className="w-full sm:w-auto min-h-10 px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/70 hover:bg-gray-100 transition text-gray-600 flex items-center justify-center gap-2 whitespace-nowrap"
        >
          <FiUserCheck size={16} />
          Hide Deleted
        </button>
      )}

      {/* Grid / Table */}
      <div className="flex items-center gap-2 self-start sm:self-auto">
        <button
          onClick={() => setViewMode('grid')}
          aria-label="Grid view"
          className={`p-2.5 min-w-10 min-h-10 rounded-xl border ${
            viewMode === 'grid'
              ? 'bg-emerald-100 border-emerald-300'
              : 'border-gray-200'
          } hover:bg-gray-100 transition flex items-center justify-center`}
        >
          <FiGrid size={18} />
        </button>

        <button
          onClick={() => setViewMode('table')}
          aria-label="Table view"
          className={`p-2.5 min-w-10 min-h-10 rounded-xl border ${
            viewMode === 'table'
              ? 'bg-emerald-100 border-emerald-300'
              : 'border-gray-200'
          } hover:bg-gray-100 transition flex items-center justify-center`}
        >
          <FiList size={18} />
        </button>
      </div>

    </div>
  </div>
</div>
      {/* Customer List */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100/80 dark:border-gray-700/80 overflow-hidden animate-pulse">
              <div className="p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mt-1"></div>
                  </div>
                </div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
              </div>
            </div>
          ))}
        </div>
      ) : allCustomers.length === 0 ? (
        <div className="text-center py-16">
          <FiUser size={64} className="mx-auto text-gray-300 dark:text-gray-600" />
          <h3 className="mt-4 text-xl font-semibold text-gray-600 dark:text-gray-400">No customers found</h3>
          <p className="text-gray-400 dark:text-gray-500">Try adjusting your search or filters.</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {customers.map((customer) => (
            <CustomerCard
               key={customer._id}
    customer={customer}
    onViewDetails={handleViewDetails}
    onEdit={handleEdit}
    onBlock={handleBlock}
    onUnblock={handleUnblock}
    onPremium={handlePremium}
    onDelete={handleDelete}
    onRestore={handleRestore}
    onPermanentDelete={handlePermanentDelete}
            />
          ))}
        </div>
      ) : (
        <CustomerTable
          customers={customers}
          onViewDetails={handleViewDetails}
          onEdit={handleEdit}
          onBlock={handleBlock}
          onUnblock={handleUnblock}
          onPremium={handlePremium}
          onDelete={handleDelete}
          onRestore={handleRestore}
          onPermanentDelete={handlePermanentDelete}
        />
      )}

      <CustomerPagination
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />

      {/* Delete Modal */}
      <DeleteCustomerModal
        isOpen={!!deleteModal}
        onClose={() => setDeleteModal(null)}
        onConfirm={confirmDelete}
      />

      {/* Profile Modal */}
      <CustomerProfileModal
        isOpen={!!profileModal}
        onClose={() => setProfileModal(null)}
        customer={profileModal}
      />
    </div>
  );
};

// ============================================================
// PAGE: CustomerDetails
// ============================================================
export const CustomerDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
   const {
    getCustomerById,
    selectedCustomer,
    loading,
  } = useCustomers();
  const [customer, setCustomer] = useState(null);

 useEffect(() => {
  getCustomerById(id);
}, [id]);

  if (loading) return <div className="p-6 text-center">Loading...</div>;
   if (!selectedCustomer) return (
    <div className="p-6 text-center text-gray-600 dark:text-gray-300">
      <p>Customer not found.</p>
      <Link to="/admin/customers" className="text-emerald-600 hover:underline">Back to Customers</Link>
    </div>
  );

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto">
      <Link to="/admin/customers" className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 mb-6">
        <FiArrowLeft /> Back to Customers
      </Link>

      <div className="space-y-6">
        {/* Profile Header */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100/80 dark:border-gray-700/80 p-6">
          <div className="flex flex-wrap justify-between items-start gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white text-2xl font-bold">
                {customer.fullName.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-gray-800 dark:text-white">{customer.fullName}</h1>
                <p className="text-gray-500 dark:text-gray-400">{customer.email}</p>
                <div className="flex items-center gap-3 mt-1">
                  <CustomerStatusBadge status={customer.status} />
                  {customer.isPremium && (
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 flex items-center gap-1">
                      <FiStar size={14} /> Premium
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Link
                to={`/admin/customers/edit/${customer._id}`}
                className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold shadow-lg shadow-emerald-200/50 dark:shadow-emerald-900/30 flex items-center gap-2 transition"
              >
                <FiEdit2 /> Edit
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Details, Address, Notes */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100/80 dark:border-gray-700/80 p-6">
              <h3 className="font-semibold text-gray-800 dark:text-white flex items-center gap-2 mb-4">
                <FiUser className="text-emerald-500" /> Personal Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Phone</p>
                  <p className="font-medium text-gray-800 dark:text-white">{customer.mobile || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Joined</p>
                  <p className="font-medium text-gray-800 dark:text-white">{new Date(customer.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Total Orders</p>
                  <p className="font-medium text-gray-800 dark:text-white">{customer.totalOrders}</p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Total Spent</p>
                  <p className="font-medium text-gray-800 dark:text-white">₹{customer.totalSpent}</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100/80 dark:border-gray-700/80 p-6">
              <h3 className="font-semibold text-gray-800 dark:text-white flex items-center gap-2 mb-4">
                <FiMapPin className="text-emerald-500" /> Address
              </h3>
              {customer.address ? (
                <CustomerAddressCard
                  address={{  label:"Home",
    line1:customer.address,
    city:customer.city,
    state:"",
    pincode:customer.pincode }}
                  onEdit={() => {}}
                  onDelete={() => {}}
                />
              ) : (
                <p className="text-gray-500 dark:text-gray-400">No address provided.</p>
              )}
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100/80 dark:border-gray-700/80 p-6">
              <h3 className="font-semibold text-gray-800 dark:text-white flex items-center gap-2 mb-4">
                <FiMessageCircle className="text-emerald-500" /> Notes
              </h3>
              <CustomerNotes
                notes={customer.notes || []}
                onAddNote={(text) => {
                  // Update notes in context (not implemented in mock)
                  alert('Add note: ' + text);
                }}
                onDeleteNote={(idx) => {
                  // Delete note (not implemented in mock)
                  alert('Delete note index: ' + idx);
                }}
              />
            </div>
          </div>

          {/* Right Column: Stats, Activity */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100/80 dark:border-gray-700/80 p-6">
              <h3 className="font-semibold text-gray-800 dark:text-white flex items-center gap-2 mb-4">
                <FiPackage className="text-emerald-500" /> Recent Orders
              </h3>
              {customer.orders && customer.orders.length > 0 ? (
                <div className="space-y-2">
                  {customer.orders.slice(0, 3).map((order) => (
                    <div key={order.id} className="flex justify-between items-center text-sm border-b border-gray-100 dark:border-gray-700 pb-2 last:border-0">
                      <div>
                        <p className="font-medium text-gray-800 dark:text-white">{order.orderNumber}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(order.date).toLocaleDateString()}</p>
                      </div>
                      <span className="font-bold">₹{order.total}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-sm">No orders.</p>
              )}
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100/80 dark:border-gray-700/80 p-6">
              <h3 className="font-semibold text-gray-800 dark:text-white flex items-center gap-2 mb-4">
                <FiActivity className="text-emerald-500" /> Recent Activity
              </h3>
              <CustomerActivity activities={customer.activities || []} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// PAGES: AddCustomer & EditCustomer
// ============================================================
export const AddCustomerPage = () => {
  const navigate = useNavigate();
  const { addCustomer } = useCustomers();

  const handleSubmit = async (data) => {
  try {
    await addCustomer(data);

    navigate("/admin/customers");
  } catch (err) {
    console.log(err);
  }
};

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-extrabold text-gray-800 dark:text-white mb-6">Add New Customer</h1>
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100/80 dark:border-gray-700/80 p-6">
        <CustomerForm
          onSubmit={handleSubmit}
          onCancel={() => navigate('/admin/customers')}
          submitLabel="Add Customer"
        />
      </div>
    </div>
  );
};

export const EditCustomerPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { customers, updateCustomer, loading } = useCustomers();
  const [customer, setCustomer] = useState(null);

  useEffect(() => {
  const found = customers.find(
    c => String(c._id) === String(id)
);
    if (found) setCustomer(found);
  }, [id, customers]);

  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (!customer) return (
    <div className="p-6 text-center text-gray-600 dark:text-gray-300">
      <p>Customer not found.</p>
      <Link to="/admin/customers" className="text-emerald-600 hover:underline">Back to Customers</Link>
    </div>
  );

  const handleSubmit = (data) => {
    updateCustomer(customer._id, data);
    navigate('/admin/customers');
  };

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-extrabold text-gray-800 dark:text-white mb-6">Edit Customer</h1>
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100/80 dark:border-gray-700/80 p-6">
        <CustomerForm
          initialData={customer}
          onSubmit={handleSubmit}
          onCancel={() => navigate('/admin/customers')}
          submitLabel="Update Customer"
        />
      </div>
    </div>
  );
};

// ============================================================
// STATUS PAGES (Active, Blocked, Premium, Deleted)
// ============================================================
export const ActiveCustomersPage = createStatusPage('active', 'Active Customers', <FiUserCheck className="text-emerald-500" />);
export const BlockedCustomersPage = createStatusPage('blocked', 'Blocked Customers', <FiUserX className="text-red-500" />);
export const PremiumCustomersPage = () => {
  const navigate = useNavigate();
  const { allCustomers, loading, loadCustomers, } = useCustomers();
useEffect(() => {
  loadCustomers(1, false);
}, []);

const filtered = allCustomers.filter(
  c => c.isPremium && !c.deleted
);

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link to="/admin/customers" className="text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400">
          <FiArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-extrabold text-gray-800 dark:text-white flex items-center gap-2">
          <FiStar className="text-amber-500" /> Premium Customers
        </h1>
        <span className="text-sm text-gray-500 dark:text-gray-400">({filtered.length} customers)</span>
      </div>
      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-500 dark:text-gray-400">No premium customers found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((customer) => (
            <CustomerCard
              key={customer._id}
              customer={customer}
              onViewDetails={(id) => navigate(`/admin/customers/${id}`)}
              onEdit={(c) => navigate(`/admin/customers/edit/${c._id}`)}
              onDelete={() => {}}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const DeletedCustomersPage = () => {
  const navigate = useNavigate();
const {
  allCustomers,
  loading,
  restoreCustomer,
  permanentDelete,
  loadCustomers,
  setShowDeleted,
} = useCustomers();

useEffect(() => {
  setShowDeleted(true);
  loadCustomers(1, true);

  return () => {
    setShowDeleted(false);
  };
}, []);
const filtered = allCustomers.filter(c => c.deleted);

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link to="/admin/customers" className="text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400">
          <FiArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-extrabold text-gray-800 dark:text-white flex items-center gap-2">
          <FiTrash2 className="text-red-500" /> Deleted Customers
        </h1>
        <span className="text-sm text-gray-500 dark:text-gray-400">({filtered.length} customers)</span>
      </div>
      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-500 dark:text-gray-400">No deleted customers.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((customer) => (
            <div key={customer._id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100/80 dark:border-gray-700/80 overflow-hidden p-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-lg font-bold">
                    {customer.fullName?.charAt(0).toUpperCase() || "?"}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 dark:text-white">{customer.fullName}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{customer.email}</p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">Deleted</span>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => restoreCustomer(customer._id)}
                  className="px-4 py-1.5 rounded-lg text-xs font-medium bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition"
                >
                  Restore
                </button>
                <button
                  onClick={() => {
                    if (window.confirm('Permanently delete this customer?')) {
                      permanentDelete(customer._id);
                    }
                  }}
                  className="px-4 py-1.5 rounded-lg text-xs font-medium bg-red-100 text-red-700 hover:bg-red-200 transition"
                >
                  Permanent Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ============================================================
// EXPORT ALL PAGES (with alias for each)
// ============================================================
export const Customers = CustomersPage;
export const CustomerDetails = CustomerDetailsPage;
export const AddCustomer = AddCustomerPage;
export const EditCustomer = EditCustomerPage;
export const ActiveCustomers = ActiveCustomersPage;
export const BlockedCustomers = BlockedCustomersPage;
export const PremiumCustomers = PremiumCustomersPage;
export const DeletedCustomers = DeletedCustomersPage;


export default CustomersPage;