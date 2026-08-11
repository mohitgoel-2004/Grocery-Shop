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
  {
    id: "home",
    icon: FiHome,
    label: "Home",
  },
  {
    id: "products",
    icon: FiGrid,
    label: "Products",
  },
  {
    id: "search",
    icon: FiSearch,
    label: "Search",
    isCenter: true,
  },
  {
    id: "cart",
    icon: FiShoppingCart,
    label: "Cart",
  },
  {
    id: "profile",
    icon: FiUser,
    label: "Profile",
  },
];

const Navbar = ({ activeTab = "home", onTabChange }) => {
  const { totalItems } = useCart();

  const handleNavigation = (id) => {
    if (onTabChange) {
      onTabChange(id);
    }
  };

  return (
    <nav
      className="
        fixed
        bottom-[calc(10px+env(safe-area-inset-bottom))]
        left-1/2
        z-50
        w-[calc(100%-24px)]
        max-w-[455px]
        -translate-x-1/2
      "
    >
      <div
        className="
          relative
          flex
          h-[68px]
          items-center
          justify-around
          rounded-[24px]
          border
          border-gray-200/80
          bg-white/95
          px-1.5
          shadow-[0_8px_30px_rgba(15,23,42,0.14)]
          backdrop-blur-xl
        "
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          {/* =====================================================
              CENTER SEARCH BUTTON
          ===================================================== */}
          if (item.isCenter) {
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavigation(item.id)}
                className="
                  relative
                  -mt-8
                  flex
                  h-[54px]
                  w-[54px]
                  items-center
                  justify-center
                  rounded-full
                  border-[4px]
                  border-white
                  bg-gradient-to-br
                  from-emerald-400
                  to-emerald-600
                  text-white
                  shadow-[0_7px_18px_rgba(16,185,129,0.35)]
                  transition
                  hover:scale-105
                  active:scale-95
                "
                aria-label="Search"
              >
                <FiSearch className="text-[22px]" />
              </button>
            );
          }

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleNavigation(item.id)}
              className={`
                relative
                flex
                min-w-[58px]
                flex-col
                items-center
                justify-center
                gap-1
                py-2
                transition-all
                duration-200
                ${
                  isActive
                    ? "text-emerald-600"
                    : "text-gray-400 hover:text-gray-600"
                }
              `}
              aria-label={item.label}
            >
              {/* =================================================
                  ICON
              ================================================= */}
              <div className="relative">
                <Icon
                  className={`
                    text-[21px]
                    transition-transform
                    duration-200
                    ${
                      isActive
                        ? "scale-110 stroke-[2.4]"
                        : "stroke-[1.8]"
                    }
                  `}
                />

                {/* =================================================
                    CART BADGE
                ================================================= */}
                {item.id === "cart" && totalItems > 0 && (
                  <span
                    className="
                      absolute
                      -right-2
                      -top-2
                      flex
                      min-h-[17px]
                      min-w-[17px]
                      items-center
                      justify-center
                      rounded-full
                      bg-emerald-500
                      px-1
                      text-[9px]
                      font-bold
                      leading-none
                      text-white
                      shadow-sm
                    "
                  >
                    {totalItems > 99 ? "99+" : totalItems}
                  </span>
                )}
              </div>

              {/* =================================================
                  LABEL
              ================================================= */}
              <span
                className={`
                  text-[10px]
                  font-semibold
                  leading-none
                  ${
                    isActive
                      ? "text-emerald-600"
                      : "text-gray-400"
                  }
                `}
              >
                {item.label}
              </span>

              {/* =================================================
                  ACTIVE INDICATOR
              ================================================= */}
              {isActive && (
                <span
                  className="
                    absolute
                    -bottom-0.5
                    h-1
                    w-1
                    rounded-full
                    bg-emerald-500
                  "
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default Navbar;