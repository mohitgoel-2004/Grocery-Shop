import React from "react";
import { motion } from "framer-motion";
import {
  FiShoppingBag,
  FiUsers,
  FiDollarSign,
  FiPackage,
  FiTrendingUp,
  FiTrendingDown,
  FiClock,
  FiArrowUpRight,
  FiSearch,
  FiGrid,
  FiList,
  FiTag,
  FiTruck,
  FiBarChart2,
  FiBell,
  FiUser,
  FiMoreHorizontal,
} from "react-icons/fi";
import { FaAppleAlt, FaCarrot, FaLeaf, FaStore, FaSeedling } from "react-icons/fa";
import { useDashboard } from "../../Context/dashboardContext";

// ========== MAIN COMPONENT ==========
const Dashboard = () => {
  const {
    dashboard,
    loading,
    error,
    refreshDashboard,
  } = useDashboard();

  console.log("Dashboard State:", dashboard);
  console.log("Loading:", loading);
  console.log("Error:", error);

  const [hoveredStat, setHoveredStat] = React.useState(null);
  console.log(dashboard.summary);
  console.log(dashboard.today);
  console.log(dashboard.recentOrders);

  const stats = [
    {
      title: "Revenue",
      value: `₹${dashboard?.summary?.totalRevenue ?? 0}`,
      icon: <FiDollarSign size={24} />,
      color: "from-emerald-400 to-emerald-600",
      bgLight: "bg-emerald-50",
      textColor: "text-emerald-600",
      positive: true,
      change: "Live",
    },
    {
      title: "Orders",
      value: dashboard?.summary?.totalOrders ?? 0,
      icon: <FiShoppingBag size={24} />,
      color: "from-blue-400 to-blue-600",
      bgLight: "bg-blue-50",
      textColor: "text-blue-600",
      positive: true,
      change: "Live",
    },
    {
      title: "Customers",
      value: dashboard?.summary?.totalCustomers ?? 0,
      icon: <FiUsers size={24} />,
      color: "from-purple-400 to-purple-600",
      bgLight: "bg-purple-50",
      textColor: "text-purple-600",
      positive: true,
      change: "Live",
    },
    {
      title: "Products",
      value: dashboard?.summary?.totalProducts ?? 0,
      icon: <FiPackage size={24} />,
      color: "from-amber-400 to-amber-600",
      bgLight: "bg-amber-50",
      textColor: "text-amber-600",
      positive: true,
      change: "Live",
    },
  ];

  const recentOrders = dashboard?.recentOrders || [];

  const todaySummary = [
    {
      title: "Pending",
      value: dashboard?.today?.pendingOrders || 0,
      icon: <FiClock className="text-amber-500" size={18} />,
      bg: "bg-amber-100",
    },
    {
      title: "Delivered",
      value: dashboard?.today?.deliveredOrders || 0,
      icon: <FiTruck className="text-emerald-500" size={18} />,
      bg: "bg-emerald-100",
    },
    {
      title: "Cancelled",
      value: dashboard?.today?.cancelledOrders || 0,
      icon: <FiTrendingDown className="text-red-500" size={18} />,
      bg: "bg-red-100",
    },
    {
      title: "New Customers",
      value: dashboard?.today?.newCustomers || 0,
      icon: <FiUsers className="text-purple-500" size={18} />,
      bg: "bg-purple-100",
    },
  ];

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
        <div className="w-16 h-16 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-500 font-medium">Loading your dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
        <div className="bg-red-50 text-red-600 px-6 py-4 rounded-2xl shadow-sm border border-red-200 max-w-md text-center">
          <h2 className="text-lg font-bold">Oops!</h2>
          <p className="mt-1">{error}</p>
          <button
            onClick={refreshDashboard}
            className="mt-4 px-6 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50/40 via-white to-blue-50/30 font-['Inter',sans-serif]">
      {/* ===== MOBILE HEADER ===== */}
      {/* <header className="sticky top-0 z-40 bg-white/70 backdrop-blur-md border-b border-gray-200/60 px-4 py-3 flex items-center justify-between lg:px-8">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-md shadow-emerald-200">
            <FaStore className="text-white text-xl" />
          </div>
          <span className="font-extrabold text-xl text-gray-800 tracking-tight">
            Grocery<span className="text-emerald-500">Hub</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-2 rounded-full hover:bg-gray-100 transition relative">
            <FiBell size={20} className="text-gray-600" />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          <button className="p-2 rounded-full hover:bg-gray-100 transition">
            <FiUser size={20} className="text-gray-600" />
          </button>
        </div>
      </header> */}

      {/* ===== DASHBOARD BODY ===== */}
      <main className="max-w-7xl mx-auto px-4 py-6 lg:px-8 space-y-6">
        {/* ===== WELCOME SECTION ===== */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
        >
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800 tracking-tight flex items-center gap-2">
              Dashboard
              <span className="text-xs font-medium bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full">
                <FaLeaf className="inline mr-1" size={12} />
                Fresh
              </span>
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Welcome back 👋 Here's your grocery store snapshot.
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-5 py-2.5 rounded-xl font-semibold shadow-md shadow-emerald-200/60 hover:shadow-lg hover:from-emerald-600 hover:to-emerald-700 transition-all"
          >
            <FiBarChart2 size={18} />
            <span className="hidden sm:inline">Generate Report</span>
            <span className="sm:hidden">Report</span>
          </motion.button>
        </motion.div>

        {/* ===== STATS CARDS ===== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.07, type: "spring", stiffness: 300 }}
              onMouseEnter={() => setHoveredStat(index)}
              onMouseLeave={() => setHoveredStat(null)}
              className={`relative bg-white rounded-2xl p-5 shadow-sm border border-gray-100/80 transition-all duration-300 ${
                hoveredStat === index ? "shadow-xl -translate-y-1 border-emerald-200/60" : ""
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">
                    {item.title}
                  </p>
                  <h3 className="text-2xl font-extrabold text-gray-800 mt-1">
                    {item.value}
                  </h3>
                  <div className="flex items-center mt-2 gap-1">
                    {item.positive ? (
                      <FiTrendingUp className="text-emerald-500" size={14} />
                    ) : (
                      <FiTrendingDown className="text-red-500" size={14} />
                    )}
                    <span
                      className={`text-xs font-semibold ${
                        item.positive ? "text-emerald-600" : "text-red-500"
                      }`}
                    >
                      {item.change}
                    </span>
                    <span className="text-gray-400 text-xs ml-0.5">vs last month</span>
                  </div>
                </div>
                <div
                  className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white shadow-lg`}
                  style={{ boxShadow: `0 6px 16px -4px ${item.color.split(" ")[1]}80` }}
                >
                  {item.icon}
                </div>
              </div>
              {/* subtle progress bar */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-100/80 rounded-b-2xl overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: item.positive ? "70%" : "30%" }}
                  transition={{ delay: 0.3 + index * 0.1, duration: 1, ease: "easeOut" }}
                  className={`h-full bg-gradient-to-r ${item.color}`}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* ===== TODAY + ORDERS ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          {/* Today's Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100/80 p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <FiClock className="text-emerald-500" />
                  Today
                </h2>
                <p className="text-xs text-gray-400">Performance snapshot</p>
              </div>
              <span className="text-xs font-medium text-gray-400 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                {new Date().toLocaleDateString("en-IN", {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                })}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {todaySummary.map((item, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.03 }}
                  className="bg-gray-50/80 rounded-xl p-3 hover:bg-emerald-50/40 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-lg ${item.bg} flex items-center justify-center`}>
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">
                        {item.title}
                      </p>
                      <p className="text-lg font-extrabold text-gray-800">{item.value}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            {/* Fresh tip */}
            <div className="mt-4 p-3 rounded-xl bg-gradient-to-r from-emerald-50/80 to-emerald-100/40 border border-emerald-100/50 flex items-center gap-3">
              <FaSeedling className="text-emerald-600 text-lg" />
              <div>
                <p className="text-xs font-semibold text-emerald-700">Stock alert</p>
                <p className="text-[10px] text-emerald-600/70">12 items need restocking</p>
              </div>
            </div>
          </motion.div>

          {/* Recent Orders */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-3 bg-white rounded-2xl shadow-sm border border-gray-100/80 p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <FiList className="text-emerald-500" />
                  Recent Orders
                </h2>
                <p className="text-xs text-gray-400">Latest transactions</p>
              </div>
              <button className="text-sm font-medium text-emerald-600 hover:text-emerald-700 flex items-center gap-1 transition">
                View all
                <FiArrowUpRight size={14} />
              </button>
            </div>

            {/* Mobile: Cards, Desktop: Table */}
            <div className="block lg:hidden space-y-3">
              {recentOrders.map((order, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + idx * 0.05 }}
                  className="bg-gray-50/70 rounded-xl p-3 border border-gray-100/60"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs font-semibold text-gray-700">
                        #{order?._id?.slice(-6) || "------"}
                      </p>
                      <p className="text-sm font-medium text-gray-800">
                        {order.user?.name || order.customer?.name || order.customerName || "Guest"}
                      </p>
                      <p className="text-xs text-gray-500">{order.items?.length || 0} items</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-800">₹{order.total || order.totalPrice}</p>
                      <span
                        className={`text-[10px] font-medium px-2 py-0.5 rounded-full inline-block mt-1 ${
                          order.status === "Delivered"
                            ? "bg-emerald-100 text-emerald-700"
                            : order.status === "Processing"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-400 text-xs font-medium uppercase tracking-wider border-b border-gray-100">
                    <th className="pb-2 pr-4">Order</th>
                    <th className="pb-2 pr-4">Customer</th>
                    <th className="pb-2 pr-4 hidden sm:table-cell">Items</th>
                    <th className="pb-2 pr-4">Total</th>
                    <th className="pb-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order, idx) => (
                    <motion.tr
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + idx * 0.05 }}
                      className="border-t border-gray-50/80 hover:bg-emerald-50/20 transition"
                    >
                      <td className="py-3 pr-4 font-semibold text-gray-700 text-xs">
                        #{order?._id?.slice(-6) || "------"}
                      </td>
                      <td className="py-3 pr-4 text-gray-700 font-medium">
                        {order.user?.name || order.customer?.name || order.customerName || "Guest"}
                      </td>
                      <td className="py-3 pr-4 text-gray-500 text-xs hidden sm:table-cell">
                        {order.items?.length || 0} Items
                      </td>
                      <td className="py-3 pr-4 font-bold text-gray-800">
                        ₹{order.total || order.totalPrice}
                      </td>
                      <td className="py-3">
                        <span
                          className={`text-xs font-medium px-3 py-1 rounded-full ${
                            order.status === "Delivered"
                              ? "bg-emerald-100 text-emerald-700"
                              : order.status === "Processing"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>

        {/* ===== QUICK ACTIONS ===== */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <FiGrid className="text-emerald-500" />
              Quick Actions
            </h2>
            <span className="text-xs text-gray-400 bg-white px-3 py-1 rounded-full border border-gray-100 shadow-sm">
              🛒 Ops
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Add Product", icon: <FiPackage size={18} />, color: "from-emerald-400 to-emerald-500", bg: "bg-emerald-50", iconBg: "bg-emerald-100 text-emerald-600" },
              { label: "Coupon", icon: <FiTag size={18} />, color: "from-amber-400 to-amber-500", bg: "bg-amber-50", iconBg: "bg-amber-100 text-amber-600" },
              { label: "Orders", icon: <FiShoppingBag size={18} />, color: "from-blue-400 to-blue-500", bg: "bg-blue-50", iconBg: "bg-blue-100 text-blue-600" },
              { label: "Inventory", icon: <FiGrid size={18} />, color: "from-purple-400 to-purple-500", bg: "bg-purple-50", iconBg: "bg-purple-100 text-purple-600" },
            ].map((action, index) => (
              <motion.button
                key={index}
                whileHover={{ y: -3, scale: 1.01 }}
                whileTap={{ scale: 0.97 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 + index * 0.06 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100/80 p-4 text-left hover:shadow-lg transition-all duration-200 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-9 h-9 rounded-xl ${action.iconBg} flex items-center justify-center group-hover:scale-110 transition`}>
                      {action.icon}
                    </div>
                    <h3 className="font-semibold text-gray-700 text-sm">{action.label}</h3>
                  </div>
                  <FiArrowUpRight className="text-gray-300 group-hover:text-emerald-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" size={16} />
                </div>
                <div className="mt-2 h-1 w-full rounded-full bg-gray-100/60 overflow-hidden">
                  <div className={`h-full w-0 group-hover:w-full bg-gradient-to-r ${action.color} transition-all duration-700`} />
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* ===== FOOTER ===== */}
        <div className="pt-6 pb-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-400 border-t border-gray-200/60">
          <div className="flex items-center gap-4">
            <span>© 2026 GroceryHub</span>
            <span className="w-1 h-1 rounded-full bg-gray-300" />
            <span className="flex items-center gap-1">
              <FaLeaf className="text-emerald-400" size={12} />
              Fresh & Organic
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Live
            </span>
            <span>v2.4.0</span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;