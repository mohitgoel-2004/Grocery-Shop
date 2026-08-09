import React from "react";
import {
  FiSearch,
  FiPackage,
  FiTruck,
  FiEdit3,
  FiCalendar,
  FiActivity,
  FiTrash2,
  FiXCircle,
} from "react-icons/fi";

const InventoryTable = ({
  activeTab,
  products,
  filteredProducts,
  movements,

  search,
  setSearch,

  categoryFilter,
  setCategoryFilter,

  statusFilter,
  setStatusFilter,

  sortBy,
  setSortBy,

  categories,

  getAvailableStock,
  getStockStatus,
  getDaysUntilExpiry,
  isExpiringSoon,
  isExpired,

  onRestock,
  onAdjust,
  onBatch,
  onHistory,
}) => {
  const getMovementIcon = (type) => {
    if (type === "purchase") {
      return (
        <div className="rounded-lg bg-green-50 p-2 text-green-600">
          <FiTruck size={17} />
        </div>
      );
    }

    if (type === "order") {
      return (
        <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
          <FiPackage size={17} />
        </div>
      );
    }

    if (type === "damaged") {
      return (
        <div className="rounded-lg bg-orange-50 p-2 text-orange-600">
          <FiTrash2 size={17} />
        </div>
      );
    }

    if (type === "expired") {
      return (
        <div className="rounded-lg bg-red-50 p-2 text-red-600">
          <FiXCircle size={17} />
        </div>
      );
    }

    return (
      <div className="rounded-lg bg-gray-100 p-2 text-gray-600">
        <FiActivity size={17} />
      </div>
    );
  };

  /* =========================================================
     INVENTORY TAB
  ========================================================= */

  if (activeTab === "inventory") {
    return (
      <div>
        {/* Filters */}

        <div className="mb-6 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-5">
            {/* Search */}

            <div className="relative lg:col-span-2">
              <FiSearch
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />

              <input
                type="text"
                placeholder="Search product, SKU, brand or batch..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            {/* Category */}

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-emerald-500"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category === "All" ? "All Categories" : category}
                </option>
              ))}
            </select>

            {/* Status */}

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-emerald-500"
            >
              <option value="All">All Status</option>

              <option value="in">In Stock</option>

              <option value="low">Low Stock</option>

              <option value="out">Out of Stock</option>

              <option value="expiring">Expiring Soon</option>

              <option value="expired">Expired</option>

              <option value="damaged">Damaged</option>
            </select>

            {/* Sort */}

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-emerald-500"
            >
              <option value="default">Sort By</option>

              <option value="low-high">Stock: Low → High</option>

              <option value="high-low">Stock: High → Low</option>

              <option value="name">Product Name</option>

              <option value="expiry">Expiry Date</option>
            </select>
          </div>
        </div>

        {/* Table */}

        <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
          <div className="border-b border-gray-100 px-5 py-4">
            <h2 className="font-semibold text-gray-900">Inventory Products</h2>

            <p className="mt-1 text-xs text-gray-500">
              Showing {filteredProducts.length} of {products.length} products
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1450px] text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-5 py-3 text-xs font-semibold uppercase text-gray-500">
                    Product
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold uppercase text-gray-500">
                    SKU
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold uppercase text-gray-500">
                    Stock
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold uppercase text-gray-500">
                    Reserved
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold uppercase text-gray-500">
                    Available
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold uppercase text-gray-500">
                    Min
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold uppercase text-gray-500">
                    Batch
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold uppercase text-gray-500">
                    Expiry
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold uppercase text-gray-500">
                    Status
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold uppercase text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => {
                    const status = getStockStatus(product);

                    const availableStock = getAvailableStock(product);

                    const days = getDaysUntilExpiry(product.expiryDate);

                    return (
                      <tr
                        key={product._id || product.id}
                        className="transition hover:bg-gray-50"
                      >
                        {/* Product */}

                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            {product.image || product.images?.[0] ? (
                              <img
                                src={product.image || product.images?.[0]}
                                alt={product.name || "Product"}
                                className="h-11 w-11 rounded-lg border border-gray-100 object-cover"
                                onError={(e) => {
                                  e.currentTarget.style.display = "none";
                                }}
                              />
                            ) : (
                              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-gray-100 text-gray-400">
                                <FiPackage size={20} />
                              </div>
                            )}

                            <div>
                              <p className="font-medium text-gray-900">
                                {product.name || "Unnamed Product"}
                              </p>

                              <p className="mt-0.5 text-xs text-gray-500">
                                {product.brand || "No brand"}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* SKU */}

                        <td className="px-5 py-4">
                          <span className="text-sm font-medium text-gray-700">
                            {product.sku}
                          </span>
                        </td>

                        {/* Stock */}

                        <td className="px-5 py-4">
                          <span className="font-bold text-gray-900">
                            {product.stock}
                          </span>

                          <span className="ml-1 text-xs text-gray-500">
                            {product.unit}
                          </span>
                        </td>

                        {/* Reserved */}

                        <td className="px-5 py-4">
                          <span className="font-semibold text-blue-600">
                            {product.reservedStock}
                          </span>
                        </td>

                        {/* Available */}

                        <td className="px-5 py-4">
                          <span
                            className={`font-bold ${
                              availableStock === 0
                                ? "text-red-600"
                                : availableStock <= product.minStock
                                  ? "text-yellow-600"
                                  : "text-green-600"
                            }`}
                          >
                            {availableStock}
                          </span>
                        </td>

                        {/* Min */}

                        <td className="px-5 py-4">
                          <span className="text-sm text-gray-600">
                            {product.minStock}
                          </span>
                        </td>

                        {/* Batch */}

                        <td className="px-5 py-4">
                          <span className="rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">
                            {product.batchNo}
                          </span>
                        </td>

                        {/* Expiry */}

                        <td className="px-5 py-4">
                          <p
                            className={`text-sm font-medium ${
                              days < 0
                                ? "text-red-600"
                                : days <= 7
                                  ? "text-orange-600"
                                  : "text-gray-700"
                            }`}
                          >
                            {new Date(product.expiryDate).toLocaleDateString(
                              "en-IN",
                            )}
                          </p>

                          <p className="mt-0.5 text-xs text-gray-400">
                            {days < 0 ? "Expired" : `${days} days left`}
                          </p>
                        </td>

                        {/* Status */}

                        <td className="px-5 py-4">
                          {status === "in" && (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                              <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                              In Stock
                            </span>
                          )}

                          {status === "low" && (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-50 px-3 py-1 text-xs font-medium text-yellow-700">
                              <span className="h-1.5 w-1.5 rounded-full bg-yellow-500" />
                              Low Stock
                            </span>
                          )}

                          {status === "out" && (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-700">
                              <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                              Out of Stock
                            </span>
                          )}
                        </td>

                        {/* Actions */}

                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => onRestock(product)}
                              title="Restock"
                              className="rounded-lg border border-gray-200 p-2 text-gray-500 hover:border-green-200 hover:bg-green-50 hover:text-green-600"
                            >
                              <FiTruck size={16} />
                            </button>

                            <button
                              onClick={() => onAdjust(product)}
                              title="Adjust Stock"
                              className="rounded-lg border border-gray-200 p-2 text-gray-500 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                            >
                              <FiEdit3 size={16} />
                            </button>

                            <button
                              onClick={() => onBatch(product)}
                              title="Batch & Expiry"
                              className="rounded-lg border border-gray-200 p-2 text-gray-500 hover:border-orange-200 hover:bg-orange-50 hover:text-orange-600"
                            >
                              <FiCalendar size={16} />
                            </button>

                            <button
                              onClick={() => onHistory(product)}
                              title="Stock History"
                              className="rounded-lg border border-gray-200 p-2 text-gray-500 hover:border-purple-200 hover:bg-purple-50 hover:text-purple-600"
                            >
                              <FiActivity size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="10" className="px-5 py-12 text-center">
                      <FiPackage className="mx-auto text-gray-300" size={40} />

                      <h3 className="mt-3 font-medium text-gray-700">
                        No products found
                      </h3>

                      <p className="mt-1 text-sm text-gray-500">
                        Try changing your search or filters.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================
     STOCK MOVEMENT TAB
  ========================================================= */

  if (activeTab === "movement") {
    return (
      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-5 py-4">
          <h2 className="font-semibold text-gray-900">
            Stock Movement History
          </h2>

          <p className="mt-1 text-xs text-gray-500">
            Track every stock addition, deduction and adjustment.
          </p>
        </div>

        <div className="divide-y divide-gray-100">
          {movements.map((movement) => (
            <div
              key={movement.id}
              className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between"
            >
              <div className="flex items-center gap-4">
                {getMovementIcon(movement.type)}

                <div>
                  <p className="font-medium text-gray-900">
                    {movement.product}
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    {movement.sku} • {movement.reason}
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    {movement.date} • {movement.performedBy}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-8">
                <div className="text-right">
                  <p className="text-xs text-gray-400">Stock</p>

                  <p className="mt-1 text-sm font-medium text-gray-700">
                    {movement.beforeStock} → {movement.afterStock}
                  </p>
                </div>

                <div className="text-right">
                  <p
                    className={`text-lg font-bold ${
                      movement.type === "purchase"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {movement.type === "purchase" ? "+" : "-"}
                    {movement.quantity}
                  </p>

                  <p className="text-xs text-gray-400">units</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* =========================================================
     BATCH & EXPIRY TAB
  ========================================================= */

  if (activeTab === "expiry") {
    return (
      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-5 py-4">
          <h2 className="font-semibold text-gray-900">
            Batch & Expiry Management
          </h2>

          <p className="mt-1 text-xs text-gray-500">
            Monitor product batches and expiry dates.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-5 py-3 text-xs font-semibold uppercase text-gray-500">
                  Product
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase text-gray-500">
                  Batch
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase text-gray-500">
                  Manufacturing
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase text-gray-500">
                  Expiry
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase text-gray-500">
                  Stock
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase text-gray-500">
                  Status
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {products.map((product) => {
                const days = getDaysUntilExpiry(product.expiryDate);

                return (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-5 py-4">
                      <p className="font-medium text-gray-900">
                        {product.name}
                      </p>

                      <p className="text-xs text-gray-400">{product.sku}</p>
                    </td>

                    <td className="px-5 py-4">
                      <span className="rounded-md bg-gray-100 px-2 py-1 text-xs font-medium">
                        {product.batchNo}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-600">
                      {new Date(product.manufacturingDate).toLocaleDateString(
                        "en-IN",
                      )}
                    </td>

                    <td className="px-5 py-4">
                      <p
                        className={`text-sm font-medium ${
                          days < 0
                            ? "text-red-600"
                            : days <= 7
                              ? "text-orange-600"
                              : "text-gray-700"
                        }`}
                      >
                        {new Date(product.expiryDate).toLocaleDateString(
                          "en-IN",
                        )}
                      </p>

                      <p className="text-xs text-gray-400">
                        {days < 0 ? "Expired" : `${days} days left`}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <span className="font-semibold">{product.stock}</span>
                    </td>

                    <td className="px-5 py-4">
                      {days < 0 ? (
                        <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-700">
                          Expired
                        </span>
                      ) : days <= 7 ? (
                        <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-orange-700">
                          Expiring Soon
                        </span>
                      ) : (
                        <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                          Good
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  /* =========================================================
     DAMAGED / EXPIRED TAB
  ========================================================= */

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Damaged */}

      <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-5 py-4">
          <div className="flex items-center gap-2">
            <FiTrash2 className="text-orange-600" />

            <h2 className="font-semibold text-gray-900">Damaged Stock</h2>
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {products
            .filter((product) => product.damagedStock > 0)
            .map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between p-5"
              >
                <div>
                  <p className="font-medium text-gray-900">{product.name}</p>

                  <p className="mt-1 text-xs text-gray-500">
                    SKU: {product.sku}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-lg font-bold text-orange-600">
                    {product.damagedStock}
                  </p>

                  <p className="text-xs text-gray-400">damaged</p>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Expired */}

      <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-5 py-4">
          <div className="flex items-center gap-2">
            <FiXCircle className="text-red-600" />

            <h2 className="font-semibold text-gray-900">Expired Stock</h2>
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {products
            .filter((product) => product.expiredStock > 0)
            .map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between p-5"
              >
                <div>
                  <p className="font-medium text-gray-900">{product.name}</p>

                  <p className="mt-1 text-xs text-gray-500">
                    Batch: {product.batchNo}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-lg font-bold text-red-600">
                    {product.expiredStock}
                  </p>

                  <p className="text-xs text-gray-400">expired</p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default InventoryTable;
