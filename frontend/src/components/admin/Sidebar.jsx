// Sidebar.jsx
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiGrid,
  FiBox,
  FiLayers,
  FiShoppingCart,
  FiUsers,
  FiArchive,
  FiGift,
  FiBarChart2,
  FiSettings,
  FiUser,
  FiLogOut,
  FiX,
  FiChevronRight,
} from "react-icons/fi";
import { FaAppleAlt } from "react-icons/fa";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();

  const menuItems = [
    { title: "Dashboard", icon: <FiGrid size={20} />, path: "/admin/dashboard" },
    { title: "Products", icon: <FiBox size={20} />, path: "/admin/products" },
    { title: "Categories", icon: <FiLayers size={20} />, path: "/admin/categories" },
    { title: "Orders", icon: <FiShoppingCart size={20} />, path: "/admin/orders" },
    { title: "Customers", icon: <FiUsers size={20} />, path: "/admin/customers" },
    { title: "Inventory", icon: <FiArchive size={20} />, path: "/admin/inventory" },
    { title: "Coupons", icon: <FiGift size={20} />, path: "/admin/coupons" },
    { title: "Reports", icon: <FiBarChart2 size={20} />, path: "/admin/reports" },
    { title: "Settings", icon: <FiSettings size={20} />, path: "/admin/settings" },
    { title: "Profile", icon: <FiUser size={20} />, path: "/admin/profile" },
  ];

  const logout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
     <motion.aside
  initial={false}
  animate={{
    x:
      window.innerWidth >= 1024
        ? 0
        : sidebarOpen
        ? 0
        : -300,
  }}
  transition={{ duration: 0.25 }}
  className="fixed top-0 left-0 z-50 h-screen w-[250px] bg-white dark:bg-gray-900 shadow-2xl border-r border-gray-200 dark:border-gray-800 flex flex-col"
>
        {/* Header / Brand */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100/80 dark:border-gray-800/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-200/50 dark:shadow-emerald-900/30">
              <FaAppleAlt size={20} />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-gray-800 dark:text-white tracking-tight">
                Grocery<span className="text-emerald-500">Hub</span>
              </h2>
              <p className="text-[11px] font-medium text-gray-400 dark:text-gray-500 tracking-wider uppercase">
                Admin Panel
              </p>
            </div>
          </div>
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
           onClick={() => {
  if (window.innerWidth < 1024) {
    setSidebarOpen(false);
  }
}}
          >
            <FiX size={22} className="text-gray-600 dark:text-gray-300" />
          </button>
        </div>

        {/* User profile mini card */}
        {/* <div className="mx-5 mt-4 p-4 rounded-2xl bg-gradient-to-r from-emerald-50/60 to-emerald-100/30 dark:from-emerald-900/20 dark:to-emerald-800/10 border border-emerald-100/50 dark:border-emerald-800/30 flex items-center gap-3">
          <img
            src="https://i.pravatar.cc/100?img=11"
            alt="Admin"
            className="w-12 h-12 rounded-full object-cover ring-2 ring-emerald-400/30 dark:ring-emerald-500/30"
          />
          <div className="flex-1">
            <h4 className="font-semibold text-sm text-gray-800 dark:text-white">Rahul Sharma</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">Super Admin</p>
            <span className="inline-block mt-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-100/70 dark:bg-emerald-900/40 px-2 py-0.5 rounded-full">
              ● Online
            </span>
          </div>
          <FiChevronRight size={16} className="text-gray-400 dark:text-gray-500" />
        </div> */}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-5 space-y-1.5 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
          {menuItems.map((item, index) => (
            <NavLink
              key={item.title}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `group flex items-center gap-4 px-4 py-3 rounded-xl font-medium transition-all duration-200 relative ${
                  isActive
                    ? "bg-gradient-to-r from-emerald-50 to-emerald-100/60 dark:from-emerald-900/30 dark:to-emerald-800/20 text-emerald-700 dark:text-emerald-300 shadow-sm shadow-emerald-100/30 dark:shadow-emerald-900/20"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-gray-200"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`transition-colors duration-200 ${
                      isActive
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300"
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span className="flex-1 text-sm">{item.title}</span>
                  {isActive && (
                    <motion.span
                      layoutId="activeIndicator"
                      className="w-1.5 h-6 rounded-full bg-emerald-500 shadow-md shadow-emerald-200/50 dark:shadow-emerald-900/30"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Logout button */}
        <div className="px-5 pb-6 pt-2 border-t border-gray-100/80 dark:border-gray-800/80">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={logout}
            className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-rose-500 to-red-500 hover:from-rose-600 hover:to-red-600 text-white py-3.5 rounded-2xl font-semibold transition-all duration-200 shadow-lg shadow-rose-200/50 dark:shadow-rose-900/30"
          >
            <FiLogOut size={18} />
            Logout
          </motion.button>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;