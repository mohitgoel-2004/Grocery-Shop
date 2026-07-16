const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");

/* ==========================================================
   TODAY REVENUE
========================================================== */

const getTodayRevenue = async () => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const result = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: start },
        paymentStatus: "Paid",
      },
    },
    {
      $group: {
        _id: null,
        revenue: {
          $sum: "$totalAmount",
        },
      },
    },
  ]);

  return result.length ? result[0].revenue : 0;
};

/* ==========================================================
   TODAY ORDERS
========================================================== */

const getTodayOrders = async () => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  return Order.countDocuments({
    createdAt: {
      $gte: start,
    },
  });
};

/* ==========================================================
   TODAY CUSTOMERS
========================================================== */

const getTodayCustomers = async () => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    return User.countDocuments({
        deleted: false,
        createdAt: {
            $gte: start,
        },
    });
};

/* ==========================================================
   RECENT ORDERS
========================================================== */

const getRecentOrders = async () => {
  const orders = await Order.find()
.populate("user", "fullName email")
.sort({ createdAt: -1 })
.limit(10);

console.log(
JSON.stringify(orders,null,2)
);

  return orders.map((order) => ({
    _id: order._id,
    orderNumber:
      order.orderNumber ||
      `ORD-${order._id.toString().slice(-6).toUpperCase()}`,

    customerName: order.user?.fullName || "Guest",

    customerEmail: order.user?.email || "",

    itemsCount: order.items?.length || 0,

  totalPrice: order.total || 0,

    status: order.status,

    createdAt: order.createdAt,
  }));
};

/* ==========================================================
   TOP PRODUCTS
========================================================== */

const getTopProducts = async () => {
  return Product.find()
    .sort({
      sold: -1,
    })
    .limit(10)
    .select("name price stock sold images");
};

/* ==========================================================
   DASHBOARD SUMMARY
========================================================== */

const getDashboardSummary = async () => {
  /* ---------------- Revenue ---------------- */

  const revenueResult = await Order.aggregate([
    {
      $match: {
       status: {
    $ne: "Cancelled"
}
      },
    },
    {
      $group: {
        _id: null,
        revenue: {
         $sum: "$total"
        },
      },
    },
  ]);

  const totalRevenue =
    revenueResult.length > 0
      ? revenueResult[0].revenue
      : 0;

  const todayRevenue = await getTodayRevenue();

  /* ---------------- Orders ---------------- */

  const totalOrders = await Order.countDocuments();

  const todayOrders = await getTodayOrders();

const pendingOrders = await Order.countDocuments({
    status: "pending",
});

const processingOrders = await Order.countDocuments({
    status: "processing",
});

const packedOrders = await Order.countDocuments({
    status: "packed",
});

const shippedOrders = await Order.countDocuments({
    status: "shipped",
});

const outForDeliveryOrders = await Order.countDocuments({
    status: "out for delivery",
});

const deliveredOrders = await Order.countDocuments({
    status: "delivered",
});

const cancelledOrders = await Order.countDocuments({
    status: "cancelled",
});

const returnedOrders = await Order.countDocuments({
    status: "returned",
});

const refundedOrders = await Order.countDocuments({
    status: "refund",
});

  /* ---------------- Customers ---------------- */

 const totalCustomers = await User.countDocuments({
    deleted: false,
});

// console.log("TOTAL CUSTOMERS =", totalCustomers);

const users = await User.find();

console.log(users);
  const newCustomers = await getTodayCustomers();

  /* ---------------- Products ---------------- */

  const totalProducts = await Product.countDocuments();

  const outOfStockProducts = await Product.countDocuments({
    stock: 0,
  });

  const lowStockProducts = await Product.countDocuments({
    stock: {
      $gt: 0,
      $lte: 10,
    },
  });

  /* ---------------- Lists ---------------- */

  const recentOrders = await getRecentOrders();

  const topProducts = await getTopProducts();

  /* ---------------- Return ---------------- */

  return {
    summary: {
      totalRevenue,
      totalOrders,
      totalCustomers,
      totalProducts,
      todayRevenue,
      todayOrders,
    },

   today: {
    pendingOrders,
    processingOrders,
    packedOrders,
    shippedOrders,
    outForDeliveryOrders,
    deliveredOrders,
    cancelledOrders,
    returnedOrders,
    refundedOrders,
    newCustomers,
},

    inventory: {
      outOfStockProducts,
      lowStockProducts,
    },

    recentOrders,

    topProducts,
  };
};

module.exports = {
  getDashboardSummary,
  getTodayRevenue,
  getTodayOrders,
  getTodayCustomers,
  getRecentOrders,
  getTopProducts,
};