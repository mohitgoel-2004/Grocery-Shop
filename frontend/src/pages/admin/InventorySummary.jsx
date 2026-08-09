import React from "react";

import {
  FiPackage,
  FiAlertTriangle,
  FiCalendar,
  FiArchive,
} from "react-icons/fi";

const InventorySummary = ({
  summary = {},
  lowStockProducts = [],
  expiringProducts = [],
  damagedCount = 0,
  expiredCount = 0,
}) => {
  // ======================================================
  // SUMMARY CARDS
  // ======================================================

  const cards = [
    {
      title: "Products",
      value: summary.totalProducts || 0,
      icon: <FiPackage size={21} />,
      iconClass: "bg-blue-50 text-blue-600",
      valueClass: "text-gray-900",
    },

    {
      title: "Available Stock",
      value: summary.availableStock || 0,
      subtitle: `Physical: ${summary.totalStock || 0}`,
      icon: <FiPackage size={21} />,
      iconClass: "bg-green-50 text-green-600",
      valueClass: "text-green-600",
    },

    {
      title: "Reserved Stock",
      value: summary.reservedStock || 0,
      subtitle: "Held for orders",
      icon: <FiPackage size={21} />,
      iconClass: "bg-blue-50 text-blue-600",
      valueClass: "text-blue-600",
    },

    {
      title: "Low Stock",
      value: summary.lowStock || 0,
      icon: <FiAlertTriangle size={21} />,
      iconClass: "bg-yellow-50 text-yellow-600",
      valueClass: "text-yellow-600",
    },

    {
      title: "Out of Stock",
      value: summary.outOfStock || 0,
      icon: <FiArchive size={21} />,
      iconClass: "bg-red-50 text-red-600",
      valueClass: "text-red-600",
    },

    {
      title: "Inventory Value",
      value: `₹${Number(
        summary.inventoryValue || 0
      ).toLocaleString("en-IN")}`,
      icon: <FiPackage size={21} />,
      iconClass: "bg-purple-50 text-purple-600",
      valueClass: "text-gray-900",
    },
  ];

  // ======================================================
  // CHECK IF ANY ALERT EXISTS
  // ======================================================

  const hasAlerts =
    lowStockProducts.length > 0 ||
    expiringProducts.length > 0 ||
    damagedCount > 0 ||
    expiredCount > 0;

  return (
    <>
      {/* ======================================================
          SUMMARY CARDS
      ====================================================== */}

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-6">
        {cards.map((card) => (
          <div
            key={card.title}
            className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between gap-3">
              {/* Card Content */}

              <div>
                <p className="text-xs font-medium text-gray-500">
                  {card.title}
                </p>

                <h2
                  className={`mt-2 text-2xl font-bold ${card.valueClass}`}
                >
                  {card.value}
                </h2>

                {card.subtitle && (
                  <p className="mt-1 text-xs text-gray-400">
                    {card.subtitle}
                  </p>
                )}
              </div>

              {/* Card Icon */}

              <div
                className={`rounded-lg p-3 ${card.iconClass}`}
              >
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ======================================================
          ALERTS
      ====================================================== */}

      {hasAlerts && (
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">

          {/* ==================================================
              LOW STOCK ALERT
          ================================================== */}

          {lowStockProducts.length > 0 && (
            <div className="rounded-xl border border-yellow-300 bg-yellow-50 p-4">
              <div className="flex items-center gap-3">

                <div className="shrink-0 rounded-lg bg-yellow-100 p-3 text-yellow-600">
                  <FiAlertTriangle size={20} />
                </div>

                <div className="min-w-0">
                  <h3 className="font-medium text-yellow-800">
                    Low Stock Alert
                  </h3>

                  <p className="mt-1 text-sm text-yellow-700">
                    {lowStockProducts.length}{" "}
                    {lowStockProducts.length === 1
                      ? "product needs"
                      : "products need"}{" "}
                    restocking.
                  </p>
                </div>

              </div>
            </div>
          )}

          {/* ==================================================
              EXPIRING SOON
          ================================================== */}

          {expiringProducts.length > 0 && (
            <div className="rounded-xl border border-orange-300 bg-orange-50 p-4">
              <div className="flex items-center gap-3">

                <div className="shrink-0 rounded-lg bg-orange-100 p-3 text-orange-600">
                  <FiCalendar size={20} />
                </div>

                <div className="min-w-0">
                  <h3 className="font-medium text-orange-800">
                    Expiring Soon
                  </h3>

                  <p className="mt-1 text-sm text-orange-700">
                    {expiringProducts.length}{" "}
                    {expiringProducts.length === 1
                      ? "product expires"
                      : "products expire"}{" "}
                    within 7 days.
                  </p>
                </div>

              </div>
            </div>
          )}

          {/* ==================================================
              DAMAGED / EXPIRED
          ================================================== */}

          {(damagedCount > 0 || expiredCount > 0) && (
            <div className="rounded-xl border border-red-300 bg-red-50 p-4">
              <div className="flex items-center gap-3">

                <div className="shrink-0 rounded-lg bg-red-100 p-3 text-red-600">
                  <FiArchive size={20} />
                </div>

                <div className="min-w-0">
                  <h3 className="font-medium text-red-800">
                    Damaged / Expired
                  </h3>

                  <p className="mt-1 text-sm text-red-700">
                    {damagedCount} damaged +{" "}
                    {expiredCount} expired units.
                  </p>
                </div>

              </div>
            </div>
          )}

        </div>
      )}
    </>
  );
};

export default InventorySummary;