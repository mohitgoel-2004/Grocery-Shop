const express = require("express");

const adminAuth = require("../middleware/adminMiddleware");

const {
  getInventory,
  getInventorySummary,
  restockProduct,
  markDamaged,
  markExpired,
  adjustStock,
  getProductBatches,
  getStockMovements,
} = require("../controllers/inventoryController");

const router = express.Router();

router.use(adminAuth);

// Inventory list
router.get("/", getInventory);

// Dashboard summary
router.get("/summary", getInventorySummary);

// Stock movements
router.get(
  "/movements",
  getStockMovements
);

// Product batches
router.get(
  "/:id/batches",
  getProductBatches
);

// Restock
router.post(
  "/:id/restock",
  restockProduct
);

// Damaged
router.post(
  "/:id/damaged",
  markDamaged
);

// Expired
router.post(
  "/:id/expired",
  markExpired
);

// Manual adjustment
router.post(
  "/:id/adjust",
  adjustStock
);

module.exports = router;