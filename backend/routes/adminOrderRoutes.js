const express = require("express");

const adminAuth = require("../middleware/adminMiddleware");

// const {
//   getDashboardStats,
// } = require("../controllers/adminOrderController");

const {
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
  getOrderStats,
  searchOrders,
  getOrdersByStatus,
} = require("../controllers/orderController");

const router = express.Router();

router.use(adminAuth);

// Dashboard
router.get("/stats", getOrderStats);

// Orders
router.get("/", getAllOrders);
router.get("/search", searchOrders);
router.get("/status/:status", getOrdersByStatus);
router.get("/:id", getOrderById);

router.put("/:id/status", updateOrderStatus);

router.delete("/:id", deleteOrder);

module.exports = router;