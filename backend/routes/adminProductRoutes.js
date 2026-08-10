const express = require("express");

const {
  getAdminProducts,
  fetchProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleProductStatus,
  bulkImportProducts,
} = require("../controllers/productController");

const bulkImportUpload = require("../middleware/bulkImportUpload");

const router = express.Router();

// List
router.get("/", getAdminProducts);

// Bulk Import
router.post(
  "/bulk-import",
  bulkImportUpload.single("file"),
  bulkImportProducts
);

// Single
router.get("/:id", fetchProductById);

// Create
router.post("/", createProduct);

// Update
router.put("/:id", updateProduct);

// Delete
router.delete("/:id", deleteProduct);

// Status
router.patch("/:id/status", toggleProductStatus);

module.exports = router;