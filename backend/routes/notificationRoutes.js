const express = require("express");

const router = express.Router();

const auth = require("../middleware/authMiddleware");
const adminAuth = require("../middleware/adminMiddleware");

const {
  getNotifications,
  markAsRead,
  markAllRead,
  deleteNotification,
  clearAllNotifications,
  sendNotification,
} = require("../controllers/notificationController");

router.get("/", auth, getNotifications);

router.patch("/:id/read", auth, markAsRead);

router.patch("/read-all", auth, markAllRead);

router.delete("/:id", auth, deleteNotification);

router.delete("/", auth, clearAllNotifications);

router.post("/send", adminAuth, sendNotification);

module.exports = router;