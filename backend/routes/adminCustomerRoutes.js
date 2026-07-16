const express = require("express");

const router = express.Router();

const {
  getAllCustomers,
  getCustomerById,
  getCustomerStats,

  createCustomer,
  updateCustomer,

  blockCustomer,
  unblockCustomer,
  makePremium,

  deleteCustomer,
  restoreCustomer,
  permanentDeleteCustomer,
} = require("../controllers/adminCustomerController");
console.log("✅ adminCustomerRoutes loaded");

// ===============================
// Stats
// ===============================

router.get("/stats", getCustomerStats);

// ===============================
// Customer List
// ===============================

router.get("/", getAllCustomers);

// ===============================
// Customer Details
// ===============================
router.get("/:id", getCustomerById);
// exports.getCustomerById = async (req, res) => {
//   try {
//     console.log("Customer ID:", req.params.id);

//     const customer = await User.findById(req.params.id);

//     console.log("Customer:", customer);

//     if (!customer) {
//       return res.status(404).json({
//         success: false,
//         message: "Customer not found",
//       });
//     }

//     const orders = await Order.find({
//       user: customer._id,
//     }).sort({ createdAt: -1 });

//     const totalOrders = orders.length;

//     const totalSpent = orders.reduce(
//       (sum, order) => sum + (order.total || 0),
//       0
//     );

//     return res.status(200).json({
//       success: true,
//       customer,
//       orders,
//       stats: {
//         totalOrders,
//         totalSpent,
//       },
//     });
//   } catch (error) {
//     console.error("GET CUSTOMER ERROR:");
//     console.error(error);

//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// ===============================
// Create Customer
// ===============================

router.post("/", createCustomer);

// ===============================
// Update Customer
// ===============================

router.put("/:id", updateCustomer);

// ===============================
// Block Customer
// ===============================

router.patch("/:id/block", blockCustomer);

// ===============================
// Unblock Customer
// ===============================

router.patch("/:id/unblock", unblockCustomer);

// ===============================
// Premium
// ===============================

router.patch("/:id/premium", makePremium);

// ===============================
// Restore
// ===============================

router.patch("/:id/restore", restoreCustomer);

// ===============================
// Soft Delete
// ===============================

router.delete("/:id", deleteCustomer);

// ===============================
// Permanent Delete
// ===============================

router.delete("/:id/permanent", permanentDeleteCustomer);

module.exports = router;