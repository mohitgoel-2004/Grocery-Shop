const express = require("express");

const {
  loginAdmin,
  getAdminProfile,
  logoutAdmin,
} = require("../controllers/adminController");

const adminAuth = require("../middleware/adminMiddleware");

const router = express.Router();

/**
 * Public Routes
 */
router.post("/login", loginAdmin);

/**
 * Protected Routes
 */
// router.get("/profile", adminAuth, getAdminProfile);

router.post("/logout", adminAuth, logoutAdmin);

module.exports = router;