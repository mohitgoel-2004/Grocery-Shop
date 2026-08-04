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
            className="fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-sm lg:hidden"
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
  className="fixed top-0 left-0 z-50 flex h-screen w-[250px] flex-col border-r border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.12)]"
>
        {/* Header / Brand */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-linear-to-br from-emerald-400 to-emerald-600 text-white shadow-lg shadow-emerald-200/50">
              <FaAppleAlt size={20} />
            </div>
            <div>
              <h2 className="text-xl font-extrabold tracking-tight text-slate-900">
                Grocery<span className="text-emerald-500">Hub</span>
              </h2>
              <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
                Admin Panel
              </p>
            </div>
          </div>
          <button
            className="rounded-lg p-2 transition hover:bg-slate-100 lg:hidden"
           onClick={() => {
  if (window.innerWidth < 1024) {
    setSidebarOpen(false);
  }
}}
          >
            <FiX size={22} className="text-slate-600" />
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
        <nav className="flex-1 space-y-1.5 overflow-y-auto px-4 py-5 scrollbar-thin scrollbar-thumb-gray-300">
          {menuItems.map((item, index) => (
            <NavLink
              key={item.title}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `group flex items-center gap-4 px-4 py-3 rounded-xl font-medium transition-all duration-200 relative ${
                  isActive
                    ? "bg-emerald-50 text-emerald-700 shadow-sm shadow-emerald-100/40"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`transition-colors duration-200 ${
                      isActive
                        ? "text-emerald-600"
                        : "text-slate-400 group-hover:text-slate-600"
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span className="flex-1 text-sm">{item.title}</span>
                  {isActive && (
                    <motion.span
                      layoutId="activeIndicator"
                      className="h-6 w-1.5 rounded-full bg-emerald-500 shadow-md shadow-emerald-200/50"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Logout button */}
        <div className="border-t border-slate-100 px-5 pb-6 pt-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={logout}
            className="flex w-full items-center justify-center gap-3 rounded-2xl bg-linear-to-r from-rose-500 to-red-500 py-3.5 font-semibold text-white shadow-lg shadow-rose-200/50 transition-all duration-200 hover:from-rose-600 hover:to-red-600"
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