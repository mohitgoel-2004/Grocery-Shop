const express = require("express");

const router = express.Router();

const auth = require("../middleware/authMiddleware");
const adminAuth = require("../middleware/adminMiddleware");

const {
  getNotifications,
  getAdminNotifications,
  markAsRead,
  markAdminAsRead,
  markAllRead,
  deleteNotification,
  clearAllNotifications,
  sendNotification,
} = require("../controllers/notificationController");

// ========================================
// CUSTOMER
// ========================================

router.get("/", auth, getNotifications);

router.patch("/:id/read", auth, markAsRead);

router.patch("/read-all", auth, markAllRead);

router.delete("/:id", auth, deleteNotification);

router.delete("/", auth, clearAllNotifications);

// ========================================
// ADMIN
// ========================================

router.get(
  "/admin",
  adminAuth,
  getAdminNotifications
);

router.patch(
  "/admin/:id/read",
  adminAuth,
  markAdminAsRead
);

// Admin sends notification to customer
router.post(
  "/send",
  adminAuth,
  sendNotification
);

module.exports = router;