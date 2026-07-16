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
import { useNavigate } from "react-router-dom";
import { useAdminProfile } from "../../Context/AdminProfileContext";

const Header = ({ setSidebarOpen }) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const { adminProfile } = useAdminProfile();
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

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
            ? "text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
            : "text-gray-700 dark:text-gray-200 hover:bg-emerald-50/60 dark:hover:bg-emerald-900/20"
        }`}
    >
      <span className="text-gray-500 dark:text-gray-400">{icon}</span>
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-gray-100/60 shadow-sm dark:bg-gray-900/80 dark:border-gray-800/60 transition-all duration-300 overflow-visible">
      <div className="flex items-center justify-between px-3 sm:px-8 py-2 sm:py-3.5">
        {/* ---------- LEFT SECTION ---------- */}
        <div className="flex items-center gap-2 sm:gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSidebarOpen((prev) => !prev)}
            className="lg:hidden p-1.5 sm:p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 text-gray-600 dark:text-gray-300"
            aria-label="Open sidebar"
          >
            <FiMenu size={20} className="sm:size-22" />
          </motion.button>

          <div className="flex items-center gap-1.5 sm:gap-2.5">
            <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-200/50 dark:shadow-emerald-900/30">
              <FiShoppingBag size={14} className="sm:text-lg text-white" />
            </div>
            <span className="hidden sm:inline text-lg font-extrabold text-gray-800 dark:text-white tracking-tight">
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
                searchFocused ? "text-emerald-500" : "text-gray-400 dark:text-gray-500"
              }`}
              size={18}
            />
            <input
              type="text"
              placeholder="Search products, orders, customers..."
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className="w-full pl-11 pr-5 py-2.5 rounded-xl border-2 bg-gray-50/80 dark:bg-gray-800/80 border-gray-200 dark:border-gray-700 focus:border-emerald-400 dark:focus:border-emerald-500 focus:ring-0 focus:bg-white dark:focus:bg-gray-800 outline-none transition-all duration-200 text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 shadow-sm hover:shadow-md"
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden lg:inline-block px-2 py-0.5 text-[10px] font-semibold text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600">
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
            className="relative w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gray-100/80 hover:bg-gray-200/90 dark:bg-gray-800/80 dark:hover:bg-gray-700/90 flex items-center justify-center transition-all duration-200 border border-gray-200/60 dark:border-gray-700/60 shadow-sm hover:shadow-md"
            aria-label="Notifications"
          >
            <FiBell size={18} className="sm:text-xl text-gray-600 dark:text-gray-300" />
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 sm:w-5 sm:h-5 bg-red-500 text-white text-[10px] sm:text-xs rounded-full flex items-center justify-center font-bold shadow-sm shadow-red-200/50">
              0
            </span>
          </motion.button>

          {/* Profile Dropdown Container - overflow-visible and high z-index */}
          <div className="relative overflow-visible" ref={dropdownRef}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-1.5 sm:gap-3 bg-gray-100/80 hover:bg-gray-200/90 dark:bg-gray-800/80 dark:hover:bg-gray-700/90 px-2 sm:px-3.5 py-1 sm:py-2 rounded-xl transition-all duration-200 border border-gray-200/60 dark:border-gray-700/60 shadow-sm hover:shadow-md"
            >
              <div className="relative">
                <img
                  src={
                    adminProfile?.avatar
                      ? `http://10.77.245.168:5000${adminProfile.avatar}`
                      : "https://ui-avatars.com/api/?name=Admin&background=10b981&color=fff&size=100"
                  }
                  alt="Admin"
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover ring-2 ring-emerald-400/30 dark:ring-emerald-500/30"
                />
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-emerald-400 border-2 border-white dark:border-gray-800 shadow-sm shadow-emerald-200/50" />
              </div>
              <div className="hidden lg:block text-left">
                <h4 className="font-semibold text-sm text-gray-800 dark:text-white leading-tight">
                  {adminProfile?.name || "Admin"}
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-tight">
                  {adminProfile?.email || "admin@groceryhub.in"}
                </p>
              </div>
              <FiChevronDown
                className={`text-gray-400 dark:text-gray-500 transition-transform duration-300 ${
                  profileOpen ? "rotate-180" : ""
                }`}
                size={14}
                className="sm:text-base"
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
                  className="absolute top-full mt-2 w-64 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100/80 dark:border-gray-700/80 overflow-hidden z-50 right-0 sm:right-0 left-auto"
                  style={{ minWidth: "16rem" }}
                >
                  {/* Profile header */}
                  <div className="px-5 py-4 bg-gradient-to-r from-emerald-50/60 to-emerald-100/30 dark:from-emerald-900/20 dark:to-emerald-800/10 border-b border-gray-100/60 dark:border-gray-700/60">
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          adminProfile?.avatar
                            ? `http://10.77.245.168:5000${adminProfile.avatar}`
                            : "https://ui-avatars.com/api/?name=Admin&background=10b981&color=fff&size=100"
                        }
                        alt="Admin"
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-300/40 dark:ring-emerald-400/30"
                      />
                      <div>
                        <h4 className="font-bold text-gray-800 dark:text-white">
                          {adminProfile?.name || "Admin"}
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {adminProfile?.email || "admin@groceryhub.in"}
                        </p>
                        <span className="inline-block mt-1 text-[10px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-100/70 dark:bg-emerald-900/40 px-2 py-0.5 rounded-full">
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

                  <hr className="dark:border-gray-700/60" />
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
      <div className="md:hidden px-3 pb-2 sm:pb-3.5 -mt-0.5">
        <div className="relative">
          <FiSearch
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
            size={16}
          />
          <input
            type="text"
            placeholder="Search groceries, orders..."
            className="w-full pl-9 pr-3 py-1.5 sm:py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/70 dark:bg-gray-800/70 focus:outline-none focus:ring-2 focus:ring-emerald-400/60 text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 transition-shadow"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;