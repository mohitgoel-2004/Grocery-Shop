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
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[95%] max-w-md z-50">
      <div className="relative bg-white/90 backdrop-blur-xl rounded-full shadow-2xl border border-white/30 px-2 py-2 flex items-center justify-around">

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          // Search Button
          if (item.isCenter) {
            return (
              <button
                key={item.id}
                onClick={() => onTabChange?.(item.id)}
                className="relative -mt-7 w-14 h-14 rounded-full bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center text-white shadow-xl hover:scale-110 transition"
              >
                <Icon className="text-2xl" />
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => onTabChange?.(item.id)}
              className={`relative flex flex-col items-center justify-center gap-1 px-3 py-1 transition ${
                isActive
                  ? "text-green-600"
                  : "text-gray-400 hover:text-gray-700"
              }`}
            >
              <div className="relative">

                <Icon
                  className={`text-xl ${
                    isActive ? "scale-110" : ""
                  } transition`}
                />

                {/* Cart Badge */}
                {item.id === "cart" && totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] px-1 bg-red-500 rounded-full text-white text-[10px] flex items-center justify-center font-bold shadow">
                    {totalItems}
                  </span>
                )}

              </div>

              <span
                className={`text-[10px] font-medium ${
                  isActive ? "text-green-600" : "text-gray-400"
                }`}
              >
                {item.label}
              </span>

              {isActive && (
                <span className="absolute -top-1 w-1 h-1 rounded-full bg-green-500"></span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default Navbar;