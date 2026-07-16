const express = require("express");

const {
    getAdminProducts,
    fetchProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    toggleProductStatus,
} = require("../controllers/productController");

const router = express.Router();

// List
router.get("/", getAdminProducts);

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