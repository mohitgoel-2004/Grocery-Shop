const express = require("express");

const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

const {
  placeOrder,
  fetchOrders,
  cancelUserOrder,
   getMyOrderById,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
  getOrderStats,
  searchOrders,
  getOrdersByStatus,
} = require("../controllers/orderController");

const router = express.Router();


// ================= CUSTOMER =================

router.post("/", protect, placeOrder);

router.get("/my-orders", protect, fetchOrders);

router.get("/my-orders/:id", protect, getMyOrderById);

router.put("/cancel", protect, cancelUserOrder);


// ================= ADMIN =================

router.get("/admin", protect, admin, getAllOrders);

router.get("/admin/stats", protect, admin, getOrderStats);

router.get("/admin/search", protect, admin, searchOrders);

router.get("/admin/status/:status", protect, admin, getOrdersByStatus);

router.get("/admin/:id", protect, admin, getOrderById);

router.put("/admin/:id", protect, admin, updateOrderStatus);

router.delete("/admin/:id", protect, admin, deleteOrder);

module.exports = router;