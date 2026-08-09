const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const StockMovement = require("../models/StockMovement");
const DeliverySettings = require("../models/DeliverySettings");

// ======================================================
// DELIVERY CHARGE
// ======================================================

const calculateDeliveryCharge = (
  subtotal,
  settings
) => {
  if (!settings) {
    return 0;
  }

  // Delivery charge disabled
  if (!settings.isDeliveryChargeEnabled) {
    return 0;
  }

  // Free delivery threshold achieved
  if (
    subtotal >=
    Number(settings.freeDeliveryThreshold || 0)
  ) {
    return 0;
  }

  return Number(settings.deliveryCharge || 0);
};

// ======================================================
// TAX
// ======================================================

const calculateTax = (subtotal) => {
  return Math.round(subtotal * 0.05);
};

// ======================================================
// RESERVE STOCK
// ======================================================

const reserveStockForOrder = async (items) => {
  const reservedProducts = [];

  try {
    for (const item of items) {
      const quantity = Number(item.quantity);

      if (!quantity || quantity <= 0) {
        throw new Error(
          `Invalid quantity for ${item.name}`
        );
      }

      /*
       * Atomic update:
       *
       * stock - reservedStock >= quantity
       *
       * means enough AVAILABLE stock exists.
       */

      const product =
        await Product.findOneAndUpdate(
          {
            _id: item.product,

            $expr: {
              $gte: [
                {
                  $subtract: [
                    "$stock",
                    "$reservedStock",
                  ],
                },
                quantity,
              ],
            },
          },
          {
            $inc: {
              reservedStock: quantity,
            },
          },
          {
            new: true,
          }
        );

      if (!product) {
        throw new Error(
          `Insufficient stock for ${item.name}`
        );
      }

      reservedProducts.push({
        productId: product._id,
        quantity,
      });

      // Stock movement
      await StockMovement.create({
        product: product._id,
        type: "RESERVED",
        quantity,
        beforeStock: product.stock,
        afterStock: product.stock,
        reason: "Stock reserved for order",
      });
    }

    return reservedProducts;
  } catch (error) {
    /*
     * If one product fails,
     * release already reserved products.
     */

    for (const item of reservedProducts) {
      await Product.findByIdAndUpdate(
        item.productId,
        {
          $inc: {
            reservedStock: -item.quantity,
          },
        }
      );
    }

    throw error;
  }
};

// ======================================================
// RELEASE RESERVED STOCK
// ======================================================

const releaseReservedStock = async (items) => {
  for (const item of items) {
    const quantity = Number(item.quantity);

    if (!quantity || quantity <= 0) {
      continue;
    }

    const product =
      await Product.findOneAndUpdate(
        {
          _id: item.product,
          reservedStock: {
            $gte: quantity,
          },
        },
        {
          $inc: {
            reservedStock: -quantity,
          },
        },
        {
          new: true,
        }
      );

    if (!product) {
      continue;
    }

    await StockMovement.create({
      product: product._id,
      type: "RELEASED",
      quantity,
      beforeStock: product.stock,
      afterStock: product.stock,
      reason: "Reserved stock released",
    });
  }
};

// ======================================================
// FINALIZE STOCK AFTER DELIVERY
// ======================================================

const finalizeStockForDeliveredOrder = async (
  items
) => {
  for (const item of items) {
    const quantity = Number(item.quantity);

    if (!quantity || quantity <= 0) {
      continue;
    }

    /*
     * Physical stock decreases.
     *
     * Reserved stock also decreases.
     */

    const product =
      await Product.findOneAndUpdate(
        {
          _id: item.product,
          stock: {
            $gte: quantity,
          },
          reservedStock: {
            $gte: quantity,
          },
        },
        {
          $inc: {
            stock: -quantity,
            reservedStock: -quantity,
          },
        },
        {
          new: true,
        }
      );

    if (!product) {
      throw new Error(
        `Unable to finalize stock for ${item.name}`
      );
    }

    await StockMovement.create({
      product: product._id,
      type: "SALE",
      quantity: -quantity,
      beforeStock:
        product.stock + quantity,
      afterStock: product.stock,
      reason: "Order delivered",
    });
  }
};

// ======================================================
// RETURN STOCK
// ======================================================

const restoreStockForReturnedOrder = async (
  items
) => {
  for (const item of items) {
    const quantity = Number(item.quantity);

    if (!quantity || quantity <= 0) {
      continue;
    }

    const product =
      await Product.findByIdAndUpdate(
        item.product,
        {
          $inc: {
            stock: quantity,
          },
        },
        {
          new: true,
        }
      );

    if (!product) {
      continue;
    }

    await StockMovement.create({
      product: product._id,
      type: "ADJUSTMENT",
      quantity,
      beforeStock:
        product.stock - quantity,
      afterStock: product.stock,
      reason: "Product returned",
    });
  }
};

// ======================================================
// CREATE ORDER
// ======================================================

const createOrder = async ({
  user,
  paymentMethod = "cod",
  deliveryAddress,
}) => {
  const cart = await Cart.findOne({
    user: user._id,
  });

  // Cart empty
  if (!cart || cart.items.length === 0) {
    throw new Error("Cart is empty");
  }

  // ====================================================
  // Calculate subtotal
  // ====================================================

  const subtotal = cart.items.reduce(
    (sum, item) =>
      sum + item.price * item.quantity,
    0
  );

  // ====================================================
  // Delivery settings
  // ====================================================

  const deliverySettings =
    await DeliverySettings.findOne();

  // ====================================================
  // Minimum order
  // ====================================================

  const minimumOrderValue = Number(
    deliverySettings?.minimumOrderValue || 0
  );

  if (subtotal < minimumOrderValue) {
    throw new Error(
      `Minimum order value is ₹${minimumOrderValue}`
    );
  }

  // ====================================================
  // Delivery
  // ====================================================

  const deliveryCharge =
    calculateDeliveryCharge(
      subtotal,
      deliverySettings
    );

  // ====================================================
  // Tax
  // ====================================================

  const tax = calculateTax(subtotal);

  // ====================================================
  // Total
  // ====================================================

  const total =
    subtotal +
    deliveryCharge +
    tax;

  // ====================================================
  // Prepare order items
  // ====================================================

  const orderItems = cart.items.map(
    (item) => ({
      product: item.product,
      name: item.name,
      image: item.image,
      price: item.price,
      quantity: item.quantity,
      weight: item.weight,
    })
  );

  // ====================================================
  // RESERVE INVENTORY
  // ====================================================

  await reserveStockForOrder(
    orderItems
  );

  try {
    // ==================================================
    // Generate order number
    // ==================================================

    const orderNumber = `#${Math.floor(
      100000 + Math.random() * 900000
    )}`;

    // ==================================================
    // Create order
    // ==================================================

    const order = await Order.create({
      user: user._id,

      items: orderItems,

      deliveryAddress:
        deliveryAddress || user.address,

      paymentMethod,

      subtotal,
      deliveryCharge,
      tax,
      total,

      orderNumber,
    });

    // ==================================================
    // Clear cart
    // ==================================================

    cart.items = [];
    cart.subtotal = 0;
    cart.total = 0;

    await cart.save();

    return order.populate(
      "items.product",
      "name slug image price weight"
    );
  } catch (error) {
    /*
     * Order creation failed.
     * Release reserved inventory.
     */

    await releaseReservedStock(
      orderItems
    );

    throw error;
  }
};

// ======================================================
// LIST ORDERS
// ======================================================

const listOrders = async (userId) => {
  return Order.find({
    user: userId,
  })
    .sort({
      createdAt: -1,
    })
    .populate(
      "items.product",
      "name slug image price weight"
    );
};

// ======================================================
// CANCEL ORDER
// ======================================================

const cancelOrder = async (
  userId,
  orderId
) => {
  const order = await Order.findOne({
    _id: orderId,
    user: userId,
  });

  if (!order) {
    throw new Error("Order not found");
  }

  const currentStatus =
    order.status?.toLowerCase();

  if (
    [
      "delivered",
      "cancelled",
      "returned",
      "refund",
    ].includes(currentStatus)
  ) {
    throw new Error(
      "Order cannot be cancelled"
    );
  }

  // ====================================================
  // Release reserved inventory
  // ====================================================

  await releaseReservedStock(
    order.items
  );

  // ====================================================
  // Update order
  // ====================================================

  order.status = "cancelled";
  order.cancelledAt = new Date();

  await order.save();

  return order.populate(
    "items.product",
    "name slug image price weight"
  );
};

// ======================================================
// ADMIN STATUS CHANGE
// ======================================================

const updateOrderStatusWithInventory = async (
  orderId,
  newStatus
) => {
  const order = await Order.findById(
    orderId
  );

  if (!order) {
    throw new Error("Order not found");
  }

  const oldStatus =
    order.status?.toLowerCase();

  const status =
    newStatus?.toLowerCase();

  if (
    ![
      "pending",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
      "returned",
      "refund",
    ].includes(status)
  ) {
    throw new Error(
      "Invalid order status"
    );
  }

  // Same status
  if (oldStatus === status) {
    return order.populate(
      "items.product",
      "name slug image price weight"
    );
  }

  // ====================================================
  // CANCELLED
  // ====================================================

  if (
    status === "cancelled" &&
    oldStatus !== "cancelled" &&
    oldStatus !== "delivered"
  ) {
    await releaseReservedStock(
      order.items
    );
  }

  // ====================================================
  // DELIVERED
  // ====================================================

  if (
    status === "delivered" &&
    oldStatus !== "delivered"
  ) {
    await finalizeStockForDeliveredOrder(
      order.items
    );
  }

  // ====================================================
  // RETURNED
  // ====================================================

  if (
    status === "returned" &&
    oldStatus === "delivered"
  ) {
    await restoreStockForReturnedOrder(
      order.items
    );
  }

  order.status = status;

  if (status === "cancelled") {
    order.cancelledAt = new Date();
  }

  await order.save();

  return order.populate(
    "items.product",
    "name slug image price weight"
  );
};

module.exports = {
  createOrder,
  listOrders,
  cancelOrder,
  updateOrderStatusWithInventory,
};