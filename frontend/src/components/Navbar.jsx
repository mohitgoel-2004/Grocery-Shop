import React from "react";
import {
  FiHome,
  FiShoppingCart,
  FiSearch,
  FiGrid,
  FiUser,
} from "react-icons/fi";
import { useCart } from "../Context/context";


const navItems = [
  { id: "home", icon: FiHome, label: "Home" },
  { id: "cart", icon: FiShoppingCart, label: "Cart" },
  { id: "search", icon: FiSearch, label: "Search", isCenter: true },
  { id: "products", icon: FiGrid, label: "Products" },
  { id: "profile", icon: FiUser, label: "Profile" },
];


const Navbar = ({ activeTab = "home", onTabChange }) => {
  const { totalItems } = useCart();

  return (
    <nav className="fixed inset-x-3 bottom-[calc(0.75rem+env(safe-area-inset-bottom))] z-50 mx-auto w-auto max-w-md sm:inset-x-4">
      <div className="relative flex items-center justify-around rounded-full border border-white/40 bg-white/88 px-2 py-2 shadow-[0_18px_50px_rgba(15,23,42,0.16)] backdrop-blur-2xl">

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          // Search Button
          if (item.isCenter) {
            return (
              <button
                key={item.id}
                onClick={() => onTabChange?.(item.id)}
                className="relative -mt-7 flex h-13 w-13 items-center justify-center rounded-full bg-linear-to-r from-green-400 via-emerald-500 to-green-600 text-white shadow-xl transition duration-300 hover:scale-105 active:scale-95"
              >
                <Icon className="text-xl" />
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => onTabChange?.(item.id)}
              className={`relative flex flex-col items-center justify-center gap-1 px-3 py-1 transition ${
                isActive
                  ? "text-emerald-600"
                  : "text-gray-400 hover:text-gray-700"
              }`}
            >
              <div className="relative">

                <Icon
                  className={`text-xl ${
                    isActive ? "scale-110" : ""
                  } transition duration-300`}
                />

                {/* Cart Badge */}
                {item.id === "cart" && totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white shadow">
                    {totalItems}
                  </span>
                )}

              </div>

              <span
                className={`text-[10px] font-medium ${
                  isActive ? "text-emerald-600" : "text-gray-400"
                }`}
              >
                {item.label}
              </span>

              {isActive && (
                <span className="absolute -top-1 h-1 w-1 rounded-full bg-emerald-500"></span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default Navbar;