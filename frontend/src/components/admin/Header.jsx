// Header.jsx
import React, { useState, useEffect, useRef } from "react";
import {
  FiMenu,
  FiBell,
  FiSearch,
  FiChevronDown,
  FiUser,
  FiSettings,
  FiLogOut,
  FiShoppingBag,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { useAdminProfile } from "../../Context/AdminProfileContext";

const Header = ({ setSidebarOpen }) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const { adminProfile } = useAdminProfile();
  const dropdownRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { title: "Dashboard", path: "/admin/dashboard" },
    { title: "Products", path: "/admin/products" },
    { title: "Categories", path: "/admin/categories" },
    { title: "Orders", path: "/admin/orders" },
    { title: "Customers", path: "/admin/customers" },
    { title: "Inventory", path: "/admin/inventory" },
    { title: "Coupons", path: "/admin/coupons" },
    { title: "Reports", path: "/admin/reports" },
    { title: "Settings", path: "/admin/settings" },
    { title: "Profile", path: "/admin/profile" },
  ];

  const activeMobileLabel = menuItems.reduce((current, item) => {
    if (location.pathname === item.path || location.pathname.startsWith(`${item.path}/`)) {
      return item.title;
    }

    return current;
  }, "Admin Panel");

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    sessionStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const DropdownItem = ({ icon, label, danger, onClick }) => (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
        ${
          danger
            ? "text-red-600 hover:bg-red-50"
            : "text-slate-700 hover:bg-emerald-50/60"
        }`}
    >
      <span className="text-slate-500">{icon}</span>
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <header className="sticky top-0 z-30 overflow-visible border-b border-slate-100 bg-white/90 shadow-sm backdrop-blur-xl transition-all duration-300">
      <div className="flex items-center justify-between px-3 py-2 sm:px-6 sm:py-3.5 lg:px-8">
        {/* ---------- LEFT SECTION ---------- */}
        <div className="flex items-center gap-2 sm:gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSidebarOpen((prev) => !prev)}
            className="rounded-xl p-1.5 text-slate-600 transition-colors duration-200 hover:bg-slate-100 sm:p-2.5 lg:hidden"
            aria-label="Open sidebar"
          >
            <FiMenu size={20} />
          </motion.button>

          <div className="flex items-center gap-1.5 sm:gap-2.5">
            <div className="flex h-7 min-w-7 items-center justify-center rounded-xl bg-linear-to-br from-emerald-400 to-emerald-600 px-2 text-[10px] font-semibold text-white shadow-lg shadow-emerald-200/50 sm:h-9 sm:min-w-9 sm:px-0 sm:text-lg">
              <span className="sm:hidden truncate max-w-20">{activeMobileLabel}</span>
              <FiShoppingBag size={14} className="hidden text-white sm:block sm:text-lg" />
            </div>
            <span className="hidden text-lg font-extrabold tracking-tight text-slate-900 sm:inline">
              Grocery<span className="text-emerald-500">Hub</span>
            </span>
          </div>

          {/* Desktop Search */}
          <div
            className={`relative hidden md:block transition-all duration-300 ${
              searchFocused ? "w-96" : "w-72"
            }`}
          >
            <FiSearch
              className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200 ${
                searchFocused ? "text-emerald-500" : "text-slate-400"
              }`}
              size={18}
            />
            <input
              type="text"
              placeholder="Search products, orders, customers..."
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className="w-full rounded-xl border-2 border-slate-200 bg-slate-50/80 py-2.5 pl-11 pr-5 text-sm text-slate-700 shadow-sm transition-all duration-200 placeholder:text-slate-400 hover:shadow-md focus:border-emerald-400 focus:bg-white focus:ring-0"
            />
            <kbd className="absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-md border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-semibold text-slate-400 lg:inline-block">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* ---------- RIGHT SECTION ---------- */}
        <div className="flex items-center gap-1.5 sm:gap-4">
          {/* Notifications */}
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => navigate("/admin/notification")}
            className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-100/80 shadow-sm transition-all duration-200 hover:bg-slate-200/90 hover:shadow-md sm:h-11 sm:w-11"
            aria-label="Notifications"
          >
            <FiBell size={18} className="text-slate-600 sm:text-xl" />
            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm shadow-red-200/50 sm:h-5 sm:w-5 sm:text-xs">
              0
            </span>
          </motion.button>

          {/* Profile Dropdown Container - overflow-visible and high z-index */}
          <div className="relative overflow-visible" ref={dropdownRef}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-100/80 px-2 py-1 shadow-sm transition-all duration-200 hover:bg-slate-200/90 hover:shadow-md sm:gap-3 sm:px-3.5 sm:py-2"
            >
              <div className="relative">
                <img
                  src={
                    adminProfile?.avatar
                      ? `http://10.77.245.168:5000${adminProfile.avatar}`
                      : "https://ui-avatars.com/api/?name=Admin&background=10b981&color=fff&size=100"
                  }
                  alt="Admin"
                  className="h-8 w-8 rounded-full object-cover ring-2 ring-emerald-400/30 sm:h-10 sm:w-10"
                />
                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-400 shadow-sm shadow-emerald-200/50 sm:h-3.5 sm:w-3.5" />
              </div>
              <div className="hidden text-left lg:block">
                <h4 className="text-sm font-semibold leading-tight text-slate-900">
                  {adminProfile?.name || "Admin"}
                </h4>
                <p className="text-xs leading-tight text-slate-500">
                  {adminProfile?.email || "admin@groceryhub.in"}
                </p>
              </div>
              <FiChevronDown
                className={`text-slate-400 transition-transform duration-300 ${
                  profileOpen ? "rotate-180" : ""
                }`}
                size={14}
              />
            </motion.button>

            {/* Dropdown Menu - with higher z-index and adjusted positioning */}
            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.96 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-2xl"
                  style={{ minWidth: "16rem" }}
                >
                  {/* Profile header */}
                  <div className="border-b border-slate-100 bg-emerald-50/60 px-5 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          adminProfile?.avatar
                            ? `http://10.77.245.168:5000${adminProfile.avatar}`
                            : "https://ui-avatars.com/api/?name=Admin&background=10b981&color=fff&size=100"
                        }
                        alt="Admin"
                        className="h-10 w-10 rounded-full object-cover ring-2 ring-emerald-300/40"
                      />
                      <div>
                        <h4 className="font-bold text-slate-900">
                          {adminProfile?.name || "Admin"}
                        </h4>
                        <p className="text-xs text-slate-500">
                          {adminProfile?.email || "admin@groceryhub.in"}
                        </p>
                        <span className="mt-1 inline-block rounded-full bg-emerald-100/70 px-2 py-0.5 text-[10px] font-medium text-emerald-600">
                          ● Active
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-2">
                    <DropdownItem
                      icon={<FiUser size={18} />}
                      label="My Profile"
                      onClick={() => {
                        navigate("/admin/profile");
                        setProfileOpen(false);
                      }}
                    />
                    <DropdownItem
                      icon={<FiSettings size={18} />}
                      label="Settings"
                      onClick={() => {
                        navigate("/admin/settings");
                        setProfileOpen(false);
                      }}
                    />
                    <DropdownItem
                      icon={<FiBell size={18} />}
                      label="Notifications"
                      onClick={() => {
                        navigate("/admin/notification");
                        setProfileOpen(false);
                      }}
                    />
                  </div>

                  <hr className="border-slate-100" />
                  <DropdownItem
                    icon={<FiLogOut size={18} />}
                    label="Logout"
                    danger
                    onClick={handleLogout}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Mobile Search */}
      <div className="-mt-0.5 px-3 pb-2 sm:pb-3.5 md:hidden">
        <div className="relative">
          <FiSearch
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={16}
          />
          <input
            type="text"
            placeholder="Search groceries, orders..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-1.5 pl-9 pr-3 text-sm text-slate-700 transition-shadow placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/60 sm:py-2.5"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;