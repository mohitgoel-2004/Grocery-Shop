const Product = require("../models/Product");
const InventoryBatch = require("../models/InventoryBatch");
const StockMovement = require("../models/StockMovement");

const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/apiResponse");
const ApiError = require("../utils/apiError");

// ======================================================
// GET INVENTORY
// ======================================================

const getInventory = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 100,
    search = "",
    status = "",
  } = req.query;

  const currentPage = Number(page);
  const currentLimit = Number(limit);

  const query = {};

  // Search
  if (search.trim()) {
    query.$or = [
      {
        name: {
          $regex: search.trim(),
          $options: "i",
        },
      },
      {
        sku: {
          $regex: search.trim(),
          $options: "i",
        },
      },
      {
        brand: {
          $regex: search.trim(),
          $options: "i",
        },
      },
    ];
  }

  // Get products
  const products = await Product.find(query)
    .populate("category", "name")
    .sort({ createdAt: -1 })
    .skip((currentPage - 1) * currentLimit)
    .limit(currentLimit)
    .lean();

  // ----------------------------------------------------
  // Get batches for these products
  // ----------------------------------------------------

  const productIds = products.map(
    (product) => product._id
  );

  const batches = await InventoryBatch.find({
    product: {
      $in: productIds,
    },
  })
    .sort({
      expiryDate: 1,
    })
    .lean();

  // ----------------------------------------------------
  // Attach batch information to products
  // ----------------------------------------------------

  const productsWithInventory = products.map(
    (product) => {
      const productBatches = batches.filter(
        (batch) =>
          String(batch.product) ===
          String(product._id)
      );

      const activeBatches =
        productBatches.filter(
          (batch) => Number(batch.quantity || 0) > 0
        );

      const firstBatch =
        activeBatches[0] || productBatches[0];

      return {
        ...product,

        // Frontend friendly ID
        id: product._id,

        // Frontend image support
        image:
          product.image ||
          product.images?.[0] ||
          "",

        // Frontend min stock support
        minStock:
          product.minStock ??
          product.lowStockThreshold ??
          0,

        // Safe inventory values
        stock: Number(product.stock || 0),

        reservedStock: Number(
          product.reservedStock || 0
        ),

        damagedStock: Number(
          product.damagedStock || 0
        ),

        expiredStock: Number(
          product.expiredStock || 0
        ),

        // Batch information
        batchNo:
          firstBatch?.batchNo || "",

        manufacturingDate:
          firstBatch?.manufacturingDate || null,

        expiryDate:
          firstBatch?.expiryDate || null,

        // All batches
        batches: productBatches,
      };
    }
  );

  // ----------------------------------------------------
  // Apply stock status filter
  // ----------------------------------------------------

  const filteredProducts =
    productsWithInventory.filter(
      (product) => {
        if (!status) {
          return true;
        }

        const stock = Number(
          product.stock || 0
        );

        const reserved = Number(
          product.reservedStock || 0
        );

        const available = Math.max(
          0,
          stock - reserved
        );

        const minStock = Number(
          product.minStock || 0
        );

        if (status === "out_of_stock") {
          return available <= 0;
        }

        if (status === "low_stock") {
          return (
            available > 0 &&
            available <= minStock
          );
        }

        if (status === "in_stock") {
          return available > minStock;
        }

        return true;
      }
    );

  // ----------------------------------------------------
  // Total products
  // ----------------------------------------------------

  const total =
    await Product.countDocuments(query);

  // ----------------------------------------------------
  // Response
  // ----------------------------------------------------

  res.status(200).json(
    ApiResponse.success(
      {
        products: filteredProducts,
        total,
        page: currentPage,
        totalPages: Math.ceil(
          total / currentLimit
        ),
      },
      "Inventory fetched successfully"
    )
  );
});

// ======================================================
// INVENTORY SUMMARY
// ======================================================

const getInventorySummary = asyncHandler(
  async (req, res) => {
    const products = await Product.find().lean();

    let totalProducts = products.length;
    let totalStock = 0;
    let totalReserved = 0;
    let totalAvailable = 0;
    let lowStock = 0;
    let outOfStock = 0;
    let inStock = 0;
    let damagedStock = 0;
    let expiredStock = 0;
    let inventoryValue = 0;

    products.forEach((product) => {
      const stock = Number(
        product.stock || 0
      );

      const reserved = Number(
        product.reservedStock || 0
      );

      const available = Math.max(
        0,
        stock - reserved
      );

      const minStock = Number(
        product.minStock ??
        product.lowStockThreshold ??
        0
      );

      const costPrice = Number(
        product.costPrice || 0
      );

      totalStock += stock;
      totalReserved += reserved;
      totalAvailable += available;

      damagedStock += Number(
        product.damagedStock || 0
      );

      expiredStock += Number(
        product.expiredStock || 0
      );

      inventoryValue +=
        stock * costPrice;

      if (available <= 0) {
        outOfStock++;
      } else if (available <= minStock) {
        lowStock++;
      } else {
        inStock++;
      }
    });

    // ----------------------------------------------------
    // Batches
    // ----------------------------------------------------

    const batches =
      await InventoryBatch.find().lean();

    const today = new Date();

    const expiringSoonDate =
      new Date();

    expiringSoonDate.setDate(
      today.getDate() + 30
    );

    const expiringSoon =
      batches.filter((batch) => {
        if (!batch.expiryDate) {
          return false;
        }

        const expiryDate =
          new Date(batch.expiryDate);

        return (
          expiryDate > today &&
          expiryDate <=
            expiringSoonDate &&
          Number(batch.quantity || 0) > 0
        );
      }).length;

    const expiredBatches =
      batches.filter((batch) => {
        if (!batch.expiryDate) {
          return false;
        }

        return (
          new Date(batch.expiryDate) <
            today &&
          Number(batch.quantity || 0) > 0
        );
      }).length;

    // ----------------------------------------------------
    // Response
    // ----------------------------------------------------

    res.status(200).json(
      ApiResponse.success(
        {
          totalProducts,

          totalStock,

          // Backend original names
          totalReserved,

          totalAvailable,

          // Frontend names
          reservedStock:
            totalReserved,

          availableStock:
            totalAvailable,

          inStock,

          lowStock,

          outOfStock,

          damagedStock,

          expiredStock,

          inventoryValue,

          expiringSoon,

          expiredBatches,
        },
        "Inventory summary fetched successfully"
      )
    );
  }
);

// ======================================================
// RESTOCK
// ======================================================

const restockProduct = asyncHandler(
  async (req, res) => {
    const {
      quantity,
      batchNo,
      manufacturingDate,
      expiryDate,
      purchasePrice,
      supplier,
      reason,
    } = req.body;

    if (!quantity || Number(quantity) <= 0) {
      throw new ApiError(
        400,
        "Valid quantity is required"
      );
    }

    const product = await Product.findById(
      req.params.id
    );

    if (!product) {
      throw new ApiError(
        404,
        "Product not found"
      );
    }

    const qty = Number(quantity);

    const beforeStock = product.stock;

    product.stock += qty;

    await product.save();

    if (batchNo) {
      await InventoryBatch.create({
        product: product._id,
        batchNo,
        quantity: qty,
        manufacturingDate:
          manufacturingDate || null,
        expiryDate: expiryDate || null,
        purchasePrice:
          purchasePrice || 0,
        supplier: supplier || "",
      });
    }

    await StockMovement.create({
      product: product._id,
      type: "RESTOCK",
      quantity: qty,
      beforeStock,
      afterStock: product.stock,
      reason:
        reason || "Inventory restocked",
      performedBy: req.admin?._id || null,
    });

    res.status(200).json(
      ApiResponse.success(
        {
          product,
        },
        "Product restocked successfully"
      )
    );
  }
);

// ======================================================
// DAMAGED STOCK
// ======================================================

const markDamaged = asyncHandler(
  async (req, res) => {
    const { quantity, reason } = req.body;

    const qty = Number(quantity);

    if (!qty || qty <= 0) {
      throw new ApiError(
        400,
        "Valid quantity is required"
      );
    }

    const product = await Product.findById(
      req.params.id
    );

    if (!product) {
      throw new ApiError(
        404,
        "Product not found"
      );
    }

    const available =
      product.stock -
      product.reservedStock;

    if (qty > available) {
      throw new ApiError(
        400,
        "Damaged quantity cannot exceed available stock"
      );
    }

    const beforeStock = product.stock;

    product.stock -= qty;
    product.damagedStock += qty;

    await product.save();

    await StockMovement.create({
      product: product._id,
      type: "DAMAGED",
      quantity: -qty,
      beforeStock,
      afterStock: product.stock,
      reason:
        reason || "Stock marked as damaged",
      performedBy: req.admin?._id || null,
    });

    res.status(200).json(
      ApiResponse.success(
        {
          product,
        },
        "Damaged stock updated successfully"
      )
    );
  }
);

// ======================================================
// EXPIRED STOCK
// ======================================================

const markExpired = asyncHandler(
  async (req, res) => {
    const { quantity, reason } = req.body;

    const qty = Number(quantity);

    if (!qty || qty <= 0) {
      throw new ApiError(
        400,
        "Valid quantity is required"
      );
    }

    const product = await Product.findById(
      req.params.id
    );

    if (!product) {
      throw new ApiError(
        404,
        "Product not found"
      );
    }

    const available =
      product.stock -
      product.reservedStock;

    if (qty > available) {
      throw new ApiError(
        400,
        "Expired quantity cannot exceed available stock"
      );
    }

    const beforeStock = product.stock;

    product.stock -= qty;
    product.expiredStock += qty;

    await product.save();

    await StockMovement.create({
      product: product._id,
      type: "EXPIRED",
      quantity: -qty,
      beforeStock,
      afterStock: product.stock,
      reason:
        reason || "Stock marked as expired",
      performedBy: req.admin?._id || null,
    });

    res.status(200).json(
      ApiResponse.success(
        {
          product,
        },
        "Expired stock updated successfully"
      )
    );
  }
);

// ======================================================
// STOCK ADJUSTMENT
// ======================================================

const adjustStock = asyncHandler(
  async (req, res) => {
    const { quantity, reason } = req.body;

    const adjustment = Number(quantity);

    if (!adjustment) {
      throw new ApiError(
        400,
        "Adjustment quantity is required"
      );
    }

    const product = await Product.findById(
      req.params.id
    );

    if (!product) {
      throw new ApiError(
        404,
        "Product not found"
      );
    }

    const newStock =
      product.stock + adjustment;

    if (newStock < 0) {
      throw new ApiError(
        400,
        "Stock cannot become negative"
      );
    }

    const beforeStock = product.stock;

    product.stock = newStock;

    await product.save();

    await StockMovement.create({
      product: product._id,
      type: "ADJUSTMENT",
      quantity: adjustment,
      beforeStock,
      afterStock: newStock,
      reason:
        reason || "Manual stock adjustment",
      performedBy: req.admin?._id || null,
    });

    res.status(200).json(
      ApiResponse.success(
        {
          product,
        },
        "Stock adjusted successfully"
      )
    );
  }
);

// ======================================================
// BATCHES
// ======================================================

const getProductBatches = asyncHandler(
  async (req, res) => {
    const batches =
      await InventoryBatch.find({
        product: req.params.id,
      }).sort({
        expiryDate: 1,
      });

    res.status(200).json(
      ApiResponse.success(
        {
          batches,
        },
        "Batches fetched successfully"
      )
    );
  }
);

// ======================================================
// STOCK MOVEMENTS
// ======================================================

const getStockMovements = asyncHandler(
  async (req, res) => {
    const filter = {};

    if (req.query.product) {
      filter.product = req.query.product;
    }

    const movements =
      await StockMovement.find(filter)
        .populate(
          "product",
          "name sku images"
        )
        .sort({
          createdAt: -1,
        })
        .limit(200);

    res.status(200).json(
      ApiResponse.success(
        {
          movements,
        },
        "Stock movements fetched successfully"
      )
    );
  }
);

module.exports = {
  getInventory,
  getInventorySummary,
  restockProduct,
  markDamaged,
  markExpired,
  adjustStock,
  getProductBatches,
  getStockMovements,
};