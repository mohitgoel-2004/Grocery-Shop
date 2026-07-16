const express = require("express");

const router = express.Router();

const adminAuth = require("../middleware/adminMiddleware");
const upload = require("../middleware/uploadMiddleware");

const {
  getProfile,
  updateProfile,
  changePassword,
  uploadProfileImage,
} = require("../controllers/adminProfileController");

// ======================================
// GET PROFILE
// ======================================
router.get(
  "/",
  adminAuth,
  getProfile
);

// ======================================
// UPDATE PROFILE
// ======================================
router.put(
  "/",
  adminAuth,
  updateProfile
);

// ======================================
// CHANGE PASSWORD
// ======================================
router.put(
  "/password",
  adminAuth,
  changePassword
);

// ======================================
// UPDATE PROFILE IMAGE
// ======================================
router.put(
  "/image",
  adminAuth,
  upload.single("image"),
  uploadProfileImage
);

module.exports = router;