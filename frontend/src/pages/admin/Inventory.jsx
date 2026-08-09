import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  FiPackage,
  FiActivity,
  FiCalendar,
  FiTrash2,
  FiRefreshCw,
} from "react-icons/fi";

import toast from "react-hot-toast";

import InventorySummary from "./InventorySummary";
import InventoryTable from "./InventoryTable";
import InventoryModal from "./InventoryModal";

import {
  fetchInventory,
  fetchStockMovements,
  fetchInventorySummary,
  restockProduct,
  adjustStock,
  markDamagedStock,
  markExpiredStock,
} from "../../services/inventoryService";


const getAvailableStock = (product) => {
  const stock = Number(product.stock || 0);

  const reservedStock = Number(
    product.reservedStock || 0
  );

  return Math.max(
    0,
    stock - reservedStock
  );
};


const getStockStatus = (product) => {
  const availableStock =
    getAvailableStock(product);

  const minStock = Number(
    product.minStock ??
      product.lowStockThreshold ??
      0
  );

  if (availableStock === 0) {
    return "out";
  }

  if (availableStock <= minStock) {
    return "low";
  }

  return "in";
};


const getDaysUntilExpiry = (expiryDate) => {
  if (!expiryDate) return null;

  const today = new Date();

  today.setHours(0, 0, 0, 0);

  const expiry = new Date(expiryDate);

  expiry.setHours(0, 0, 0, 0);

  const difference =
    expiry.getTime() - today.getTime();

  return Math.ceil(
    difference /
      (1000 * 60 * 60 * 24)
  );
};


const isExpiringSoon = (product) => {
  const days = getDaysUntilExpiry(
    product.expiryDate
  );

  return (
    days !== null &&
    days >= 0 &&
    days <= 7
  );
};


const isExpired = (product) => {
  const days = getDaysUntilExpiry(
    product.expiryDate
  );

  return (
    days !== null &&
    days < 0
  );
};


const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [movements, setMovements] = useState([]);

  const [backendSummary, setBackendSummary] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [activeTab, setActiveTab] =
    useState("inventory");

  const [search, setSearch] =
    useState("");

  const [categoryFilter, setCategoryFilter] =
    useState("All");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [sortBy, setSortBy] =
    useState("default");

  const [modal, setModal] =
    useState(null);

  const [selectedProduct, setSelectedProduct] =
    useState(null);

  const [adjustType, setAdjustType] =
    useState("add");

  const [adjustQuantity, setAdjustQuantity] =
    useState("");

  const [adjustReason, setAdjustReason] =
    useState("New Purchase");

  const [restockQuantity, setRestockQuantity] =
    useState("");

  const [restockSupplier, setRestockSupplier] =
    useState("");

  const [restockCostPrice, setRestockCostPrice] =
    useState("");


  /*
  |--------------------------------------------------------------------------
  | Load Inventory
  |--------------------------------------------------------------------------
  */

  const loadInventory = useCallback(
    async () => {
      try {
        setLoading(true);

        const [
          inventoryData,
          movementData,
          summaryData,
        ] = await Promise.all([
          fetchInventory(),
          fetchStockMovements(),
          fetchInventorySummary(),
        ]);

        setProducts(
          Array.isArray(inventoryData)
            ? inventoryData
            : []
        );

        setMovements(
          Array.isArray(movementData)
            ? movementData
            : []
        );

        setBackendSummary(
          summaryData || null
        );
      } catch (error) {
        console.error(
          "Inventory loading error:",
          error
        );

        toast.error(
          error.response?.data?.message ||
            "Failed to load inventory"
        );
      } finally {
        setLoading(false);
      }
    },
    []
  );


  useEffect(() => {
    loadInventory();
  }, [loadInventory]);


  /*
  |--------------------------------------------------------------------------
  | Categories
  |--------------------------------------------------------------------------
  */

  const categories = useMemo(() => {
    const uniqueCategories =
      new Set(
        products
          .map(
            (product) =>
              product.category?.name ||
              product.category
          )
          .filter(Boolean)
      );

    return [
      "All",
      ...uniqueCategories,
    ];
  }, [products]);


  /*
  |--------------------------------------------------------------------------
  | Summary
  |--------------------------------------------------------------------------
  */

  const summary = useMemo(() => {
    if (
      backendSummary &&
      Object.keys(backendSummary).length
    ) {
      return {
        totalProducts:
          backendSummary.totalProducts ??
          products.length,

        totalStock:
          backendSummary.totalStock ??
          products.reduce(
            (sum, product) =>
              sum +
              Number(product.stock || 0),
            0
          ),

        reservedStock:
          backendSummary.reservedStock ??
          products.reduce(
            (sum, product) =>
              sum +
              Number(
                product.reservedStock || 0
              ),
            0
          ),

        availableStock:
          backendSummary.availableStock ??
          products.reduce(
            (sum, product) =>
              sum +
              getAvailableStock(product),
            0
          ),

        inStock:
          backendSummary.inStock ??
          products.filter(
            (product) =>
              getStockStatus(product) === "in"
          ).length,

        lowStock:
          backendSummary.lowStock ??
          products.filter(
            (product) =>
              getStockStatus(product) === "low"
          ).length,

        outOfStock:
          backendSummary.outOfStock ??
          products.filter(
            (product) =>
              getStockStatus(product) === "out"
          ).length,

        damagedStock:
          backendSummary.damagedStock ??
          products.reduce(
            (sum, product) =>
              sum +
              Number(
                product.damagedStock || 0
              ),
            0
          ),

        expiredStock:
          backendSummary.expiredStock ??
          products.reduce(
            (sum, product) =>
              sum +
              Number(
                product.expiredStock || 0
              ),
            0
          ),

        inventoryValue:
          backendSummary.inventoryValue ??
          products.reduce(
            (sum, product) =>
              sum +
              Number(product.stock || 0) *
                Number(
                  product.costPrice || 0
                ),
            0
          ),

        expiringSoon:
          backendSummary.expiringSoon ??
          products.filter(
            isExpiringSoon
          ).length,
      };
    }


    return {
      totalProducts: products.length,

      totalStock: products.reduce(
        (sum, product) =>
          sum +
          Number(product.stock || 0),
        0
      ),

      reservedStock: products.reduce(
        (sum, product) =>
          sum +
          Number(
            product.reservedStock || 0
          ),
        0
      ),

      availableStock: products.reduce(
        (sum, product) =>
          sum +
          getAvailableStock(product),
        0
      ),

      inStock: products.filter(
        (product) =>
          getStockStatus(product) === "in"
      ).length,

      lowStock: products.filter(
        (product) =>
          getStockStatus(product) === "low"
      ).length,

      outOfStock: products.filter(
        (product) =>
          getStockStatus(product) === "out"
      ).length,

      damagedStock: products.reduce(
        (sum, product) =>
          sum +
          Number(
            product.damagedStock || 0
          ),
        0
      ),

      expiredStock: products.reduce(
        (sum, product) =>
          sum +
          Number(
            product.expiredStock || 0
          ),
        0
      ),

      inventoryValue: products.reduce(
        (sum, product) =>
          sum +
          Number(product.stock || 0) *
            Number(
              product.costPrice || 0
            ),
        0
      ),

      expiringSoon:
        products.filter(
          isExpiringSoon
        ).length,
    };
  }, [
    products,
    backendSummary,
  ]);


  // ======================================================
// INVENTORY ALERT PRODUCTS
// ======================================================

const lowStockProducts = useMemo(() => {
  return products.filter(
    (product) => getStockStatus(product) === "low"
  );
}, [products]);

const expiringProducts = useMemo(() => {
  return products.filter(isExpiringSoon);
}, [products]);

const damagedCount = useMemo(() => {
  return products.reduce(
    (sum, product) =>
      sum + Number(product.damagedStock || 0),
    0
  );
}, [products]);

const expiredCount = useMemo(() => {
  return products.reduce(
    (sum, product) =>
      sum + Number(product.expiredStock || 0),
    0
  );
}, [products]);

  /*
  |--------------------------------------------------------------------------
  | Filter
  |--------------------------------------------------------------------------
  */

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (search.trim()) {
      const searchText =
        search.toLowerCase();

      result = result.filter(
        (product) =>
          [
            product.name,
            product.sku,
            product.brand,
            product.batchNo,
          ].some(
            (value) =>
              String(value || "")
                .toLowerCase()
                .includes(searchText)
          )
      );
    }


    if (categoryFilter !== "All") {
      result = result.filter(
        (product) =>
          (
            product.category?.name ||
            product.category
          ) === categoryFilter
      );
    }


    if (statusFilter !== "All") {
      if (
        statusFilter === "expiring"
      ) {
        result =
          result.filter(
            isExpiringSoon
          );
      } else if (
        statusFilter === "expired"
      ) {
        result =
          result.filter(isExpired);
      } else if (
        statusFilter === "damaged"
      ) {
        result =
          result.filter(
            (product) =>
              Number(
                product.damagedStock || 0
              ) > 0
          );
      } else {
        result =
          result.filter(
            (product) =>
              getStockStatus(product) ===
              statusFilter
          );
      }
    }


    if (sortBy === "low-high") {
      result.sort(
        (a, b) =>
          getAvailableStock(a) -
          getAvailableStock(b)
      );
    }


    if (sortBy === "high-low") {
      result.sort(
        (a, b) =>
          getAvailableStock(b) -
          getAvailableStock(a)
      );
    }


    if (sortBy === "name") {
      result.sort((a, b) =>
        String(a.name || "").localeCompare(
          String(b.name || "")
        )
      );
    }


    if (sortBy === "expiry") {
      result.sort(
        (a, b) =>
          new Date(a.expiryDate || 0) -
          new Date(b.expiryDate || 0)
      );
    }


    return result;
  }, [
    products,
    search,
    categoryFilter,
    statusFilter,
    sortBy,
  ]);


  /*
  |--------------------------------------------------------------------------
  | Modal
  |--------------------------------------------------------------------------
  */

  const openModal = (
    type,
    product
  ) => {
    setSelectedProduct(product);
    setModal(type);

    if (type === "adjust") {
      setAdjustType("add");
      setAdjustQuantity("");
      setAdjustReason(
        "New Purchase"
      );
    }

    if (type === "restock") {
      setRestockQuantity("");

      setRestockSupplier(
        product.supplier || ""
      );

      setRestockCostPrice(
        product.costPrice || ""
      );
    }
  };


  const closeModal = () => {
    setModal(null);
    setSelectedProduct(null);
  };


  /*
  |--------------------------------------------------------------------------
  | Adjust Stock
  |--------------------------------------------------------------------------
  */

  const handleAdjustStock =
    async () => {
      const quantity =
        Number(adjustQuantity);

      if (
        !quantity ||
        quantity <= 0
      ) {
        toast.error(
          "Please enter a valid quantity"
        );
        return;
      }

      try {
        await adjustStock(
          selectedProduct._id ||
            selectedProduct.id,
          {
            type: adjustType,
            quantity,
            reason: adjustReason,
          }
        );

        toast.success(
          "Stock updated successfully"
        );

        closeModal();

        await loadInventory();
      } catch (error) {
        console.error(error);

        toast.error(
          error.response?.data?.message ||
            "Failed to update stock"
        );
      }
    };


  /*
  |--------------------------------------------------------------------------
  | Restock
  |--------------------------------------------------------------------------
  */

  const handleRestock =
    async () => {
      const quantity =
        Number(restockQuantity);

      const costPrice =
        Number(restockCostPrice);

      if (
        !quantity ||
        quantity <= 0
      ) {
        toast.error(
          "Please enter a valid quantity"
        );
        return;
      }

      try {
        await restockProduct(
          selectedProduct._id ||
            selectedProduct.id,
          {
            quantity,
            supplier:
              restockSupplier,
            costPrice,
          }
        );

        toast.success(
          "Product restocked successfully"
        );

        closeModal();

        await loadInventory();
      } catch (error) {
        console.error(error);

        toast.error(
          error.response?.data?.message ||
            "Failed to restock product"
        );
      }
    };


  /*
  |--------------------------------------------------------------------------
  | Refresh
  |--------------------------------------------------------------------------
  */

  const handleRefresh = async () => {
    await loadInventory();

    toast.success(
      "Inventory refreshed"
    );
  };


  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">

      {/* Header */}

      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Inventory Management
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage stock, batches, expiry,
            restocking and inventory movements.
          </p>
        </div>


        <button
          onClick={handleRefresh}
          disabled={loading}
          className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <FiRefreshCw
            size={16}
            className={
              loading
                ? "animate-spin"
                : ""
            }
          />

          {loading
            ? "Refreshing..."
            : "Refresh"}
        </button>

      </div>


      {/* Summary */}

      <InventorySummary
        summary={summary}
     expiringProducts={expiringProducts}
      />


      {/* Tabs */}

      <div className="mb-5 overflow-x-auto rounded-xl border border-gray-100 bg-white shadow-sm">

        <div className="flex min-w-max">

          <button
            onClick={() =>
              setActiveTab("inventory")
            }
            className={`flex items-center gap-2 border-b-2 px-5 py-4 text-sm font-medium ${
              activeTab === "inventory"
                ? "border-emerald-600 text-emerald-600"
                : "border-transparent text-gray-500"
            }`}
          >
            <FiPackage size={17} />
            Inventory
          </button>


          <button
            onClick={() =>
              setActiveTab("movement")
            }
            className={`flex items-center gap-2 border-b-2 px-5 py-4 text-sm font-medium ${
              activeTab === "movement"
                ? "border-emerald-600 text-emerald-600"
                : "border-transparent text-gray-500"
            }`}
          >
            <FiActivity size={17} />
            Stock Movement
          </button>


          <button
            onClick={() =>
              setActiveTab("expiry")
            }
            className={`flex items-center gap-2 border-b-2 px-5 py-4 text-sm font-medium ${
              activeTab === "expiry"
                ? "border-emerald-600 text-emerald-600"
                : "border-transparent text-gray-500"
            }`}
          >
            <FiCalendar size={17} />
            Batch & Expiry
          </button>


          <button
            onClick={() =>
              setActiveTab("wastage")
            }
            className={`flex items-center gap-2 border-b-2 px-5 py-4 text-sm font-medium ${
              activeTab === "wastage"
                ? "border-emerald-600 text-emerald-600"
                : "border-transparent text-gray-500"
            }`}
          >
            <FiTrash2 size={17} />
            Damaged / Expired
          </button>

        </div>

      </div>


      {loading && products.length === 0 ? (
        <div className="rounded-xl border border-gray-100 bg-white py-16 text-center">
          <FiRefreshCw
            className="mx-auto animate-spin text-emerald-600"
            size={28}
          />

          <p className="mt-3 text-sm text-gray-500">
            Loading inventory...
          </p>
        </div>
      ) : (
        <InventoryTable
          activeTab={activeTab}
          products={products}
          filteredProducts={filteredProducts}
          movements={movements}
          search={search}
          setSearch={setSearch}
          categoryFilter={categoryFilter}
          setCategoryFilter={
            setCategoryFilter
          }
          statusFilter={statusFilter}
          setStatusFilter={
            setStatusFilter
          }
          sortBy={sortBy}
          setSortBy={setSortBy}
          categories={categories}
          getAvailableStock={
            getAvailableStock
          }
          getStockStatus={
            getStockStatus
          }
          getDaysUntilExpiry={
            getDaysUntilExpiry
          }
          isExpiringSoon={
            isExpiringSoon
          }
          isExpired={isExpired}
          onRestock={(product) =>
            openModal(
              "restock",
              product
            )
          }
          onAdjust={(product) =>
            openModal(
              "adjust",
              product
            )
          }
          onBatch={(product) =>
            openModal(
              "batch",
              product
            )
          }
          onHistory={(product) =>
            openModal(
              "history",
              product
            )
          }
        />
      )}


      <InventoryModal
        modal={modal}
        selectedProduct={selectedProduct}
        closeModal={closeModal}
        adjustType={adjustType}
        setAdjustType={setAdjustType}
        adjustQuantity={adjustQuantity}
        setAdjustQuantity={
          setAdjustQuantity
        }
        adjustReason={adjustReason}
        setAdjustReason={
          setAdjustReason
        }
        restockQuantity={
          restockQuantity
        }
        setRestockQuantity={
          setRestockQuantity
        }
        restockSupplier={
          restockSupplier
        }
        setRestockSupplier={
          setRestockSupplier
        }
        restockCostPrice={
          restockCostPrice
        }
        setRestockCostPrice={
          setRestockCostPrice
        }
        handleAdjustStock={
          handleAdjustStock
        }
        handleRestock={
          handleRestock
        }
        movements={movements}
        getAvailableStock={
          getAvailableStock
        }
        getDaysUntilExpiry={
          getDaysUntilExpiry
        }
      />

    </div>
  );
};

export default Inventory;