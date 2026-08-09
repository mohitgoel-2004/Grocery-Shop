import React, { useState } from "react";
import {
  FiX,
  FiPlus,
  FiMinus,
  FiTruck,
  FiCalendar,
  FiActivity,
  FiTrash2,
  FiPackage,
  FiLoader,
} from "react-icons/fi";
import toast from "react-hot-toast";
import api from "../../api/axios";

const getToken = () => {
  return localStorage.getItem("adminToken");
};

const authConfig = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

const adjustInventoryStock = async (productId, payload) => {
  const res = await api.put(
    `/admin/inventory/${productId}/adjust`,
    payload,
    authConfig()
  );

  return res.data;
};

const restockInventory = async (productId, payload) => {
  const res = await api.put(
    `/admin/inventory/${productId}/restock`,
    payload,
    authConfig()
  );

  return res.data;
};

const InventoryModal = ({
  modal,
  selectedProduct,
  closeModal,

  adjustType,
  setAdjustType,

  adjustQuantity,
  setAdjustQuantity,

  adjustReason,
  setAdjustReason,

  restockQuantity,
  setRestockQuantity,

  restockSupplier,
  setRestockSupplier,

  restockCostPrice,
  setRestockCostPrice,

  handleAdjustStock,
  handleRestock,

  movements = [],

  getAvailableStock,
  getDaysUntilExpiry,

  onInventoryUpdated,
}) => {
  const [loading, setLoading] = useState(false);

  if (!modal || !selectedProduct) {
    return null;
  }

  const product = selectedProduct;

  /*
   * =========================================================
   * API: ADJUST STOCK
   * =========================================================
   */

  const handleAdjustSubmit = async () => {
    const quantity = Number(adjustQuantity);

    if (!quantity || quantity <= 0) {
      toast.error("Please enter a valid quantity.");
      return;
    }

    if (!product._id && !product.id) {
      toast.error("Product ID is missing.");
      return;
    }

    if (
      adjustType === "remove" &&
      quantity > Number(product.stock || 0)
    ) {
      toast.error("Cannot remove more stock than available.");
      return;
    }

    try {
      setLoading(true);

      const productId = product._id || product.id;

      const response = await adjustInventoryStock(productId, {
        type: adjustType,
        quantity,
        reason: adjustReason,
      });

      toast.success(
        response?.message || "Stock updated successfully"
      );

      /*
       * Parent Inventory component ko refresh/update karne ke liye.
       */
      if (typeof onInventoryUpdated === "function") {
        await onInventoryUpdated(response);
      } else if (typeof handleAdjustStock === "function") {
        /*
         * Fallback:
         * Agar parent ne API integration already handle kar rakhi hai
         * to existing function call ho jayega.
         */
        await handleAdjustStock();
      }

      closeModal();
    } catch (error) {
      console.error("Adjust stock error:", error);

      toast.error(
        error?.response?.data?.message ||
          "Failed to update stock."
      );
    } finally {
      setLoading(false);
    }
  };

  /*
   * =========================================================
   * API: RESTOCK
   * =========================================================
   */

  const handleRestockSubmit = async () => {
    const quantity = Number(restockQuantity);
    const costPrice = Number(restockCostPrice);

    if (!quantity || quantity <= 0) {
      toast.error("Please enter a valid quantity.");
      return;
    }

    if (!product._id && !product.id) {
      toast.error("Product ID is missing.");
      return;
    }

    try {
      setLoading(true);

      const productId = product._id || product.id;

      const response = await restockInventory(productId, {
        quantity,
        supplier: restockSupplier?.trim() || "",
        costPrice: costPrice > 0 ? costPrice : undefined,
      });

      toast.success(
        response?.message || "Product restocked successfully"
      );

      if (typeof onInventoryUpdated === "function") {
        await onInventoryUpdated(response);
      } else if (typeof handleRestock === "function") {
        await handleRestock();
      }

      closeModal();
    } catch (error) {
      console.error("Restock error:", error);

      toast.error(
        error?.response?.data?.message ||
          "Failed to restock product."
      );
    } finally {
      setLoading(false);
    }
  };

  /*
   * =========================================================
   * ADJUST STOCK MODAL
   * =========================================================
   */

  if (modal === "adjust") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">

          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Adjust Stock
              </h2>

              <p className="mt-0.5 text-xs text-gray-500">
                {product.name}
              </p>
            </div>

            <button
              onClick={closeModal}
              disabled={loading}
              className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 disabled:cursor-not-allowed"
            >
              <FiX size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="space-y-5 p-6">

            {/* Current Stock */}
            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-xs uppercase text-gray-500">
                Current Stock
              </p>

              <p className="mt-1 text-2xl font-bold text-gray-900">
                {product.stock || 0}
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Reserved: {product.reservedStock || 0}
                {" • "}
                Available:{" "}
                {getAvailableStock
                  ? getAvailableStock(product)
                  : Math.max(
                      0,
                      Number(product.stock || 0) -
                        Number(product.reservedStock || 0)
                    )}
              </p>
            </div>

            {/* Adjustment Type */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Adjustment Type
              </label>

              <div className="grid grid-cols-2 gap-3">

                <button
                  type="button"
                  disabled={loading}
                  onClick={() => setAdjustType("add")}
                  className={`flex items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium ${
                    adjustType === "add"
                      ? "border-green-500 bg-green-50 text-green-700"
                      : "border-gray-200 text-gray-600"
                  }`}
                >
                  <FiPlus size={17} />
                  Add Stock
                </button>

                <button
                  type="button"
                  disabled={loading}
                  onClick={() => setAdjustType("remove")}
                  className={`flex items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium ${
                    adjustType === "remove"
                      ? "border-red-500 bg-red-50 text-red-700"
                      : "border-gray-200 text-gray-600"
                  }`}
                >
                  <FiMinus size={17} />
                  Remove Stock
                </button>

              </div>
            </div>

            {/* Quantity */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Quantity
              </label>

              <input
                type="number"
                min="1"
                value={adjustQuantity}
                disabled={loading}
                onChange={(e) =>
                  setAdjustQuantity(e.target.value)
                }
                placeholder="Enter quantity"
                className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-emerald-500 disabled:bg-gray-100"
              />
            </div>

            {/* Reason */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Reason
              </label>

              <select
                value={adjustReason}
                disabled={loading}
                onChange={(e) =>
                  setAdjustReason(e.target.value)
                }
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-500 disabled:bg-gray-100"
              >
                <option value="New Purchase">
                  New Purchase
                </option>

                <option value="Damaged">
                  Damaged
                </option>

                <option value="Expired">
                  Expired
                </option>

                <option value="Customer Return">
                  Customer Return
                </option>

                <option value="Manual Correction">
                  Manual Correction
                </option>

                <option value="Wastage">
                  Wastage
                </option>

                <option value="Other">
                  Other
                </option>
              </select>
            </div>

          </div>

          {/* Footer */}
          <div className="flex gap-3 border-t border-gray-100 px-6 py-4">

            <button
              onClick={closeModal}
              disabled={loading}
              className="flex-1 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              onClick={handleAdjustSubmit}
              disabled={loading}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? (
                <>
                  <FiLoader className="animate-spin" size={16} />
                  Updating...
                </>
              ) : (
                "Update Stock"
              )}
            </button>

          </div>

        </div>
      </div>
    );
  }

  /*
   * =========================================================
   * RESTOCK MODAL
   * =========================================================
   */

  if (modal === "restock") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">

          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">

            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Restock Product
              </h2>

              <p className="mt-1 text-xs text-gray-500">
                {product.name}
              </p>
            </div>

            <button
              onClick={closeModal}
              disabled={loading}
              className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 disabled:cursor-not-allowed"
            >
              <FiX size={20} />
            </button>

          </div>

          {/* Body */}
          <div className="space-y-5 p-6">

            {/* Current Stock */}
            <div className="rounded-lg bg-green-50 p-4">

              <p className="text-xs text-green-700">
                Current Stock
              </p>

              <p className="mt-1 text-2xl font-bold text-green-700">
                {product.stock || 0}
              </p>

            </div>

            {/* Quantity */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Quantity
              </label>

              <input
                type="number"
                min="1"
                value={restockQuantity}
                disabled={loading}
                onChange={(e) =>
                  setRestockQuantity(e.target.value)
                }
                placeholder="Enter quantity"
                className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-emerald-500 disabled:bg-gray-100"
              />
            </div>

            {/* Supplier */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Supplier
              </label>

              <input
                type="text"
                value={restockSupplier}
                disabled={loading}
                onChange={(e) =>
                  setRestockSupplier(e.target.value)
                }
                placeholder="Supplier name"
                className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-emerald-500 disabled:bg-gray-100"
              />
            </div>

            {/* Cost Price */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Cost Price
              </label>

              <input
                type="number"
                min="0"
                value={restockCostPrice}
                disabled={loading}
                onChange={(e) =>
                  setRestockCostPrice(e.target.value)
                }
                placeholder="Purchase price"
                className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-emerald-500 disabled:bg-gray-100"
              />
            </div>

            {/* Preview */}
            {restockQuantity && (
              <div className="rounded-lg bg-gray-50 p-4">

                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">
                    Current Stock
                  </span>

                  <span className="font-medium text-gray-900">
                    {product.stock || 0}
                  </span>
                </div>

                <div className="mt-2 flex justify-between text-sm">
                  <span className="text-gray-500">
                    Restock Quantity
                  </span>

                  <span className="font-medium text-green-600">
                    +{Number(restockQuantity)}
                  </span>
                </div>

                <div className="mt-3 border-t border-gray-200 pt-3">
                  <div className="flex justify-between">

                    <span className="font-medium text-gray-700">
                      New Stock
                    </span>

                    <span className="text-lg font-bold text-gray-900">
                      {Number(product.stock || 0) +
                        Number(restockQuantity || 0)}
                    </span>

                  </div>
                </div>

              </div>
            )}

          </div>

          {/* Footer */}
          <div className="flex gap-3 border-t border-gray-100 px-6 py-4">

            <button
              onClick={closeModal}
              disabled={loading}
              className="flex-1 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              onClick={handleRestockSubmit}
              disabled={loading}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? (
                <>
                  <FiLoader className="animate-spin" size={16} />
                  Restocking...
                </>
              ) : (
                <>
                  <FiTruck size={16} />
                  Restock
                </>
              )}
            </button>

          </div>

        </div>
      </div>
    );
  }

  /*
   * =========================================================
   * BATCH DETAILS
   * =========================================================
   */

  if (modal === "batch") {
    const days = getDaysUntilExpiry
      ? getDaysUntilExpiry(product.expiryDate)
      : null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

        <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">

          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">

            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Batch Details
              </h2>

              <p className="mt-1 text-xs text-gray-500">
                {product.name}
              </p>
            </div>

            <button
              onClick={closeModal}
              className="rounded-lg p-2 text-gray-400 hover:bg-gray-100"
            >
              <FiX size={20} />
            </button>

          </div>

          {/* Body */}
          <div className="space-y-4 p-6">

            <div className="rounded-lg border border-gray-100 p-4">
              <p className="text-xs text-gray-500">
                Batch Number
              </p>

              <p className="mt-1 font-semibold text-gray-900">
                {product.batchNo || "N/A"}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">

              <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-xs text-gray-500">
                  Manufacturing
                </p>

                <p className="mt-1 text-sm font-semibold text-gray-900">
                  {product.manufacturingDate
                    ? new Date(
                        product.manufacturingDate
                      ).toLocaleDateString("en-IN")
                    : "N/A"}
                </p>
              </div>

              <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-xs text-gray-500">
                  Expiry
                </p>

                <p className="mt-1 text-sm font-semibold text-gray-900">
                  {product.expiryDate
                    ? new Date(
                        product.expiryDate
                      ).toLocaleDateString("en-IN")
                    : "N/A"}
                </p>
              </div>

            </div>

            <div className="rounded-lg bg-blue-50 p-4">

              <p className="text-xs text-blue-600">
                Current Batch Stock
              </p>

              <p className="mt-1 text-2xl font-bold text-blue-700">
                {product.stock || 0}
              </p>

            </div>

            <div className="rounded-lg bg-gray-50 p-4">

              <p className="text-xs text-gray-500">
                Supplier
              </p>

              <p className="mt-1 text-sm font-medium text-gray-900">
                {product.supplier || "N/A"}
              </p>

            </div>

            <div
              className={`rounded-lg p-4 ${
                days !== null && days < 0
                  ? "bg-red-50"
                  : days !== null && days <= 7
                  ? "bg-orange-50"
                  : "bg-green-50"
              }`}
            >
              <p className="text-xs text-gray-500">
                Expiry Status
              </p>

              <p className="mt-1 text-sm font-semibold text-gray-900">
                {days === null
                  ? "N/A"
                  : days < 0
                  ? "Expired"
                  : `${days} days remaining`}
              </p>
            </div>

          </div>

          {/* Footer */}
          <div className="border-t border-gray-100 px-6 py-4">

            <button
              onClick={closeModal}
              className="w-full rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700"
            >
              Close
            </button>

          </div>

        </div>

      </div>
    );
  }

  /*
   * =========================================================
   * STOCK HISTORY
   * =========================================================
   */

  if (modal === "history") {
    const productMovements = movements.filter(
      (movement) =>
        movement.sku === product.sku ||
        movement.productId === product._id ||
        movement.productId === product.id
    );

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

        <div className="max-h-[85vh] w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">

          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">

            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Stock History
              </h2>

              <p className="mt-1 text-xs text-gray-500">
                {product.name}
              </p>
            </div>

            <button
              onClick={closeModal}
              className="rounded-lg p-2 text-gray-400 hover:bg-gray-100"
            >
              <FiX size={20} />
            </button>

          </div>

          {/* History */}
          <div className="max-h-[65vh] overflow-y-auto">

            {productMovements.length > 0 ? (
              productMovements.map((movement, index) => (

                <div
                  key={
                    movement._id ||
                    movement.id ||
                    index
                  }
                  className="flex items-center gap-4 border-b border-gray-100 p-5"
                >

                  {/* Icon */}
                  <div>
                    {movement.type === "purchase" && (
                      <div className="rounded-lg bg-green-50 p-2 text-green-600">
                        <FiTruck size={17} />
                      </div>
                    )}

                    {movement.type === "order" && (
                      <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
                        <FiPackage size={17} />
                      </div>
                    )}

                    {movement.type === "damaged" && (
                      <div className="rounded-lg bg-orange-50 p-2 text-orange-600">
                        <FiTrash2 size={17} />
                      </div>
                    )}

                    {movement.type === "expired" && (
                      <div className="rounded-lg bg-red-50 p-2 text-red-600">
                        <FiCalendar size={17} />
                      </div>
                    )}

                    {movement.type === "adjustment" && (
                      <div className="rounded-lg bg-gray-100 p-2 text-gray-600">
                        <FiActivity size={17} />
                      </div>
                    )}
                  </div>

                  {/* Information */}
                  <div className="flex-1">

                    <p className="font-medium text-gray-900">
                      {movement.reason || "Stock Adjustment"}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      {movement.date ||
                        (movement.createdAt
                          ? new Date(
                              movement.createdAt
                            ).toLocaleString("en-IN")
                          : "N/A")}
                      {" • "}
                      {movement.performedBy ||
                        movement.performedBy?.name ||
                        "Admin"}
                    </p>

                  </div>

                  {/* Quantity */}
                  <div className="text-right">

                    <p
                      className={`font-bold ${
                        movement.type === "purchase" ||
                        movement.type === "return"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {movement.type === "purchase" ||
                      movement.type === "return"
                        ? "+"
                        : "-"}
                      {movement.quantity || 0}
                    </p>

                    {(movement.beforeStock !==
                      undefined ||
                      movement.afterStock !==
                        undefined) && (
                      <p className="text-xs text-gray-400">
                        {movement.beforeStock ?? 0}
                        {" → "}
                        {movement.afterStock ?? 0}
                      </p>
                    )}

                  </div>

                </div>

              ))
            ) : (
              <div className="px-6 py-12 text-center">

                <FiActivity
                  className="mx-auto text-gray-300"
                  size={40}
                />

                <p className="mt-3 font-medium text-gray-700">
                  No stock movement found
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  Stock changes will appear here.
                </p>

              </div>
            )}

          </div>

          {/* Footer */}
          <div className="border-t border-gray-100 px-6 py-4">

            <button
              onClick={closeModal}
              className="w-full rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
            >
              Close
            </button>

          </div>

        </div>

      </div>
    );
  }

  return null;
};

export default InventoryModal;