const express = require("express");

const router = express.Router();
const protect = require("../middleware/authMiddleware");

const {
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} = require("../controllers/addressController");

// ==============================
// Get all addresses
// ==============================
router.get("/", protect, getAddresses);

// ==============================
// Add new address
// ==============================
router.post("/", protect, createAddress);

// ==============================
// Update address
// ==============================
router.put("/:id", protect, updateAddress);

// ==============================
// Delete address
// ==============================
router.delete("/:id", protect, deleteAddress);

// ==============================
// Set default address
// ==============================
router.patch("/default/:id", protect, setDefaultAddress);

module.exports = router;