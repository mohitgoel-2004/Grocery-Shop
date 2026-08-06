const Order = require("../models/Order");
const Cart = require("../models/Cart");
const DeliverySettings = require("../models/DeliverySettings");

const calculateDeliveryCharge = (subtotal, settings) => {
  if (!settings) {
    return 0;
  }

  // Admin ne delivery charge disable kiya hai
  if (!settings.isDeliveryChargeEnabled) {
    return 0;
  }

  // Free delivery threshold achieve ho gaya
  if (
    subtotal >=
    Number(settings.freeDeliveryThreshold || 0)
  ) {
    return 0;
  }

  // Admin ke according delivery charge
  return Number(settings.deliveryCharge || 0);
};

const calculateTax = (subtotal) => {
  return Math.round(subtotal * 0.05);
};

const createOrder = async ({
  user,
  paymentMethod = "cod",
  deliveryAddress,
}) => {
  const cart = await Cart.findOne({
    user: user._id,
  });

  // Cart empty validation
  if (!cart || cart.items.length === 0) {
    throw new Error("Cart is empty");
  }

  // Calculate subtotal
  const subtotal = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Get delivery settings configured by admin
  const deliverySettings =
    await DeliverySettings.findOne();

  // Minimum order value
  const minimumOrderValue = Number(
    deliverySettings?.minimumOrderValue || 0
  );

  // Minimum order validation
  if (subtotal < minimumOrderValue) {
    throw new Error(
      `Minimum order value is ₹${minimumOrderValue}`
    );
  }

  // Calculate delivery charge from admin settings
  const deliveryCharge = calculateDeliveryCharge(
    subtotal,
    deliverySettings
  );

  // Calculate tax
  const tax = calculateTax(subtotal);

  // Calculate final total
  const total =
    subtotal +
    deliveryCharge +
    tax;

  // Generate order number
  const orderNumber = `#${Math.floor(
    100000 + Math.random() * 900000
  )}`;

  // Create order
  const order = await Order.create({
    user: user._id,

    items: cart.items.map((item) => ({
      product: item.product,
      name: item.name,
      image: item.image,
      price: item.price,
      quantity: item.quantity,
      weight: item.weight,
    })),

    deliveryAddress:
      deliveryAddress || user.address,

    paymentMethod,

    subtotal,
    deliveryCharge,
    tax,
    total,

    orderNumber,
  });

  // Clear cart after successful order
  cart.items = [];
  cart.subtotal = 0;
  cart.total = 0;

  await cart.save();

  return order.populate(
    "items.product",
    "name slug image price weight"
  );
};

const listOrders = async (userId) => {
  return Order.find({ user: userId })
    .sort({ createdAt: -1 })
    .populate(
      "items.product",
      "name slug image price weight"
    );
};

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

  if (
  [
    "delivered",
    "cancelled",
    "returned",
    "refunded",
  ].includes(order.status?.toLowerCase())
) {
  throw new Error("Order cannot be cancelled");
}

order.status = "cancelled";
order.cancelledAt = new Date();

await order.save()

  return order.populate(
    "items.product",
    "name slug image price weight"
  );
};

module.exports = {
  createOrder,
  listOrders,
  cancelOrder,
};